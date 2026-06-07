import { ae as push_element, ab as pop_element, u as derived, a9 as onDestroy, i as attr, m as bind_props, y as escape_html, ac as prevent_snippet_stringification, j as attr_class, k as attr_style, ax as stringify, w as ensure_array_like, aw as store_get, al as sanitize_props, au as spread_props, as as slot, aI as writable, T as html, p as clsx$1, F as FILENAME, E as get$1, aD as unsubscribe_stores } from './index-server-DF5QiTDW.js';
import { u as useQueryClient, a as createQuery, c as createMutation } from './dist-BVaOiDfh.js';
import { g as goto } from './client-BEw2xY00.js';
import { p as page } from './stores-BUAexBiU.js';
import { u as useSession } from './auth-client-BxKE7wBF.js';
import { W as Wifi_off, u as userStore } from './wifi-off-JxkjcGFn.js';
import { m as updatePageFn, s as saveVersionFn, l as restoreVersionFn, v as versionsKey, b as createCommentFn, c as commentsKey, u as updateCommentFn, g as deleteCommentFn, e as createReplyFn, n as versionsQueryOptions, w as workspaceMembersQueryOptions, a as commentsQueryOptions, i as pageQueryOptions, k as pagesQueryOptions, f as currentWorkspaceId, p as pageKey, j as pagesKey, h as deletePageFn } from './queries-Du7rYaK9.js';
import { T as Tooltip, i as Loader_circle, C as Check, k as Triangle_alert, f as Info, I as Icon, X } from './src-BoyCCkns.js';
import { F as File_text } from './file-text-BhBnRKaX.js';
import 'idb-keyval';
import '@floating-ui/dom';
import { Node, wrappingInputRule, mergeAttributes, Mark, Extension } from '@tiptap/core';
import '@tiptap/starter-kit';
import { jsx } from '@tiptap/core/jsx-runtime';
import Image from '@tiptap/extension-image';
import '@tiptap/extension-placeholder';
import '@tiptap/extension-typography';
import '@tiptap/extension-text-align';
import '@tiptap/extension-link';
import '@tiptap/extension-file-handler';
import { Suggestion } from '@tiptap/suggestion';
import 'clsx';
import './index-server3-BJHpPivQ.js';
import './internal-CcZaUmqm.js';
import 'hono/client';
import 'tailwind-merge';

function findDiffStart(a, b, pos) {
    for (let i = 0;; i++) {
        if (i == a.childCount || i == b.childCount)
            return a.childCount == b.childCount ? null : pos;
        let childA = a.child(i), childB = b.child(i);
        if (childA == childB) {
            pos += childA.nodeSize;
            continue;
        }
        if (!childA.sameMarkup(childB))
            return pos;
        if (childA.isText && childA.text != childB.text) {
            for (let j = 0; childA.text[j] == childB.text[j]; j++)
                pos++;
            return pos;
        }
        if (childA.content.size || childB.content.size) {
            let inner = findDiffStart(childA.content, childB.content, pos + 1);
            if (inner != null)
                return inner;
        }
        pos += childA.nodeSize;
    }
}
function findDiffEnd(a, b, posA, posB) {
    for (let iA = a.childCount, iB = b.childCount;;) {
        if (iA == 0 || iB == 0)
            return iA == iB ? null : { a: posA, b: posB };
        let childA = a.child(--iA), childB = b.child(--iB), size = childA.nodeSize;
        if (childA == childB) {
            posA -= size;
            posB -= size;
            continue;
        }
        if (!childA.sameMarkup(childB))
            return { a: posA, b: posB };
        if (childA.isText && childA.text != childB.text) {
            let same = 0, minSize = Math.min(childA.text.length, childB.text.length);
            while (same < minSize && childA.text[childA.text.length - same - 1] == childB.text[childB.text.length - same - 1]) {
                same++;
                posA--;
                posB--;
            }
            return { a: posA, b: posB };
        }
        if (childA.content.size || childB.content.size) {
            let inner = findDiffEnd(childA.content, childB.content, posA - 1, posB - 1);
            if (inner)
                return inner;
        }
        posA -= size;
        posB -= size;
    }
}

/**
A fragment represents a node's collection of child nodes.

Like nodes, fragments are persistent data structures, and you
should not mutate them or their content. Rather, you create new
instances whenever needed. The API tries to make this easy.
*/
class Fragment {
    /**
    @internal
    */
    constructor(
    /**
    The child nodes in this fragment.
    */
    content, size) {
        this.content = content;
        this.size = size || 0;
        if (size == null)
            for (let i = 0; i < content.length; i++)
                this.size += content[i].nodeSize;
    }
    /**
    Invoke a callback for all descendant nodes between the given two
    positions (relative to start of this fragment). Doesn't descend
    into a node when the callback returns `false`.
    */
    nodesBetween(from, to, f, nodeStart = 0, parent) {
        for (let i = 0, pos = 0; pos < to; i++) {
            let child = this.content[i], end = pos + child.nodeSize;
            if (end > from && f(child, nodeStart + pos, parent || null, i) !== false && child.content.size) {
                let start = pos + 1;
                child.nodesBetween(Math.max(0, from - start), Math.min(child.content.size, to - start), f, nodeStart + start);
            }
            pos = end;
        }
    }
    /**
    Call the given callback for every descendant node. `pos` will be
    relative to the start of the fragment. The callback may return
    `false` to prevent traversal of a given node's children.
    */
    descendants(f) {
        this.nodesBetween(0, this.size, f);
    }
    /**
    Extract the text between `from` and `to`. See the same method on
    [`Node`](https://prosemirror.net/docs/ref/#model.Node.textBetween).
    */
    textBetween(from, to, blockSeparator, leafText) {
        let text = "", first = true;
        this.nodesBetween(from, to, (node, pos) => {
            let nodeText = node.isText ? node.text.slice(Math.max(from, pos) - pos, to - pos)
                : !node.isLeaf ? ""
                    : leafText ? (typeof leafText === "function" ? leafText(node) : leafText)
                        : node.type.spec.leafText ? node.type.spec.leafText(node)
                            : "";
            if (node.isBlock && (node.isLeaf && nodeText || node.isTextblock) && blockSeparator) {
                if (first)
                    first = false;
                else
                    text += blockSeparator;
            }
            text += nodeText;
        }, 0);
        return text;
    }
    /**
    Create a new fragment containing the combined content of this
    fragment and the other.
    */
    append(other) {
        if (!other.size)
            return this;
        if (!this.size)
            return other;
        let last = this.lastChild, first = other.firstChild, content = this.content.slice(), i = 0;
        if (last.isText && last.sameMarkup(first)) {
            content[content.length - 1] = last.withText(last.text + first.text);
            i = 1;
        }
        for (; i < other.content.length; i++)
            content.push(other.content[i]);
        return new Fragment(content, this.size + other.size);
    }
    /**
    Cut out the sub-fragment between the two given positions.
    */
    cut(from, to = this.size) {
        if (from == 0 && to == this.size)
            return this;
        let result = [], size = 0;
        if (to > from)
            for (let i = 0, pos = 0; pos < to; i++) {
                let child = this.content[i], end = pos + child.nodeSize;
                if (end > from) {
                    if (pos < from || end > to) {
                        if (child.isText)
                            child = child.cut(Math.max(0, from - pos), Math.min(child.text.length, to - pos));
                        else
                            child = child.cut(Math.max(0, from - pos - 1), Math.min(child.content.size, to - pos - 1));
                    }
                    result.push(child);
                    size += child.nodeSize;
                }
                pos = end;
            }
        return new Fragment(result, size);
    }
    /**
    @internal
    */
    cutByIndex(from, to) {
        if (from == to)
            return Fragment.empty;
        if (from == 0 && to == this.content.length)
            return this;
        return new Fragment(this.content.slice(from, to));
    }
    /**
    Create a new fragment in which the node at the given index is
    replaced by the given node.
    */
    replaceChild(index, node) {
        let current = this.content[index];
        if (current == node)
            return this;
        let copy = this.content.slice();
        let size = this.size + node.nodeSize - current.nodeSize;
        copy[index] = node;
        return new Fragment(copy, size);
    }
    /**
    Create a new fragment by prepending the given node to this
    fragment.
    */
    addToStart(node) {
        return new Fragment([node].concat(this.content), this.size + node.nodeSize);
    }
    /**
    Create a new fragment by appending the given node to this
    fragment.
    */
    addToEnd(node) {
        return new Fragment(this.content.concat(node), this.size + node.nodeSize);
    }
    /**
    Compare this fragment to another one.
    */
    eq(other) {
        if (this.content.length != other.content.length)
            return false;
        for (let i = 0; i < this.content.length; i++)
            if (!this.content[i].eq(other.content[i]))
                return false;
        return true;
    }
    /**
    The first child of the fragment, or `null` if it is empty.
    */
    get firstChild() { return this.content.length ? this.content[0] : null; }
    /**
    The last child of the fragment, or `null` if it is empty.
    */
    get lastChild() { return this.content.length ? this.content[this.content.length - 1] : null; }
    /**
    The number of child nodes in this fragment.
    */
    get childCount() { return this.content.length; }
    /**
    Get the child node at the given index. Raise an error when the
    index is out of range.
    */
    child(index) {
        let found = this.content[index];
        if (!found)
            throw new RangeError("Index " + index + " out of range for " + this);
        return found;
    }
    /**
    Get the child node at the given index, if it exists.
    */
    maybeChild(index) {
        return this.content[index] || null;
    }
    /**
    Call `f` for every child node, passing the node, its offset
    into this parent node, and its index.
    */
    forEach(f) {
        for (let i = 0, p = 0; i < this.content.length; i++) {
            let child = this.content[i];
            f(child, p, i);
            p += child.nodeSize;
        }
    }
    /**
    Find the first position at which this fragment and another
    fragment differ, or `null` if they are the same.
    */
    findDiffStart(other, pos = 0) {
        return findDiffStart(this, other, pos);
    }
    /**
    Find the first position, searching from the end, at which this
    fragment and the given fragment differ, or `null` if they are
    the same. Since this position will not be the same in both
    nodes, an object with two separate positions is returned.
    */
    findDiffEnd(other, pos = this.size, otherPos = other.size) {
        return findDiffEnd(this, other, pos, otherPos);
    }
    /**
    Find the index and inner offset corresponding to a given relative
    position in this fragment. The result object will be reused
    (overwritten) the next time the function is called. @internal
    */
    findIndex(pos) {
        if (pos == 0)
            return retIndex(0, pos);
        if (pos == this.size)
            return retIndex(this.content.length, pos);
        if (pos > this.size || pos < 0)
            throw new RangeError(`Position ${pos} outside of fragment (${this})`);
        for (let i = 0, curPos = 0;; i++) {
            let cur = this.child(i), end = curPos + cur.nodeSize;
            if (end >= pos) {
                if (end == pos)
                    return retIndex(i + 1, end);
                return retIndex(i, curPos);
            }
            curPos = end;
        }
    }
    /**
    Return a debugging string that describes this fragment.
    */
    toString() { return "<" + this.toStringInner() + ">"; }
    /**
    @internal
    */
    toStringInner() { return this.content.join(", "); }
    /**
    Create a JSON-serializeable representation of this fragment.
    */
    toJSON() {
        return this.content.length ? this.content.map(n => n.toJSON()) : null;
    }
    /**
    Deserialize a fragment from its JSON representation.
    */
    static fromJSON(schema, value) {
        if (!value)
            return Fragment.empty;
        if (!Array.isArray(value))
            throw new RangeError("Invalid input for Fragment.fromJSON");
        return Fragment.fromArray(value.map(schema.nodeFromJSON));
    }
    /**
    Build a fragment from an array of nodes. Ensures that adjacent
    text nodes with the same marks are joined together.
    */
    static fromArray(array) {
        if (!array.length)
            return Fragment.empty;
        let joined, size = 0;
        for (let i = 0; i < array.length; i++) {
            let node = array[i];
            size += node.nodeSize;
            if (i && node.isText && array[i - 1].sameMarkup(node)) {
                if (!joined)
                    joined = array.slice(0, i);
                joined[joined.length - 1] = node
                    .withText(joined[joined.length - 1].text + node.text);
            }
            else if (joined) {
                joined.push(node);
            }
        }
        return new Fragment(joined || array, size);
    }
    /**
    Create a fragment from something that can be interpreted as a
    set of nodes. For `null`, it returns the empty fragment. For a
    fragment, the fragment itself. For a node or array of nodes, a
    fragment containing those nodes.
    */
    static from(nodes) {
        if (!nodes)
            return Fragment.empty;
        if (nodes instanceof Fragment)
            return nodes;
        if (Array.isArray(nodes))
            return this.fromArray(nodes);
        if (nodes.attrs)
            return new Fragment([nodes], nodes.nodeSize);
        throw new RangeError("Can not convert " + nodes + " to a Fragment" +
            (nodes.nodesBetween ? " (looks like multiple versions of prosemirror-model were loaded)" : ""));
    }
}
/**
An empty fragment. Intended to be reused whenever a node doesn't
contain anything (rather than allocating a new empty fragment for
each leaf node).
*/
Fragment.empty = new Fragment([], 0);
const found = { index: 0, offset: 0 };
function retIndex(index, offset) {
    found.index = index;
    found.offset = offset;
    return found;
}

/**
Error type raised by [`Node.replace`](https://prosemirror.net/docs/ref/#model.Node.replace) when
given an invalid replacement.
*/
class ReplaceError extends Error {
}
/**
A slice represents a piece cut out of a larger document. It
stores not only a fragment, but also the depth up to which nodes on
both side are ‘open’ (cut through).
*/
class Slice {
    /**
    Create a slice. When specifying a non-zero open depth, you must
    make sure that there are nodes of at least that depth at the
    appropriate side of the fragment—i.e. if the fragment is an
    empty paragraph node, `openStart` and `openEnd` can't be greater
    than 1.
    
    It is not necessary for the content of open nodes to conform to
    the schema's content constraints, though it should be a valid
    start/end/middle for such a node, depending on which sides are
    open.
    */
    constructor(
    /**
    The slice's content.
    */
    content, 
    /**
    The open depth at the start of the fragment.
    */
    openStart, 
    /**
    The open depth at the end.
    */
    openEnd) {
        this.content = content;
        this.openStart = openStart;
        this.openEnd = openEnd;
    }
    /**
    The size this slice would add when inserted into a document.
    */
    get size() {
        return this.content.size - this.openStart - this.openEnd;
    }
    /**
    @internal
    */
    insertAt(pos, fragment) {
        let content = insertInto(this.content, pos + this.openStart, fragment, this.openStart + 1, this.openEnd + 1);
        return content && new Slice(content, this.openStart, this.openEnd);
    }
    /**
    @internal
    */
    removeBetween(from, to) {
        return new Slice(removeRange(this.content, from + this.openStart, to + this.openStart), this.openStart, this.openEnd);
    }
    /**
    Tests whether this slice is equal to another slice.
    */
    eq(other) {
        return this.content.eq(other.content) && this.openStart == other.openStart && this.openEnd == other.openEnd;
    }
    /**
    @internal
    */
    toString() {
        return this.content + "(" + this.openStart + "," + this.openEnd + ")";
    }
    /**
    Convert a slice to a JSON-serializable representation.
    */
    toJSON() {
        if (!this.content.size)
            return null;
        let json = { content: this.content.toJSON() };
        if (this.openStart > 0)
            json.openStart = this.openStart;
        if (this.openEnd > 0)
            json.openEnd = this.openEnd;
        return json;
    }
    /**
    Deserialize a slice from its JSON representation.
    */
    static fromJSON(schema, json) {
        if (!json)
            return Slice.empty;
        let openStart = json.openStart || 0, openEnd = json.openEnd || 0;
        if (typeof openStart != "number" || typeof openEnd != "number")
            throw new RangeError("Invalid input for Slice.fromJSON");
        return new Slice(Fragment.fromJSON(schema, json.content), openStart, openEnd);
    }
    /**
    Create a slice from a fragment by taking the maximum possible
    open value on both side of the fragment.
    */
    static maxOpen(fragment, openIsolating = true) {
        let openStart = 0, openEnd = 0;
        for (let n = fragment.firstChild; n && !n.isLeaf && (openIsolating || !n.type.spec.isolating); n = n.firstChild)
            openStart++;
        for (let n = fragment.lastChild; n && !n.isLeaf && (openIsolating || !n.type.spec.isolating); n = n.lastChild)
            openEnd++;
        return new Slice(fragment, openStart, openEnd);
    }
}
/**
The empty slice.
*/
Slice.empty = new Slice(Fragment.empty, 0, 0);
function removeRange(content, from, to) {
    let { index, offset } = content.findIndex(from), child = content.maybeChild(index);
    let { index: indexTo, offset: offsetTo } = content.findIndex(to);
    if (offset == from || child.isText) {
        if (offsetTo != to && !content.child(indexTo).isText)
            throw new RangeError("Removing non-flat range");
        return content.cut(0, from).append(content.cut(to));
    }
    if (index != indexTo)
        throw new RangeError("Removing non-flat range");
    return content.replaceChild(index, child.copy(removeRange(child.content, from - offset - 1, to - offset - 1)));
}
function insertInto(content, dist, insert, openStart, openEnd, parent) {
    let { index, offset } = content.findIndex(dist), child = content.maybeChild(index);
    if (offset == dist || child.isText) {
        if (parent && openStart <= 0 && openEnd <= 0 && !parent.canReplace(index, index, insert))
            return null;
        return content.cut(0, dist).append(insert).append(content.cut(dist));
    }
    let inner = insertInto(child.content, dist - offset - 1, insert, index == 0 ? openStart - 1 : 0, index == content.childCount - 1 ? openEnd - 1 : 0, child);
    return inner && content.replaceChild(index, child.copy(inner));
}

// Recovery values encode a range index and an offset. They are
// represented as numbers, because tons of them will be created when
// mapping, for example, a large number of decorations. The number's
// lower 16 bits provide the index, the remaining bits the offset.
//
// Note: We intentionally don't use bit shift operators to en- and
// decode these, since those clip to 32 bits, which we might in rare
// cases want to overflow. A 64-bit float can represent 48-bit
// integers precisely.
const lower16 = 0xffff;
const factor16 = Math.pow(2, 16);
function makeRecover(index, offset) { return index + offset * factor16; }
function recoverIndex(value) { return value & lower16; }
function recoverOffset(value) { return (value - (value & lower16)) / factor16; }
const DEL_BEFORE = 1, DEL_AFTER = 2, DEL_ACROSS = 4, DEL_SIDE = 8;
/**
An object representing a mapped position with extra
information.
*/
class MapResult {
    /**
    @internal
    */
    constructor(
    /**
    The mapped version of the position.
    */
    pos, 
    /**
    @internal
    */
    delInfo, 
    /**
    @internal
    */
    recover) {
        this.pos = pos;
        this.delInfo = delInfo;
        this.recover = recover;
    }
    /**
    Tells you whether the position was deleted, that is, whether the
    step removed the token on the side queried (via the `assoc`)
    argument from the document.
    */
    get deleted() { return (this.delInfo & DEL_SIDE) > 0; }
    /**
    Tells you whether the token before the mapped position was deleted.
    */
    get deletedBefore() { return (this.delInfo & (DEL_BEFORE | DEL_ACROSS)) > 0; }
    /**
    True when the token after the mapped position was deleted.
    */
    get deletedAfter() { return (this.delInfo & (DEL_AFTER | DEL_ACROSS)) > 0; }
    /**
    Tells whether any of the steps mapped through deletes across the
    position (including both the token before and after the
    position).
    */
    get deletedAcross() { return (this.delInfo & DEL_ACROSS) > 0; }
}
/**
A map describing the deletions and insertions made by a step, which
can be used to find the correspondence between positions in the
pre-step version of a document and the same position in the
post-step version.
*/
class StepMap {
    /**
    Create a position map. The modifications to the document are
    represented as an array of numbers, in which each group of three
    represents a modified chunk as `[start, oldSize, newSize]`.
    */
    constructor(
    /**
    @internal
    */
    ranges, 
    /**
    @internal
    */
    inverted = false) {
        this.ranges = ranges;
        this.inverted = inverted;
        if (!ranges.length && StepMap.empty)
            return StepMap.empty;
    }
    /**
    @internal
    */
    recover(value) {
        let diff = 0, index = recoverIndex(value);
        if (!this.inverted)
            for (let i = 0; i < index; i++)
                diff += this.ranges[i * 3 + 2] - this.ranges[i * 3 + 1];
        return this.ranges[index * 3] + diff + recoverOffset(value);
    }
    mapResult(pos, assoc = 1) { return this._map(pos, assoc, false); }
    map(pos, assoc = 1) { return this._map(pos, assoc, true); }
    /**
    @internal
    */
    _map(pos, assoc, simple) {
        let diff = 0, oldIndex = this.inverted ? 2 : 1, newIndex = this.inverted ? 1 : 2;
        for (let i = 0; i < this.ranges.length; i += 3) {
            let start = this.ranges[i] - (this.inverted ? diff : 0);
            if (start > pos)
                break;
            let oldSize = this.ranges[i + oldIndex], newSize = this.ranges[i + newIndex], end = start + oldSize;
            if (pos <= end) {
                let side = !oldSize ? assoc : pos == start ? -1 : pos == end ? 1 : assoc;
                let result = start + diff + (side < 0 ? 0 : newSize);
                if (simple)
                    return result;
                let recover = pos == (assoc < 0 ? start : end) ? null : makeRecover(i / 3, pos - start);
                let del = pos == start ? DEL_AFTER : pos == end ? DEL_BEFORE : DEL_ACROSS;
                if (assoc < 0 ? pos != start : pos != end)
                    del |= DEL_SIDE;
                return new MapResult(result, del, recover);
            }
            diff += newSize - oldSize;
        }
        return simple ? pos + diff : new MapResult(pos + diff, 0, null);
    }
    /**
    @internal
    */
    touches(pos, recover) {
        let diff = 0, index = recoverIndex(recover);
        let oldIndex = this.inverted ? 2 : 1, newIndex = this.inverted ? 1 : 2;
        for (let i = 0; i < this.ranges.length; i += 3) {
            let start = this.ranges[i] - (this.inverted ? diff : 0);
            if (start > pos)
                break;
            let oldSize = this.ranges[i + oldIndex], end = start + oldSize;
            if (pos <= end && i == index * 3)
                return true;
            diff += this.ranges[i + newIndex] - oldSize;
        }
        return false;
    }
    /**
    Calls the given function on each of the changed ranges included in
    this map.
    */
    forEach(f) {
        let oldIndex = this.inverted ? 2 : 1, newIndex = this.inverted ? 1 : 2;
        for (let i = 0, diff = 0; i < this.ranges.length; i += 3) {
            let start = this.ranges[i], oldStart = start - (this.inverted ? diff : 0), newStart = start + (this.inverted ? 0 : diff);
            let oldSize = this.ranges[i + oldIndex], newSize = this.ranges[i + newIndex];
            f(oldStart, oldStart + oldSize, newStart, newStart + newSize);
            diff += newSize - oldSize;
        }
    }
    /**
    Create an inverted version of this map. The result can be used to
    map positions in the post-step document to the pre-step document.
    */
    invert() {
        return new StepMap(this.ranges, !this.inverted);
    }
    /**
    @internal
    */
    toString() {
        return (this.inverted ? "-" : "") + JSON.stringify(this.ranges);
    }
    /**
    Create a map that moves all positions by offset `n` (which may be
    negative). This can be useful when applying steps meant for a
    sub-document to a larger document, or vice-versa.
    */
    static offset(n) {
        return n == 0 ? StepMap.empty : new StepMap(n < 0 ? [0, -n, 0] : [0, 0, n]);
    }
}
/**
A StepMap that contains no changed ranges.
*/
StepMap.empty = new StepMap([]);

const stepsByID = Object.create(null);
/**
A step object represents an atomic change. It generally applies
only to the document it was created for, since the positions
stored in it will only make sense for that document.

New steps are defined by creating classes that extend `Step`,
overriding the `apply`, `invert`, `map`, `getMap` and `fromJSON`
methods, and registering your class with a unique
JSON-serialization identifier using
[`Step.jsonID`](https://prosemirror.net/docs/ref/#transform.Step^jsonID).
*/
class Step {
    /**
    Get the step map that represents the changes made by this step,
    and which can be used to transform between positions in the old
    and the new document.
    */
    getMap() { return StepMap.empty; }
    /**
    Try to merge this step with another one, to be applied directly
    after it. Returns the merged step when possible, null if the
    steps can't be merged.
    */
    merge(other) { return null; }
    /**
    Deserialize a step from its JSON representation. Will call
    through to the step class' own implementation of this method.
    */
    static fromJSON(schema, json) {
        if (!json || !json.stepType)
            throw new RangeError("Invalid input for Step.fromJSON");
        let type = stepsByID[json.stepType];
        if (!type)
            throw new RangeError(`No step type ${json.stepType} defined`);
        return type.fromJSON(schema, json);
    }
    /**
    To be able to serialize steps to JSON, each step needs a string
    ID to attach to its JSON representation. Use this method to
    register an ID for your step classes. Try to pick something
    that's unlikely to clash with steps from other modules.
    */
    static jsonID(id, stepClass) {
        if (id in stepsByID)
            throw new RangeError("Duplicate use of step JSON ID " + id);
        stepsByID[id] = stepClass;
        stepClass.prototype.jsonID = id;
        return stepClass;
    }
}
/**
The result of [applying](https://prosemirror.net/docs/ref/#transform.Step.apply) a step. Contains either a
new document or a failure value.
*/
class StepResult {
    /**
    @internal
    */
    constructor(
    /**
    The transformed document, if successful.
    */
    doc, 
    /**
    The failure message, if unsuccessful.
    */
    failed) {
        this.doc = doc;
        this.failed = failed;
    }
    /**
    Create a successful step result.
    */
    static ok(doc) { return new StepResult(doc, null); }
    /**
    Create a failed step result.
    */
    static fail(message) { return new StepResult(null, message); }
    /**
    Call [`Node.replace`](https://prosemirror.net/docs/ref/#model.Node.replace) with the given
    arguments. Create a successful result if it succeeds, and a
    failed one if it throws a `ReplaceError`.
    */
    static fromReplace(doc, from, to, slice) {
        try {
            return StepResult.ok(doc.replace(from, to, slice));
        }
        catch (e) {
            if (e instanceof ReplaceError)
                return StepResult.fail(e.message);
            throw e;
        }
    }
}

function mapFragment(fragment, f, parent) {
    let mapped = [];
    for (let i = 0; i < fragment.childCount; i++) {
        let child = fragment.child(i);
        if (child.content.size)
            child = child.copy(mapFragment(child.content, f, child));
        if (child.isInline)
            child = f(child, parent, i);
        mapped.push(child);
    }
    return Fragment.fromArray(mapped);
}
/**
Add a mark to all inline content between two positions.
*/
class AddMarkStep extends Step {
    /**
    Create a mark step.
    */
    constructor(
    /**
    The start of the marked range.
    */
    from, 
    /**
    The end of the marked range.
    */
    to, 
    /**
    The mark to add.
    */
    mark) {
        super();
        this.from = from;
        this.to = to;
        this.mark = mark;
    }
    apply(doc) {
        let oldSlice = doc.slice(this.from, this.to), $from = doc.resolve(this.from);
        let parent = $from.node($from.sharedDepth(this.to));
        let slice = new Slice(mapFragment(oldSlice.content, (node, parent) => {
            if (!node.isAtom || !parent.type.allowsMarkType(this.mark.type))
                return node;
            return node.mark(this.mark.addToSet(node.marks));
        }, parent), oldSlice.openStart, oldSlice.openEnd);
        return StepResult.fromReplace(doc, this.from, this.to, slice);
    }
    invert() {
        return new RemoveMarkStep(this.from, this.to, this.mark);
    }
    map(mapping) {
        let from = mapping.mapResult(this.from, 1), to = mapping.mapResult(this.to, -1);
        if (from.deleted && to.deleted || from.pos >= to.pos)
            return null;
        return new AddMarkStep(from.pos, to.pos, this.mark);
    }
    merge(other) {
        if (other instanceof AddMarkStep &&
            other.mark.eq(this.mark) &&
            this.from <= other.to && this.to >= other.from)
            return new AddMarkStep(Math.min(this.from, other.from), Math.max(this.to, other.to), this.mark);
        return null;
    }
    toJSON() {
        return { stepType: "addMark", mark: this.mark.toJSON(),
            from: this.from, to: this.to };
    }
    /**
    @internal
    */
    static fromJSON(schema, json) {
        if (typeof json.from != "number" || typeof json.to != "number")
            throw new RangeError("Invalid input for AddMarkStep.fromJSON");
        return new AddMarkStep(json.from, json.to, schema.markFromJSON(json.mark));
    }
}
Step.jsonID("addMark", AddMarkStep);
/**
Remove a mark from all inline content between two positions.
*/
class RemoveMarkStep extends Step {
    /**
    Create a mark-removing step.
    */
    constructor(
    /**
    The start of the unmarked range.
    */
    from, 
    /**
    The end of the unmarked range.
    */
    to, 
    /**
    The mark to remove.
    */
    mark) {
        super();
        this.from = from;
        this.to = to;
        this.mark = mark;
    }
    apply(doc) {
        let oldSlice = doc.slice(this.from, this.to);
        let slice = new Slice(mapFragment(oldSlice.content, node => {
            return node.mark(this.mark.removeFromSet(node.marks));
        }, doc), oldSlice.openStart, oldSlice.openEnd);
        return StepResult.fromReplace(doc, this.from, this.to, slice);
    }
    invert() {
        return new AddMarkStep(this.from, this.to, this.mark);
    }
    map(mapping) {
        let from = mapping.mapResult(this.from, 1), to = mapping.mapResult(this.to, -1);
        if (from.deleted && to.deleted || from.pos >= to.pos)
            return null;
        return new RemoveMarkStep(from.pos, to.pos, this.mark);
    }
    merge(other) {
        if (other instanceof RemoveMarkStep &&
            other.mark.eq(this.mark) &&
            this.from <= other.to && this.to >= other.from)
            return new RemoveMarkStep(Math.min(this.from, other.from), Math.max(this.to, other.to), this.mark);
        return null;
    }
    toJSON() {
        return { stepType: "removeMark", mark: this.mark.toJSON(),
            from: this.from, to: this.to };
    }
    /**
    @internal
    */
    static fromJSON(schema, json) {
        if (typeof json.from != "number" || typeof json.to != "number")
            throw new RangeError("Invalid input for RemoveMarkStep.fromJSON");
        return new RemoveMarkStep(json.from, json.to, schema.markFromJSON(json.mark));
    }
}
Step.jsonID("removeMark", RemoveMarkStep);
/**
Add a mark to a specific node.
*/
class AddNodeMarkStep extends Step {
    /**
    Create a node mark step.
    */
    constructor(
    /**
    The position of the target node.
    */
    pos, 
    /**
    The mark to add.
    */
    mark) {
        super();
        this.pos = pos;
        this.mark = mark;
    }
    apply(doc) {
        let node = doc.nodeAt(this.pos);
        if (!node)
            return StepResult.fail("No node at mark step's position");
        let updated = node.type.create(node.attrs, null, this.mark.addToSet(node.marks));
        return StepResult.fromReplace(doc, this.pos, this.pos + 1, new Slice(Fragment.from(updated), 0, node.isLeaf ? 0 : 1));
    }
    invert(doc) {
        let node = doc.nodeAt(this.pos);
        if (node) {
            let newSet = this.mark.addToSet(node.marks);
            if (newSet.length == node.marks.length) {
                for (let i = 0; i < node.marks.length; i++)
                    if (!node.marks[i].isInSet(newSet))
                        return new AddNodeMarkStep(this.pos, node.marks[i]);
                return new AddNodeMarkStep(this.pos, this.mark);
            }
        }
        return new RemoveNodeMarkStep(this.pos, this.mark);
    }
    map(mapping) {
        let pos = mapping.mapResult(this.pos, 1);
        return pos.deletedAfter ? null : new AddNodeMarkStep(pos.pos, this.mark);
    }
    toJSON() {
        return { stepType: "addNodeMark", pos: this.pos, mark: this.mark.toJSON() };
    }
    /**
    @internal
    */
    static fromJSON(schema, json) {
        if (typeof json.pos != "number")
            throw new RangeError("Invalid input for AddNodeMarkStep.fromJSON");
        return new AddNodeMarkStep(json.pos, schema.markFromJSON(json.mark));
    }
}
Step.jsonID("addNodeMark", AddNodeMarkStep);
/**
Remove a mark from a specific node.
*/
class RemoveNodeMarkStep extends Step {
    /**
    Create a mark-removing step.
    */
    constructor(
    /**
    The position of the target node.
    */
    pos, 
    /**
    The mark to remove.
    */
    mark) {
        super();
        this.pos = pos;
        this.mark = mark;
    }
    apply(doc) {
        let node = doc.nodeAt(this.pos);
        if (!node)
            return StepResult.fail("No node at mark step's position");
        let updated = node.type.create(node.attrs, null, this.mark.removeFromSet(node.marks));
        return StepResult.fromReplace(doc, this.pos, this.pos + 1, new Slice(Fragment.from(updated), 0, node.isLeaf ? 0 : 1));
    }
    invert(doc) {
        let node = doc.nodeAt(this.pos);
        if (!node || !this.mark.isInSet(node.marks))
            return this;
        return new AddNodeMarkStep(this.pos, this.mark);
    }
    map(mapping) {
        let pos = mapping.mapResult(this.pos, 1);
        return pos.deletedAfter ? null : new RemoveNodeMarkStep(pos.pos, this.mark);
    }
    toJSON() {
        return { stepType: "removeNodeMark", pos: this.pos, mark: this.mark.toJSON() };
    }
    /**
    @internal
    */
    static fromJSON(schema, json) {
        if (typeof json.pos != "number")
            throw new RangeError("Invalid input for RemoveNodeMarkStep.fromJSON");
        return new RemoveNodeMarkStep(json.pos, schema.markFromJSON(json.mark));
    }
}
Step.jsonID("removeNodeMark", RemoveNodeMarkStep);

/**
Replace a part of the document with a slice of new content.
*/
class ReplaceStep extends Step {
    /**
    The given `slice` should fit the 'gap' between `from` and
    `to`—the depths must line up, and the surrounding nodes must be
    able to be joined with the open sides of the slice. When
    `structure` is true, the step will fail if the content between
    from and to is not just a sequence of closing and then opening
    tokens (this is to guard against rebased replace steps
    overwriting something they weren't supposed to).
    */
    constructor(
    /**
    The start position of the replaced range.
    */
    from, 
    /**
    The end position of the replaced range.
    */
    to, 
    /**
    The slice to insert.
    */
    slice, 
    /**
    @internal
    */
    structure = false) {
        super();
        this.from = from;
        this.to = to;
        this.slice = slice;
        this.structure = structure;
    }
    apply(doc) {
        if (this.structure && contentBetween(doc, this.from, this.to))
            return StepResult.fail("Structure replace would overwrite content");
        return StepResult.fromReplace(doc, this.from, this.to, this.slice);
    }
    getMap() {
        return new StepMap([this.from, this.to - this.from, this.slice.size]);
    }
    invert(doc) {
        return new ReplaceStep(this.from, this.from + this.slice.size, doc.slice(this.from, this.to));
    }
    map(mapping) {
        let to = mapping.mapResult(this.to, -1);
        let from = this.from == this.to && ReplaceStep.MAP_BIAS < 0 ? to : mapping.mapResult(this.from, 1);
        if (from.deletedAcross && to.deletedAcross)
            return null;
        return new ReplaceStep(from.pos, Math.max(from.pos, to.pos), this.slice, this.structure);
    }
    merge(other) {
        if (!(other instanceof ReplaceStep) || other.structure || this.structure)
            return null;
        if (this.from + this.slice.size == other.from && !this.slice.openEnd && !other.slice.openStart) {
            let slice = this.slice.size + other.slice.size == 0 ? Slice.empty
                : new Slice(this.slice.content.append(other.slice.content), this.slice.openStart, other.slice.openEnd);
            return new ReplaceStep(this.from, this.to + (other.to - other.from), slice, this.structure);
        }
        else if (other.to == this.from && !this.slice.openStart && !other.slice.openEnd) {
            let slice = this.slice.size + other.slice.size == 0 ? Slice.empty
                : new Slice(other.slice.content.append(this.slice.content), other.slice.openStart, this.slice.openEnd);
            return new ReplaceStep(other.from, this.to, slice, this.structure);
        }
        else {
            return null;
        }
    }
    toJSON() {
        let json = { stepType: "replace", from: this.from, to: this.to };
        if (this.slice.size)
            json.slice = this.slice.toJSON();
        if (this.structure)
            json.structure = true;
        return json;
    }
    /**
    @internal
    */
    static fromJSON(schema, json) {
        if (typeof json.from != "number" || typeof json.to != "number")
            throw new RangeError("Invalid input for ReplaceStep.fromJSON");
        return new ReplaceStep(json.from, json.to, Slice.fromJSON(schema, json.slice), !!json.structure);
    }
}
/**
By default, for backwards compatibility, an inserting step
mapped over an insertion at that same position fill move after
the inserted content. In a collaborative editing situation, that
can make redone insertions appear in unexpected places. You can
set this to -1 to make such mapping keep the step before the
insertion instead.
*/
ReplaceStep.MAP_BIAS = 1;
Step.jsonID("replace", ReplaceStep);
/**
Replace a part of the document with a slice of content, but
preserve a range of the replaced content by moving it into the
slice.
*/
class ReplaceAroundStep extends Step {
    /**
    Create a replace-around step with the given range and gap.
    `insert` should be the point in the slice into which the content
    of the gap should be moved. `structure` has the same meaning as
    it has in the [`ReplaceStep`](https://prosemirror.net/docs/ref/#transform.ReplaceStep) class.
    */
    constructor(
    /**
    The start position of the replaced range.
    */
    from, 
    /**
    The end position of the replaced range.
    */
    to, 
    /**
    The start of preserved range.
    */
    gapFrom, 
    /**
    The end of preserved range.
    */
    gapTo, 
    /**
    The slice to insert.
    */
    slice, 
    /**
    The position in the slice where the preserved range should be
    inserted.
    */
    insert, 
    /**
    @internal
    */
    structure = false) {
        super();
        this.from = from;
        this.to = to;
        this.gapFrom = gapFrom;
        this.gapTo = gapTo;
        this.slice = slice;
        this.insert = insert;
        this.structure = structure;
    }
    apply(doc) {
        if (this.structure && (contentBetween(doc, this.from, this.gapFrom) ||
            contentBetween(doc, this.gapTo, this.to)))
            return StepResult.fail("Structure gap-replace would overwrite content");
        let gap = doc.slice(this.gapFrom, this.gapTo);
        if (gap.openStart || gap.openEnd)
            return StepResult.fail("Gap is not a flat range");
        let inserted = this.slice.insertAt(this.insert, gap.content);
        if (!inserted)
            return StepResult.fail("Content does not fit in gap");
        return StepResult.fromReplace(doc, this.from, this.to, inserted);
    }
    getMap() {
        return new StepMap([this.from, this.gapFrom - this.from, this.insert,
            this.gapTo, this.to - this.gapTo, this.slice.size - this.insert]);
    }
    invert(doc) {
        let gap = this.gapTo - this.gapFrom;
        return new ReplaceAroundStep(this.from, this.from + this.slice.size + gap, this.from + this.insert, this.from + this.insert + gap, doc.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
    }
    map(mapping) {
        let from = mapping.mapResult(this.from, 1), to = mapping.mapResult(this.to, -1);
        let gapFrom = this.from == this.gapFrom ? from.pos : mapping.map(this.gapFrom, -1);
        let gapTo = this.to == this.gapTo ? to.pos : mapping.map(this.gapTo, 1);
        if ((from.deletedAcross && to.deletedAcross) || gapFrom < from.pos || gapTo > to.pos)
            return null;
        return new ReplaceAroundStep(from.pos, to.pos, gapFrom, gapTo, this.slice, this.insert, this.structure);
    }
    toJSON() {
        let json = { stepType: "replaceAround", from: this.from, to: this.to,
            gapFrom: this.gapFrom, gapTo: this.gapTo, insert: this.insert };
        if (this.slice.size)
            json.slice = this.slice.toJSON();
        if (this.structure)
            json.structure = true;
        return json;
    }
    /**
    @internal
    */
    static fromJSON(schema, json) {
        if (typeof json.from != "number" || typeof json.to != "number" ||
            typeof json.gapFrom != "number" || typeof json.gapTo != "number" || typeof json.insert != "number")
            throw new RangeError("Invalid input for ReplaceAroundStep.fromJSON");
        return new ReplaceAroundStep(json.from, json.to, json.gapFrom, json.gapTo, Slice.fromJSON(schema, json.slice), json.insert, !!json.structure);
    }
}
Step.jsonID("replaceAround", ReplaceAroundStep);
function contentBetween(doc, from, to) {
    let $from = doc.resolve(from), dist = to - from, depth = $from.depth;
    while (dist > 0 && depth > 0 && $from.indexAfter(depth) == $from.node(depth).childCount) {
        depth--;
        dist--;
    }
    if (dist > 0) {
        let next = $from.node(depth).maybeChild($from.indexAfter(depth));
        while (dist > 0) {
            if (!next || next.isLeaf)
                return true;
            next = next.firstChild;
            dist--;
        }
    }
    return false;
}

/**
Update an attribute in a specific node.
*/
class AttrStep extends Step {
    /**
    Construct an attribute step.
    */
    constructor(
    /**
    The position of the target node.
    */
    pos, 
    /**
    The attribute to set.
    */
    attr, 
    // The attribute's new value.
    value) {
        super();
        this.pos = pos;
        this.attr = attr;
        this.value = value;
    }
    apply(doc) {
        let node = doc.nodeAt(this.pos);
        if (!node)
            return StepResult.fail("No node at attribute step's position");
        let attrs = Object.create(null);
        for (let name in node.attrs)
            attrs[name] = node.attrs[name];
        attrs[this.attr] = this.value;
        let updated = node.type.create(attrs, null, node.marks);
        return StepResult.fromReplace(doc, this.pos, this.pos + 1, new Slice(Fragment.from(updated), 0, node.isLeaf ? 0 : 1));
    }
    getMap() {
        return StepMap.empty;
    }
    invert(doc) {
        return new AttrStep(this.pos, this.attr, doc.nodeAt(this.pos).attrs[this.attr]);
    }
    map(mapping) {
        let pos = mapping.mapResult(this.pos, 1);
        return pos.deletedAfter ? null : new AttrStep(pos.pos, this.attr, this.value);
    }
    toJSON() {
        return { stepType: "attr", pos: this.pos, attr: this.attr, value: this.value };
    }
    static fromJSON(schema, json) {
        if (typeof json.pos != "number" || typeof json.attr != "string")
            throw new RangeError("Invalid input for AttrStep.fromJSON");
        return new AttrStep(json.pos, json.attr, json.value);
    }
}
Step.jsonID("attr", AttrStep);
/**
Update an attribute in the doc node.
*/
class DocAttrStep extends Step {
    /**
    Construct an attribute step.
    */
    constructor(
    /**
    The attribute to set.
    */
    attr, 
    // The attribute's new value.
    value) {
        super();
        this.attr = attr;
        this.value = value;
    }
    apply(doc) {
        let attrs = Object.create(null);
        for (let name in doc.attrs)
            attrs[name] = doc.attrs[name];
        attrs[this.attr] = this.value;
        let updated = doc.type.create(attrs, doc.content, doc.marks);
        return StepResult.ok(updated);
    }
    getMap() {
        return StepMap.empty;
    }
    invert(doc) {
        return new DocAttrStep(this.attr, doc.attrs[this.attr]);
    }
    map(mapping) {
        return this;
    }
    toJSON() {
        return { stepType: "docAttr", attr: this.attr, value: this.value };
    }
    static fromJSON(schema, json) {
        if (typeof json.attr != "string")
            throw new RangeError("Invalid input for DocAttrStep.fromJSON");
        return new DocAttrStep(json.attr, json.value);
    }
}
Step.jsonID("docAttr", DocAttrStep);

/**
@internal
*/
let TransformError = class extends Error {
};
TransformError = function TransformError(message) {
    let err = Error.call(this, message);
    err.__proto__ = TransformError.prototype;
    return err;
};
TransformError.prototype = Object.create(Error.prototype);
TransformError.prototype.constructor = TransformError;
TransformError.prototype.name = "TransformError";

const classesById = Object.create(null);
/**
Superclass for editor selections. Every selection type should
extend this. Should not be instantiated directly.
*/
class Selection {
    /**
    Initialize a selection with the head and anchor and ranges. If no
    ranges are given, constructs a single range across `$anchor` and
    `$head`.
    */
    constructor(
    /**
    The resolved anchor of the selection (the side that stays in
    place when the selection is modified).
    */
    $anchor, 
    /**
    The resolved head of the selection (the side that moves when
    the selection is modified).
    */
    $head, ranges) {
        this.$anchor = $anchor;
        this.$head = $head;
        this.ranges = ranges || [new SelectionRange($anchor.min($head), $anchor.max($head))];
    }
    /**
    The selection's anchor, as an unresolved position.
    */
    get anchor() { return this.$anchor.pos; }
    /**
    The selection's head.
    */
    get head() { return this.$head.pos; }
    /**
    The lower bound of the selection's main range.
    */
    get from() { return this.$from.pos; }
    /**
    The upper bound of the selection's main range.
    */
    get to() { return this.$to.pos; }
    /**
    The resolved lower  bound of the selection's main range.
    */
    get $from() {
        return this.ranges[0].$from;
    }
    /**
    The resolved upper bound of the selection's main range.
    */
    get $to() {
        return this.ranges[0].$to;
    }
    /**
    Indicates whether the selection contains any content.
    */
    get empty() {
        let ranges = this.ranges;
        for (let i = 0; i < ranges.length; i++)
            if (ranges[i].$from.pos != ranges[i].$to.pos)
                return false;
        return true;
    }
    /**
    Get the content of this selection as a slice.
    */
    content() {
        return this.$from.doc.slice(this.from, this.to, true);
    }
    /**
    Replace the selection with a slice or, if no slice is given,
    delete the selection. Will append to the given transaction.
    */
    replace(tr, content = Slice.empty) {
        // Put the new selection at the position after the inserted
        // content. When that ended in an inline node, search backwards,
        // to get the position after that node. If not, search forward.
        let lastNode = content.content.lastChild, lastParent = null;
        for (let i = 0; i < content.openEnd; i++) {
            lastParent = lastNode;
            lastNode = lastNode.lastChild;
        }
        let mapFrom = tr.steps.length, ranges = this.ranges;
        for (let i = 0; i < ranges.length; i++) {
            let { $from, $to } = ranges[i], mapping = tr.mapping.slice(mapFrom);
            tr.replaceRange(mapping.map($from.pos), mapping.map($to.pos), i ? Slice.empty : content);
            if (i == 0)
                selectionToInsertionEnd(tr, mapFrom, (lastNode ? lastNode.isInline : lastParent && lastParent.isTextblock) ? -1 : 1);
        }
    }
    /**
    Replace the selection with the given node, appending the changes
    to the given transaction.
    */
    replaceWith(tr, node) {
        let mapFrom = tr.steps.length, ranges = this.ranges;
        for (let i = 0; i < ranges.length; i++) {
            let { $from, $to } = ranges[i], mapping = tr.mapping.slice(mapFrom);
            let from = mapping.map($from.pos), to = mapping.map($to.pos);
            if (i) {
                tr.deleteRange(from, to);
            }
            else {
                tr.replaceRangeWith(from, to, node);
                selectionToInsertionEnd(tr, mapFrom, node.isInline ? -1 : 1);
            }
        }
    }
    /**
    Find a valid cursor or leaf node selection starting at the given
    position and searching back if `dir` is negative, and forward if
    positive. When `textOnly` is true, only consider cursor
    selections. Will return null when no valid selection position is
    found.
    */
    static findFrom($pos, dir, textOnly = false) {
        let inner = $pos.parent.inlineContent ? new TextSelection($pos)
            : findSelectionIn($pos.node(0), $pos.parent, $pos.pos, $pos.index(), dir, textOnly);
        if (inner)
            return inner;
        for (let depth = $pos.depth - 1; depth >= 0; depth--) {
            let found = dir < 0
                ? findSelectionIn($pos.node(0), $pos.node(depth), $pos.before(depth + 1), $pos.index(depth), dir, textOnly)
                : findSelectionIn($pos.node(0), $pos.node(depth), $pos.after(depth + 1), $pos.index(depth) + 1, dir, textOnly);
            if (found)
                return found;
        }
        return null;
    }
    /**
    Find a valid cursor or leaf node selection near the given
    position. Searches forward first by default, but if `bias` is
    negative, it will search backwards first.
    */
    static near($pos, bias = 1) {
        return this.findFrom($pos, bias) || this.findFrom($pos, -bias) || new AllSelection($pos.node(0));
    }
    /**
    Find the cursor or leaf node selection closest to the start of
    the given document. Will return an
    [`AllSelection`](https://prosemirror.net/docs/ref/#state.AllSelection) if no valid position
    exists.
    */
    static atStart(doc) {
        return findSelectionIn(doc, doc, 0, 0, 1) || new AllSelection(doc);
    }
    /**
    Find the cursor or leaf node selection closest to the end of the
    given document.
    */
    static atEnd(doc) {
        return findSelectionIn(doc, doc, doc.content.size, doc.childCount, -1) || new AllSelection(doc);
    }
    /**
    Deserialize the JSON representation of a selection. Must be
    implemented for custom classes (as a static class method).
    */
    static fromJSON(doc, json) {
        if (!json || !json.type)
            throw new RangeError("Invalid input for Selection.fromJSON");
        let cls = classesById[json.type];
        if (!cls)
            throw new RangeError(`No selection type ${json.type} defined`);
        return cls.fromJSON(doc, json);
    }
    /**
    To be able to deserialize selections from JSON, custom selection
    classes must register themselves with an ID string, so that they
    can be disambiguated. Try to pick something that's unlikely to
    clash with classes from other modules.
    */
    static jsonID(id, selectionClass) {
        if (id in classesById)
            throw new RangeError("Duplicate use of selection JSON ID " + id);
        classesById[id] = selectionClass;
        selectionClass.prototype.jsonID = id;
        return selectionClass;
    }
    /**
    Get a [bookmark](https://prosemirror.net/docs/ref/#state.SelectionBookmark) for this selection,
    which is a value that can be mapped without having access to a
    current document, and later resolved to a real selection for a
    given document again. (This is used mostly by the history to
    track and restore old selections.) The default implementation of
    this method just converts the selection to a text selection and
    returns the bookmark for that.
    */
    getBookmark() {
        return TextSelection.between(this.$anchor, this.$head).getBookmark();
    }
}
Selection.prototype.visible = true;
/**
Represents a selected range in a document.
*/
class SelectionRange {
    /**
    Create a range.
    */
    constructor(
    /**
    The lower bound of the range.
    */
    $from, 
    /**
    The upper bound of the range.
    */
    $to) {
        this.$from = $from;
        this.$to = $to;
    }
}
let warnedAboutTextSelection = false;
function checkTextSelection($pos) {
    if (!warnedAboutTextSelection && !$pos.parent.inlineContent) {
        warnedAboutTextSelection = true;
        console["warn"]("TextSelection endpoint not pointing into a node with inline content (" + $pos.parent.type.name + ")");
    }
}
/**
A text selection represents a classical editor selection, with a
head (the moving side) and anchor (immobile side), both of which
point into textblock nodes. It can be empty (a regular cursor
position).
*/
class TextSelection extends Selection {
    /**
    Construct a text selection between the given points.
    */
    constructor($anchor, $head = $anchor) {
        checkTextSelection($anchor);
        checkTextSelection($head);
        super($anchor, $head);
    }
    /**
    Returns a resolved position if this is a cursor selection (an
    empty text selection), and null otherwise.
    */
    get $cursor() { return this.$anchor.pos == this.$head.pos ? this.$head : null; }
    map(doc, mapping) {
        let $head = doc.resolve(mapping.map(this.head));
        if (!$head.parent.inlineContent)
            return Selection.near($head);
        let $anchor = doc.resolve(mapping.map(this.anchor));
        return new TextSelection($anchor.parent.inlineContent ? $anchor : $head, $head);
    }
    replace(tr, content = Slice.empty) {
        super.replace(tr, content);
        if (content == Slice.empty) {
            let marks = this.$from.marksAcross(this.$to);
            if (marks)
                tr.ensureMarks(marks);
        }
    }
    eq(other) {
        return other instanceof TextSelection && other.anchor == this.anchor && other.head == this.head;
    }
    getBookmark() {
        return new TextBookmark(this.anchor, this.head);
    }
    toJSON() {
        return { type: "text", anchor: this.anchor, head: this.head };
    }
    /**
    @internal
    */
    static fromJSON(doc, json) {
        if (typeof json.anchor != "number" || typeof json.head != "number")
            throw new RangeError("Invalid input for TextSelection.fromJSON");
        return new TextSelection(doc.resolve(json.anchor), doc.resolve(json.head));
    }
    /**
    Create a text selection from non-resolved positions.
    */
    static create(doc, anchor, head = anchor) {
        let $anchor = doc.resolve(anchor);
        return new this($anchor, head == anchor ? $anchor : doc.resolve(head));
    }
    /**
    Return a text selection that spans the given positions or, if
    they aren't text positions, find a text selection near them.
    `bias` determines whether the method searches forward (default)
    or backwards (negative number) first. Will fall back to calling
    [`Selection.near`](https://prosemirror.net/docs/ref/#state.Selection^near) when the document
    doesn't contain a valid text position.
    */
    static between($anchor, $head, bias) {
        let dPos = $anchor.pos - $head.pos;
        if (!bias || dPos)
            bias = dPos >= 0 ? 1 : -1;
        if (!$head.parent.inlineContent) {
            let found = Selection.findFrom($head, bias, true) || Selection.findFrom($head, -bias, true);
            if (found)
                $head = found.$head;
            else
                return Selection.near($head, bias);
        }
        if (!$anchor.parent.inlineContent) {
            if (dPos == 0) {
                $anchor = $head;
            }
            else {
                $anchor = (Selection.findFrom($anchor, -bias, true) || Selection.findFrom($anchor, bias, true)).$anchor;
                if (($anchor.pos < $head.pos) != (dPos < 0))
                    $anchor = $head;
            }
        }
        return new TextSelection($anchor, $head);
    }
}
Selection.jsonID("text", TextSelection);
class TextBookmark {
    constructor(anchor, head) {
        this.anchor = anchor;
        this.head = head;
    }
    map(mapping) {
        return new TextBookmark(mapping.map(this.anchor), mapping.map(this.head));
    }
    resolve(doc) {
        return TextSelection.between(doc.resolve(this.anchor), doc.resolve(this.head));
    }
}
/**
A node selection is a selection that points at a single node. All
nodes marked [selectable](https://prosemirror.net/docs/ref/#model.NodeSpec.selectable) can be the
target of a node selection. In such a selection, `from` and `to`
point directly before and after the selected node, `anchor` equals
`from`, and `head` equals `to`..
*/
class NodeSelection extends Selection {
    /**
    Create a node selection. Does not verify the validity of its
    argument.
    */
    constructor($pos) {
        let node = $pos.nodeAfter;
        let $end = $pos.node(0).resolve($pos.pos + node.nodeSize);
        super($pos, $end);
        this.node = node;
    }
    map(doc, mapping) {
        let { deleted, pos } = mapping.mapResult(this.anchor);
        let $pos = doc.resolve(pos);
        if (deleted)
            return Selection.near($pos);
        return new NodeSelection($pos);
    }
    content() {
        return new Slice(Fragment.from(this.node), 0, 0);
    }
    eq(other) {
        return other instanceof NodeSelection && other.anchor == this.anchor;
    }
    toJSON() {
        return { type: "node", anchor: this.anchor };
    }
    getBookmark() { return new NodeBookmark(this.anchor); }
    /**
    @internal
    */
    static fromJSON(doc, json) {
        if (typeof json.anchor != "number")
            throw new RangeError("Invalid input for NodeSelection.fromJSON");
        return new NodeSelection(doc.resolve(json.anchor));
    }
    /**
    Create a node selection from non-resolved positions.
    */
    static create(doc, from) {
        return new NodeSelection(doc.resolve(from));
    }
    /**
    Determines whether the given node may be selected as a node
    selection.
    */
    static isSelectable(node) {
        return !node.isText && node.type.spec.selectable !== false;
    }
}
NodeSelection.prototype.visible = false;
Selection.jsonID("node", NodeSelection);
class NodeBookmark {
    constructor(anchor) {
        this.anchor = anchor;
    }
    map(mapping) {
        let { deleted, pos } = mapping.mapResult(this.anchor);
        return deleted ? new TextBookmark(pos, pos) : new NodeBookmark(pos);
    }
    resolve(doc) {
        let $pos = doc.resolve(this.anchor), node = $pos.nodeAfter;
        if (node && NodeSelection.isSelectable(node))
            return new NodeSelection($pos);
        return Selection.near($pos);
    }
}
/**
A selection type that represents selecting the whole document
(which can not necessarily be expressed with a text selection, when
there are for example leaf block nodes at the start or end of the
document).
*/
class AllSelection extends Selection {
    /**
    Create an all-selection over the given document.
    */
    constructor(doc) {
        super(doc.resolve(0), doc.resolve(doc.content.size));
    }
    replace(tr, content = Slice.empty) {
        if (content == Slice.empty) {
            tr.delete(0, tr.doc.content.size);
            let sel = Selection.atStart(tr.doc);
            if (!sel.eq(tr.selection))
                tr.setSelection(sel);
        }
        else {
            super.replace(tr, content);
        }
    }
    toJSON() { return { type: "all" }; }
    /**
    @internal
    */
    static fromJSON(doc) { return new AllSelection(doc); }
    map(doc) { return new AllSelection(doc); }
    eq(other) { return other instanceof AllSelection; }
    getBookmark() { return AllBookmark; }
}
Selection.jsonID("all", AllSelection);
const AllBookmark = {
    map() { return this; },
    resolve(doc) { return new AllSelection(doc); }
};
// FIXME we'll need some awareness of text direction when scanning for selections
// Try to find a selection inside the given node. `pos` points at the
// position where the search starts. When `text` is true, only return
// text selections.
function findSelectionIn(doc, node, pos, index, dir, text = false) {
    if (node.inlineContent)
        return TextSelection.create(doc, pos);
    for (let i = index - (dir > 0 ? 0 : 1); dir > 0 ? i < node.childCount : i >= 0; i += dir) {
        let child = node.child(i);
        if (!child.isAtom) {
            let inner = findSelectionIn(doc, child, pos + dir, dir < 0 ? child.childCount : 0, dir, text);
            if (inner)
                return inner;
        }
        else if (!text && NodeSelection.isSelectable(child)) {
            return NodeSelection.create(doc, pos - (dir < 0 ? child.nodeSize : 0));
        }
        pos += child.nodeSize * dir;
    }
    return null;
}
function selectionToInsertionEnd(tr, startLen, bias) {
    let last = tr.steps.length - 1;
    if (last < startLen)
        return;
    let step = tr.steps[last];
    if (!(step instanceof ReplaceStep || step instanceof ReplaceAroundStep))
        return;
    let map = tr.mapping.maps[last], end;
    map.forEach((_from, _to, _newFrom, newTo) => { if (end == null)
        end = newTo; });
    tr.setSelection(Selection.near(tr.doc.resolve(end), bias));
}

function bind(f, self) {
    return !self || !f ? f : f.bind(self);
}
class FieldDesc {
    constructor(name, desc, self) {
        this.name = name;
        this.init = bind(desc.init, self);
        this.apply = bind(desc.apply, self);
    }
}
[
    new FieldDesc("doc", {
        init(config) { return config.doc || config.schema.topNodeType.createAndFill(); },
        apply(tr) { return tr.doc; }
    }),
    new FieldDesc("selection", {
        init(config, instance) { return config.selection || Selection.atStart(instance.doc); },
        apply(tr) { return tr.selection; }
    }),
    new FieldDesc("storedMarks", {
        init(config) { return config.storedMarks || null; },
        apply(tr, _marks, _old, state) { return state.selection.$cursor ? tr.storedMarks : null; }
    }),
    new FieldDesc("scrollToSelection", {
        init() { return 0; },
        apply(tr, prev) { return tr.scrolledIntoView ? prev + 1 : prev; }
    })
];

// src/blockquote.tsx
var inputRegex = /^\s*>\s$/;
var Blockquote = Node.create({
  name: "blockquote",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  content: "block+",
  group: "block",
  defining: true,
  parseHTML() {
    return [{ tag: "blockquote" }];
  },
  renderHTML({ HTMLAttributes }) {
    return /* @__PURE__ */ jsx("blockquote", { ...mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), children: /* @__PURE__ */ jsx("slot", {}) });
  },
  parseMarkdown: (token, helpers) => {
    var _a;
    const parseBlockChildren = (_a = helpers.parseBlockChildren) != null ? _a : helpers.parseChildren;
    return helpers.createNode("blockquote", void 0, parseBlockChildren(token.tokens || []));
  },
  renderMarkdown: (node, h) => {
    if (!node.content) {
      return "";
    }
    const prefix = ">";
    const result = [];
    node.content.forEach((child, index) => {
      var _a, _b;
      const childContent = (_b = (_a = h.renderChild) == null ? void 0 : _a.call(h, child, index)) != null ? _b : h.renderChildren([child]);
      const lines = childContent.split("\n");
      const linesWithPrefix = lines.map((line) => {
        if (line.trim() === "") {
          return prefix;
        }
        return `${prefix} ${line}`;
      });
      result.push(linesWithPrefix.join("\n"));
    });
    return result.join(`
${prefix}
`);
  },
  addCommands() {
    return {
      setBlockquote: () => ({ commands }) => {
        return commands.wrapIn(this.name);
      },
      toggleBlockquote: () => ({ commands }) => {
        return commands.toggleWrap(this.name);
      },
      unsetBlockquote: () => ({ commands }) => {
        return commands.lift(this.name);
      }
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-b": () => this.editor.commands.toggleBlockquote()
    };
  },
  addInputRules() {
    return [
      wrappingInputRule({
        find: inputRegex,
        type: this.type
      })
    ];
  }
});

// src/index.ts
var index_default = Blockquote;

//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/align-center-vertical.svelte
Align_center_vertical[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/align-center-vertical.svelte";
function Align_center_vertical($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);
	$$renderer.component(($$renderer) => {
		/**
		* @license lucide-svelte v1.0.1 - ISC
		*
		* ISC License
		*
		* Copyright (c) 2026 Lucide Icons and Contributors
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The following Lucide icons are derived from the Feather project:
		*
		* airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out
		*
		* The MIT License (MIT) (for the icons listed above)
		*
		* Copyright (c) 2013-present Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		Icon($$renderer, spread_props([
			{ name: "align-center-vertical" },
			$$sanitized_props,
			{
				/**
				* @component @name AlignCenterVertical
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgMnYyMCIgLz4KICA8cGF0aCBkPSJNOCAxMEg0YTIgMiAwIDAgMS0yLTJWNmMwLTEuMS45LTIgMi0yaDQiIC8+CiAgPHBhdGggZD0iTTE2IDEwaDRhMiAyIDAgMCAwIDItMlY2YTIgMiAwIDAgMC0yLTJoLTQiIC8+CiAgPHBhdGggZD0iTTggMjBIN2EyIDIgMCAwIDEtMi0ydi0yYzAtMS4xLjktMiAyLTJoMSIgLz4KICA8cGF0aCBkPSJNMTYgMTRoMWEyIDIgMCAwIDEgMiAydjJhMiAyIDAgMCAxLTIgMmgtMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/align-center-vertical
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [
					["path", { "d": "M12 2v20" }],
					["path", { "d": "M8 10H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h4" }],
					["path", { "d": "M16 10h4a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-4" }],
					["path", { "d": "M8 20H7a2 2 0 0 1-2-2v-2c0-1.1.9-2 2-2h1" }],
					["path", { "d": "M16 14h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1" }]
				],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Align_center_vertical);
}
Align_center_vertical.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/align-end-vertical.svelte
Align_end_vertical[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/align-end-vertical.svelte";
function Align_end_vertical($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);
	$$renderer.component(($$renderer) => {
		/**
		* @license lucide-svelte v1.0.1 - ISC
		*
		* ISC License
		*
		* Copyright (c) 2026 Lucide Icons and Contributors
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The following Lucide icons are derived from the Feather project:
		*
		* airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out
		*
		* The MIT License (MIT) (for the icons listed above)
		*
		* Copyright (c) 2013-present Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		Icon($$renderer, spread_props([
			{ name: "align-end-vertical" },
			$$sanitized_props,
			{
				/**
				* @component @name AlignEndVertical
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iNiIgeD0iMiIgeT0iNCIgcng9IjIiIC8+CiAgPHJlY3Qgd2lkdGg9IjkiIGhlaWdodD0iNiIgeD0iOSIgeT0iMTQiIHJ4PSIyIiAvPgogIDxwYXRoIGQ9Ik0yMiAyMlYyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/align-end-vertical
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [
					["rect", {
						"width": "16",
						"height": "6",
						"x": "2",
						"y": "4",
						"rx": "2"
					}],
					["rect", {
						"width": "9",
						"height": "6",
						"x": "9",
						"y": "14",
						"rx": "2"
					}],
					["path", { "d": "M22 22V2" }]
				],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Align_end_vertical);
}
Align_end_vertical.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/align-start-vertical.svelte
Align_start_vertical[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/align-start-vertical.svelte";
function Align_start_vertical($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);
	$$renderer.component(($$renderer) => {
		/**
		* @license lucide-svelte v1.0.1 - ISC
		*
		* ISC License
		*
		* Copyright (c) 2026 Lucide Icons and Contributors
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The following Lucide icons are derived from the Feather project:
		*
		* airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out
		*
		* The MIT License (MIT) (for the icons listed above)
		*
		* Copyright (c) 2013-present Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		Icon($$renderer, spread_props([
			{ name: "align-start-vertical" },
			$$sanitized_props,
			{
				/**
				* @component @name AlignStartVertical
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iOSIgaGVpZ2h0PSI2IiB4PSI2IiB5PSIxNCIgcng9IjIiIC8+CiAgPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjYiIHg9IjYiIHk9IjQiIHJ4PSIyIiAvPgogIDxwYXRoIGQ9Ik0yIDJ2MjAiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/align-start-vertical
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [
					["rect", {
						"width": "9",
						"height": "6",
						"x": "6",
						"y": "14",
						"rx": "2"
					}],
					["rect", {
						"width": "16",
						"height": "6",
						"x": "6",
						"y": "4",
						"rx": "2"
					}],
					["path", { "d": "M2 2v20" }]
				],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Align_start_vertical);
}
Align_start_vertical.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/align-vertical-justify-center.svelte
Align_vertical_justify_center[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/align-vertical-justify-center.svelte";
function Align_vertical_justify_center($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);
	$$renderer.component(($$renderer) => {
		/**
		* @license lucide-svelte v1.0.1 - ISC
		*
		* ISC License
		*
		* Copyright (c) 2026 Lucide Icons and Contributors
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The following Lucide icons are derived from the Feather project:
		*
		* airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out
		*
		* The MIT License (MIT) (for the icons listed above)
		*
		* Copyright (c) 2013-present Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		Icon($$renderer, spread_props([
			{ name: "align-vertical-justify-center" },
			$$sanitized_props,
			{
				/**
				* @component @name AlignVerticalJustifyCenter
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTQiIGhlaWdodD0iNiIgeD0iNSIgeT0iMTYiIHJ4PSIyIiAvPgogIDxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSI2IiB4PSI3IiB5PSIyIiByeD0iMiIgLz4KICA8cGF0aCBkPSJNMiAxMmgyMCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/align-vertical-justify-center
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [
					["rect", {
						"width": "14",
						"height": "6",
						"x": "5",
						"y": "16",
						"rx": "2"
					}],
					["rect", {
						"width": "10",
						"height": "6",
						"x": "7",
						"y": "2",
						"rx": "2"
					}],
					["path", { "d": "M2 12h20" }]
				],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Align_vertical_justify_center);
}
Align_vertical_justify_center.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/bookmark-plus.svelte
Bookmark_plus[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/bookmark-plus.svelte";
function Bookmark_plus($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);
	$$renderer.component(($$renderer) => {
		/**
		* @license lucide-svelte v1.0.1 - ISC
		*
		* ISC License
		*
		* Copyright (c) 2026 Lucide Icons and Contributors
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The following Lucide icons are derived from the Feather project:
		*
		* airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out
		*
		* The MIT License (MIT) (for the icons listed above)
		*
		* Copyright (c) 2013-present Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		Icon($$renderer, spread_props([
			{ name: "bookmark-plus" },
			$$sanitized_props,
			{
				/**
				* @component @name BookmarkPlus
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgN3Y2IiAvPgogIDxwYXRoIGQ9Ik0xNSAxMEg5IiAvPgogIDxwYXRoIGQ9Ik0xNyAzYTIgMiAwIDAgMSAyIDJ2MTVhMSAxIDAgMCAxLTEuNDk2Ljg2OGwtNC41MTItMi41NzhhMiAyIDAgMCAwLTEuOTg0IDBsLTQuNTEyIDIuNTc4QTEgMSAwIDAgMSA1IDIwVjVhMiAyIDAgMCAxIDItMnoiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/bookmark-plus
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [
					["path", { "d": "M12 7v6" }],
					["path", { "d": "M15 10H9" }],
					["path", { "d": "M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z" }]
				],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Bookmark_plus);
}
Bookmark_plus.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/circle-alert.svelte
Circle_alert[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/circle-alert.svelte";
function Circle_alert($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);
	$$renderer.component(($$renderer) => {
		/**
		* @license lucide-svelte v1.0.1 - ISC
		*
		* ISC License
		*
		* Copyright (c) 2026 Lucide Icons and Contributors
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The following Lucide icons are derived from the Feather project:
		*
		* airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out
		*
		* The MIT License (MIT) (for the icons listed above)
		*
		* Copyright (c) 2013-present Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		Icon($$renderer, spread_props([
			{ name: "circle-alert" },
			$$sanitized_props,
			{
				/**
				* @component @name CircleAlert
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8bGluZSB4MT0iMTIiIHgyPSIxMiIgeTE9IjgiIHkyPSIxMiIgLz4KICA8bGluZSB4MT0iMTIiIHgyPSIxMi4wMSIgeTE9IjE2IiB5Mj0iMTYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/circle-alert
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [
					["circle", {
						"cx": "12",
						"cy": "12",
						"r": "10"
					}],
					["line", {
						"x1": "12",
						"x2": "12",
						"y1": "8",
						"y2": "12"
					}],
					["line", {
						"x1": "12",
						"x2": "12.01",
						"y1": "16",
						"y2": "16"
					}]
				],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Circle_alert);
}
Circle_alert.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/circle-check-big.svelte
Circle_check_big[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/circle-check-big.svelte";
function Circle_check_big($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);
	$$renderer.component(($$renderer) => {
		/**
		* @license lucide-svelte v1.0.1 - ISC
		*
		* ISC License
		*
		* Copyright (c) 2026 Lucide Icons and Contributors
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The following Lucide icons are derived from the Feather project:
		*
		* airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out
		*
		* The MIT License (MIT) (for the icons listed above)
		*
		* Copyright (c) 2013-present Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		Icon($$renderer, spread_props([
			{ name: "circle-check-big" },
			$$sanitized_props,
			{
				/**
				* @component @name CircleCheckBig
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEuODAxIDEwQTEwIDEwIDAgMSAxIDE3IDMuMzM1IiAvPgogIDxwYXRoIGQ9Im05IDExIDMgM0wyMiA0IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/circle-check-big
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [["path", { "d": "M21.801 10A10 10 0 1 1 17 3.335" }], ["path", { "d": "m9 11 3 3L22 4" }]],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Circle_check_big);
}
Circle_check_big.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/circle-play.svelte
Circle_play[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/circle-play.svelte";
function Circle_play($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);
	$$renderer.component(($$renderer) => {
		/**
		* @license lucide-svelte v1.0.1 - ISC
		*
		* ISC License
		*
		* Copyright (c) 2026 Lucide Icons and Contributors
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The following Lucide icons are derived from the Feather project:
		*
		* airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out
		*
		* The MIT License (MIT) (for the icons listed above)
		*
		* Copyright (c) 2013-present Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		Icon($$renderer, spread_props([
			{ name: "circle-play" },
			$$sanitized_props,
			{
				/**
				* @component @name CirclePlay
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNOSA5LjAwM2ExIDEgMCAwIDEgMS41MTctLjg1OWw0Ljk5NyAyLjk5N2ExIDEgMCAwIDEgMCAxLjcxOGwtNC45OTcgMi45OTdBMSAxIDAgMCAxIDkgMTQuOTk2eiIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/circle-play
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [["path", { "d": "M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z" }], ["circle", {
					"cx": "12",
					"cy": "12",
					"r": "10"
				}]],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Circle_play);
}
Circle_play.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/cloud-upload.svelte
Cloud_upload[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/cloud-upload.svelte";
function Cloud_upload($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);
	$$renderer.component(($$renderer) => {
		/**
		* @license lucide-svelte v1.0.1 - ISC
		*
		* ISC License
		*
		* Copyright (c) 2026 Lucide Icons and Contributors
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The following Lucide icons are derived from the Feather project:
		*
		* airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out
		*
		* The MIT License (MIT) (for the icons listed above)
		*
		* Copyright (c) 2013-present Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		Icon($$renderer, spread_props([
			{ name: "cloud-upload" },
			$$sanitized_props,
			{
				/**
				* @component @name CloudUpload
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgMTN2OCIgLz4KICA8cGF0aCBkPSJNNCAxNC44OTlBNyA3IDAgMSAxIDE1LjcxIDhoMS43OWE0LjUgNC41IDAgMCAxIDIuNSA4LjI0MiIgLz4KICA8cGF0aCBkPSJtOCAxNyA0LTQgNCA0IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/cloud-upload
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [
					["path", { "d": "M12 13v8" }],
					["path", { "d": "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" }],
					["path", { "d": "m8 17 4-4 4 4" }]
				],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Cloud_upload);
}
Cloud_upload.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/code-xml.svelte
Code_xml[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/code-xml.svelte";
function Code_xml($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);
	$$renderer.component(($$renderer) => {
		/**
		* @license lucide-svelte v1.0.1 - ISC
		*
		* ISC License
		*
		* Copyright (c) 2026 Lucide Icons and Contributors
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The following Lucide icons are derived from the Feather project:
		*
		* airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out
		*
		* The MIT License (MIT) (for the icons listed above)
		*
		* Copyright (c) 2013-present Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		Icon($$renderer, spread_props([
			{ name: "code-xml" },
			$$sanitized_props,
			{
				/**
				* @component @name CodeXml
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTggMTYgNC00LTQtNCIgLz4KICA8cGF0aCBkPSJtNiA4LTQgNCA0IDQiIC8+CiAgPHBhdGggZD0ibTE0LjUgNC01IDE2IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/code-xml
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [
					["path", { "d": "m18 16 4-4-4-4" }],
					["path", { "d": "m6 8-4 4 4 4" }],
					["path", { "d": "m14.5 4-5 16" }]
				],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Code_xml);
}
Code_xml.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/copy.svelte
Copy[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/copy.svelte";
function Copy($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);
	$$renderer.component(($$renderer) => {
		/**
		* @license lucide-svelte v1.0.1 - ISC
		*
		* ISC License
		*
		* Copyright (c) 2026 Lucide Icons and Contributors
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The following Lucide icons are derived from the Feather project:
		*
		* airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out
		*
		* The MIT License (MIT) (for the icons listed above)
		*
		* Copyright (c) 2013-present Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		Icon($$renderer, spread_props([
			{ name: "copy" },
			$$sanitized_props,
			{
				/**
				* @component @name Copy
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHg9IjgiIHk9IjgiIHJ4PSIyIiByeT0iMiIgLz4KICA8cGF0aCBkPSJNNCAxNmMtMS4xIDAtMi0uOS0yLTJWNGMwLTEuMS45LTIgMi0yaDEwYzEuMSAwIDIgLjkgMiAyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/copy
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [["rect", {
					"width": "14",
					"height": "14",
					"x": "8",
					"y": "8",
					"rx": "2",
					"ry": "2"
				}], ["path", { "d": "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }]],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Copy);
}
Copy.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/heading-1.svelte
Heading_1[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/heading-1.svelte";
function Heading_1($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);
	$$renderer.component(($$renderer) => {
		/**
		* @license lucide-svelte v1.0.1 - ISC
		*
		* ISC License
		*
		* Copyright (c) 2026 Lucide Icons and Contributors
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The following Lucide icons are derived from the Feather project:
		*
		* airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out
		*
		* The MIT License (MIT) (for the icons listed above)
		*
		* Copyright (c) 2013-present Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		Icon($$renderer, spread_props([
			{ name: "heading-1" },
			$$sanitized_props,
			{
				/**
				* @component @name Heading1
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNCAxMmg4IiAvPgogIDxwYXRoIGQ9Ik00IDE4VjYiIC8+CiAgPHBhdGggZD0iTTEyIDE4VjYiIC8+CiAgPHBhdGggZD0ibTE3IDEyIDMtMnY4IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/heading-1
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [
					["path", { "d": "M4 12h8" }],
					["path", { "d": "M4 18V6" }],
					["path", { "d": "M12 18V6" }],
					["path", { "d": "m17 12 3-2v8" }]
				],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Heading_1);
}
Heading_1.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/heading-2.svelte
Heading_2[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/heading-2.svelte";
function Heading_2($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);
	$$renderer.component(($$renderer) => {
		/**
		* @license lucide-svelte v1.0.1 - ISC
		*
		* ISC License
		*
		* Copyright (c) 2026 Lucide Icons and Contributors
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The following Lucide icons are derived from the Feather project:
		*
		* airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out
		*
		* The MIT License (MIT) (for the icons listed above)
		*
		* Copyright (c) 2013-present Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		Icon($$renderer, spread_props([
			{ name: "heading-2" },
			$$sanitized_props,
			{
				/**
				* @component @name Heading2
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNCAxMmg4IiAvPgogIDxwYXRoIGQ9Ik00IDE4VjYiIC8+CiAgPHBhdGggZD0iTTEyIDE4VjYiIC8+CiAgPHBhdGggZD0iTTIxIDE4aC00YzAtNCA0LTMgNC02IDAtMS41LTItMi41LTQtMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/heading-2
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [
					["path", { "d": "M4 12h8" }],
					["path", { "d": "M4 18V6" }],
					["path", { "d": "M12 18V6" }],
					["path", { "d": "M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1" }]
				],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Heading_2);
}
Heading_2.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/heading-3.svelte
Heading_3[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/heading-3.svelte";
function Heading_3($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);
	$$renderer.component(($$renderer) => {
		/**
		* @license lucide-svelte v1.0.1 - ISC
		*
		* ISC License
		*
		* Copyright (c) 2026 Lucide Icons and Contributors
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The following Lucide icons are derived from the Feather project:
		*
		* airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out
		*
		* The MIT License (MIT) (for the icons listed above)
		*
		* Copyright (c) 2013-present Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		Icon($$renderer, spread_props([
			{ name: "heading-3" },
			$$sanitized_props,
			{
				/**
				* @component @name Heading3
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNCAxMmg4IiAvPgogIDxwYXRoIGQ9Ik00IDE4VjYiIC8+CiAgPHBhdGggZD0iTTEyIDE4VjYiIC8+CiAgPHBhdGggZD0iTTE3LjUgMTAuNWMxLjctMSAzLjUgMCAzLjUgMS41YTIgMiAwIDAgMS0yIDIiIC8+CiAgPHBhdGggZD0iTTE3IDE3LjVjMiAxLjUgNCAuMyA0LTEuNWEyIDIgMCAwIDAtMi0yIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/heading-3
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [
					["path", { "d": "M4 12h8" }],
					["path", { "d": "M4 18V6" }],
					["path", { "d": "M12 18V6" }],
					["path", { "d": "M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2" }],
					["path", { "d": "M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2" }]
				],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Heading_3);
}
Heading_3.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/history.svelte
History[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/history.svelte";
function History($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);
	$$renderer.component(($$renderer) => {
		/**
		* @license lucide-svelte v1.0.1 - ISC
		*
		* ISC License
		*
		* Copyright (c) 2026 Lucide Icons and Contributors
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The following Lucide icons are derived from the Feather project:
		*
		* airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out
		*
		* The MIT License (MIT) (for the icons listed above)
		*
		* Copyright (c) 2013-present Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		Icon($$renderer, spread_props([
			{ name: "history" },
			$$sanitized_props,
			{
				/**
				* @component @name History
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyAxMmE5IDkgMCAxIDAgOS05IDkuNzUgOS43NSAwIDAgMC02Ljc0IDIuNzRMMyA4IiAvPgogIDxwYXRoIGQ9Ik0zIDN2NWg1IiAvPgogIDxwYXRoIGQ9Ik0xMiA3djVsNCAyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/history
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [
					["path", { "d": "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }],
					["path", { "d": "M3 3v5h5" }],
					["path", { "d": "M12 7v5l4 2" }]
				],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, History);
}
History.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/image-plus.svelte
Image_plus[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/image-plus.svelte";
function Image_plus($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);
	$$renderer.component(($$renderer) => {
		/**
		* @license lucide-svelte v1.0.1 - ISC
		*
		* ISC License
		*
		* Copyright (c) 2026 Lucide Icons and Contributors
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The following Lucide icons are derived from the Feather project:
		*
		* airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out
		*
		* The MIT License (MIT) (for the icons listed above)
		*
		* Copyright (c) 2013-present Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		Icon($$renderer, spread_props([
			{ name: "image-plus" },
			$$sanitized_props,
			{
				/**
				* @component @name ImagePlus
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTYgNWg2IiAvPgogIDxwYXRoIGQ9Ik0xOSAydjYiIC8+CiAgPHBhdGggZD0iTTIxIDExLjVWMTlhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJWNWEyIDIgMCAwIDEgMi0yaDcuNSIgLz4KICA8cGF0aCBkPSJtMjEgMTUtMy4wODYtMy4wODZhMiAyIDAgMCAwLTIuODI4IDBMNiAyMSIgLz4KICA8Y2lyY2xlIGN4PSI5IiBjeT0iOSIgcj0iMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/image-plus
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [
					["path", { "d": "M16 5h6" }],
					["path", { "d": "M19 2v6" }],
					["path", { "d": "M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5" }],
					["path", { "d": "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" }],
					["circle", {
						"cx": "9",
						"cy": "9",
						"r": "2"
					}]
				],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Image_plus);
}
Image_plus.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/image.svelte
Image$1[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/image.svelte";
function Image$1($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);
	$$renderer.component(($$renderer) => {
		/**
		* @license lucide-svelte v1.0.1 - ISC
		*
		* ISC License
		*
		* Copyright (c) 2026 Lucide Icons and Contributors
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The following Lucide icons are derived from the Feather project:
		*
		* airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out
		*
		* The MIT License (MIT) (for the icons listed above)
		*
		* Copyright (c) 2013-present Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		Icon($$renderer, spread_props([
			{ name: "image" },
			$$sanitized_props,
			{
				/**
				* @component @name Image
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIiByeT0iMiIgLz4KICA8Y2lyY2xlIGN4PSI5IiBjeT0iOSIgcj0iMiIgLz4KICA8cGF0aCBkPSJtMjEgMTUtMy4wODYtMy4wODZhMiAyIDAgMCAwLTIuODI4IDBMNiAyMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/image
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [
					["rect", {
						"width": "18",
						"height": "18",
						"x": "3",
						"y": "3",
						"rx": "2",
						"ry": "2"
					}],
					["circle", {
						"cx": "9",
						"cy": "9",
						"r": "2"
					}],
					["path", { "d": "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" }]
				],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Image$1);
}
Image$1.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/lightbulb.svelte
Lightbulb[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/lightbulb.svelte";
function Lightbulb($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);
	$$renderer.component(($$renderer) => {
		/**
		* @license lucide-svelte v1.0.1 - ISC
		*
		* ISC License
		*
		* Copyright (c) 2026 Lucide Icons and Contributors
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The following Lucide icons are derived from the Feather project:
		*
		* airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out
		*
		* The MIT License (MIT) (for the icons listed above)
		*
		* Copyright (c) 2013-present Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		Icon($$renderer, spread_props([
			{ name: "lightbulb" },
			$$sanitized_props,
			{
				/**
				* @component @name Lightbulb
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTUgMTRjLjItMSAuNy0xLjcgMS41LTIuNSAxLS45IDEuNS0yLjIgMS41LTMuNUE2IDYgMCAwIDAgNiA4YzAgMSAuMiAyLjIgMS41IDMuNS43LjcgMS4zIDEuNSAxLjUgMi41IiAvPgogIDxwYXRoIGQ9Ik05IDE4aDYiIC8+CiAgPHBhdGggZD0iTTEwIDIyaDQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/lightbulb
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [
					["path", { "d": "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" }],
					["path", { "d": "M9 18h6" }],
					["path", { "d": "M10 22h4" }]
				],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Lightbulb);
}
Lightbulb.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/link.svelte
Link[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/link.svelte";
function Link($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);
	$$renderer.component(($$renderer) => {
		/**
		* @license lucide-svelte v1.0.1 - ISC
		*
		* ISC License
		*
		* Copyright (c) 2026 Lucide Icons and Contributors
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The following Lucide icons are derived from the Feather project:
		*
		* airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out
		*
		* The MIT License (MIT) (for the icons listed above)
		*
		* Copyright (c) 2013-present Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		Icon($$renderer, spread_props([
			{ name: "link" },
			$$sanitized_props,
			{
				/**
				* @component @name Link
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAgMTNhNSA1IDAgMCAwIDcuNTQuNTRsMy0zYTUgNSAwIDAgMC03LjA3LTcuMDdsLTEuNzIgMS43MSIgLz4KICA8cGF0aCBkPSJNMTQgMTFhNSA1IDAgMCAwLTcuNTQtLjU0bC0zIDNhNSA1IDAgMCAwIDcuMDcgNy4wN2wxLjcxLTEuNzEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/link
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [["path", { "d": "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" }], ["path", { "d": "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" }]],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Link);
}
Link.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/list-ordered.svelte
List_ordered[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/list-ordered.svelte";
function List_ordered($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);
	$$renderer.component(($$renderer) => {
		/**
		* @license lucide-svelte v1.0.1 - ISC
		*
		* ISC License
		*
		* Copyright (c) 2026 Lucide Icons and Contributors
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The following Lucide icons are derived from the Feather project:
		*
		* airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out
		*
		* The MIT License (MIT) (for the icons listed above)
		*
		* Copyright (c) 2013-present Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		Icon($$renderer, spread_props([
			{ name: "list-ordered" },
			$$sanitized_props,
			{
				/**
				* @component @name ListOrdered
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTEgNWgxMCIgLz4KICA8cGF0aCBkPSJNMTEgMTJoMTAiIC8+CiAgPHBhdGggZD0iTTExIDE5aDEwIiAvPgogIDxwYXRoIGQ9Ik00IDRoMXY1IiAvPgogIDxwYXRoIGQ9Ik00IDloMiIgLz4KICA8cGF0aCBkPSJNNi41IDIwSDMuNGMwLTEgMi42LTEuOTI1IDIuNi0zLjVhMS41IDEuNSAwIDAgMC0yLjYtMS4wMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/list-ordered
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [
					["path", { "d": "M11 5h10" }],
					["path", { "d": "M11 12h10" }],
					["path", { "d": "M11 19h10" }],
					["path", { "d": "M4 4h1v5" }],
					["path", { "d": "M4 9h2" }],
					["path", { "d": "M6.5 20H3.4c0-1 2.6-1.925 2.6-3.5a1.5 1.5 0 0 0-2.6-1.02" }]
				],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, List_ordered);
}
List_ordered.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/list.svelte
List[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/list.svelte";
function List($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);
	$$renderer.component(($$renderer) => {
		/**
		* @license lucide-svelte v1.0.1 - ISC
		*
		* ISC License
		*
		* Copyright (c) 2026 Lucide Icons and Contributors
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The following Lucide icons are derived from the Feather project:
		*
		* airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out
		*
		* The MIT License (MIT) (for the icons listed above)
		*
		* Copyright (c) 2013-present Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		Icon($$renderer, spread_props([
			{ name: "list" },
			$$sanitized_props,
			{
				/**
				* @component @name List
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyA1aC4wMSIgLz4KICA8cGF0aCBkPSJNMyAxMmguMDEiIC8+CiAgPHBhdGggZD0iTTMgMTloLjAxIiAvPgogIDxwYXRoIGQ9Ik04IDVoMTMiIC8+CiAgPHBhdGggZD0iTTggMTJoMTMiIC8+CiAgPHBhdGggZD0iTTggMTloMTMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/list
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [
					["path", { "d": "M3 5h.01" }],
					["path", { "d": "M3 12h.01" }],
					["path", { "d": "M3 19h.01" }],
					["path", { "d": "M8 5h13" }],
					["path", { "d": "M8 12h13" }],
					["path", { "d": "M8 19h13" }]
				],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, List);
}
List.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/message-square.svelte
Message_square[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/message-square.svelte";
function Message_square($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);
	$$renderer.component(($$renderer) => {
		/**
		* @license lucide-svelte v1.0.1 - ISC
		*
		* ISC License
		*
		* Copyright (c) 2026 Lucide Icons and Contributors
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The following Lucide icons are derived from the Feather project:
		*
		* airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out
		*
		* The MIT License (MIT) (for the icons listed above)
		*
		* Copyright (c) 2013-present Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		Icon($$renderer, spread_props([
			{ name: "message-square" },
			$$sanitized_props,
			{
				/**
				* @component @name MessageSquare
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjIgMTdhMiAyIDAgMCAxLTIgMkg2LjgyOGEyIDIgMCAwIDAtMS40MTQuNTg2bC0yLjIwMiAyLjIwMkEuNzEuNzEgMCAwIDEgMiAyMS4yODZWNWEyIDIgMCAwIDEgMi0yaDE2YTIgMiAwIDAgMSAyIDJ6IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/message-square
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [["path", { "d": "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" }]],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Message_square);
}
Message_square.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/minus.svelte
Minus[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/minus.svelte";
function Minus($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);
	$$renderer.component(($$renderer) => {
		/**
		* @license lucide-svelte v1.0.1 - ISC
		*
		* ISC License
		*
		* Copyright (c) 2026 Lucide Icons and Contributors
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The following Lucide icons are derived from the Feather project:
		*
		* airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out
		*
		* The MIT License (MIT) (for the icons listed above)
		*
		* Copyright (c) 2013-present Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		Icon($$renderer, spread_props([
			{ name: "minus" },
			$$sanitized_props,
			{
				/**
				* @component @name Minus
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNSAxMmgxNCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/minus
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [["path", { "d": "M5 12h14" }]],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Minus);
}
Minus.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/pilcrow.svelte
Pilcrow[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/pilcrow.svelte";
function Pilcrow($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);
	$$renderer.component(($$renderer) => {
		/**
		* @license lucide-svelte v1.0.1 - ISC
		*
		* ISC License
		*
		* Copyright (c) 2026 Lucide Icons and Contributors
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The following Lucide icons are derived from the Feather project:
		*
		* airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out
		*
		* The MIT License (MIT) (for the icons listed above)
		*
		* Copyright (c) 2013-present Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		Icon($$renderer, spread_props([
			{ name: "pilcrow" },
			$$sanitized_props,
			{
				/**
				* @component @name Pilcrow
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTMgNHYxNiIgLz4KICA8cGF0aCBkPSJNMTcgNHYxNiIgLz4KICA8cGF0aCBkPSJNMTkgNEg5LjVhNC41IDQuNSAwIDAgMCAwIDlIMTMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/pilcrow
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [
					["path", { "d": "M13 4v16" }],
					["path", { "d": "M17 4v16" }],
					["path", { "d": "M19 4H9.5a4.5 4.5 0 0 0 0 9H13" }]
				],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Pilcrow);
}
Pilcrow.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/quote.svelte
Quote[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/quote.svelte";
function Quote($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);
	$$renderer.component(($$renderer) => {
		/**
		* @license lucide-svelte v1.0.1 - ISC
		*
		* ISC License
		*
		* Copyright (c) 2026 Lucide Icons and Contributors
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The following Lucide icons are derived from the Feather project:
		*
		* airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out
		*
		* The MIT License (MIT) (for the icons listed above)
		*
		* Copyright (c) 2013-present Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		Icon($$renderer, spread_props([
			{ name: "quote" },
			$$sanitized_props,
			{
				/**
				* @component @name Quote
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTYgM2EyIDIgMCAwIDAtMiAydjZhMiAyIDAgMCAwIDIgMiAxIDEgMCAwIDEgMSAxdjFhMiAyIDAgMCAxLTIgMiAxIDEgMCAwIDAtMSAxdjJhMSAxIDAgMCAwIDEgMSA2IDYgMCAwIDAgNi02VjVhMiAyIDAgMCAwLTItMnoiIC8+CiAgPHBhdGggZD0iTTUgM2EyIDIgMCAwIDAtMiAydjZhMiAyIDAgMCAwIDIgMiAxIDEgMCAwIDEgMSAxdjFhMiAyIDAgMCAxLTIgMiAxIDEgMCAwIDAtMSAxdjJhMSAxIDAgMCAwIDEgMSA2IDYgMCAwIDAgNi02VjVhMiAyIDAgMCAwLTItMnoiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/quote
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [["path", { "d": "M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" }], ["path", { "d": "M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" }]],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Quote);
}
Quote.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/trash-2.svelte
Trash_2[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/trash-2.svelte";
function Trash_2($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);
	$$renderer.component(($$renderer) => {
		/**
		* @license lucide-svelte v1.0.1 - ISC
		*
		* ISC License
		*
		* Copyright (c) 2026 Lucide Icons and Contributors
		*
		* Permission to use, copy, modify, and/or distribute this software for any
		* purpose with or without fee is hereby granted, provided that the above
		* copyright notice and this permission notice appear in all copies.
		*
		* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
		* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
		* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
		* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
		* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
		* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
		* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
		*
		* ---
		*
		* The following Lucide icons are derived from the Feather project:
		*
		* airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out
		*
		* The MIT License (MIT) (for the icons listed above)
		*
		* Copyright (c) 2013-present Cole Bemis
		*
		* Permission is hereby granted, free of charge, to any person obtaining a copy
		* of this software and associated documentation files (the "Software"), to deal
		* in the Software without restriction, including without limitation the rights
		* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		* copies of the Software, and to permit persons to whom the Software is
		* furnished to do so, subject to the following conditions:
		*
		* The above copyright notice and this permission notice shall be included in all
		* copies or substantial portions of the Software.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		* SOFTWARE.
		*
		*/
		Icon($$renderer, spread_props([
			{ name: "trash-2" },
			$$sanitized_props,
			{
				/**
				* @component @name Trash2
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAgMTF2NiIgLz4KICA8cGF0aCBkPSJNMTQgMTF2NiIgLz4KICA8cGF0aCBkPSJNMTkgNnYxNGEyIDIgMCAwIDEtMiAySDdhMiAyIDAgMCAxLTItMlY2IiAvPgogIDxwYXRoIGQ9Ik0zIDZoMTgiIC8+CiAgPHBhdGggZD0iTTggNlY0YTIgMiAwIDAgMSAyLTJoNGEyIDIgMCAwIDEgMiAydjIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/trash-2
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [
					["path", { "d": "M10 11v6" }],
					["path", { "d": "M14 11v6" }],
					["path", { "d": "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" }],
					["path", { "d": "M3 6h18" }],
					["path", { "d": "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }]
				],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Trash_2);
}
Trash_2.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region src/lib/editor.ts
var SLASH_ITEMS = [
	{
		title: "Heading 1",
		description: "Large section heading",
		icon: "heading-1",
		shortcut: "#",
		command: (e) => e.chain().focus().toggleHeading({ level: 1 }).run()
	},
	{
		title: "Heading 2",
		description: "Medium section heading",
		icon: "heading-2",
		shortcut: "##",
		command: (e) => e.chain().focus().toggleHeading({ level: 2 }).run()
	},
	{
		title: "Heading 3",
		description: "Small section heading",
		icon: "heading-3",
		shortcut: "###",
		command: (e) => e.chain().focus().toggleHeading({ level: 3 }).run()
	},
	{
		title: "Paragraph",
		description: "Plain text block",
		icon: "pilcrow",
		command: (e) => e.chain().focus().setParagraph().run()
	},
	{
		title: "Bullet List",
		description: "Unordered list",
		icon: "list",
		shortcut: "-",
		command: (e) => e.chain().focus().toggleBulletList().run()
	},
	{
		title: "Ordered List",
		description: "Numbered list",
		icon: "list-ordered",
		shortcut: "1.",
		command: (e) => e.chain().focus().toggleOrderedList().run()
	},
	{
		title: "Code Block",
		description: "Code snippet",
		icon: "code-2",
		shortcut: "```",
		command: (e) => e.chain().focus().toggleCodeBlock().run()
	},
	{
		title: "Blockquote",
		description: "Quote or callout",
		icon: "quote",
		shortcut: ">",
		command: (e) => e.chain().focus().toggleBlockquote().run()
	},
	{
		title: "Divider",
		description: "Horizontal separator",
		icon: "minus",
		shortcut: "---",
		command: (e) => e.chain().focus().setHorizontalRule().run()
	},
	{
		title: "Image",
		description: "Upload an image from your computer",
		icon: "image",
		command: (ed) => {
			const input = document.createElement("input");
			input.type = "file";
			input.accept = "image/png,image/jpeg,image/gif,image/webp";
			input.onchange = async () => {
				const file = input.files?.[0];
				if (!file) return;
				try {
					const url = await uploadImage(file);
					ed.chain().focus().insertContent({
						type: "image",
						attrs: {
							src: url,
							align: "center"
						}
					}).run();
				} catch (err) {
					console.error("Image upload failed", err);
				}
			};
			input.click();
		}
	},
	{
		title: "Image from URL",
		description: "Embed an image from a web link",
		icon: "image-link",
		inputMode: "url",
		urlPlaceholder: "https://example.com/image.png",
		urlLabel: "Image from URL",
		urlCommand: (ed, url) => {
			const src = url.startsWith("http") ? url : `https://${url}`;
			ed.chain().focus().insertContent({
				type: "image",
				attrs: {
					src,
					align: "center"
				}
			}).run();
		},
		command: () => {}
	},
	{
		title: "Video",
		description: "Embed a YouTube or Vimeo video",
		icon: "video",
		inputMode: "url",
		urlPlaceholder: "https://youtube.com/watch?v=...",
		urlLabel: "Embed Video",
		urlCommand: (ed, url) => {
			const embedUrl = getVideoEmbedUrl(url);
			if (!embedUrl) return;
			ed.chain().focus().insertContent({
				type: "videoEmbed",
				attrs: { src: embedUrl }
			}).run();
		},
		command: () => {}
	},
	{
		title: "Callout",
		description: "Highlighted note block",
		icon: "lightbulb",
		command: (e) => e.chain().focus().insertContent({
			type: "callout",
			attrs: { variant: "default" },
			content: [{ type: "paragraph" }]
		}).run()
	},
	{
		title: "Info",
		description: "Informational callout",
		icon: "info",
		command: (e) => e.chain().focus().insertContent({
			type: "callout",
			attrs: { variant: "info" },
			content: [{ type: "paragraph" }]
		}).run()
	},
	{
		title: "Warning",
		description: "Warning callout",
		icon: "alert-triangle",
		command: (e) => e.chain().focus().insertContent({
			type: "callout",
			attrs: { variant: "warning" },
			content: [{ type: "paragraph" }]
		}).run()
	},
	{
		title: "Success",
		description: "Success callout",
		icon: "check-circle",
		command: (e) => e.chain().focus().insertContent({
			type: "callout",
			attrs: { variant: "success" },
			content: [{ type: "paragraph" }]
		}).run()
	}
];
var slashMenuStore = writable({
	open: false,
	items: [],
	selectedIndex: 0,
	rect: null,
	contextElement: null,
	executeCommand: null,
	urlInputMode: false,
	onUrlSubmit: null,
	urlLabel: "",
	urlPlaceholder: ""
});
Mark.create({
	name: "comment",
	addAttributes() {
		return { commentId: {
			default: null,
			parseHTML: (el) => el.getAttribute("data-comment-id"),
			renderHTML: (attrs) => attrs.commentId ? { "data-comment-id": attrs.commentId } : {}
		} };
	},
	parseHTML() {
		return [{ tag: "mark[data-comment-id]" }];
	},
	renderHTML({ HTMLAttributes }) {
		return [
			"mark",
			mergeAttributes({ class: "comment-mark" }, HTMLAttributes),
			0
		];
	}
});
var ALIGN_STYLES = {
	left: "display:block;margin-left:0;margin-right:auto;",
	center: "display:block;margin-left:auto;margin-right:auto;",
	right: "display:block;margin-left:auto;margin-right:0;",
	"full-width": "display:block;width:100%;"
};
function buildFigureStyle(align, width) {
	const base = ALIGN_STYLES[align] ?? ALIGN_STYLES.center;
	if (width && align !== "full-width") return base + `max-width:${width}px;width:${width}px;`;
	return base;
}
function syncFigureAttrs(figure, img, attrs) {
	const align = attrs.align ?? "center";
	const width = attrs.width;
	figure.style.cssText = buildFigureStyle(align, width);
	figure.dataset.align = align;
	img.src = attrs.src ?? "";
	if (attrs.alt) img.alt = attrs.alt;
	else img.removeAttribute("alt");
	if (attrs.title) img.title = attrs.title;
	else img.removeAttribute("title");
	const pendingId = attrs.pendingId;
	if (pendingId) img.dataset.pendingId = pendingId;
	else delete img.dataset.pendingId;
}
Image.extend({
	addAttributes() {
		return {
			...this.parent?.(),
			align: {
				default: "center",
				renderHTML: (attrs) => {
					return {
						style: (ALIGN_STYLES[attrs.align] ?? ALIGN_STYLES.center) + (attrs.width && attrs.align !== "full-width" ? `max-width:${attrs.width}px;width:${attrs.width}px;` : ""),
						"data-align": attrs.align
					};
				},
				parseHTML: (el) => el.getAttribute("data-align") ?? "center"
			},
			width: {
				default: null,
				parseHTML: (el) => {
					const v = el.getAttribute("data-width");
					return v ? Number(v) : null;
				},
				renderHTML: (attrs) => attrs.width ? { "data-width": String(attrs.width) } : {}
			},
			caption: {
				default: "",
				parseHTML: (el) => el.getAttribute("data-caption") ?? "",
				renderHTML: (attrs) => attrs.caption ? { "data-caption": attrs.caption } : {}
			},
			pendingId: {
				default: null,
				parseHTML: (el) => el.getAttribute("data-pending-id") ?? null,
				renderHTML: (attrs) => attrs.pendingId ? { "data-pending-id": attrs.pendingId } : {}
			}
		};
	},
	addNodeView() {
		return ({ node, getPos, editor: ed }) => {
			let currentAttrs = { ...node.attrs };
			const figure = document.createElement("figure");
			figure.className = "image-figure";
			const img = document.createElement("img");
			img.className = "image-figure__img";
			const captionEl = document.createElement("figcaption");
			captionEl.contentEditable = "true";
			captionEl.dataset.placeholder = "Add a caption…";
			captionEl.className = "image-figure__caption";
			syncFigureAttrs(figure, img, currentAttrs);
			captionEl.textContent = currentAttrs.caption ?? "";
			figure.appendChild(img);
			figure.appendChild(captionEl);
			captionEl.addEventListener("input", () => {
				const pos = typeof getPos === "function" ? getPos() : void 0;
				if (pos === void 0) return;
				const { tr } = ed.state;
				tr.setNodeMarkup(pos, void 0, {
					...currentAttrs,
					caption: captionEl.textContent ?? ""
				});
				ed.view.dispatch(tr);
			});
			captionEl.addEventListener("keydown", (e) => {
				if (e.key === "Escape") captionEl.blur();
				e.stopPropagation();
			});
			return {
				dom: figure,
				update(updatedNode) {
					if (updatedNode.type.name !== "image") return false;
					currentAttrs = { ...updatedNode.attrs };
					syncFigureAttrs(figure, img, currentAttrs);
					if (!captionEl.matches(":focus")) captionEl.textContent = currentAttrs.caption ?? "";
					return true;
				},
				stopEvent(event) {
					return captionEl.contains(event.target);
				},
				ignoreMutation(mutation) {
					return captionEl.contains(mutation.target);
				}
			};
		};
	}
});
index_default.extend({
	addKeyboardShortcuts() {
		return {
			...this.parent?.(),
			Enter: ({ editor }) => {
				const { $from, empty } = editor.state.selection;
				let blockquoteDepth = -1;
				for (let d = $from.depth; d > 0; d--) if ($from.node(d).type.name === "blockquote") {
					blockquoteDepth = d;
					break;
				}
				if (blockquoteDepth === -1) return false;
				const currentNode = $from.node($from.depth);
				if (empty && currentNode.type.name === "paragraph" && currentNode.content.size === 0) {
					const { state, view } = editor;
					const { tr, schema } = state;
					const paraStart = $from.before($from.depth);
					const paraEnd = $from.after($from.depth);
					const bqEnd = $from.before(blockquoteDepth) + $from.node(blockquoteDepth).nodeSize;
					const newPara = schema.nodes.paragraph.create();
					tr.delete(paraStart, paraEnd).insert(tr.mapping.map(bqEnd), newPara);
					const landingPos = tr.mapping.map(bqEnd) + 1;
					tr.setSelection(TextSelection.near(tr.doc.resolve(landingPos)));
					view.dispatch(tr);
					return true;
				}
				return editor.commands.splitBlock();
			},
			"Shift-Enter": ({ editor }) => {
				const { $from } = editor.state.selection;
				let blockquoteDepth = -1;
				for (let d = $from.depth; d > 0; d--) if ($from.node(d).type.name === "blockquote") {
					blockquoteDepth = d;
					break;
				}
				if (blockquoteDepth === -1) return false;
				const bqNode = $from.node(blockquoteDepth);
				const afterBlockquote = $from.before(blockquoteDepth) + bqNode.nodeSize;
				return editor.chain().insertContentAt(afterBlockquote, { type: "paragraph" }).setTextSelection(afterBlockquote + 1).run();
			}
		};
	},
	addAttributes() {
		return {
			...this.parent?.(),
			author: {
				default: "",
				parseHTML: (el) => el.getAttribute("data-author") ?? "",
				renderHTML: (attrs) => attrs.author ? { "data-author": attrs.author } : {}
			}
		};
	},
	addNodeView() {
		return ({ node, getPos, editor: ed }) => {
			let currentAttrs = { ...node.attrs };
			const figure = document.createElement("figure");
			figure.className = "blockquote-figure";
			const bq = document.createElement("blockquote");
			bq.className = "blockquote-figure__content";
			const cite = document.createElement("cite");
			cite.contentEditable = "true";
			cite.dataset.placeholder = "Tambahkan sumber…";
			cite.className = "blockquote-figure__author";
			cite.textContent = currentAttrs.author ?? "";
			figure.appendChild(bq);
			figure.appendChild(cite);
			function commitAuthor() {
				const pos = typeof getPos === "function" ? getPos() : void 0;
				if (pos === void 0) return;
				const author = (cite.innerText || cite.textContent || "").replace(/\n/g, " ").trim();
				ed.commands.command(({ tr, state }) => {
					const node = state.doc.nodeAt(pos);
					if (!node || node.type.name !== "blockquote") return false;
					if (node.attrs.author === author) return false;
					tr.setNodeMarkup(pos, void 0, {
						...node.attrs,
						author
					});
					return true;
				});
			}
			cite.addEventListener("input", commitAuthor);
			cite.addEventListener("blur", commitAuthor);
			cite.addEventListener("keydown", (e) => {
				if (e.key === "Enter") {
					e.preventDefault();
					cite.blur();
				}
				if (e.key === "Escape") cite.blur();
				e.stopPropagation();
			});
			return {
				dom: figure,
				contentDOM: bq,
				update(updatedNode) {
					if (updatedNode.type.name !== "blockquote") return false;
					currentAttrs = { ...updatedNode.attrs };
					if (!cite.matches(":focus")) cite.textContent = currentAttrs.author ?? "";
					return true;
				},
				stopEvent(event) {
					return cite.contains(event.target);
				},
				ignoreMutation(mutation) {
					return cite.contains(mutation.target);
				}
			};
		};
	}
});
var CALLOUT_SVG_PATHS = {
	default: `<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>`,
	info: `<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>`,
	warning: `<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>`,
	success: `<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>`,
	error: `<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>`
};
function makeCalloutSVG(variant) {
	return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${CALLOUT_SVG_PATHS[variant] ?? CALLOUT_SVG_PATHS.default}</svg>`;
}
Node.create({
	name: "callout",
	group: "block",
	content: "block+",
	defining: true,
	addAttributes() {
		return { variant: {
			default: "default",
			parseHTML: (el) => el.getAttribute("data-callout-variant") ?? "default",
			renderHTML: (attrs) => ({ "data-callout-variant": attrs.variant })
		} };
	},
	parseHTML() {
		return [{ tag: "div[data-callout-variant]" }];
	},
	renderHTML({ HTMLAttributes }) {
		return [
			"div",
			mergeAttributes({ class: "callout" }, HTMLAttributes),
			0
		];
	},
	addNodeView() {
		return ({ node }) => {
			let variant = node.attrs.variant ?? "default";
			const wrapper = document.createElement("div");
			wrapper.className = `callout callout--${variant}`;
			const iconEl = document.createElement("span");
			iconEl.className = "callout__icon";
			iconEl.innerHTML = makeCalloutSVG(variant);
			const contentEl = document.createElement("div");
			contentEl.className = "callout__content";
			wrapper.appendChild(iconEl);
			wrapper.appendChild(contentEl);
			return {
				dom: wrapper,
				contentDOM: contentEl,
				update(updatedNode) {
					if (updatedNode.type.name !== "callout") return false;
					variant = updatedNode.attrs.variant ?? "default";
					wrapper.className = `callout callout--${variant}`;
					iconEl.innerHTML = makeCalloutSVG(variant);
					return true;
				}
			};
		};
	}
});
function getVideoEmbedUrl(url) {
	const raw = url.trim();
	const full = raw.startsWith("http") ? raw : `https://${raw}`;
	try {
		const u = new URL(full);
		if ((u.hostname === "www.youtube.com" || u.hostname === "youtube.com") && u.pathname === "/watch") {
			const id = u.searchParams.get("v");
			if (id) return `https://www.youtube.com/embed/${id}`;
		}
		if (u.hostname === "youtu.be") {
			const id = u.pathname.replace("/", "");
			if (id) return `https://www.youtube.com/embed/${id}`;
		}
		if ((u.hostname === "www.youtube.com" || u.hostname === "youtube.com") && u.pathname.startsWith("/shorts/")) {
			const id = u.pathname.replace("/shorts/", "");
			if (id) return `https://www.youtube.com/embed/${id}`;
		}
		if (u.hostname === "vimeo.com" || u.hostname === "www.vimeo.com") {
			const id = u.pathname.replace("/", "");
			if (id) return `https://player.vimeo.com/video/${id}`;
		}
		if (u.hostname.includes("youtube.com/embed") || u.hostname.includes("player.vimeo.com")) return full;
		return null;
	} catch {
		return null;
	}
}
Node.create({
	name: "videoEmbed",
	group: "block",
	atom: true,
	draggable: true,
	addAttributes() {
		return { src: { default: null } };
	},
	parseHTML() {
		return [{ tag: "div[data-video-embed]" }];
	},
	renderHTML({ HTMLAttributes }) {
		return ["div", mergeAttributes({ "data-video-embed": "" }, HTMLAttributes)];
	},
	addNodeView() {
		return ({ node }) => {
			const wrapper = document.createElement("div");
			wrapper.className = "video-embed";
			wrapper.setAttribute("data-video-embed", "");
			const iframe = document.createElement("iframe");
			iframe.src = node.attrs.src ?? "";
			iframe.allowFullscreen = true;
			iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
			iframe.className = "video-embed__iframe";
			wrapper.appendChild(iframe);
			return {
				dom: wrapper,
				update(updatedNode) {
					if (updatedNode.type.name !== "videoEmbed") return false;
					iframe.src = updatedNode.attrs.src ?? "";
					return true;
				}
			};
		};
	}
});
Extension.create({
	name: "slashMenu",
	addProseMirrorPlugins() {
		const editor = this.editor;
		return [Suggestion({
			editor,
			char: "/",
			startOfLine: false,
			allowedPrefixes: null,
			items: ({ query }) => {
				const q = query.toLowerCase().trim();
				if (!q) return SLASH_ITEMS;
				return SLASH_ITEMS.filter((item) => item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q));
			},
			command: ({ editor: ed, range, props }) => {
				if (props.inputMode === "url") {
					ed.chain().focus().deleteRange(range).run();
					slashMenuStore.update((s) => ({
						...s,
						urlInputMode: true,
						urlLabel: props.urlLabel ?? props.title,
						urlPlaceholder: props.urlPlaceholder ?? "https://...",
						onUrlSubmit: (url) => {
							const trimmed = url.trim();
							slashMenuStore.update((st) => ({
								...st,
								open: false,
								urlInputMode: false,
								onUrlSubmit: null
							}));
							if (!trimmed) return;
							props.urlCommand?.(ed, trimmed);
						}
					}));
					return;
				}
				ed.chain().focus().deleteRange(range).run();
				props.command(ed);
			},
			render: () => {
				let localItems = [];
				let localCommand = null;
				let selectedIndex = 0;
				return {
					onStart(props) {
						localItems = props.items;
						localCommand = props.command;
						selectedIndex = 0;
						slashMenuStore.set({
							open: true,
							items: localItems,
							selectedIndex: 0,
							rect: props.clientRect ?? null,
							contextElement: editor.view.dom,
							executeCommand: (item) => localCommand?.(item),
							urlInputMode: false,
							onUrlSubmit: null,
							urlLabel: "",
							urlPlaceholder: ""
						});
					},
					onUpdate(props) {
						localItems = props.items;
						localCommand = props.command;
						selectedIndex = 0;
						slashMenuStore.update((s) => ({
							...s,
							items: localItems,
							selectedIndex: 0,
							rect: props.clientRect ?? s.rect,
							executeCommand: (item) => localCommand?.(item)
						}));
					},
					onExit() {
						slashMenuStore.update((s) => ({
							...s,
							open: false
						}));
					},
					onKeyDown({ event }) {
						if (!get$1(slashMenuStore).open) return false;
						if (event.key === "ArrowDown") {
							selectedIndex = (selectedIndex + 1) % (localItems.length || 1);
							slashMenuStore.update((s) => ({
								...s,
								selectedIndex
							}));
							return true;
						}
						if (event.key === "ArrowUp") {
							selectedIndex = (selectedIndex - 1 + (localItems.length || 1)) % (localItems.length || 1);
							slashMenuStore.update((s) => ({
								...s,
								selectedIndex
							}));
							return true;
						}
						if (event.key === "Enter") {
							const item = localItems[selectedIndex];
							if (item) localCommand?.(item);
							return true;
						}
						if (event.key === "Escape") {
							slashMenuStore.update((s) => ({
								...s,
								open: false
							}));
							return false;
						}
						return false;
					}
				};
			}
		})];
	}
});
async function uploadImage(file) {
	const sigRes = await fetch("/api/upload/signature", {
		method: "POST",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({})
	});
	if (!sigRes.ok) throw new Error("Failed to get upload signature");
	const { signature, timestamp, folder, apiKey, cloudName } = await sigRes.json();
	const formData = new FormData();
	formData.append("file", file);
	formData.append("api_key", apiKey);
	formData.append("timestamp", String(timestamp));
	formData.append("signature", signature);
	formData.append("folder", folder);
	const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
		method: "POST",
		body: formData
	});
	if (!uploadRes.ok) throw new Error("Cloudinary upload failed");
	return (await uploadRes.json()).secure_url;
}
async function saveDraft(pageId, content) {}
async function clearDraft(pageId) {}
//#endregion
//#region src/lib/components/editor/PageHeader.svelte
PageHeader[FILENAME] = "src/lib/components/editor/PageHeader.svelte";
function PageHeader($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { page, titleValue, onTitleInput } = $$props;
		function focusTitle() {}
		if (page.coverImage) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="relative -mx-8 h-52 overflow-hidden mb-8">`);
			push_element($$renderer, "div", 24, 2);
			$$renderer.push(`<img${attr("src", page.coverImage)} alt="Cover" class="w-full h-full object-cover"/>`);
			push_element($$renderer, "img", 25, 4);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="mb-4 group/header">`);
		push_element($$renderer, "div", 29, 0);
		$$renderer.push(`<div class="opacity-0 group-hover/header:opacity-100 transition-opacity">`);
		push_element($$renderer, "div", 30, 2);
		File_text($$renderer, {
			class: "w-12 h-12 text-muted-foreground",
			strokeWidth: 1.5
		});
		$$renderer.push(`<!----></div>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <input type="text"${attr("value", titleValue)} placeholder="Untitled" class="w-full text-4xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground mb-6"/>`);
		push_element($$renderer, "input", 35, 0);
		pop_element();
		bind_props($$props, { focusTitle });
	}, PageHeader);
}
PageHeader.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region src/lib/components/editor/EditorToolbar.svelte
EditorToolbar[FILENAME] = "src/lib/components/editor/EditorToolbar.svelte";
function EditorToolbar($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { saveIsPending = false, saveIsError = false, versionIsPending = false, versionIsSuccess = false, commentPanelOpen = false, commentCount = 0, hasDraft = false, pendingImageCount = 0, onImageUpload, onSaveVersion, onOpenHistory, onToggleComments, onDiscardDraft } = $$props;
		$$renderer.push(`<div class="flex flex-col gap-2 mb-4">`);
		push_element($$renderer, "div", 36, 0);
		if (pendingImageCount > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex items-center gap-2 px-3 py-2 rounded-md bg-muted text-muted-foreground text-xs">`);
			push_element($$renderer, "div", 38, 4);
			Wifi_off($$renderer, { class: "w-3.5 h-3.5 shrink-0" });
			$$renderer.push(`<!----> <span>`);
			push_element($$renderer, "span", 40, 6);
			$$renderer.push(`${escape_html(pendingImageCount === 1 ? "1 gambar" : `${pendingImageCount} gambar`)}
        akan di-upload saat online kembali</span>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="flex items-center gap-1 pb-3 border-b border-border text-muted-foreground">`);
		push_element($$renderer, "div", 47, 2);
		if (Tooltip) {
			$$renderer.push("<!--[-->");
			Tooltip($$renderer, {
				content: "Upload image",
				side: "bottom",
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<button class="p-1.5 rounded-md hover:bg-accent hover:text-foreground transition-colors" aria-label="Upload image">`);
					push_element($$renderer, "button", 50, 6);
					Image_plus($$renderer, { class: "w-4 h-4" });
					$$renderer.push(`<!----></button>`);
					pop_element();
				}),
				$$slots: { default: true }
			});
			$$renderer.push("<!--]-->");
		} else {
			$$renderer.push("<!--[!-->");
			$$renderer.push("<!--]-->");
		}
		$$renderer.push(` <div class="flex-1">`);
		push_element($$renderer, "div", 59, 4);
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` `);
		if (hasDraft && !saveIsPending) {
			$$renderer.push("<!--[0-->");
			if (Tooltip) {
				$$renderer.push("<!--[-->");
				Tooltip($$renderer, {
					content: "Perubahan tersimpan lokal, menunggu sinkronisasi",
					side: "bottom",
					children: prevent_snippet_stringification(($$renderer) => {
						$$renderer.push(`<span class="flex items-center gap-1 text-xs text-muted-foreground cursor-default">`);
						push_element($$renderer, "span", 64, 8);
						Cloud_upload($$renderer, { class: "w-3.5 h-3.5" });
						$$renderer.push(`<!----> Draft tersimpan</span>`);
						pop_element();
					}),
					$$slots: { default: true }
				});
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
			$$renderer.push(` `);
			if (onDiscardDraft) {
				$$renderer.push("<!--[0-->");
				if (Tooltip) {
					$$renderer.push("<!--[-->");
					Tooltip($$renderer, {
						content: "Buang perubahan lokal dan kembalikan ke versi server",
						side: "bottom",
						children: prevent_snippet_stringification(($$renderer) => {
							$$renderer.push(`<button class="text-xs text-destructive hover:underline px-1">`);
							push_element($$renderer, "button", 71, 10);
							$$renderer.push(`Buang</button>`);
							pop_element();
						}),
						$$slots: { default: true }
					});
					$$renderer.push("<!--]-->");
				} else {
					$$renderer.push("<!--[!-->");
					$$renderer.push("<!--]-->");
				}
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <span class="w-px h-3 bg-border mx-0.5">`);
			push_element($$renderer, "span", 79, 6);
			$$renderer.push(`</span>`);
			pop_element();
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (saveIsPending) {
			$$renderer.push("<!--[0-->");
			if (Tooltip) {
				$$renderer.push("<!--[-->");
				Tooltip($$renderer, {
					content: "Saving…",
					side: "bottom",
					children: prevent_snippet_stringification(($$renderer) => {
						$$renderer.push(`<span aria-label="Saving">`);
						push_element($$renderer, "span", 85, 8);
						Loader_circle($$renderer, { class: "w-3.5 h-3.5 animate-spin text-muted-foreground" });
						$$renderer.push(`<!----></span>`);
						pop_element();
					}),
					$$slots: { default: true }
				});
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		} else if (saveIsError) {
			$$renderer.push("<!--[1-->");
			if (Tooltip) {
				$$renderer.push("<!--[-->");
				Tooltip($$renderer, {
					content: "Save failed",
					side: "bottom",
					children: prevent_snippet_stringification(($$renderer) => {
						$$renderer.push(`<span aria-label="Save failed">`);
						push_element($$renderer, "span", 91, 8);
						Circle_alert($$renderer, { class: "w-3.5 h-3.5 text-destructive" });
						$$renderer.push(`<!----></span>`);
						pop_element();
					}),
					$$slots: { default: true }
				});
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (versionIsSuccess) {
			$$renderer.push("<!--[0-->");
			if (Tooltip) {
				$$renderer.push("<!--[-->");
				Tooltip($$renderer, {
					content: "Version saved",
					side: "bottom",
					children: prevent_snippet_stringification(($$renderer) => {
						$$renderer.push(`<span aria-label="Version saved">`);
						push_element($$renderer, "span", 99, 8);
						Check($$renderer, { class: "w-3.5 h-3.5 text-green-600" });
						$$renderer.push(`<!----></span>`);
						pop_element();
					}),
					$$slots: { default: true }
				});
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (Tooltip) {
			$$renderer.push("<!--[-->");
			Tooltip($$renderer, {
				content: "Save version",
				side: "bottom",
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<button${attr("disabled", versionIsPending, true)} class="p-1.5 rounded-md hover:bg-accent hover:text-foreground transition-colors disabled:opacity-50" aria-label="Save version">`);
					push_element($$renderer, "button", 107, 6);
					if (versionIsPending) {
						$$renderer.push("<!--[0-->");
						Loader_circle($$renderer, { class: "w-4 h-4 animate-spin" });
					} else {
						$$renderer.push("<!--[-1-->");
						Bookmark_plus($$renderer, { class: "w-4 h-4" });
					}
					$$renderer.push(`<!--]--></button>`);
					pop_element();
				}),
				$$slots: { default: true }
			});
			$$renderer.push("<!--]-->");
		} else {
			$$renderer.push("<!--[!-->");
			$$renderer.push("<!--]-->");
		}
		$$renderer.push(` `);
		if (Tooltip) {
			$$renderer.push("<!--[-->");
			Tooltip($$renderer, {
				content: "Version history",
				side: "bottom",
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<button class="p-1.5 rounded-md hover:bg-accent hover:text-foreground transition-colors" aria-label="Version history">`);
					push_element($$renderer, "button", 123, 6);
					History($$renderer, { class: "w-4 h-4" });
					$$renderer.push(`<!----></button>`);
					pop_element();
				}),
				$$slots: { default: true }
			});
			$$renderer.push("<!--]-->");
		} else {
			$$renderer.push("<!--[!-->");
			$$renderer.push("<!--]-->");
		}
		$$renderer.push(` `);
		if (Tooltip) {
			$$renderer.push("<!--[-->");
			Tooltip($$renderer, {
				content: "Toggle comments",
				shortcut: "⌘⇧M",
				side: "bottom",
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<button${attr_class(`relative p-1.5 rounded-md transition-colors ${commentPanelOpen ? "bg-accent text-foreground" : "hover:bg-accent hover:text-foreground"}`)} aria-label="Toggle comments">`);
					push_element($$renderer, "button", 134, 6);
					Message_square($$renderer, { class: "w-4 h-4" });
					$$renderer.push(`<!----> `);
					if (commentCount > 0) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<span class="absolute -top-1 -right-1 bg-foreground text-background rounded-full min-w-[14px] h-[14px] flex items-center justify-center text-[9px] leading-none font-semibold px-0.5">`);
						push_element($$renderer, "span", 144, 10);
						$$renderer.push(`${escape_html(commentCount)}</span>`);
						pop_element();
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></button>`);
					pop_element();
				}),
				$$slots: { default: true }
			});
			$$renderer.push("<!--]-->");
		} else {
			$$renderer.push("<!--[!-->");
			$$renderer.push("<!--]-->");
		}
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
	}, EditorToolbar);
}
EditorToolbar.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region src/lib/components/editor/EditorArea.svelte
EditorArea[FILENAME] = "src/lib/components/editor/EditorArea.svelte";
function EditorArea($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { page, onUpdate, editor = null, imageSelected = false, imageRect = null, videoSelected = false, videoRect = null, onOpenContextMenu, onCommentClick, onImageFile } = $$props;
		onDestroy(() => {
			editor?.destroy();
		});
		$$renderer.push(`<div role="region" aria-label="Document editor">`);
		push_element($$renderer, "div", 152, 0);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div role="none" class="prose prose-neutral dark:prose-invert max-w-none min-h-96">`);
		push_element($$renderer, "div", 176, 2);
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		bind_props($$props, {
			editor,
			imageSelected,
			imageRect,
			videoSelected,
			videoRect
		});
	}, EditorArea);
}
EditorArea.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region src/lib/components/editor/ImageBubbleMenu.svelte
ImageBubbleMenu[FILENAME] = "src/lib/components/editor/ImageBubbleMenu.svelte";
function ImageBubbleMenu($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { visible = false, imageRect = null, onAlign, onDelete } = $$props;
		const alignButtons = [
			{
				value: "left",
				label: "Align left",
				Icon: Align_start_vertical
			},
			{
				value: "center",
				label: "Align center",
				Icon: Align_center_vertical
			},
			{
				value: "right",
				label: "Align right",
				Icon: Align_end_vertical
			},
			{
				value: "full-width",
				label: "Full width",
				Icon: Align_vertical_justify_center
			}
		];
		let posX = 0;
		let posY = 0;
		if (visible && imageRect) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="fixed z-50 flex items-center gap-0.5 rounded-lg border border-border bg-popover p-1 shadow-md"${attr_style("", {
				top: "0",
				left: "0",
				transform: `translate(${stringify(posX)}px, ${stringify(posY)}px)`,
				"will-change": "transform"
			})}>`);
			push_element($$renderer, "div", 71, 2);
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(alignButtons);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let btn = each_array[$$index];
				$$renderer.push(`<button class="flex items-center justify-center w-8 h-7 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"${attr("title", btn.label)}${attr("aria-label", btn.label)}>`);
				push_element($$renderer, "button", 80, 6);
				if (btn.Icon) {
					$$renderer.push("<!--[-->");
					btn.Icon($$renderer, { class: "w-3.5 h-3.5" });
					$$renderer.push("<!--]-->");
				} else {
					$$renderer.push("<!--[!-->");
					$$renderer.push("<!--]-->");
				}
				$$renderer.push(`</button>`);
				pop_element();
			}
			$$renderer.push(`<!--]--> <div class="w-px h-5 bg-border mx-0.5">`);
			push_element($$renderer, "div", 91, 4);
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(` <button class="flex items-center justify-center w-8 h-7 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Delete image" aria-label="Delete image">`);
			push_element($$renderer, "button", 93, 4);
			Trash_2($$renderer, { class: "w-3.5 h-3.5" });
			$$renderer.push(`<!----></button>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	}, ImageBubbleMenu);
}
ImageBubbleMenu.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region src/lib/components/editor/VideoBubbleMenu.svelte
VideoBubbleMenu[FILENAME] = "src/lib/components/editor/VideoBubbleMenu.svelte";
function VideoBubbleMenu($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { visible = false, videoRect = null, onDelete, onReplace } = $$props;
		let posX = 0;
		let posY = 0;
		if (visible && videoRect) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="fixed z-50 flex items-center gap-0.5 rounded-lg border border-border bg-popover p-1 shadow-md"${attr_style("", {
				top: "0",
				left: "0",
				transform: `translate(${stringify(posX)}px, ${stringify(posY)}px)`,
				"will-change": "transform"
			})}>`);
			push_element($$renderer, "div", 84, 2);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<button class="flex items-center gap-1.5 h-7 px-2 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors text-xs font-medium" title="Replace video URL">`);
			push_element($$renderer, "button", 123, 6);
			Link($$renderer, {
				class: "w-3.5 h-3.5",
				strokeWidth: 2
			});
			$$renderer.push(`<!----> Replace URL</button>`);
			pop_element();
			$$renderer.push(` <div class="w-px h-5 bg-border mx-0.5">`);
			push_element($$renderer, "div", 133, 6);
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(` <button class="flex items-center justify-center w-8 h-7 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Delete video" aria-label="Delete video">`);
			push_element($$renderer, "button", 135, 6);
			Trash_2($$renderer, { class: "w-3.5 h-3.5" });
			$$renderer.push(`<!----></button>`);
			pop_element();
			$$renderer.push(`<!--]--></div>`);
			pop_element();
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	}, VideoBubbleMenu);
}
VideoBubbleMenu.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region src/lib/components/editor/ImageResizeHandles.svelte
ImageResizeHandles[FILENAME] = "src/lib/components/editor/ImageResizeHandles.svelte";
function ImageResizeHandles($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { visible = false, imageRect = null, editor } = $$props;
		function handlePos(side) {
			if (!imageRect) return {
				left: 0,
				top: 0
			};
			const half = 10 / 2;
			switch (side) {
				case "right": return {
					left: imageRect.left + imageRect.width - half,
					top: imageRect.top + imageRect.height / 2 - half
				};
				case "bottom-right": return {
					left: imageRect.left + imageRect.width - half,
					top: imageRect.top + imageRect.height - half
				};
				case "bottom-left": return {
					left: imageRect.left - half,
					top: imageRect.top + imageRect.height - half
				};
			}
		}
		const sides = [
			"right",
			"bottom-right",
			"bottom-left"
		];
		if (visible && imageRect) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(sides);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let side = each_array[$$index];
				const pos = handlePos(side);
				$$renderer.push(`<div role="separator" aria-label="Resize image"${attr_class("fixed z-50 w-2.5 h-2.5 rounded-full border-2 border-primary bg-background shadow cursor-col-resize select-none hover:bg-primary transition-colors", void 0, {
					"cursor-nwse-resize": side === "bottom-right",
					"cursor-nesw-resize": side === "bottom-left"
				})}${attr_style(`left:${stringify(pos.left)}px;top:${stringify(pos.top)}px;`)}>`);
				push_element($$renderer, "div", 78, 4);
				$$renderer.push(`</div>`);
				pop_element();
			}
			$$renderer.push(`<!--]-->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	}, ImageResizeHandles);
}
ImageResizeHandles.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region src/lib/components/editor/BlockContextMenu.svelte
BlockContextMenu[FILENAME] = "src/lib/components/editor/BlockContextMenu.svelte";
function BlockContextMenu($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open = false, x = 0, y = 0, onClose, onDuplicate, onDelete } = $$props;
		const icons = [Copy, Trash_2];
		const items = [{
			label: "Duplicate block",
			action: () => onDuplicate(),
			baseClass: "text-foreground hover:bg-accent",
			activeClass: "bg-accent"
		}, {
			label: "Delete block",
			action: () => onDelete(),
			baseClass: "text-destructive hover:bg-destructive/10",
			activeClass: "bg-destructive/10"
		}];
		let posX = 0;
		let posY = 0;
		let activeIndex = 0;
		if (open) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="ctx-menu fixed z-50 min-w-44 rounded-lg border border-border bg-popover p-1 shadow-lg outline-none" role="menu" tabindex="-1" aria-label="Block options"${attr_style("", {
				top: "0",
				left: "0",
				transform: `translate(${stringify(posX)}px, ${stringify(posY)}px)`,
				"will-change": "transform"
			})}>`);
			push_element($$renderer, "div", 104, 2);
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(items);
			for (let i = 0, $$length = each_array.length; i < $$length; i++) {
				let item = each_array[i];
				const Icon = icons[i];
				$$renderer.push(`<button${attr_class(`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors ${stringify(item.baseClass)} ${stringify(i === activeIndex ? item.activeClass : "")}`)} role="menuitem" tabindex="-1">`);
				push_element($$renderer, "button", 118, 6);
				if (Icon) {
					$$renderer.push("<!--[-->");
					Icon($$renderer, { class: "w-3.5 h-3.5" });
					$$renderer.push("<!--]-->");
				} else {
					$$renderer.push("<!--[!-->");
					$$renderer.push("<!--]-->");
				}
				$$renderer.push(` ${escape_html(item.label)}</button>`);
				pop_element();
			}
			$$renderer.push(`<!--]--> <div class="px-2.5 pt-1 pb-0.5 border-t border-border mt-1">`);
			push_element($$renderer, "div", 130, 4);
			$$renderer.push(`<p class="text-[10px] text-muted-foreground">`);
			push_element($$renderer, "p", 131, 6);
			$$renderer.push(`↑↓ navigate · Enter select · Esc close</p>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	}, BlockContextMenu);
}
BlockContextMenu.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region src/lib/components/editor/SlashMenu.svelte
SlashMenu[FILENAME] = "src/lib/components/editor/SlashMenu.svelte";
function SlashMenu($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { slash } = $$props;
		const iconMap = {
			"heading-1": Heading_1,
			"heading-2": Heading_2,
			"heading-3": Heading_3,
			"pilcrow": Pilcrow,
			"list": List,
			"list-ordered": List_ordered,
			"code-2": Code_xml,
			"quote": Quote,
			"minus": Minus,
			"image": Image$1,
			"image-link": Link,
			"video": Circle_play,
			"lightbulb": Lightbulb,
			"info": Info,
			"alert-triangle": Triangle_alert,
			"check-circle": Circle_check_big
		};
		let posX = 0;
		let posY = 0;
		let urlValue = "";
		if (derived(() => slash.open && (slash.items.length > 0 || slash.urlInputMode))()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="slash-menu fixed z-[300] w-72 rounded-lg border border-border bg-popover shadow-xl overflow-hidden"${attr_style("", {
				top: "0",
				left: "0",
				transform: `translate(${stringify(posX)}px, ${stringify(posY)}px)`,
				"will-change": "transform"
			})}>`);
			push_element($$renderer, "div", 114, 2);
			if (slash.urlInputMode) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="px-3 py-2 border-b border-border flex items-center gap-2">`);
				push_element($$renderer, "div", 124, 6);
				Link($$renderer, {
					class: "w-3.5 h-3.5 shrink-0 text-muted-foreground",
					strokeWidth: 2
				});
				$$renderer.push(`<!----> <p class="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">`);
				push_element($$renderer, "p", 126, 8);
				$$renderer.push(`${escape_html(slash.urlLabel || "Paste URL")}</p>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(` <div class="p-3 flex flex-col gap-2">`);
				push_element($$renderer, "div", 128, 6);
				$$renderer.push(`<div class="flex items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5 focus-within:ring-1 focus-within:ring-ring">`);
				push_element($$renderer, "div", 129, 8);
				Link($$renderer, {
					class: "w-3.5 h-3.5 shrink-0 text-muted-foreground",
					strokeWidth: 2
				});
				$$renderer.push(`<!----> <input${attr("value", urlValue)} type="url"${attr("placeholder", slash.urlPlaceholder || "https://...")} class="flex-1 min-w-0 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"/>`);
				push_element($$renderer, "input", 131, 10);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(` <div class="flex gap-2">`);
				push_element($$renderer, "div", 140, 8);
				$$renderer.push(`<button class="flex-1 px-3 py-1.5 text-xs rounded-md border border-border text-muted-foreground hover:bg-accent transition-colors">`);
				push_element($$renderer, "button", 141, 10);
				$$renderer.push(`Cancel</button>`);
				pop_element();
				$$renderer.push(` <button${attr("disabled", !urlValue.trim(), true)} class="flex-1 px-3 py-1.5 text-xs rounded-md bg-foreground text-background font-medium disabled:opacity-40 hover:opacity-90 transition-opacity">`);
				push_element($$renderer, "button", 147, 10);
				$$renderer.push(`Embed</button>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(` <div class="px-3 py-1.5 border-t border-border">`);
				push_element($$renderer, "div", 156, 6);
				$$renderer.push(`<p class="text-[10px] text-muted-foreground">`);
				push_element($$renderer, "p", 157, 8);
				$$renderer.push(`Enter to embed · Esc cancel</p>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="px-3 py-2 border-b border-border">`);
				push_element($$renderer, "div", 161, 6);
				$$renderer.push(`<p class="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">`);
				push_element($$renderer, "p", 162, 8);
				$$renderer.push(`Blocks</p>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(` <div class="max-h-64 overflow-y-auto p-1">`);
				push_element($$renderer, "div", 164, 6);
				$$renderer.push(`<!--[-->`);
				const each_array = ensure_array_like(slash.items);
				for (let i = 0, $$length = each_array.length; i < $$length; i++) {
					let item = each_array[i];
					const Icon = iconMap[item.icon];
					$$renderer.push(`<button${attr_class("flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm text-left transition-colors", void 0, {
						"bg-accent": i === slash.selectedIndex,
						"text-accent-foreground": i === slash.selectedIndex,
						"text-foreground": i !== slash.selectedIndex,
						"hover:bg-accent": i !== slash.selectedIndex
					})}>`);
					push_element($$renderer, "button", 167, 10);
					$$renderer.push(`<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-border bg-background text-muted-foreground">`);
					push_element($$renderer, "div", 175, 12);
					if (Icon) {
						$$renderer.push("<!--[0-->");
						if (Icon) {
							$$renderer.push("<!--[-->");
							Icon($$renderer, {
								class: "w-4 h-4",
								strokeWidth: 1.75
							});
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div>`);
					pop_element();
					$$renderer.push(` <div class="flex-1 min-w-0">`);
					push_element($$renderer, "div", 180, 12);
					$$renderer.push(`<p class="font-medium leading-tight">`);
					push_element($$renderer, "p", 181, 14);
					$$renderer.push(`${escape_html(item.title)}</p>`);
					pop_element();
					$$renderer.push(` <p class="text-xs text-muted-foreground mt-0.5">`);
					push_element($$renderer, "p", 182, 14);
					$$renderer.push(`${escape_html(item.description)}</p>`);
					pop_element();
					$$renderer.push(`</div>`);
					pop_element();
					$$renderer.push(` `);
					if (item.shortcut) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<kbd class="shrink-0 text-[10px] font-mono text-muted-foreground bg-muted border border-border rounded px-1.5 py-0.5 leading-none">`);
						push_element($$renderer, "kbd", 185, 14);
						$$renderer.push(`${escape_html(item.shortcut)}</kbd>`);
						pop_element();
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></button>`);
					pop_element();
				}
				$$renderer.push(`<!--]--></div>`);
				pop_element();
				$$renderer.push(` <div class="px-3 py-1.5 border-t border-border">`);
				push_element($$renderer, "div", 192, 6);
				$$renderer.push(`<p class="text-[10px] text-muted-foreground">`);
				push_element($$renderer, "p", 193, 8);
				$$renderer.push(`↑↓ navigate · Enter select · Esc close</p>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
			}
			$$renderer.push(`<!--]--></div>`);
			pop_element();
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	}, SlashMenu);
}
SlashMenu.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region src/lib/components/editor/FloatingToolbar.svelte
FloatingToolbar[FILENAME] = "src/lib/components/editor/FloatingToolbar.svelte";
function FloatingToolbar($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { editor, onComment } = $$props;
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	}, FloatingToolbar);
}
FloatingToolbar.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region src/lib/components/VersionHistory.svelte
VersionHistory[FILENAME] = "src/lib/components/VersionHistory.svelte";
function VersionHistory($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { pageId, open = false, onRestore } = $$props;
		const qc = useQueryClient();
		const versionsQuery = createQuery(() => versionsQueryOptions(pageId, open));
		const versions = derived(() => versionsQuery.data ?? []);
		const restore = createMutation(() => ({
			mutationFn: restoreVersionFn,
			onSuccess: (restoredPage, { versionId }) => {
				const version = versions().find((v) => v.id === versionId);
				if (version) onRestore({
					...version,
					...restoredPage
				});
				qc.invalidateQueries({ queryKey: versionsKey(pageId) });
				open = false;
			}
		}));
		function formatDate(iso) {
			return new Date(iso).toLocaleString(void 0, {
				month: "short",
				day: "numeric",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit"
			});
		}
		if (open) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="fixed inset-0 z-40 flex" role="dialog" aria-modal="true" aria-label="Version history">`);
			push_element($$renderer, "div", 53, 2);
			$$renderer.push(`<button class="absolute inset-0 bg-black/30" tabindex="-1" aria-label="Close">`);
			push_element($$renderer, "button", 60, 4);
			$$renderer.push(`</button>`);
			pop_element();
			$$renderer.push(` <div class="relative ml-auto flex h-full w-80 flex-col border-l border-border bg-background shadow-xl">`);
			push_element($$renderer, "div", 68, 4);
			$$renderer.push(`<div class="flex items-center justify-between border-b border-border px-4 py-3">`);
			push_element($$renderer, "div", 70, 6);
			$$renderer.push(`<h2 class="text-sm font-semibold">`);
			push_element($$renderer, "h2", 71, 8);
			$$renderer.push(`Version history</h2>`);
			pop_element();
			$$renderer.push(` <button class="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors" aria-label="Close panel">`);
			push_element($$renderer, "button", 72, 8);
			$$renderer.push(`✕</button>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(` <div class="flex-1 overflow-y-auto p-4">`);
			push_element($$renderer, "div", 80, 6);
			if (versionsQuery.isPending) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="flex items-center justify-center py-12">`);
				push_element($$renderer, "div", 82, 10);
				$$renderer.push(`<div class="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent">`);
				push_element($$renderer, "div", 83, 12);
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
			} else if (versionsQuery.isError) {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`<p class="text-sm text-destructive">`);
				push_element($$renderer, "p", 86, 10);
				$$renderer.push(`${escape_html(versionsQuery.error?.message ?? "Failed to load history")}</p>`);
				pop_element();
			} else if (versions().length === 0) {
				$$renderer.push("<!--[2-->");
				$$renderer.push(`<div class="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">`);
				push_element($$renderer, "div", 90, 10);
				$$renderer.push(`<span class="text-3xl">`);
				push_element($$renderer, "span", 91, 12);
				$$renderer.push(`🕐</span>`);
				pop_element();
				$$renderer.push(` <p class="text-sm">`);
				push_element($$renderer, "p", 92, 12);
				$$renderer.push(`No saved versions yet.</p>`);
				pop_element();
				$$renderer.push(` <p class="text-xs">`);
				push_element($$renderer, "p", 93, 12);
				$$renderer.push(`Click "Save version" in the editor to create one.</p>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
			} else {
				$$renderer.push("<!--[-1-->");
				if (restore.isError) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<p class="mb-3 text-sm text-destructive">`);
					push_element($$renderer, "p", 97, 12);
					$$renderer.push(`${escape_html(restore.error?.message ?? "Restore failed")}</p>`);
					pop_element();
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <ul class="space-y-2">`);
				push_element($$renderer, "ul", 101, 10);
				$$renderer.push(`<!--[-->`);
				const each_array = ensure_array_like(versions());
				for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
					let v = each_array[$$index];
					$$renderer.push(`<li class="rounded-lg border border-border bg-card p-3 text-sm">`);
					push_element($$renderer, "li", 103, 14);
					$$renderer.push(`<div class="mb-1 flex items-start justify-between gap-2">`);
					push_element($$renderer, "div", 104, 16);
					$$renderer.push(`<span class="font-medium leading-tight line-clamp-2">`);
					push_element($$renderer, "span", 105, 18);
					$$renderer.push(`${escape_html(v.icon ? `${v.icon} ` : "")}${escape_html(v.title)}</span>`);
					pop_element();
					$$renderer.push(`</div>`);
					pop_element();
					$$renderer.push(` <p class="text-xs text-muted-foreground">`);
					push_element($$renderer, "p", 109, 16);
					$$renderer.push(`${escape_html(formatDate(v.createdAt))}</p>`);
					pop_element();
					$$renderer.push(` <p class="text-xs text-muted-foreground">`);
					push_element($$renderer, "p", 110, 16);
					$$renderer.push(`by ${escape_html(v.savedByUser.name)}</p>`);
					pop_element();
					$$renderer.push(` <button${attr("disabled", restore.isPending, true)} class="mt-2 w-full rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">`);
					push_element($$renderer, "button", 111, 16);
					$$renderer.push(`${escape_html(restore.isPending && restore.variables?.versionId === v.id ? "Restoring…" : "Restore this version")}</button>`);
					pop_element();
					$$renderer.push(`</li>`);
					pop_element();
				}
				$$renderer.push(`<!--]--></ul>`);
				pop_element();
			}
			$$renderer.push(`<!--]--></div>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { open });
	}, VersionHistory);
}
VersionHistory.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region src/lib/mentionUtils.ts
function escapeHtml(text) {
	return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function renderMentions(text, memberNames) {
	const sorted = [...memberNames].sort((a, b) => b.length - a.length);
	let escaped = escapeHtml(text);
	for (const name of sorted) {
		const safe = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		escaped = escaped.replace(new RegExp(`@(${safe})(?=[\\s,!?.\\n]|$)`, "g"), `<mark class="mention">@$1</mark>`);
	}
	return escaped;
}
//#endregion
//#region src/lib/components/editor/MentionInput.svelte
MentionInput[FILENAME] = "src/lib/components/editor/MentionInput.svelte";
function MentionInput($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { value = "", workspaceId, placeholder = "", rows = 3, autofocus = false, textareaClass = "", onSubmit, onEscape } = $$props;
		createQuery(() => workspaceMembersQueryOptions(workspaceId));
		$$renderer.push(`<div class="relative">`);
		push_element($$renderer, "div", 136, 0);
		$$renderer.push(`<textarea${attr("placeholder", placeholder)}${attr("rows", rows)}${attr_class(clsx$1(textareaClass))}>`);
		push_element($$renderer, "textarea", 137, 2);
		const $$body = escape_html(value);
		if ($$body) $$renderer.push(`${$$body}`);
		$$renderer.push(`</textarea>`);
		pop_element();
		$$renderer.push(` `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
		pop_element();
		bind_props($$props, { value });
	}, MentionInput);
}
MentionInput.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region src/lib/components/editor/CommentBubble.svelte
CommentBubble[FILENAME] = "src/lib/components/editor/CommentBubble.svelte";
function CommentBubble($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { editor, pageId, workspaceId, onCommentCreated, openForm: openFormBind = void 0 } = $$props;
		const queryClient = useQueryClient();
		let formOpen = false;
		let commentText = "";
		let savedQuote = "";
		let posX = 0;
		let posY = 0;
		const createComment = createMutation(() => ({
			mutationFn: createCommentFn,
			onSuccess: (data) => {
				queryClient.invalidateQueries({ queryKey: commentsKey(pageId) });
				onCommentCreated?.(data);
				commentText = "";
				formOpen = false;
				savedQuote = "";
			}
		}));
		function submit() {
			if (!commentText.trim()) return;
			createComment.mutate({
				pageId,
				content: commentText.trim(),
				quote: savedQuote || void 0
			});
		}
		function cancel() {
			formOpen = false;
			commentText = "";
			savedQuote = "";
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (formOpen) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="fixed inset-0 z-40" role="button" tabindex="-1" aria-label="Close">`);
				push_element($$renderer, "div", 146, 2);
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(` <div class="fixed z-50 w-72 bg-card border border-border rounded-xl shadow-2xl overflow-hidden" role="dialog" aria-label="New comment" aria-modal="true"${attr_style("", {
					top: "0",
					left: "0",
					transform: `translate(${stringify(posX)}px, ${stringify(posY)}px)`,
					"will-change": "transform"
				})}>`);
				push_element($$renderer, "div", 156, 2);
				if (savedQuote) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="px-4 pt-3 pb-0">`);
					push_element($$renderer, "div", 168, 6);
					$$renderer.push(`<p class="text-xs text-muted-foreground italic border-l-2 border-yellow-400 pl-2 line-clamp-2">`);
					push_element($$renderer, "p", 169, 8);
					$$renderer.push(`"${escape_html(savedQuote)}"</p>`);
					pop_element();
					$$renderer.push(`</div>`);
					pop_element();
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <div class="p-4">`);
				push_element($$renderer, "div", 175, 4);
				MentionInput($$renderer, {
					workspaceId,
					placeholder: "Add a comment… (type @ to mention)",
					rows: 3,
					autofocus: true,
					textareaClass: "w-full text-sm resize-none bg-transparent outline-none\n                       placeholder:text-muted-foreground leading-relaxed",
					onSubmit: submit,
					onEscape: cancel,
					get value() {
						return commentText;
					},
					set value($$value) {
						commentText = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----> <div class="flex justify-end gap-2 mt-2 pt-2 border-t border-border">`);
				push_element($$renderer, "div", 187, 6);
				$$renderer.push(`<button class="px-3 py-1.5 text-xs rounded-lg hover:bg-accent text-muted-foreground transition-colors">`);
				push_element($$renderer, "button", 188, 8);
				$$renderer.push(`Cancel</button>`);
				pop_element();
				$$renderer.push(` <button${attr("disabled", !commentText.trim() || createComment.isPending, true)} class="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-foreground text-background font-medium disabled:opacity-50 hover:opacity-90 transition-opacity">`);
				push_element($$renderer, "button", 195, 8);
				if (createComment.isPending) {
					$$renderer.push("<!--[0-->");
					Loader_circle($$renderer, { class: "w-3 h-3 animate-spin" });
					$$renderer.push(`<!----> Saving…`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`Comment`);
				}
				$$renderer.push(`<!--]--></button>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { openForm: openFormBind });
	}, CommentBubble);
}
CommentBubble.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region src/lib/components/editor/CommentPanel.svelte
CommentPanel[FILENAME] = "src/lib/components/editor/CommentPanel.svelte";
function CommentPanel($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { pageId, workspaceId, open, editor, currentUserId = "", focusedCommentId = null, onClose } = $$props;
		const queryClient = useQueryClient();
		const commentsQuery = createQuery(() => commentsQueryOptions(pageId, open));
		const membersQuery = createQuery(() => workspaceMembersQueryOptions(workspaceId));
		const memberNames = derived(() => (membersQuery.data ?? []).map((m) => m.user.name));
		let activeTab = "open";
		let replyingTo = null;
		let replyText = "";
		let highlightedId = null;
		const threads = derived(() => (commentsQuery.data ?? []).filter((c) => !c.resolved));
		const openCount = derived(() => (commentsQuery.data ?? []).filter((c) => !c.resolved).length);
		const resolvedCount = derived(() => (commentsQuery.data ?? []).filter((c) => c.resolved).length);
		createMutation(() => ({
			mutationFn: ({ id, resolved }) => updateCommentFn({
				id,
				resolved
			}),
			onSuccess: () => queryClient.invalidateQueries({ queryKey: commentsKey(pageId) })
		}));
		createMutation(() => ({
			mutationFn: (id) => deleteCommentFn(id),
			onSuccess: () => queryClient.invalidateQueries({ queryKey: commentsKey(pageId) })
		}));
		const addReply = createMutation(() => ({
			mutationFn: createReplyFn,
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: commentsKey(pageId) });
				replyingTo = null;
				replyText = "";
			}
		}));
		function submitReply(commentId) {
			if (!replyText.trim()) return;
			addReply.mutate({
				pageId,
				commentId,
				content: replyText.trim()
			});
		}
		function formatTime(ts) {
			const d = new Date(ts);
			const diff = Date.now() - d.getTime();
			if (diff < 6e4) return "just now";
			if (diff < 36e5) return `${Math.floor(diff / 6e4)}m ago`;
			if (diff < 864e5) return `${Math.floor(diff / 36e5)}h ago`;
			if (diff < 7 * 864e5) return `${Math.floor(diff / 864e5)}d ago`;
			return d.toLocaleDateString(void 0, {
				month: "short",
				day: "numeric"
			});
		}
		function initials(name) {
			return name.split(" ").map((n) => n[0] ?? "").join("").slice(0, 2).toUpperCase();
		}
		function avatarColor(name) {
			const colors = [
				"bg-blue-100 text-blue-700",
				"bg-green-100 text-green-700",
				"bg-purple-100 text-purple-700",
				"bg-orange-100 text-orange-700",
				"bg-pink-100 text-pink-700",
				"bg-teal-100 text-teal-700"
			];
			let hash = 0;
			for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) % colors.length;
			return colors[hash];
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (open) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="fixed inset-0 z-[59]" role="presentation">`);
				push_element($$renderer, "div", 153, 2);
				$$renderer.push(`</div>`);
				pop_element();
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div${attr_class("fixed top-0 right-0 h-full w-80 bg-card border-l border-border z-[60] flex flex-col shadow-xl transition-transform duration-200 ease-out", void 0, {
				"translate-x-full": !open,
				"translate-x-0": open
			})}${attr("aria-hidden", !open)} role="complementary" aria-label="Comments panel">`);
			push_element($$renderer, "div", 160, 0);
			$$renderer.push(`<div class="flex items-center justify-between px-4 h-12 border-b border-border shrink-0">`);
			push_element($$renderer, "div", 170, 2);
			$$renderer.push(`<h2 class="font-semibold text-sm">`);
			push_element($$renderer, "h2", 171, 4);
			$$renderer.push(`Comments</h2>`);
			pop_element();
			$$renderer.push(` <button class="w-7 h-7 flex items-center justify-center rounded-md hover:bg-accent text-muted-foreground transition-colors" aria-label="Close comments">`);
			push_element($$renderer, "button", 172, 4);
			X($$renderer, { class: "w-3.5 h-3.5" });
			$$renderer.push(`<!----></button>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(` <div class="flex border-b border-border shrink-0">`);
			push_element($$renderer, "div", 183, 2);
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(["open", "resolved"]);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let tab = each_array[$$index];
				$$renderer.push(`<button${attr_class("flex-1 py-2.5 text-xs font-medium capitalize transition-colors border-b-2", void 0, {
					"border-foreground": activeTab === tab,
					"text-foreground": activeTab === tab,
					"border-transparent": activeTab !== tab,
					"text-muted-foreground": activeTab !== tab
				})}>`);
				push_element($$renderer, "button", 185, 6);
				$$renderer.push(`${escape_html(tab === "open" ? `Open (${openCount()})` : `Resolved (${resolvedCount()})`)}</button>`);
				pop_element();
			}
			$$renderer.push(`<!--]--></div>`);
			pop_element();
			$$renderer.push(` <div class="flex-1 overflow-y-auto">`);
			push_element($$renderer, "div", 199, 2);
			if (commentsQuery.isLoading) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="p-6 text-center text-xs text-muted-foreground">`);
				push_element($$renderer, "div", 201, 6);
				$$renderer.push(`Loading…</div>`);
				pop_element();
			} else if (threads().length === 0) {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`<div class="p-8 text-center">`);
				push_element($$renderer, "div", 203, 6);
				$$renderer.push(`<div class="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">`);
				push_element($$renderer, "div", 204, 8);
				Message_square($$renderer, {
					class: "w-4.5 h-4.5 text-muted-foreground",
					strokeWidth: 1.5
				});
				$$renderer.push(`<!----></div>`);
				pop_element();
				$$renderer.push(` <p class="text-xs text-muted-foreground">`);
				push_element($$renderer, "p", 207, 8);
				$$renderer.push(`${escape_html("No comments yet. Select text to add one.")}</p>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="divide-y divide-border">`);
				push_element($$renderer, "div", 214, 6);
				$$renderer.push(`<!--[-->`);
				const each_array_1 = ensure_array_like(threads());
				for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
					let thread = each_array_1[$$index_2];
					$$renderer.push(`<div${attr("id", `comment-${stringify(thread.id)}`)}${attr_class(`p-4 cursor-pointer transition-colors ${highlightedId === thread.id ? "bg-yellow-50 dark:bg-yellow-950/20" : ""}`)} role="button" tabindex="0">`);
					push_element($$renderer, "div", 216, 10);
					if (thread.quote) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<p class="text-xs text-muted-foreground italic border-l-2 border-yellow-400 pl-2 mb-3 line-clamp-2">`);
						push_element($$renderer, "p", 226, 14);
						$$renderer.push(`"${escape_html(thread.quote)}"</p>`);
						pop_element();
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> <div class="flex gap-2.5">`);
					push_element($$renderer, "div", 233, 12);
					$$renderer.push(`<div${attr_class(`w-7 h-7 rounded-full ${stringify(avatarColor(thread.author.name))} flex items-center justify-center text-xs font-semibold shrink-0`)}>`);
					push_element($$renderer, "div", 234, 14);
					$$renderer.push(`${escape_html(initials(thread.author.name))}</div>`);
					pop_element();
					$$renderer.push(` <div class="flex-1 min-w-0">`);
					push_element($$renderer, "div", 238, 14);
					$$renderer.push(`<div class="flex items-baseline gap-1.5 mb-1">`);
					push_element($$renderer, "div", 239, 16);
					$$renderer.push(`<span class="text-xs font-semibold truncate">`);
					push_element($$renderer, "span", 240, 18);
					$$renderer.push(`${escape_html(thread.author.name)}</span>`);
					pop_element();
					$$renderer.push(` <span class="text-xs text-muted-foreground shrink-0">`);
					push_element($$renderer, "span", 241, 18);
					$$renderer.push(`${escape_html(formatTime(thread.createdAt))}</span>`);
					pop_element();
					$$renderer.push(`</div>`);
					pop_element();
					$$renderer.push(` <p class="text-xs leading-relaxed break-words text-foreground/90">`);
					push_element($$renderer, "p", 244, 16);
					$$renderer.push(`${html(renderMentions(thread.content, memberNames()))}</p>`);
					pop_element();
					$$renderer.push(`</div>`);
					pop_element();
					$$renderer.push(`</div>`);
					pop_element();
					$$renderer.push(` <div class="flex items-center gap-1 mt-2.5 ml-9" role="presentation">`);
					push_element($$renderer, "div", 251, 12);
					$$renderer.push(`<button class="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-accent">`);
					push_element($$renderer, "button", 256, 14);
					$$renderer.push(`Reply</button>`);
					pop_element();
					$$renderer.push(` <button class="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-accent">`);
					push_element($$renderer, "button", 266, 14);
					$$renderer.push(`${escape_html(thread.resolved ? "Re-open" : "Resolve")}</button>`);
					pop_element();
					$$renderer.push(` `);
					if (thread.authorId === currentUserId) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<button class="ml-auto text-xs text-muted-foreground hover:text-destructive transition-colors px-2 py-1 rounded hover:bg-accent">`);
						push_element($$renderer, "button", 276, 16);
						$$renderer.push(`Delete</button>`);
						pop_element();
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div>`);
					pop_element();
					$$renderer.push(` `);
					if (thread.replies && thread.replies.length > 0) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div class="mt-3 ml-9 space-y-3 border-l-2 border-border pl-3">`);
						push_element($$renderer, "div", 288, 14);
						$$renderer.push(`<!--[-->`);
						const each_array_2 = ensure_array_like(thread.replies);
						for (let $$index_1 = 0, $$length = each_array_2.length; $$index_1 < $$length; $$index_1++) {
							let reply = each_array_2[$$index_1];
							$$renderer.push(`<div class="flex gap-2">`);
							push_element($$renderer, "div", 290, 18);
							$$renderer.push(`<div${attr_class(`w-6 h-6 rounded-full ${stringify(avatarColor(reply.author.name))} flex items-center justify-center text-xs font-semibold shrink-0`)}>`);
							push_element($$renderer, "div", 291, 20);
							$$renderer.push(`${escape_html(initials(reply.author.name))}</div>`);
							pop_element();
							$$renderer.push(` <div class="flex-1 min-w-0">`);
							push_element($$renderer, "div", 295, 20);
							$$renderer.push(`<div class="flex items-baseline gap-1.5 mb-0.5">`);
							push_element($$renderer, "div", 296, 22);
							$$renderer.push(`<span class="text-xs font-semibold truncate">`);
							push_element($$renderer, "span", 297, 24);
							$$renderer.push(`${escape_html(reply.author.name)}</span>`);
							pop_element();
							$$renderer.push(` <span class="text-xs text-muted-foreground shrink-0">`);
							push_element($$renderer, "span", 298, 24);
							$$renderer.push(`${escape_html(formatTime(reply.createdAt))}</span>`);
							pop_element();
							$$renderer.push(`</div>`);
							pop_element();
							$$renderer.push(` <p class="text-xs leading-relaxed break-words">`);
							push_element($$renderer, "p", 301, 22);
							$$renderer.push(`${html(renderMentions(reply.content, memberNames()))}</p>`);
							pop_element();
							$$renderer.push(`</div>`);
							pop_element();
							$$renderer.push(` `);
							if (reply.authorId === currentUserId) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`<button class="shrink-0 text-muted-foreground hover:text-destructive transition-colors" aria-label="Delete reply">`);
								push_element($$renderer, "button", 306, 22);
								X($$renderer, { class: "w-2.5 h-2.5" });
								$$renderer.push(`<!----></button>`);
								pop_element();
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--></div>`);
							pop_element();
						}
						$$renderer.push(`<!--]--></div>`);
						pop_element();
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					if (replyingTo === thread.id) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div class="mt-3 ml-9" role="presentation">`);
						push_element($$renderer, "div", 321, 14);
						MentionInput($$renderer, {
							workspaceId,
							placeholder: "Reply… (type @ to mention)",
							rows: 2,
							autofocus: true,
							textareaClass: "w-full text-xs resize-none bg-muted rounded-lg p-2\n                                 border border-border outline-none focus:ring-1 focus:ring-ring",
							onSubmit: () => submitReply(thread.id),
							onEscape: () => {
								replyingTo = null;
								replyText = "";
							},
							get value() {
								return replyText;
							},
							set value($$value) {
								replyText = $$value;
								$$settled = false;
							}
						});
						$$renderer.push(`<!----> <div class="flex justify-end gap-2 mt-1.5">`);
						push_element($$renderer, "div", 337, 16);
						$$renderer.push(`<button class="px-2 py-1 text-xs rounded hover:bg-accent text-muted-foreground">`);
						push_element($$renderer, "button", 338, 18);
						$$renderer.push(`Cancel</button>`);
						pop_element();
						$$renderer.push(` <button${attr("disabled", !replyText.trim() || addReply.isPending, true)} class="px-2 py-1 text-xs rounded bg-foreground text-background disabled:opacity-50">`);
						push_element($$renderer, "button", 344, 18);
						$$renderer.push(`${escape_html(addReply.isPending ? "…" : "Reply")}</button>`);
						pop_element();
						$$renderer.push(`</div>`);
						pop_element();
						$$renderer.push(`</div>`);
						pop_element();
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div>`);
					pop_element();
				}
				$$renderer.push(`<!--]--></div>`);
				pop_element();
			}
			$$renderer.push(`<!--]--></div>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	}, CommentPanel);
}
CommentPanel.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region src/lib/components/PageEditor.svelte
PageEditor[FILENAME] = "src/lib/components/PageEditor.svelte";
function PageEditor($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let { page, onTitleChange, onRestore } = $$props;
		const session = useSession();
		let currentUserId = derived(() => session.data?.user?.id ?? "");
		let editor = null;
		let imageSelected = false;
		let imageRect = null;
		let videoSelected = false;
		let videoRect = null;
		let titleValue = "";
		let titleTimer;
		let saveTimer;
		let historyOpen = false;
		let commentPanelOpen = false;
		let activeCommentId = null;
		let ctxOpen = false;
		let ctxX = 0;
		let ctxY = 0;
		let ctxBlockPos = null;
		let openCommentForm = void 0;
		let slash = derived(() => store_get($$store_subs ??= {}, "$slashMenuStore", slashMenuStore));
		let hasDraft = false;
		let draftSavedAt = 0;
		let suppressAutoSave = false;
		let pendingImageCount = 0;
		/** Convert a File to a base64 data URL (works offline, survives IDB serialisation). */
		function fileToDataUrl(file) {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => resolve(reader.result);
				reader.onerror = reject;
				reader.readAsDataURL(file);
			});
		}
		/**
		* Called by EditorArea (toolbar button, drag-drop, paste) for every image file.
		* - Online: uploads immediately to Cloudinary, returns permanent URL.
		* - Offline: embeds as base64 with a pendingId; upload is deferred to reconnect.
		*/
		async function handleImageFile(file) {
			if (navigator.onLine) return { src: await uploadImage(file) };
			const id = crypto.randomUUID();
			const src = await fileToDataUrl(file);
			pendingImageCount++;
			return {
				src,
				pendingId: id
			};
		}
		const commentsQuery = createQuery(() => commentsQueryOptions(page.id, commentPanelOpen));
		let openCommentCount = derived(() => (commentsQuery.data ?? []).filter((c) => !c.resolved).length);
		const saveContent = createMutation(() => ({ mutationFn: updatePageFn }));
		const saveVersion = createMutation(() => ({ mutationFn: saveVersionFn }));
		function handleTitleInput(val) {
			titleValue = val;
			clearTimeout(titleTimer);
			titleTimer = setTimeout(() => onTitleChange?.(val), 400);
		}
		function scheduleContentSave(json) {
			if (suppressAutoSave) return;
			draftSavedAt = Date.now();
			saveDraft(page.id).catch(() => {});
			hasDraft = true;
			clearTimeout(saveTimer);
			saveTimer = setTimeout(() => {
				const capturedSavedAt = draftSavedAt;
				const capturedPageId = page.id;
				saveContent.mutate({
					id: capturedPageId,
					content: json
				}, {
					onSuccess: () => {
						if (draftSavedAt <= capturedSavedAt) {
							clearDraft().catch(() => {});
							hasDraft = false;
						}
					},
					onError: () => {
						if (draftSavedAt <= capturedSavedAt) {
							clearDraft().catch(() => {});
							hasDraft = false;
						}
					}
				});
			}, 1e3);
		}
		function discardDraft() {
			clearDraft(page.id).catch(() => {});
			hasDraft = false;
			draftSavedAt = 0;
			clearTimeout(saveTimer);
			if (editor) {
				suppressAutoSave = true;
				try {
					const serverContent = page.content ? JSON.parse(page.content) : null;
					editor.commands.setContent(serverContent ?? {
						type: "doc",
						content: [{ type: "paragraph" }]
					});
				} catch {
					editor.commands.setContent({
						type: "doc",
						content: [{ type: "paragraph" }]
					});
				}
				suppressAutoSave = false;
			}
		}
		function handleImageUpload() {
			const input = document.createElement("input");
			input.type = "file";
			input.accept = "image/png,image/jpeg,image/gif,image/webp";
			input.onchange = async () => {
				const file = input.files?.[0];
				if (!file || !editor) return;
				try {
					const result = await handleImageFile(file);
					editor.chain().focus().setImage({
						src: result.src,
						align: "center",
						...result.pendingId ? { pendingId: result.pendingId } : {}
					}).run();
				} catch (err) {
					console.error("Image upload failed:", err);
				}
			};
			input.click();
		}
		function setImageAlign(align) {
			editor?.chain().focus().updateAttributes("image", { align }).run();
		}
		function deleteImage() {
			editor?.chain().focus().deleteSelection().run();
			imageSelected = false;
			imageRect = null;
		}
		function deleteVideo() {
			editor?.chain().focus().deleteSelection().run();
			videoSelected = false;
			videoRect = null;
		}
		function replaceVideoUrl(url) {
			const embedUrl = getVideoEmbedUrl(url);
			if (!embedUrl || !editor) return;
			editor.chain().focus().updateAttributes("videoEmbed", { src: embedUrl }).run();
		}
		async function handleSaveVersion() {
			if (!editor) return;
			await saveVersion.mutateAsync({
				pageId: page.id,
				title: titleValue,
				content: JSON.stringify(editor.getJSON())
			});
		}
		function handleRestore(version) {
			titleValue = version.title;
			onTitleChange?.(version.title);
			if (editor && version.content) try {
				editor.commands.setContent(JSON.parse(version.content));
			} catch {}
			onRestore?.();
		}
		function openContextMenu({ x, y, blockPos }) {
			ctxX = x;
			ctxY = y;
			ctxBlockPos = blockPos;
			ctxOpen = true;
		}
		function closeCtx() {
			ctxOpen = false;
		}
		function deleteBlock() {
			if (!editor || ctxBlockPos === null) {
				closeCtx();
				return;
			}
			try {
				const resolvedPos = editor.state.doc.resolve(ctxBlockPos);
				const from = resolvedPos.start(1) - 1;
				const to = resolvedPos.end(1) + 1;
				editor.chain().focus().deleteRange({
					from,
					to
				}).run();
			} catch {}
			closeCtx();
		}
		function duplicateBlock() {
			if (!editor || ctxBlockPos === null) {
				closeCtx();
				return;
			}
			try {
				const resolvedPos = editor.state.doc.resolve(ctxBlockPos);
				const node = resolvedPos.node(1);
				if (node) {
					const to = resolvedPos.end(1) + 1;
					editor.chain().focus().insertContentAt(to, node.toJSON()).run();
				}
			} catch {}
			closeCtx();
		}
		function handleCommentCreated(comment) {
			activeCommentId = comment.id;
			commentPanelOpen = true;
		}
		function handleCommentClick(commentId) {
			activeCommentId = commentId;
			commentPanelOpen = true;
		}
		onDestroy(() => {
			clearTimeout(titleTimer);
			clearTimeout(saveTimer);
		});
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<div class="max-w-3xl mx-auto px-8 pb-24">`);
			push_element($$renderer, "div", 463, 0);
			PageHeader($$renderer, {
				page,
				titleValue,
				onTitleInput: handleTitleInput
			});
			$$renderer.push(`<!----> `);
			EditorToolbar($$renderer, {
				saveIsPending: saveContent.isPending,
				saveIsError: saveContent.isError,
				versionIsPending: saveVersion.isPending,
				versionIsSuccess: saveVersion.isSuccess,
				commentPanelOpen,
				commentCount: openCommentCount(),
				hasDraft,
				pendingImageCount,
				onImageUpload: handleImageUpload,
				onSaveVersion: handleSaveVersion,
				onOpenHistory: () => historyOpen = true,
				onToggleComments: () => commentPanelOpen = !commentPanelOpen,
				onDiscardDraft: discardDraft
			});
			$$renderer.push(`<!----> `);
			EditorArea($$renderer, {
				page,
				onUpdate: scheduleContentSave,
				onOpenContextMenu: openContextMenu,
				onCommentClick: handleCommentClick,
				onImageFile: handleImageFile,
				get editor() {
					return editor;
				},
				set editor($$value) {
					editor = $$value;
					$$settled = false;
				},
				get imageSelected() {
					return imageSelected;
				},
				set imageSelected($$value) {
					imageSelected = $$value;
					$$settled = false;
				},
				get imageRect() {
					return imageRect;
				},
				set imageRect($$value) {
					imageRect = $$value;
					$$settled = false;
				},
				get videoSelected() {
					return videoSelected;
				},
				set videoSelected($$value) {
					videoSelected = $$value;
					$$settled = false;
				},
				get videoRect() {
					return videoRect;
				},
				set videoRect($$value) {
					videoRect = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----></div>`);
			pop_element();
			$$renderer.push(` `);
			ImageBubbleMenu($$renderer, {
				visible: imageSelected,
				imageRect,
				onAlign: setImageAlign,
				onDelete: deleteImage
			});
			$$renderer.push(`<!----> `);
			VideoBubbleMenu($$renderer, {
				visible: videoSelected,
				videoRect,
				onDelete: deleteVideo,
				onReplace: replaceVideoUrl
			});
			$$renderer.push(`<!----> `);
			ImageResizeHandles($$renderer, {
				visible: imageSelected,
				imageRect,
				editor
			});
			$$renderer.push(`<!----> `);
			BlockContextMenu($$renderer, {
				open: ctxOpen,
				x: ctxX,
				y: ctxY,
				onClose: closeCtx,
				onDuplicate: duplicateBlock,
				onDelete: deleteBlock
			});
			$$renderer.push(`<!----> `);
			SlashMenu($$renderer, { slash: slash() });
			$$renderer.push(`<!----> `);
			FloatingToolbar($$renderer, {
				editor,
				onComment: openCommentForm
			});
			$$renderer.push(`<!----> `);
			VersionHistory($$renderer, {
				pageId: page.id,
				onRestore: handleRestore,
				get open() {
					return historyOpen;
				},
				set open($$value) {
					historyOpen = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			CommentBubble($$renderer, {
				editor,
				pageId: page.id,
				workspaceId: page.workspaceId,
				onCommentCreated: handleCommentCreated,
				get openForm() {
					return openCommentForm;
				},
				set openForm($$value) {
					openCommentForm = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			CommentPanel($$renderer, {
				pageId: page.id,
				workspaceId: page.workspaceId,
				open: commentPanelOpen,
				editor,
				currentUserId: currentUserId(),
				focusedCommentId: activeCommentId,
				onClose: () => commentPanelOpen = false
			});
			$$renderer.push(`<!---->`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	}, PageEditor);
}
PageEditor.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region src/routes/(app)/app/[pageId]/+page.svelte
_page[FILENAME] = "src/routes/(app)/app/[pageId]/+page.svelte";
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		const qc = useQueryClient();
		let pageId = derived(() => store_get($$store_subs ??= {}, "$pageParam", page).params.pageId);
		let user = derived(() => store_get($$store_subs ??= {}, "$userStore", userStore));
		const pageQuery = createQuery(() => pageQueryOptions(pageId() ?? ""));
		const currentPage = derived(() => pageQuery.data ?? null);
		const loading = derived(() => pageQuery.isPending);
		const notFound = derived(() => pageQuery.isError);
		createQuery(() => pagesQueryOptions(store_get($$store_subs ??= {}, "$currentWorkspaceId", currentWorkspaceId) ?? ""));
		const updateTitle = createMutation(() => ({
			mutationFn: updatePageFn,
			onSuccess: (updated) => {
				qc.setQueryData(pageKey(updated.id), updated);
				if (store_get($$store_subs ??= {}, "$currentWorkspaceId", currentWorkspaceId)) qc.invalidateQueries({ queryKey: pagesKey(store_get($$store_subs ??= {}, "$currentWorkspaceId", currentWorkspaceId)) });
			}
		}));
		function handleTitleChange(title) {
			if (!currentPage()) return;
			updateTitle.mutate({
				id: currentPage().id,
				title
			});
		}
		function handleRestore() {
			qc.invalidateQueries({ queryKey: pageKey(pageId() ?? "") });
		}
		createMutation(() => ({
			mutationFn: deletePageFn,
			onSuccess: async () => {
				if (currentPage() && store_get($$store_subs ??= {}, "$currentWorkspaceId", currentWorkspaceId)) await qc.invalidateQueries({ queryKey: pagesKey(store_get($$store_subs ??= {}, "$currentWorkspaceId", currentWorkspaceId)) });
				goto();
			}
		}));
		if (loading()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex h-full items-center justify-center">`);
			push_element($$renderer, "div", 95, 2);
			$$renderer.push(`<div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full">`);
			push_element($$renderer, "div", 96, 4);
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
		} else if (notFound() || !currentPage()) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<div class="flex h-full items-center justify-center text-muted-foreground">`);
			push_element($$renderer, "div", 99, 2);
			$$renderer.push(`Page not found</div>`);
			pop_element();
		} else if (user()) {
			$$renderer.push("<!--[2-->");
			PageEditor($$renderer, {
				page: currentPage(),
				onTitleChange: handleTitleChange,
				onRestore: handleRestore
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	}, _page);
}
_page.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-CFqPWkt2.js.map
