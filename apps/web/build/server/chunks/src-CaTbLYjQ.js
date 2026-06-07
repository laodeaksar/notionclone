import { m as bind_props, l as attributes, p as clsx$1, ae as push_element, ab as pop_element, al as sanitize_props, ai as rest_props, z as fallback, w as ensure_array_like, aF as validate_dynamic_element_tag, v as element, as as slot, au as spread_props, ac as prevent_snippet_stringification, y as escape_html, j as attr_class, i as attr, aG as validate_snippet_args, u as derived, at as snapshot, Q as hasContext, I as getContext, an as setContext, G as getAllContexts, aA as tick, F as FILENAME, a6 as mount, k as attr_style, ax as stringify, aC as unmount, aj as run } from './index-server-DF5QiTDW.js';
import { w as on } from './internal-CAsCd1Nb.js';
import { c as createSubscriber, M as MediaQuery } from './index-server3-BJHpPivQ.js';
import { clsx } from 'clsx';
import { twMerge, extendTailwindMerge } from 'tailwind-merge';
import { offset, shift, limitShift, flip, size, arrow, hide, computePosition } from '@floating-ui/dom';

// src/utils.js
var SPACE_REGEX = /\s+/g;
var removeExtraSpaces = (str) => {
  if (typeof str !== "string" || !str) return str;
  return str.replace(SPACE_REGEX, " ").trim();
};
var cx = (...classnames) => {
  const classList = [];
  const buildClassString = (input) => {
    if (!input && input !== 0 && input !== 0n) return;
    if (Array.isArray(input)) {
      for (let i = 0, len = input.length; i < len; i++) buildClassString(input[i]);
      return;
    }
    const type = typeof input;
    if (type === "string" || type === "number" || type === "bigint") {
      if (type === "number" && input !== input) return;
      classList.push(String(input));
    } else if (type === "object") {
      const keys = Object.keys(input);
      for (let i = 0, len = keys.length; i < len; i++) {
        const key = keys[i];
        if (input[key]) classList.push(key);
      }
    }
  };
  for (let i = 0, len = classnames.length; i < len; i++) {
    const c = classnames[i];
    if (c !== null && c !== void 0) buildClassString(c);
  }
  return classList.length > 0 ? removeExtraSpaces(classList.join(" ")) : void 0;
};
var falsyToString = (value) => value === false ? "false" : value === true ? "true" : value === 0 ? "0" : value;
var isEmptyObject = (obj) => {
  if (!obj || typeof obj !== "object") return true;
  for (const _ in obj) return false;
  return true;
};
var isEqual = (obj1, obj2) => {
  if (obj1 === obj2) return true;
  if (!obj1 || !obj2) return false;
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  for (let i = 0; i < keys1.length; i++) {
    const key = keys1[i];
    if (!keys2.includes(key)) return false;
    if (obj1[key] !== obj2[key]) return false;
  }
  return true;
};
var joinObjects = (obj1, obj2) => {
  for (const key in obj2) {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      const val2 = obj2[key];
      if (key in obj1) {
        obj1[key] = cx(obj1[key], val2);
      } else {
        obj1[key] = val2;
      }
    }
  }
  return obj1;
};
var flat = (arr, target) => {
  for (let i = 0; i < arr.length; i++) {
    const el = arr[i];
    if (Array.isArray(el)) flat(el, target);
    else if (el) target.push(el);
  }
};
var flatMergeArrays = (...arrays) => {
  const result = [];
  flat(arrays, result);
  const filtered = [];
  for (let i = 0; i < result.length; i++) {
    if (result[i]) filtered.push(result[i]);
  }
  return filtered;
};
var mergeObjects = (obj1, obj2) => {
  const result = {};
  for (const key in obj1) {
    const val1 = obj1[key];
    if (key in obj2) {
      const val2 = obj2[key];
      if (Array.isArray(val1) || Array.isArray(val2)) {
        result[key] = flatMergeArrays(val2, val1);
      } else if (typeof val1 === "object" && typeof val2 === "object" && val1 && val2) {
        result[key] = mergeObjects(val1, val2);
      } else {
        result[key] = val2 + " " + val1;
      }
    } else {
      result[key] = val1;
    }
  }
  for (const key in obj2) {
    if (!(key in obj1)) {
      result[key] = obj2[key];
    }
  }
  return result;
};

// src/config.js
var defaultConfig = {
  twMerge: true,
  twMergeConfig: {}
};

// src/state.js
function createState() {
  let cachedTwMerge = null;
  let cachedTwMergeConfig = {};
  let didTwMergeConfigChange = false;
  return {
    get cachedTwMerge() {
      return cachedTwMerge;
    },
    set cachedTwMerge(value) {
      cachedTwMerge = value;
    },
    get cachedTwMergeConfig() {
      return cachedTwMergeConfig;
    },
    set cachedTwMergeConfig(value) {
      cachedTwMergeConfig = value;
    },
    get didTwMergeConfigChange() {
      return didTwMergeConfigChange;
    },
    set didTwMergeConfigChange(value) {
      didTwMergeConfigChange = value;
    },
    reset() {
      cachedTwMerge = null;
      cachedTwMergeConfig = {};
      didTwMergeConfigChange = false;
    }
  };
}
var state = createState();

// src/core.js
var getTailwindVariants = (cn) => {
  const tv = (options, configProp) => {
    const {
      extend = null,
      slots: slotProps = {},
      variants: variantsProps = {},
      compoundVariants: compoundVariantsProps = [],
      compoundSlots = [],
      defaultVariants: defaultVariantsProps = {}
    } = options;
    const config = { ...defaultConfig, ...configProp };
    const base = extend?.base ? cx(extend.base, options?.base) : options?.base;
    const variants = extend?.variants && !isEmptyObject(extend.variants) ? mergeObjects(variantsProps, extend.variants) : variantsProps;
    const defaultVariants = extend?.defaultVariants && !isEmptyObject(extend.defaultVariants) ? { ...extend.defaultVariants, ...defaultVariantsProps } : defaultVariantsProps;
    if (!isEmptyObject(config.twMergeConfig) && !isEqual(config.twMergeConfig, state.cachedTwMergeConfig)) {
      state.didTwMergeConfigChange = true;
      state.cachedTwMergeConfig = config.twMergeConfig;
    }
    const isExtendedSlotsEmpty = isEmptyObject(extend?.slots);
    const componentSlots = !isEmptyObject(slotProps) ? {
      // add "base" to the slots object
      base: cx(options?.base, isExtendedSlotsEmpty && extend?.base),
      ...slotProps
    } : {};
    const slots = isExtendedSlotsEmpty ? componentSlots : joinObjects(
      { ...extend?.slots },
      isEmptyObject(componentSlots) ? { base: options?.base } : componentSlots
    );
    const compoundVariants = isEmptyObject(extend?.compoundVariants) ? compoundVariantsProps : flatMergeArrays(extend?.compoundVariants, compoundVariantsProps);
    const component = (props) => {
      if (isEmptyObject(variants) && isEmptyObject(slotProps) && isExtendedSlotsEmpty) {
        return cn(base, props?.class, props?.className)(config);
      }
      if (compoundVariants && !Array.isArray(compoundVariants)) {
        throw new TypeError(
          `The "compoundVariants" prop must be an array. Received: ${typeof compoundVariants}`
        );
      }
      if (compoundSlots && !Array.isArray(compoundSlots)) {
        throw new TypeError(
          `The "compoundSlots" prop must be an array. Received: ${typeof compoundSlots}`
        );
      }
      const getVariantValue = (variant, vrs = variants, _slotKey = null, slotProps2 = null) => {
        const variantObj = vrs[variant];
        if (!variantObj || isEmptyObject(variantObj)) {
          return null;
        }
        const variantProp = slotProps2?.[variant] ?? props?.[variant];
        if (variantProp === null) return null;
        const variantKey = falsyToString(variantProp);
        if (typeof variantKey === "object") {
          return null;
        }
        const defaultVariantProp = defaultVariants?.[variant];
        const key = variantKey != null ? variantKey : falsyToString(defaultVariantProp);
        const value = variantObj[key || "false"];
        return value;
      };
      const getVariantClassNames = () => {
        if (!variants) return null;
        const keys = Object.keys(variants);
        const result = [];
        for (let i = 0; i < keys.length; i++) {
          const value = getVariantValue(keys[i], variants);
          if (value) result.push(value);
        }
        return result;
      };
      const getVariantClassNamesBySlotKey = (slotKey, slotProps2) => {
        if (!variants || typeof variants !== "object") return null;
        const result = [];
        for (const variant in variants) {
          const variantValue = getVariantValue(variant, variants, slotKey, slotProps2);
          const value = slotKey === "base" && typeof variantValue === "string" ? variantValue : variantValue && variantValue[slotKey];
          if (value) result.push(value);
        }
        return result;
      };
      const propsWithoutUndefined = {};
      for (const prop in props) {
        const value = props[prop];
        if (value !== void 0) propsWithoutUndefined[prop] = value;
      }
      const getCompleteProps = (key, slotProps2) => {
        const initialProp = typeof props?.[key] === "object" ? {
          [key]: props[key]?.initial
        } : {};
        return {
          ...defaultVariants,
          ...propsWithoutUndefined,
          ...initialProp,
          ...slotProps2
        };
      };
      const getCompoundVariantsValue = (cv = [], slotProps2) => {
        const result = [];
        const cvLength = cv.length;
        for (let i = 0; i < cvLength; i++) {
          const { class: tvClass, className: tvClassName, ...compoundVariantOptions } = cv[i];
          let isValid = true;
          const completeProps = getCompleteProps(null, slotProps2);
          for (const key in compoundVariantOptions) {
            const value = compoundVariantOptions[key];
            const completePropsValue = completeProps[key];
            if (Array.isArray(value)) {
              if (!value.includes(completePropsValue)) {
                isValid = false;
                break;
              }
            } else {
              if ((value == null || value === false) && (completePropsValue == null || completePropsValue === false))
                continue;
              if (completePropsValue !== value) {
                isValid = false;
                break;
              }
            }
          }
          if (isValid) {
            if (tvClass) result.push(tvClass);
            if (tvClassName) result.push(tvClassName);
          }
        }
        return result;
      };
      const getCompoundVariantClassNamesBySlot = (slotProps2) => {
        const compoundClassNames = getCompoundVariantsValue(compoundVariants, slotProps2);
        if (!Array.isArray(compoundClassNames)) return compoundClassNames;
        const result = {};
        const cnFn = cn;
        for (let i = 0; i < compoundClassNames.length; i++) {
          const className = compoundClassNames[i];
          if (typeof className === "string") {
            result.base = cnFn(result.base, className)(config);
          } else if (typeof className === "object") {
            for (const slot in className) {
              result[slot] = cnFn(result[slot], className[slot])(config);
            }
          }
        }
        return result;
      };
      const getCompoundSlotClassNameBySlot = (slotProps2) => {
        if (compoundSlots.length < 1) return null;
        const result = {};
        const completeProps = getCompleteProps(null, slotProps2);
        for (let i = 0; i < compoundSlots.length; i++) {
          const {
            slots: slots2 = [],
            class: slotClass,
            className: slotClassName,
            ...slotVariants
          } = compoundSlots[i];
          if (!isEmptyObject(slotVariants)) {
            let isValid = true;
            for (const key in slotVariants) {
              const completePropsValue = completeProps[key];
              const slotVariantValue = slotVariants[key];
              if (completePropsValue === void 0 || (Array.isArray(slotVariantValue) ? !slotVariantValue.includes(completePropsValue) : slotVariantValue !== completePropsValue)) {
                isValid = false;
                break;
              }
            }
            if (!isValid) continue;
          }
          for (let j = 0; j < slots2.length; j++) {
            const slotName = slots2[j];
            if (!result[slotName]) result[slotName] = [];
            result[slotName].push([slotClass, slotClassName]);
          }
        }
        return result;
      };
      if (!isEmptyObject(slotProps) || !isExtendedSlotsEmpty) {
        const slotsFns = {};
        if (typeof slots === "object" && !isEmptyObject(slots)) {
          const cnFn = cn;
          for (const slotKey in slots) {
            slotsFns[slotKey] = (slotProps2) => {
              const compoundVariantClasses = getCompoundVariantClassNamesBySlot(slotProps2);
              const compoundSlotClasses = getCompoundSlotClassNameBySlot(slotProps2);
              return cnFn(
                slots[slotKey],
                getVariantClassNamesBySlotKey(slotKey, slotProps2),
                compoundVariantClasses ? compoundVariantClasses[slotKey] : void 0,
                compoundSlotClasses ? compoundSlotClasses[slotKey] : void 0,
                slotProps2?.class,
                slotProps2?.className
              )(config);
            };
          }
        }
        return slotsFns;
      }
      return cn(
        base,
        getVariantClassNames(),
        getCompoundVariantsValue(compoundVariants),
        props?.class,
        props?.className
      )(config);
    };
    const getVariantKeys = () => {
      if (!variants || typeof variants !== "object") return;
      return Object.keys(variants);
    };
    component.variantKeys = getVariantKeys();
    component.extend = extend;
    component.base = base;
    component.slots = slots;
    component.variants = variants;
    component.defaultVariants = defaultVariants;
    component.compoundSlots = compoundSlots;
    component.compoundVariants = compoundVariants;
    return component;
  };
  const createTV = (configProp) => {
    return (options, config) => tv(options, config ? mergeObjects(configProp, config) : configProp);
  };
  return {
    tv,
    createTV
  };
};

var createTwMerge = (cachedTwMergeConfig) => {
  return isEmptyObject(cachedTwMergeConfig) ? twMerge : extendTailwindMerge({
    ...cachedTwMergeConfig,
    extend: {
      theme: cachedTwMergeConfig.theme,
      classGroups: cachedTwMergeConfig.classGroups,
      conflictingClassGroupModifiers: cachedTwMergeConfig.conflictingClassGroupModifiers,
      conflictingClassGroups: cachedTwMergeConfig.conflictingClassGroups,
      ...cachedTwMergeConfig.extend
    }
  });
};
var executeMerge = (classnames, config) => {
  const base = cx(classnames);
  if (!base || !(config?.twMerge ?? true)) return base;
  if (!state.cachedTwMerge || state.didTwMergeConfigChange) {
    state.didTwMergeConfigChange = false;
    state.cachedTwMerge = createTwMerge(state.cachedTwMergeConfig);
  }
  return state.cachedTwMerge(base) || void 0;
};
var cnMerge = (...classnames) => {
  return (config) => executeMerge(classnames, config);
};

// src/index.js
var { tv } = getTailwindVariants(cnMerge);

// http://www.w3.org/TR/CSS21/grammar.html
// https://github.com/visionmedia/css-parse/pull/49#issuecomment-30088027
var COMMENT_REGEX = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;

var NEWLINE_REGEX = /\n/g;
var WHITESPACE_REGEX = /^\s*/;

// declaration
var PROPERTY_REGEX = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/;
var COLON_REGEX = /^:\s*/;
var VALUE_REGEX = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/;
var SEMICOLON_REGEX = /^[;\s]*/;

// https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Polyfill
var TRIM_REGEX = /^\s+|\s+$/g;

// strings
var NEWLINE = '\n';
var FORWARD_SLASH = '/';
var ASTERISK = '*';
var EMPTY_STRING = '';

// types
var TYPE_COMMENT = 'comment';
var TYPE_DECLARATION = 'declaration';

/**
 * @param {String} style
 * @param {Object} [options]
 * @return {Object[]}
 * @throws {TypeError}
 * @throws {Error}
 */
function index (style, options) {
  if (typeof style !== 'string') {
    throw new TypeError('First argument must be a string');
  }

  if (!style) return [];

  options = options || {};

  /**
   * Positional.
   */
  var lineno = 1;
  var column = 1;

  /**
   * Update lineno and column based on `str`.
   *
   * @param {String} str
   */
  function updatePosition(str) {
    var lines = str.match(NEWLINE_REGEX);
    if (lines) lineno += lines.length;
    var i = str.lastIndexOf(NEWLINE);
    column = ~i ? str.length - i : column + str.length;
  }

  /**
   * Mark position and patch `node.position`.
   *
   * @return {Function}
   */
  function position() {
    var start = { line: lineno, column: column };
    return function (node) {
      node.position = new Position(start);
      whitespace();
      return node;
    };
  }

  /**
   * Store position information for a node.
   *
   * @constructor
   * @property {Object} start
   * @property {Object} end
   * @property {undefined|String} source
   */
  function Position(start) {
    this.start = start;
    this.end = { line: lineno, column: column };
    this.source = options.source;
  }

  /**
   * Non-enumerable source string.
   */
  Position.prototype.content = style;

  /**
   * Error `msg`.
   *
   * @param {String} msg
   * @throws {Error}
   */
  function error(msg) {
    var err = new Error(
      options.source + ':' + lineno + ':' + column + ': ' + msg
    );
    err.reason = msg;
    err.filename = options.source;
    err.line = lineno;
    err.column = column;
    err.source = style;

    if (options.silent) ; else {
      throw err;
    }
  }

  /**
   * Match `re` and return captures.
   *
   * @param {RegExp} re
   * @return {undefined|Array}
   */
  function match(re) {
    var m = re.exec(style);
    if (!m) return;
    var str = m[0];
    updatePosition(str);
    style = style.slice(str.length);
    return m;
  }

  /**
   * Parse whitespace.
   */
  function whitespace() {
    match(WHITESPACE_REGEX);
  }

  /**
   * Parse comments.
   *
   * @param {Object[]} [rules]
   * @return {Object[]}
   */
  function comments(rules) {
    var c;
    rules = rules || [];
    while ((c = comment())) {
      if (c !== false) {
        rules.push(c);
      }
    }
    return rules;
  }

  /**
   * Parse comment.
   *
   * @return {Object}
   * @throws {Error}
   */
  function comment() {
    var pos = position();
    if (FORWARD_SLASH != style.charAt(0) || ASTERISK != style.charAt(1)) return;

    var i = 2;
    while (
      EMPTY_STRING != style.charAt(i) &&
      (ASTERISK != style.charAt(i) || FORWARD_SLASH != style.charAt(i + 1))
    ) {
      ++i;
    }
    i += 2;

    if (EMPTY_STRING === style.charAt(i - 1)) {
      return error('End of comment missing');
    }

    var str = style.slice(2, i - 2);
    column += 2;
    updatePosition(str);
    style = style.slice(i);
    column += 2;

    return pos({
      type: TYPE_COMMENT,
      comment: str
    });
  }

  /**
   * Parse declaration.
   *
   * @return {Object}
   * @throws {Error}
   */
  function declaration() {
    var pos = position();

    // prop
    var prop = match(PROPERTY_REGEX);
    if (!prop) return;
    comment();

    // :
    if (!match(COLON_REGEX)) return error("property missing ':'");

    // val
    var val = match(VALUE_REGEX);

    var ret = pos({
      type: TYPE_DECLARATION,
      property: trim(prop[0].replace(COMMENT_REGEX, EMPTY_STRING)),
      value: val
        ? trim(val[0].replace(COMMENT_REGEX, EMPTY_STRING))
        : EMPTY_STRING
    });

    // ;
    match(SEMICOLON_REGEX);

    return ret;
  }

  /**
   * Parse declarations.
   *
   * @return {Object[]}
   */
  function declarations() {
    var decls = [];

    comments(decls);

    // declarations
    var decl;
    while ((decl = declaration())) {
      if (decl !== false) {
        decls.push(decl);
        comments(decls);
      }
    }

    return decls;
  }

  whitespace();
  return declarations();
}

/**
 * Trim `str`.
 *
 * @param {String} str
 * @return {String}
 */
function trim(str) {
  return str ? str.replace(TRIM_REGEX, EMPTY_STRING) : EMPTY_STRING;
}

/**
 * Parses inline style to object.
 *
 * @param style - Inline style.
 * @param iterator - Iterator.
 * @returns - Style object or null.
 *
 * @example Parsing inline style to object:
 *
 * ```js
 * import parse from 'style-to-object';
 * parse('line-height: 42;'); // { 'line-height': '42' }
 * ```
 */
function StyleToObject(style, iterator) {
    let styleObject = null;
    if (!style || typeof style !== 'string') {
        return styleObject;
    }
    const declarations = index(style);
    const hasIterator = typeof iterator === 'function';
    declarations.forEach((declaration) => {
        if (declaration.type !== 'declaration') {
            return;
        }
        const { property, value } = declaration;
        if (hasIterator) {
            iterator(property, value, declaration);
        }
        else if (value) {
            styleObject = styleObject || {};
            styleObject[property] = value;
        }
    });
    return styleObject;
}

/*!
* tabbable 6.4.0
* @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
*/
// NOTE: separate `:not()` selectors has broader browser support than the newer
//  `:not([inert], [inert] *)` (Feb 2023)
var candidateSelectors = ['input:not([inert]):not([inert] *)', 'select:not([inert]):not([inert] *)', 'textarea:not([inert]):not([inert] *)', 'a[href]:not([inert]):not([inert] *)', 'button:not([inert]):not([inert] *)', '[tabindex]:not(slot):not([inert]):not([inert] *)', 'audio[controls]:not([inert]):not([inert] *)', 'video[controls]:not([inert]):not([inert] *)', '[contenteditable]:not([contenteditable="false"]):not([inert]):not([inert] *)', 'details>summary:first-of-type:not([inert]):not([inert] *)', 'details:not([inert]):not([inert] *)'];
var candidateSelector = /* #__PURE__ */candidateSelectors.join(',');
var NoElement = typeof Element === 'undefined';
var matches = NoElement ? function () {} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
var getRootNode = !NoElement && Element.prototype.getRootNode ? function (element) {
  var _element$getRootNode;
  return element === null || element === void 0 ? void 0 : (_element$getRootNode = element.getRootNode) === null || _element$getRootNode === void 0 ? void 0 : _element$getRootNode.call(element);
} : function (element) {
  return element === null || element === void 0 ? void 0 : element.ownerDocument;
};

/**
 * Determines if a node's content is editable.
 * @param {Element} [node]
 * @returns True if it's content-editable; false if it's not or `node` is falsy.
 */
var isContentEditable = function isContentEditable(node) {
  var _node$getAttribute2;
  // CAREFUL: JSDom does not support the `HTMLElement.isContentEditable` API so we have
  //  to use the attribute directly to check for this, which can either be empty or 'true';
  //  if it's `null` (not specified) or 'false', it's a non-editable element
  var attValue = node === null || node === void 0 ? void 0 : (_node$getAttribute2 = node.getAttribute) === null || _node$getAttribute2 === void 0 ? void 0 : _node$getAttribute2.call(node, 'contenteditable');
  return attValue === '' || attValue === 'true';
};

/**
 * @private
 * Determines if the node has an explicitly specified `tabindex` attribute.
 * @param {HTMLElement} node
 * @returns {boolean} True if so; false if not.
 */
var hasTabIndex = function hasTabIndex(node) {
  return !isNaN(parseInt(node.getAttribute('tabindex'), 10));
};

/**
 * Determine the tab index of a given node.
 * @param {HTMLElement} node
 * @returns {number} Tab order (negative, 0, or positive number).
 * @throws {Error} If `node` is falsy.
 */
var getTabIndex = function getTabIndex(node) {
  if (!node) {
    throw new Error('No node provided');
  }
  if (node.tabIndex < 0) {
    // in Chrome, <details/>, <audio controls/> and <video controls/> elements get a default
    // `tabIndex` of -1 when the 'tabindex' attribute isn't specified in the DOM,
    // yet they are still part of the regular tab order; in FF, they get a default
    // `tabIndex` of 0; since Chrome still puts those elements in the regular tab
    // order, consider their tab index to be 0.
    // Also browsers do not return `tabIndex` correctly for contentEditable nodes;
    // so if they don't have a tabindex attribute specifically set, assume it's 0.
    if ((/^(AUDIO|VIDEO|DETAILS)$/.test(node.tagName) || isContentEditable(node)) && !hasTabIndex(node)) {
      return 0;
    }
  }
  return node.tabIndex;
};
var isInput$1 = function isInput(node) {
  return node.tagName === 'INPUT';
};
var isHiddenInput = function isHiddenInput(node) {
  return isInput$1(node) && node.type === 'hidden';
};
var isDetailsWithSummary = function isDetailsWithSummary(node) {
  var r = node.tagName === 'DETAILS' && Array.prototype.slice.apply(node.children).some(function (child) {
    return child.tagName === 'SUMMARY';
  });
  return r;
};
var getCheckedRadio = function getCheckedRadio(nodes, form) {
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].checked && nodes[i].form === form) {
      return nodes[i];
    }
  }
};
var isTabbableRadio = function isTabbableRadio(node) {
  if (!node.name) {
    return true;
  }
  var radioScope = node.form || getRootNode(node);
  var queryRadios = function queryRadios(name) {
    return radioScope.querySelectorAll('input[type="radio"][name="' + name + '"]');
  };
  var radioSet;
  if (typeof window !== 'undefined' && typeof window.CSS !== 'undefined' && typeof window.CSS.escape === 'function') {
    radioSet = queryRadios(window.CSS.escape(node.name));
  } else {
    try {
      radioSet = queryRadios(node.name);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s', err.message);
      return false;
    }
  }
  var checked = getCheckedRadio(radioSet, node.form);
  return !checked || checked === node;
};
var isRadio = function isRadio(node) {
  return isInput$1(node) && node.type === 'radio';
};
var isNonTabbableRadio = function isNonTabbableRadio(node) {
  return isRadio(node) && !isTabbableRadio(node);
};

// determines if a node is ultimately attached to the window's document
var isNodeAttached = function isNodeAttached(node) {
  var _nodeRoot;
  // The root node is the shadow root if the node is in a shadow DOM; some document otherwise
  //  (but NOT _the_ document; see second 'If' comment below for more).
  // If rootNode is shadow root, it'll have a host, which is the element to which the shadow
  //  is attached, and the one we need to check if it's in the document or not (because the
  //  shadow, and all nodes it contains, is never considered in the document since shadows
  //  behave like self-contained DOMs; but if the shadow's HOST, which is part of the document,
  //  is hidden, or is not in the document itself but is detached, it will affect the shadow's
  //  visibility, including all the nodes it contains). The host could be any normal node,
  //  or a custom element (i.e. web component). Either way, that's the one that is considered
  //  part of the document, not the shadow root, nor any of its children (i.e. the node being
  //  tested).
  // To further complicate things, we have to look all the way up until we find a shadow HOST
  //  that is attached (or find none) because the node might be in nested shadows...
  // If rootNode is not a shadow root, it won't have a host, and so rootNode should be the
  //  document (per the docs) and while it's a Document-type object, that document does not
  //  appear to be the same as the node's `ownerDocument` for some reason, so it's safer
  //  to ignore the rootNode at this point, and use `node.ownerDocument`. Otherwise,
  //  using `rootNode.contains(node)` will _always_ be true we'll get false-positives when
  //  node is actually detached.
  // NOTE: If `nodeRootHost` or `node` happens to be the `document` itself (which is possible
  //  if a tabbable/focusable node was quickly added to the DOM, focused, and then removed
  //  from the DOM as in https://github.com/focus-trap/focus-trap-react/issues/905), then
  //  `ownerDocument` will be `null`, hence the optional chaining on it.
  var nodeRoot = node && getRootNode(node);
  var nodeRootHost = (_nodeRoot = nodeRoot) === null || _nodeRoot === void 0 ? void 0 : _nodeRoot.host;

  // in some cases, a detached node will return itself as the root instead of a document or
  //  shadow root object, in which case, we shouldn't try to look further up the host chain
  var attached = false;
  if (nodeRoot && nodeRoot !== node) {
    var _nodeRootHost, _nodeRootHost$ownerDo, _node$ownerDocument;
    attached = !!((_nodeRootHost = nodeRootHost) !== null && _nodeRootHost !== void 0 && (_nodeRootHost$ownerDo = _nodeRootHost.ownerDocument) !== null && _nodeRootHost$ownerDo !== void 0 && _nodeRootHost$ownerDo.contains(nodeRootHost) || node !== null && node !== void 0 && (_node$ownerDocument = node.ownerDocument) !== null && _node$ownerDocument !== void 0 && _node$ownerDocument.contains(node));
    while (!attached && nodeRootHost) {
      var _nodeRoot2, _nodeRootHost2, _nodeRootHost2$ownerD;
      // since it's not attached and we have a root host, the node MUST be in a nested shadow DOM,
      //  which means we need to get the host's host and check if that parent host is contained
      //  in (i.e. attached to) the document
      nodeRoot = getRootNode(nodeRootHost);
      nodeRootHost = (_nodeRoot2 = nodeRoot) === null || _nodeRoot2 === void 0 ? void 0 : _nodeRoot2.host;
      attached = !!((_nodeRootHost2 = nodeRootHost) !== null && _nodeRootHost2 !== void 0 && (_nodeRootHost2$ownerD = _nodeRootHost2.ownerDocument) !== null && _nodeRootHost2$ownerD !== void 0 && _nodeRootHost2$ownerD.contains(nodeRootHost));
    }
  }
  return attached;
};
var isZeroArea = function isZeroArea(node) {
  var _node$getBoundingClie = node.getBoundingClientRect(),
    width = _node$getBoundingClie.width,
    height = _node$getBoundingClie.height;
  return width === 0 && height === 0;
};
var isHidden = function isHidden(node, _ref) {
  var displayCheck = _ref.displayCheck,
    getShadowRoot = _ref.getShadowRoot;
  if (displayCheck === 'full-native') {
    if ('checkVisibility' in node) {
      // Chrome >= 105, Edge >= 105, Firefox >= 106, Safari >= 17.4
      // @see https://developer.mozilla.org/en-US/docs/Web/API/Element/checkVisibility#browser_compatibility
      var visible = node.checkVisibility({
        // Checking opacity might be desirable for some use cases, but natively,
        // opacity zero elements _are_ focusable and tabbable.
        checkOpacity: false,
        opacityProperty: false,
        contentVisibilityAuto: true,
        visibilityProperty: true,
        // This is an alias for `visibilityProperty`. Contemporary browsers
        // support both. However, this alias has wider browser support (Chrome
        // >= 105 and Firefox >= 106, vs. Chrome >= 121 and Firefox >= 122), so
        // we include it anyway.
        checkVisibilityCSS: true
      });
      return !visible;
    }
    // Fall through to manual visibility checks
  }

  // NOTE: visibility will be `undefined` if node is detached from the document
  //  (see notes about this further down), which means we will consider it visible
  //  (this is legacy behavior from a very long way back)
  // NOTE: we check this regardless of `displayCheck="none"` because this is a
  //  _visibility_ check, not a _display_ check
  if (getComputedStyle(node).visibility === 'hidden') {
    return true;
  }
  var isDirectSummary = matches.call(node, 'details>summary:first-of-type');
  var nodeUnderDetails = isDirectSummary ? node.parentElement : node;
  if (matches.call(nodeUnderDetails, 'details:not([open]) *')) {
    return true;
  }
  if (!displayCheck || displayCheck === 'full' ||
  // full-native can run this branch when it falls through in case
  // Element#checkVisibility is unsupported
  displayCheck === 'full-native' || displayCheck === 'legacy-full') {
    if (typeof getShadowRoot === 'function') {
      // figure out if we should consider the node to be in an undisclosed shadow and use the
      //  'non-zero-area' fallback
      var originalNode = node;
      while (node) {
        var parentElement = node.parentElement;
        var rootNode = getRootNode(node);
        if (parentElement && !parentElement.shadowRoot && getShadowRoot(parentElement) === true // check if there's an undisclosed shadow
        ) {
          // node has an undisclosed shadow which means we can only treat it as a black box, so we
          //  fall back to a non-zero-area test
          return isZeroArea(node);
        } else if (node.assignedSlot) {
          // iterate up slot
          node = node.assignedSlot;
        } else if (!parentElement && rootNode !== node.ownerDocument) {
          // cross shadow boundary
          node = rootNode.host;
        } else {
          // iterate up normal dom
          node = parentElement;
        }
      }
      node = originalNode;
    }
    // else, `getShadowRoot` might be true, but all that does is enable shadow DOM support
    //  (i.e. it does not also presume that all nodes might have undisclosed shadows); or
    //  it might be a falsy value, which means shadow DOM support is disabled

    // Since we didn't find it sitting in an undisclosed shadow (or shadows are disabled)
    //  now we can just test to see if it would normally be visible or not, provided it's
    //  attached to the main document.
    // NOTE: We must consider case where node is inside a shadow DOM and given directly to
    //  `isTabbable()` or `isFocusable()` -- regardless of `getShadowRoot` option setting.

    if (isNodeAttached(node)) {
      // this works wherever the node is: if there's at least one client rect, it's
      //  somehow displayed; it also covers the CSS 'display: contents' case where the
      //  node itself is hidden in place of its contents; and there's no need to search
      //  up the hierarchy either
      return !node.getClientRects().length;
    }

    // Else, the node isn't attached to the document, which means the `getClientRects()`
    //  API will __always__ return zero rects (this can happen, for example, if React
    //  is used to render nodes onto a detached tree, as confirmed in this thread:
    //  https://github.com/facebook/react/issues/9117#issuecomment-284228870)
    //
    // It also means that even window.getComputedStyle(node).display will return `undefined`
    //  because styles are only computed for nodes that are in the document.
    //
    // NOTE: THIS HAS BEEN THE CASE FOR YEARS. It is not new, nor is it caused by tabbable
    //  somehow. Though it was never stated officially, anyone who has ever used tabbable
    //  APIs on nodes in detached containers has actually implicitly used tabbable in what
    //  was later (as of v5.2.0 on Apr 9, 2021) called `displayCheck="none"` mode -- essentially
    //  considering __everything__ to be visible because of the innability to determine styles.
    //
    // v6.0.0: As of this major release, the default 'full' option __no longer treats detached
    //  nodes as visible with the 'none' fallback.__
    if (displayCheck !== 'legacy-full') {
      return true; // hidden
    }
    // else, fallback to 'none' mode and consider the node visible
  } else if (displayCheck === 'non-zero-area') {
    // NOTE: Even though this tests that the node's client rect is non-zero to determine
    //  whether it's displayed, and that a detached node will __always__ have a zero-area
    //  client rect, we don't special-case for whether the node is attached or not. In
    //  this mode, we do want to consider nodes that have a zero area to be hidden at all
    //  times, and that includes attached or not.
    return isZeroArea(node);
  }

  // visible, as far as we can tell, or per current `displayCheck=none` mode, we assume
  //  it's visible
  return false;
};

// form fields (nested) inside a disabled fieldset are not focusable/tabbable
//  unless they are in the _first_ <legend> element of the top-most disabled
//  fieldset
var isDisabledFromFieldset = function isDisabledFromFieldset(node) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(node.tagName)) {
    var parentNode = node.parentElement;
    // check if `node` is contained in a disabled <fieldset>
    while (parentNode) {
      if (parentNode.tagName === 'FIELDSET' && parentNode.disabled) {
        // look for the first <legend> among the children of the disabled <fieldset>
        for (var i = 0; i < parentNode.children.length; i++) {
          var child = parentNode.children.item(i);
          // when the first <legend> (in document order) is found
          if (child.tagName === 'LEGEND') {
            // if its parent <fieldset> is not nested in another disabled <fieldset>,
            // return whether `node` is a descendant of its first <legend>
            return matches.call(parentNode, 'fieldset[disabled] *') ? true : !child.contains(node);
          }
        }
        // the disabled <fieldset> containing `node` has no <legend>
        return true;
      }
      parentNode = parentNode.parentElement;
    }
  }

  // else, node's tabbable/focusable state should not be affected by a fieldset's
  //  enabled/disabled state
  return false;
};
var isNodeMatchingSelectorFocusable = function isNodeMatchingSelectorFocusable(options, node) {
  if (node.disabled || isHiddenInput(node) || isHidden(node, options) ||
  // For a details element with a summary, the summary element gets the focus
  isDetailsWithSummary(node) || isDisabledFromFieldset(node)) {
    return false;
  }
  return true;
};
var isNodeMatchingSelectorTabbable = function isNodeMatchingSelectorTabbable(options, node) {
  if (isNonTabbableRadio(node) || getTabIndex(node) < 0 || !isNodeMatchingSelectorFocusable(options, node)) {
    return false;
  }
  return true;
};
var isTabbable = function isTabbable(node, options) {
  options = options || {};
  if (!node) {
    throw new Error('No node provided');
  }
  if (matches.call(node, candidateSelector) === false) {
    return false;
  }
  return isNodeMatchingSelectorTabbable(options, node);
};

//#region ../../packages/ui/src/utils.ts
function cn$1(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
//#region ../../packages/ui/src/components/button/button.svelte
Button[FILENAME] = "/home/runner/workspace/packages/ui/src/components/button/button.svelte";
var buttonVariants = tv({
	base: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-md border border-transparent bg-clip-padding text-sm font-medium focus-visible:ring-3 active:not-aria-[haspopup]:translate-y-px aria-invalid:ring-3 [&_svg:not([class*='size-'])]:size-4 group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/80",
			outline: "border-border bg-background hover:bg-muted hover:text-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 aria-expanded:bg-muted aria-expanded:text-foreground shadow-xs",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
			ghost: "hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 aria-expanded:bg-muted aria-expanded:text-foreground",
			destructive: "bg-destructive/10 hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/20 text-destructive focus-visible:border-destructive/40 dark:hover:bg-destructive/30",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 gap-1.5 px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
			xs: "h-6 gap-1 rounded-[min(var(--radius-md),8px)] px-2 text-xs in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
			sm: "h-8 gap-1 rounded-[min(var(--radius-md),10px)] px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
			lg: "h-10 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
			icon: "size-9",
			"icon-xs": "size-6 rounded-[min(var(--radius-md),8px)] in-data-[slot=button-group]:rounded-md [&_svg:not([class*='size-'])]:size-3",
			"icon-sm": "size-8 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-md",
			"icon-lg": "size-10"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { class: className, variant = "default", size = "default", ref = null, href = void 0, type = "button", disabled, children, $$slots, $$events, ...restProps } = $$props;
		if (href) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<a${attributes({
				"data-slot": "button",
				class: clsx$1(cn$1(buttonVariants({
					variant,
					size
				}), className)),
				href: disabled ? void 0 : href,
				"aria-disabled": disabled,
				role: disabled ? "link" : void 0,
				tabindex: disabled ? -1 : void 0,
				...restProps
			})}>`);
			push_element($$renderer, "a", 54, 2);
			children?.($$renderer);
			$$renderer.push(`<!----></a>`);
			pop_element();
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<button${attributes({
				"data-slot": "button",
				class: clsx$1(cn$1(buttonVariants({
					variant,
					size
				}), className)),
				type,
				disabled,
				...restProps
			})}>`);
			push_element($$renderer, "button", 67, 2);
			children?.($$renderer);
			$$renderer.push(`<!----></button>`);
			pop_element();
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	}, Button);
}
Button.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../packages/ui/src/components/input/input.svelte
Input[FILENAME] = "/home/runner/workspace/packages/ui/src/components/input/input.svelte";
function Input($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, value = void 0, type, files = void 0, error = false, class: className, "data-slot": dataSlot = "input", $$slots, $$events, ...restProps } = $$props;
		if (type === "file") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<input${attributes({
				"data-slot": dataSlot,
				"aria-invalid": error || void 0,
				class: clsx$1(cn$1("cn-input file:text-foreground placeholder:text-muted-foreground w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50", className)),
				type: "file",
				...restProps
			}, void 0, void 0, void 0, 4)}/>`);
			push_element($$renderer, "input", 25, 2);
			pop_element();
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<input${attributes({
				"data-slot": dataSlot,
				"aria-invalid": error || void 0,
				class: clsx$1(cn$1("cn-input file:text-foreground placeholder:text-muted-foreground w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50", className)),
				type,
				value,
				...restProps
			}, void 0, void 0, void 0, 4)}/>`);
			push_element($$renderer, "input", 39, 2);
			pop_element();
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, {
			ref,
			value,
			files
		});
	}, Input);
}
Input.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../packages/ui/src/components/input-group/input-group.svelte
Input_group[FILENAME] = "/home/runner/workspace/packages/ui/src/components/input-group/input-group.svelte";
function Input_group($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, value = "", placeholder, wrapperClass, class: className, children, leftSection, rightSection, $$slots, $$events, ...props } = $$props;
		const hasSections = derived(() => leftSection !== void 0 || rightSection !== void 0 || placeholder !== void 0);
		$$renderer.push(`<div${attr_class(clsx$1(cn$1("", wrapperClass)))}>`);
		push_element($$renderer, "div", 27, 0);
		$$renderer.push(`<div${attributes({
			"data-slot": "input-group",
			role: "group",
			class: clsx$1(cn$1("group/input-group border-input dark:bg-input/30 has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 relative flex w-full min-w-0 items-center rounded-md border shadow-xs transition-[color,box-shadow] outline-none", className)),
			...props
		})}>`);
		push_element($$renderer, "div", 28, 2);
		if (hasSections()) {
			$$renderer.push("<!--[0-->");
			if (leftSection) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span class="pointer-events-none flex items-center pl-2.5 text-muted-foreground">`);
				push_element($$renderer, "span", 40, 8);
				leftSection($$renderer);
				$$renderer.push(`<!----></span>`);
				pop_element();
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <input data-slot="input-group-control"${attr("value", value)}${attr("placeholder", placeholder)} class="flex-1 min-w-0 bg-transparent px-2.5 py-1.5 text-sm outline-none placeholder:text-muted-foreground"/>`);
			push_element($$renderer, "input", 44, 6);
			pop_element();
			$$renderer.push(` `);
			if (rightSection) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span class="flex items-center pr-2.5 text-muted-foreground">`);
				push_element($$renderer, "span", 51, 8);
				rightSection($$renderer);
				$$renderer.push(`<!----></span>`);
				pop_element();
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		} else {
			$$renderer.push("<!--[-1-->");
			children?.($$renderer);
			$$renderer.push(`<!---->`);
		}
		$$renderer.push(`<!--]--></div>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		bind_props($$props, {
			ref,
			value
		});
	}, Input_group);
}
Input_group.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
tv({
	base: "text-muted-foreground h-auto gap-2 py-1.5 text-sm font-medium group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4 flex cursor-text items-center justify-center select-none",
	variants: { align: {
		"inline-start": "pl-2 has-[>button]:-ml-1 has-[>kbd]:ml-[-0.15rem] order-first",
		"inline-end": "pr-2 has-[>button]:-mr-1 has-[>kbd]:mr-[-0.15rem] order-last",
		"block-start": "px-2.5 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2 order-first w-full justify-start",
		"block-end": "px-2.5 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2 order-last w-full justify-start"
	} },
	defaultVariants: { align: "inline-start" }
});
tv({
	base: "gap-2 text-sm flex items-center shadow-none",
	variants: { size: {
		xs: "h-6 gap-1 rounded-[calc(var(--radius)-5px)] px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
		sm: "dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 h-9 rounded-md border bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] file:h-7 file:text-sm file:font-medium focus-visible:ring-3 aria-invalid:ring-3 md:text-sm-group-button-size-sm",
		"icon-xs": "size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0",
		"icon-sm": "size-8 p-0 has-[>svg]:p-0"
	} },
	defaultVariants: { size: "xs" }
});
//#endregion
//#region ../../node_modules/.pnpm/svelte-toolbelt@0.7.1_svelte@5.56.0/node_modules/svelte-toolbelt/dist/utils/is.js
function isFunction(value) {
	return typeof value === "function";
}
function isObject(value) {
	return value !== null && typeof value === "object";
}
var CLASS_VALUE_PRIMITIVE_TYPES = [
	"string",
	"number",
	"bigint",
	"boolean"
];
function isClassValue(value) {
	if (value === null || value === void 0) return true;
	if (CLASS_VALUE_PRIMITIVE_TYPES.includes(typeof value)) return true;
	if (Array.isArray(value)) return value.every((item) => isClassValue(item));
	if (typeof value === "object") {
		if (Object.getPrototypeOf(value) !== Object.prototype) return false;
		return true;
	}
	return false;
}
//#endregion
//#region ../../node_modules/.pnpm/svelte-toolbelt@0.7.1_svelte@5.56.0/node_modules/svelte-toolbelt/dist/box/box.svelte.js
var BoxSymbol = Symbol("box");
var isWritableSymbol = Symbol("is-writable");
function isBox(value) {
	return isObject(value) && BoxSymbol in value;
}
/**
* @returns Whether the value is a WritableBox
*
* @see {@link https://runed.dev/docs/functions/box}
*/
function isWritableBox(value) {
	return box.isBox(value) && isWritableSymbol in value;
}
function box(initialValue) {
	let current = initialValue;
	return {
		[BoxSymbol]: true,
		[isWritableSymbol]: true,
		get current() {
			return current;
		},
		set current(v) {
			current = v;
		}
	};
}
function boxWith(getter, setter) {
	const derived$1 = derived(getter);
	if (setter) return {
		[BoxSymbol]: true,
		[isWritableSymbol]: true,
		get current() {
			return derived$1();
		},
		set current(v) {
			setter(v);
		}
	};
	return {
		[BoxSymbol]: true,
		get current() {
			return getter();
		}
	};
}
function boxFrom(value) {
	if (box.isBox(value)) return value;
	if (isFunction(value)) return box.with(value);
	return box(value);
}
/**
* Function that gets an object of boxes, and returns an object of reactive values
*
* @example
* const count = box(0)
* const flat = box.flatten({ count, double: box.with(() => count.current) })
* // type of flat is { count: number, readonly double: number }
*
* @see {@link https://runed.dev/docs/functions/box}
*/
function boxFlatten(boxes) {
	return Object.entries(boxes).reduce((acc, [key, b]) => {
		if (!box.isBox(b)) return Object.assign(acc, { [key]: b });
		if (box.isWritableBox(b)) Object.defineProperty(acc, key, {
			get() {
				return b.current;
			},
			set(v) {
				b.current = v;
			}
		});
		else Object.defineProperty(acc, key, { get() {
			return b.current;
		} });
		return acc;
	}, {});
}
/**
* Function that converts a box to a readonly box.
*
* @example
* const count = box(0) // WritableBox<number>
* const countReadonly = box.readonly(count) // ReadableBox<number>
*
* @see {@link https://runed.dev/docs/functions/box}
*/
function toReadonlyBox(b) {
	if (!box.isWritableBox(b)) return b;
	return {
		[BoxSymbol]: true,
		get current() {
			return b.current;
		}
	};
}
box.from = boxFrom;
box.with = boxWith;
box.flatten = boxFlatten;
box.readonly = toReadonlyBox;
box.isBox = isBox;
box.isWritableBox = isWritableBox;
//#endregion
//#region ../../node_modules/.pnpm/svelte-toolbelt@0.7.1_svelte@5.56.0/node_modules/svelte-toolbelt/dist/utils/compose-handlers.js
/**
* Composes event handlers into a single function that can be called with an event.
* If the previous handler cancels the event using `event.preventDefault()`, the handlers
* that follow will not be called.
*/
function composeHandlers(...handlers) {
	return function(e) {
		for (const handler of handlers) {
			if (!handler) continue;
			if (e.defaultPrevented) return;
			if (typeof handler === "function") handler.call(this, e);
			else handler.current?.call(this, e);
		}
	};
}
//#endregion
//#region ../../node_modules/.pnpm/svelte-toolbelt@0.7.1_svelte@5.56.0/node_modules/svelte-toolbelt/dist/utils/strings.js
var NUMBER_CHAR_RE = /\d/;
var STR_SPLITTERS = [
	"-",
	"_",
	"/",
	"."
];
function isUppercase(char = "") {
	if (NUMBER_CHAR_RE.test(char)) return void 0;
	return char !== char.toLowerCase();
}
function splitByCase(str) {
	const parts = [];
	let buff = "";
	let previousUpper;
	let previousSplitter;
	for (const char of str) {
		const isSplitter = STR_SPLITTERS.includes(char);
		if (isSplitter === true) {
			parts.push(buff);
			buff = "";
			previousUpper = void 0;
			continue;
		}
		const isUpper = isUppercase(char);
		if (previousSplitter === false) {
			if (previousUpper === false && isUpper === true) {
				parts.push(buff);
				buff = char;
				previousUpper = isUpper;
				continue;
			}
			if (previousUpper === true && isUpper === false && buff.length > 1) {
				const lastChar = buff.at(-1);
				parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
				buff = lastChar + char;
				previousUpper = isUpper;
				continue;
			}
		}
		buff += char;
		previousUpper = isUpper;
		previousSplitter = isSplitter;
	}
	parts.push(buff);
	return parts;
}
function pascalCase(str) {
	if (!str) return "";
	return splitByCase(str).map((p) => upperFirst(p)).join("");
}
function camelCase(str) {
	return lowerFirst(pascalCase(str || ""));
}
function upperFirst(str) {
	return str ? str[0].toUpperCase() + str.slice(1) : "";
}
function lowerFirst(str) {
	return str ? str[0].toLowerCase() + str.slice(1) : "";
}
//#endregion
//#region ../../node_modules/.pnpm/svelte-toolbelt@0.7.1_svelte@5.56.0/node_modules/svelte-toolbelt/dist/utils/css-to-style-obj.js
function cssToStyleObj(css) {
	if (!css) return {};
	const styleObj = {};
	function iterator(name, value) {
		if (name.startsWith("-moz-") || name.startsWith("-webkit-") || name.startsWith("-ms-") || name.startsWith("-o-")) {
			styleObj[pascalCase(name)] = value;
			return;
		}
		if (name.startsWith("--")) {
			styleObj[name] = value;
			return;
		}
		styleObj[camelCase(name)] = value;
	}
	StyleToObject(css, iterator);
	return styleObj;
}
//#endregion
//#region ../../node_modules/.pnpm/svelte-toolbelt@0.7.1_svelte@5.56.0/node_modules/svelte-toolbelt/dist/utils/execute-callbacks.js
/**
* Executes an array of callback functions with the same arguments.
* @template T The types of the arguments that the callback functions take.
* @param callbacks array of callback functions to execute.
* @returns A new function that executes all of the original callback functions with the same arguments.
*/
function executeCallbacks(...callbacks) {
	return (...args) => {
		for (const callback of callbacks) if (typeof callback === "function") callback(...args);
	};
}
//#endregion
//#region ../../node_modules/.pnpm/svelte-toolbelt@0.7.1_svelte@5.56.0/node_modules/svelte-toolbelt/dist/utils/style-to-css.js
function createParser(matcher, replacer) {
	const regex = RegExp(matcher, "g");
	return (str) => {
		if (typeof str !== "string") throw new TypeError(`expected an argument of type string, but got ${typeof str}`);
		if (!str.match(regex)) return str;
		return str.replace(regex, replacer);
	};
}
var camelToKebab = createParser(/[A-Z]/, (match) => `-${match.toLowerCase()}`);
function styleToCSS(styleObj) {
	if (!styleObj || typeof styleObj !== "object" || Array.isArray(styleObj)) throw new TypeError(`expected an argument of type object, but got ${typeof styleObj}`);
	return Object.keys(styleObj).map((property) => `${camelToKebab(property)}: ${styleObj[property]};`).join("\n");
}
//#endregion
//#region ../../node_modules/.pnpm/svelte-toolbelt@0.7.1_svelte@5.56.0/node_modules/svelte-toolbelt/dist/utils/style.js
function styleToString(style = {}) {
	return styleToCSS(style).replace("\n", " ");
}
var srOnlyStylesString = styleToString({
	position: "absolute",
	width: "1px",
	height: "1px",
	padding: "0",
	margin: "-1px",
	overflow: "hidden",
	clip: "rect(0, 0, 0, 0)",
	whiteSpace: "nowrap",
	borderWidth: "0",
	transform: "translateX(-100%)"
});
//#endregion
//#region ../../node_modules/.pnpm/svelte-toolbelt@0.7.1_svelte@5.56.0/node_modules/svelte-toolbelt/dist/utils/merge-props.js
/**
* Modified from https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/utils/src/mergeProps.ts (see NOTICE.txt for source)
*/
function isEventHandler(key) {
	return key.length > 2 && key.startsWith("on") && key[2] === key[2]?.toLowerCase();
}
/**
* Given a list of prop objects, merges them into a single object.
* - Automatically composes event handlers (e.g. `onclick`, `oninput`, etc.)
* - Chains regular functions with the same name so they are called in order
* - Merges class strings with `clsx`
* - Merges style objects and converts them to strings
* - Handles a bug with Svelte where setting the `hidden` attribute to `false` doesn't remove it
* - Overrides other values with the last one
*/
function mergeProps(...args) {
	const result = { ...args[0] };
	for (let i = 1; i < args.length; i++) {
		const props = args[i];
		for (const key in props) {
			const a = result[key];
			const b = props[key];
			const aIsFunction = typeof a === "function";
			const bIsFunction = typeof b === "function";
			if (aIsFunction && typeof bIsFunction && isEventHandler(key)) result[key] = composeHandlers(a, b);
			else if (aIsFunction && bIsFunction) result[key] = executeCallbacks(a, b);
			else if (key === "class") {
				const aIsClassValue = isClassValue(a);
				const bIsClassValue = isClassValue(b);
				if (aIsClassValue && bIsClassValue) result[key] = clsx(a, b);
				else if (aIsClassValue) result[key] = clsx(a);
				else if (bIsClassValue) result[key] = clsx(b);
			} else if (key === "style") {
				const aIsObject = typeof a === "object";
				const bIsObject = typeof b === "object";
				const aIsString = typeof a === "string";
				const bIsString = typeof b === "string";
				if (aIsObject && bIsObject) result[key] = {
					...a,
					...b
				};
				else if (aIsObject && bIsString) {
					const parsedStyle = cssToStyleObj(b);
					result[key] = {
						...a,
						...parsedStyle
					};
				} else if (aIsString && bIsObject) result[key] = {
					...cssToStyleObj(a),
					...b
				};
				else if (aIsString && bIsString) {
					const parsedStyleA = cssToStyleObj(a);
					const parsedStyleB = cssToStyleObj(b);
					result[key] = {
						...parsedStyleA,
						...parsedStyleB
					};
				} else if (aIsObject) result[key] = a;
				else if (bIsObject) result[key] = b;
				else if (aIsString) result[key] = a;
				else if (bIsString) result[key] = b;
			} else result[key] = b !== void 0 ? b : a;
		}
	}
	if (typeof result.style === "object") result.style = styleToString(result.style).replaceAll("\n", " ");
	if (result.hidden !== true) {
		result.hidden = void 0;
		delete result.hidden;
	}
	if (result.disabled !== true) {
		result.disabled = void 0;
		delete result.disabled;
	}
	return result;
}
//#endregion
//#region ../../node_modules/.pnpm/runed@0.23.4_svelte@5.56.0/node_modules/runed/dist/internal/configurable-globals.js
var defaultWindow$2 = void 0;
//#endregion
//#region ../../node_modules/.pnpm/runed@0.23.4_svelte@5.56.0/node_modules/runed/dist/internal/utils/dom.js
/**
* Handles getting the active element in a document or shadow root.
* If the active element is within a shadow root, it will traverse the shadow root
* to find the active element.
* If not, it will return the active element in the document.
*
* @param document A document or shadow root to get the active element from.
* @returns The active element in the document or shadow root.
*/
function getActiveElement$2(document) {
	let activeElement = document.activeElement;
	while (activeElement?.shadowRoot) {
		const node = activeElement.shadowRoot.activeElement;
		if (node === activeElement) break;
		else activeElement = node;
	}
	return activeElement;
}
//#endregion
//#region ../../node_modules/.pnpm/runed@0.23.4_svelte@5.56.0/node_modules/runed/dist/utilities/active-element/active-element.svelte.js
var ActiveElement$2 = class {
	#document;
	#subscribe;
	constructor(options = {}) {
		const { window = defaultWindow$2, document = window?.document } = options;
		if (window === void 0) return;
		this.#document = document;
		this.#subscribe = createSubscriber();
	}
	get current() {
		this.#subscribe?.();
		if (!this.#document) return null;
		return getActiveElement$2(this.#document);
	}
};
new ActiveElement$2();
//#endregion
//#region ../../node_modules/.pnpm/runed@0.23.4_svelte@5.56.0/node_modules/runed/dist/utilities/watch/watch.svelte.js
function runWatcher$2(sources, flush, effect, options = {}) {
	const { lazy = false } = options;
}
function watch$2(sources, effect, options) {
	runWatcher$2(sources, "post", effect, options);
}
function watchPre$2(sources, effect, options) {
	runWatcher$2(sources, "pre", effect, options);
}
watch$2.pre = watchPre$2;
//#endregion
//#region ../../node_modules/.pnpm/runed@0.23.4_svelte@5.56.0/node_modules/runed/dist/utilities/element-size/element-size.svelte.js
var ElementSize = class {
	#size = {
		width: 0,
		height: 0
	};
	constructor(node, options = { box: "border-box" }) {
		options.window;
		this.#size = {
			width: options.initialSize?.width ?? 0,
			height: options.initialSize?.height ?? 0
		};
	}
	get current() {
		return this.#size;
	}
	get width() {
		return this.#size.width;
	}
	get height() {
		return this.#size.height;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/runed@0.23.4_svelte@5.56.0/node_modules/runed/dist/utilities/previous/previous.svelte.js
var Previous = class {
	#previous = void 0;
	#curr;
	constructor(getter) {}
	get current() {
		return this.#previous;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/runed@0.23.4_svelte@5.56.0/node_modules/runed/dist/utilities/context/context.js
var Context$1 = class {
	#name;
	#key;
	/**
	* @param name The name of the context.
	* This is used for generating the context key and error messages.
	*/
	constructor(name) {
		this.#name = name;
		this.#key = Symbol(name);
	}
	/**
	* The key used to get and set the context.
	*
	* It is not recommended to use this value directly.
	* Instead, use the methods provided by this class.
	*/
	get key() {
		return this.#key;
	}
	/**
	* Checks whether this has been set in the context of a parent component.
	*
	* Must be called during component initialisation.
	*/
	exists() {
		return hasContext(this.#key);
	}
	/**
	* Retrieves the context that belongs to the closest parent component.
	*
	* Must be called during component initialisation.
	*
	* @throws An error if the context does not exist.
	*/
	get() {
		const context = getContext(this.#key);
		if (context === void 0) throw new Error(`Context "${this.#name}" not found`);
		return context;
	}
	/**
	* Retrieves the context that belongs to the closest parent component,
	* or the given fallback value if the context does not exist.
	*
	* Must be called during component initialisation.
	*/
	getOr(fallback) {
		const context = getContext(this.#key);
		if (context === void 0) return fallback;
		return context;
	}
	/**
	* Associates the given value with the current component and returns it.
	*
	* Must be called during component initialisation.
	*/
	set(context) {
		return setContext(this.#key, context);
	}
};
//#endregion
//#region ../../node_modules/.pnpm/svelte-toolbelt@0.7.1_svelte@5.56.0/node_modules/svelte-toolbelt/dist/utils/use-ref-by-id.svelte.js
function useRefById({ id, ref, deps = () => true, onRefChange, getRootNode }) {
	watch$2([() => id.current, deps], ([_id]) => {
		const node = (getRootNode?.() ?? document)?.getElementById(_id);
		if (node) ref.current = node;
		else ref.current = null;
		onRefChange?.(ref.current);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/svelte-toolbelt@0.7.1_svelte@5.56.0/node_modules/svelte-toolbelt/dist/utils/after-sleep.js
/**
* A utility function that executes a callback after a specified number of milliseconds.
*/
function afterSleep(ms, cb) {
	return setTimeout(cb, ms);
}
//#endregion
//#region ../../node_modules/.pnpm/svelte-toolbelt@0.7.1_svelte@5.56.0/node_modules/svelte-toolbelt/dist/utils/after-tick.js
function afterTick(fn) {
	(/* @__PURE__ */ tick()).then(fn);
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/internal/attrs.js
function getDataOpenClosed(condition) {
	return condition ? "open" : "closed";
}
function getDataDisabled(condition) {
	return condition ? "" : void 0;
}
function getDisabled(condition) {
	return condition ? true : void 0;
}
function getRequired(condition) {
	return condition ? true : void 0;
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/internal/is.js
var isBrowser$3 = typeof document !== "undefined";
function isHTMLElement(element) {
	return element instanceof HTMLElement;
}
function isElement(element) {
	return element instanceof Element;
}
function isFocusVisible(element) {
	return element.matches(":focus-visible");
}
function isNotNull(value) {
	return value !== null;
}
/**
* Determines if the provided object is a valid `HTMLInputElement` with
* a `select` method available.
*/
function isSelectableInput(element) {
	return element instanceof HTMLInputElement && "select" in element;
}
/**
* Given a node, determine if it is hidden by walking up the
* DOM tree until we hit the `stopAt` node (exclusive), if provided)
* otherwise we stop at the document root.
*/
function isElementHidden(node, stopAt) {
	if (getComputedStyle(node).visibility === "hidden") return true;
	while (node) {
		if (stopAt !== void 0 && node === stopAt) return false;
		if (getComputedStyle(node).display === "none") return true;
		node = node.parentElement;
	}
	return false;
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/internal/use-id.js
globalThis.bitsIdCounter ??= { current: 0 };
/**
* Generates a unique ID based on a global counter.
*/
function useId$1(prefix = "bits") {
	globalThis.bitsIdCounter.current++;
	return `${prefix}-${globalThis.bitsIdCounter.current}`;
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/internal/noop.js
/**
* A no operation function (does nothing)
*/
function noop$1() {}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/internal/use-state-machine.svelte.js
function useStateMachine(initialState, machine) {
	const state = box(initialState);
	function reducer(event) {
		return machine[state.current][event] ?? state.current;
	}
	const dispatch = (event) => {
		state.current = reducer(event);
	};
	return {
		state,
		dispatch
	};
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/presence-layer/use-presence.svelte.js
function usePresence(present, id) {
	let styles = {};
	let prevAnimationNameState = "none";
	const initialState = present.current ? "mounted" : "unmounted";
	let node = null;
	const prevPresent = new Previous(() => present.current);
	watch$2([() => id.current, () => present.current], ([id, present]) => {
		if (!id || !present) return;
		afterTick(() => {
			node = document.getElementById(id);
		});
	});
	const { state, dispatch } = useStateMachine(initialState, {
		mounted: {
			UNMOUNT: "unmounted",
			ANIMATION_OUT: "unmountSuspended"
		},
		unmountSuspended: {
			MOUNT: "mounted",
			ANIMATION_END: "unmounted"
		},
		unmounted: { MOUNT: "mounted" }
	});
	watch$2(() => present.current, (currPresent) => {
		if (!node) node = document.getElementById(id.current);
		if (!node) return;
		if (!(currPresent !== prevPresent.current)) return;
		const prevAnimationName = prevAnimationNameState;
		const currAnimationName = getAnimationName(node);
		if (currPresent) dispatch("MOUNT");
		else if (currAnimationName === "none" || styles.display === "none") dispatch("UNMOUNT");
		else if (prevPresent && prevAnimationName !== currAnimationName) dispatch("ANIMATION_OUT");
		else dispatch("UNMOUNT");
	});
	/**
	* Triggering an ANIMATION_OUT during an ANIMATION_IN will fire an `animationcancel`
	* event for ANIMATION_IN after we have entered `unmountSuspended` state. So, we
	* make sure we only trigger ANIMATION_END for the currently active animation.
	*/
	function handleAnimationEnd(event) {
		if (!node) node = document.getElementById(id.current);
		if (!node) return;
		const currAnimationName = getAnimationName(node);
		const isCurrentAnimation = currAnimationName.includes(event.animationName) || currAnimationName === "none";
		if (event.target === node && isCurrentAnimation) dispatch("ANIMATION_END");
	}
	function handleAnimationStart(event) {
		if (!node) node = document.getElementById(id.current);
		if (!node) return;
		if (event.target === node) prevAnimationNameState = getAnimationName(node);
	}
	watch$2(() => state.current, () => {
		if (!node) node = document.getElementById(id.current);
		if (!node) return;
		const currAnimationName = getAnimationName(node);
		prevAnimationNameState = state.current === "mounted" ? currAnimationName : "none";
	});
	watch$2(() => node, (node) => {
		if (!node) return;
		styles = getComputedStyle(node);
		return executeCallbacks(on(node, "animationstart", handleAnimationStart), on(node, "animationcancel", handleAnimationEnd), on(node, "animationend", handleAnimationEnd));
	});
	const isPresentDerived = derived(() => ["mounted", "unmountSuspended"].includes(state.current));
	return { get current() {
		return isPresentDerived();
	} };
}
function getAnimationName(node) {
	return node ? getComputedStyle(node).animationName || "none" : "none";
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/presence-layer/presence-layer.svelte
Presence_layer[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/presence-layer/presence-layer.svelte";
function Presence_layer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { present, forceMount, presence, id } = $$props;
		const isPresent = usePresence(box.with(() => present), box.with(() => id));
		if (forceMount || present || isPresent.current) {
			$$renderer.push("<!--[0-->");
			presence?.($$renderer, { present: isPresent });
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	}, Presence_layer);
}
Presence_layer.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/dialog/dialog.svelte.js
function createAttrs(variant) {
	return {
		content: `data-${variant}-content`,
		trigger: `data-${variant}-trigger`,
		overlay: `data-${variant}-overlay`,
		title: `data-${variant}-title`,
		description: `data-${variant}-description`,
		close: `data-${variant}-close`,
		cancel: `data-${variant}-cancel`,
		action: `data-${variant}-action`
	};
}
var DialogRootState = class {
	opts;
	triggerNode = null;
	contentNode = null;
	descriptionNode = null;
	contentId = void 0;
	titleId = void 0;
	triggerId = void 0;
	descriptionId = void 0;
	cancelNode = null;
	#attrs = derived(() => createAttrs(this.opts.variant.current));
	get attrs() {
		return this.#attrs();
	}
	set attrs($$value) {
		return this.#attrs($$value);
	}
	constructor(opts) {
		this.opts = opts;
		this.handleOpen = this.handleOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
	}
	handleOpen() {
		if (this.opts.open.current) return;
		this.opts.open.current = true;
	}
	handleClose() {
		if (!this.opts.open.current) return;
		this.opts.open.current = false;
	}
	#sharedProps = derived(() => ({ "data-state": getDataOpenClosed(this.opts.open.current) }));
	get sharedProps() {
		return this.#sharedProps();
	}
	set sharedProps($$value) {
		return this.#sharedProps($$value);
	}
};
var DialogContentState = class {
	opts;
	root;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		useRefById({
			...opts,
			deps: () => this.root.opts.open.current,
			onRefChange: (node) => {
				this.root.contentNode = node;
				this.root.contentId = node?.id;
			}
		});
	}
	#snippetProps = derived(() => ({ open: this.root.opts.open.current }));
	get snippetProps() {
		return this.#snippetProps();
	}
	set snippetProps($$value) {
		return this.#snippetProps($$value);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		role: this.root.opts.variant.current === "alert-dialog" ? "alertdialog" : "dialog",
		"aria-modal": "true",
		"aria-describedby": this.root.descriptionId,
		"aria-labelledby": this.root.titleId,
		[this.root.attrs.content]: "",
		style: {
			pointerEvents: "auto",
			outline: this.root.opts.variant.current === "alert-dialog" ? "none" : void 0
		},
		tabindex: this.root.opts.variant.current === "alert-dialog" ? -1 : void 0,
		...this.root.sharedProps
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var DialogOverlayState = class {
	opts;
	root;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		useRefById({
			...opts,
			deps: () => this.root.opts.open.current
		});
	}
	#snippetProps = derived(() => ({ open: this.root.opts.open.current }));
	get snippetProps() {
		return this.#snippetProps();
	}
	set snippetProps($$value) {
		return this.#snippetProps($$value);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		[this.root.attrs.overlay]: "",
		style: { pointerEvents: "auto" },
		...this.root.sharedProps
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var DialogRootContext = new Context$1("Dialog.Root");
function useDialogRoot(props) {
	return DialogRootContext.set(new DialogRootState(props));
}
function useDialogContent(props) {
	return new DialogContentState(props, DialogRootContext.get());
}
function useDialogOverlay(props) {
	return new DialogOverlayState(props, DialogRootContext.get());
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/portal/portal.svelte
Portal[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/portal/portal.svelte";
function Portal($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { to = "body", children, disabled } = $$props;
		getAllContexts();
		let target = derived(getTarget);
		function getTarget() {
			if (!isBrowser$3 || disabled) return null;
			let localTarget = null;
			if (typeof to === "string") {
				localTarget = document.querySelector(to);
				if (localTarget === null) throw new Error(`Target element "${to}" not found.`);
			} else if (to instanceof HTMLElement || to instanceof DocumentFragment) localTarget = to;
			else throw new TypeError(`Unknown portal target type: ${to === null ? "null" : typeof to}. Allowed types: string (query selector), HTMLElement, or DocumentFragment.`);
			return localTarget;
		}
		let instance;
		function unmountInstance() {
			if (instance) {
				unmount();
				instance = null;
			}
		}
		watch$2([() => target(), () => disabled], ([target, disabled]) => {
			if (!target || disabled) {
				unmountInstance();
				return;
			}
			instance = mount();
			return () => {
				unmountInstance();
			};
		});
		if (disabled) {
			$$renderer.push("<!--[0-->");
			children?.($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	}, Portal);
}
Portal.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/internal/events.js
/**
* Adds an event listener to the specified target element(s) for the given event(s), and returns a function to remove it.
* @param target The target element(s) to add the event listener to.
* @param event The event(s) to listen for.
* @param handler The function to be called when the event is triggered.
* @param options An optional object that specifies characteristics about the event listener.
* @returns A function that removes the event listener from the target element(s).
*/
function addEventListener(target, event, handler, options) {
	const events = Array.isArray(event) ? event : [event];
	events.forEach((_event) => target.addEventListener(_event, handler, options));
	return () => {
		events.forEach((_event) => target.removeEventListener(_event, handler, options));
	};
}
/**
* Creates a typed event dispatcher and listener pair for custom events
* @template T - The type of data that will be passed in the event detail
* @param eventName - The name of the custom event
* @param options - CustomEvent options (bubbles, cancelable, etc.)
*/
var CustomEventDispatcher = class {
	eventName;
	options;
	constructor(eventName, options = {
		bubbles: true,
		cancelable: true
	}) {
		this.eventName = eventName;
		this.options = options;
	}
	createEvent(detail) {
		return new CustomEvent(this.eventName, {
			...this.options,
			detail
		});
	}
	dispatch(element, detail) {
		const event = this.createEvent(detail);
		element.dispatchEvent(event);
		return event;
	}
	listen(element, callback, options) {
		const handler = (event) => {
			callback(event);
		};
		return on(element, this.eventName, handler, options);
	}
};
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/internal/debounce.js
function debounce$2(fn, wait = 500) {
	let timeout = null;
	const debounced = (...args) => {
		if (timeout !== null) clearTimeout(timeout);
		timeout = setTimeout(() => {
			fn(...args);
		}, wait);
	};
	debounced.destroy = () => {
		if (timeout !== null) {
			clearTimeout(timeout);
			timeout = null;
		}
	};
	return debounced;
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/internal/elements.js
function isOrContainsTarget(node, target) {
	return node === target || node.contains(target);
}
function getOwnerDocument(el) {
	return el?.ownerDocument ?? document;
}
/**
* Determines if the click event truly occurred outside the content node.
* This was added to handle password managers and other elements that may be injected
* into the DOM but visually appear inside the content.
*/
function isClickTrulyOutside(event, contentNode) {
	const { clientX, clientY } = event;
	const rect = contentNode.getBoundingClientRect();
	return clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom;
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/dismissible-layer/use-dismissable-layer.svelte.js
globalThis.bitsDismissableLayers ??= /* @__PURE__ */ new Map();
var DismissibleLayerState = class {
	opts;
	#interactOutsideProp;
	#behaviorType;
	#interceptedEvents = { pointerdown: false };
	#isResponsibleLayer = false;
	#isFocusInsideDOMTree = false;
	node = box(null);
	#documentObj = void 0;
	#onFocusOutside;
	currNode = null;
	#unsubClickListener = noop$1;
	constructor(opts) {
		this.opts = opts;
		useRefById({
			id: opts.id,
			ref: this.node,
			deps: () => opts.enabled.current,
			onRefChange: (node) => {
				this.currNode = node;
			}
		});
		this.#behaviorType = opts.interactOutsideBehavior;
		this.#interactOutsideProp = opts.onInteractOutside;
		this.#onFocusOutside = opts.onFocusOutside;
		let unsubEvents = noop$1;
		const cleanup = () => {
			this.#resetState();
			globalThis.bitsDismissableLayers.delete(this);
			this.#handleInteractOutside.destroy();
			unsubEvents();
		};
		watch$2([() => this.opts.enabled.current, () => this.currNode], ([enabled, currNode]) => {
			if (!enabled || !currNode) return;
			afterSleep(1, () => {
				if (!this.currNode) return;
				globalThis.bitsDismissableLayers.set(this, this.#behaviorType);
				unsubEvents();
				unsubEvents = this.#addEventListeners();
			});
			return cleanup;
		});
	}
	#handleFocus = (event) => {
		if (event.defaultPrevented) return;
		if (!this.currNode) return;
		afterTick(() => {
			if (!this.currNode || this.#isTargetWithinLayer(event.target)) return;
			if (event.target && !this.#isFocusInsideDOMTree) this.#onFocusOutside.current?.(event);
		});
	};
	#addEventListeners() {
		return executeCallbacks(
			/**
			* CAPTURE INTERACTION START
			* mark interaction-start event as intercepted.
			* mark responsible layer during interaction start
			* to avoid checking if is responsible layer during interaction end
			* when a new floating element may have been opened.
			*/
			on(this.#documentObj, "pointerdown", executeCallbacks(this.#markInterceptedEvent, this.#markResponsibleLayer), { capture: true }),
			/**
			* BUBBLE INTERACTION START
			* Mark interaction-start event as non-intercepted. Debounce `onInteractOutsideStart`
			* to avoid prematurely checking if other events were intercepted.
			*/
			on(this.#documentObj, "pointerdown", executeCallbacks(this.#markNonInterceptedEvent, this.#handleInteractOutside)),
			/**
			* HANDLE FOCUS OUTSIDE
			*/
			on(this.#documentObj, "focusin", this.#handleFocus)
		);
	}
	#handleDismiss = (e) => {
		let event = e;
		if (event.defaultPrevented) event = createWrappedEvent(e);
		this.#interactOutsideProp.current(e);
	};
	#handleInteractOutside = debounce$2((e) => {
		if (!this.currNode) {
			this.#unsubClickListener();
			return;
		}
		const isEventValid = this.opts.isValidEvent.current(e, this.currNode) || isValidEvent(e, this.currNode);
		if (!this.#isResponsibleLayer || this.#isAnyEventIntercepted() || !isEventValid) {
			this.#unsubClickListener();
			return;
		}
		let event = e;
		if (event.defaultPrevented) event = createWrappedEvent(event);
		if (this.#behaviorType.current !== "close" && this.#behaviorType.current !== "defer-otherwise-close") {
			this.#unsubClickListener();
			return;
		}
		if (e.pointerType === "touch") {
			this.#unsubClickListener();
			this.#unsubClickListener = addEventListener(this.#documentObj, "click", this.#handleDismiss, { once: true });
		} else this.#interactOutsideProp.current(event);
	}, 10);
	#markInterceptedEvent = (e) => {
		this.#interceptedEvents[e.type] = true;
	};
	#markNonInterceptedEvent = (e) => {
		this.#interceptedEvents[e.type] = false;
	};
	#markResponsibleLayer = () => {
		if (!this.node.current) return;
		this.#isResponsibleLayer = isResponsibleLayer(this.node.current);
	};
	#isTargetWithinLayer = (target) => {
		if (!this.node.current) return false;
		return isOrContainsTarget(this.node.current, target);
	};
	#resetState = debounce$2(() => {
		for (const eventType in this.#interceptedEvents) this.#interceptedEvents[eventType] = false;
		this.#isResponsibleLayer = false;
	}, 20);
	#isAnyEventIntercepted() {
		return Object.values(this.#interceptedEvents).some(Boolean);
	}
	#onfocuscapture = () => {
		this.#isFocusInsideDOMTree = true;
	};
	#onblurcapture = () => {
		this.#isFocusInsideDOMTree = false;
	};
	props = {
		onfocuscapture: this.#onfocuscapture,
		onblurcapture: this.#onblurcapture
	};
};
function useDismissibleLayer(props) {
	return new DismissibleLayerState(props);
}
function getTopMostLayer(layersArr) {
	return layersArr.findLast(([_, { current: behaviorType }]) => behaviorType === "close" || behaviorType === "ignore");
}
function isResponsibleLayer(node) {
	const layersArr = [...globalThis.bitsDismissableLayers];
	/**
	* We first check if we can find a top layer with `close` or `ignore`.
	* If that top layer was found and matches the provided node, then the node is
	* responsible for the outside interaction. Otherwise, we know that all layers defer so
	* the first layer is the responsible one.
	*/
	const topMostLayer = getTopMostLayer(layersArr);
	if (topMostLayer) return topMostLayer[0].node.current === node;
	const [firstLayerNode] = layersArr[0];
	return firstLayerNode.node.current === node;
}
function isValidEvent(e, node) {
	if ("button" in e && e.button > 0) return false;
	const target = e.target;
	if (!isElement(target)) return false;
	return getOwnerDocument(target).documentElement.contains(target) && !isOrContainsTarget(node, target) && isClickTrulyOutside(e, node);
}
function createWrappedEvent(e) {
	const capturedCurrentTarget = e.currentTarget;
	const capturedTarget = e.target;
	let newEvent;
	if (e instanceof PointerEvent) newEvent = new PointerEvent(e.type, e);
	else newEvent = new PointerEvent("pointerdown", e);
	let isPrevented = false;
	return new Proxy(newEvent, { get: (target, prop) => {
		if (prop === "currentTarget") return capturedCurrentTarget;
		if (prop === "target") return capturedTarget;
		if (prop === "preventDefault") return () => {
			isPrevented = true;
			if (typeof target.preventDefault === "function") target.preventDefault();
		};
		if (prop === "defaultPrevented") return isPrevented;
		if (prop in target) return target[prop];
		return e[prop];
	} });
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/dismissible-layer/dismissible-layer.svelte
Dismissible_layer[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/dismissible-layer/dismissible-layer.svelte";
function Dismissible_layer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { interactOutsideBehavior = "close", onInteractOutside = noop$1, onFocusOutside = noop$1, id, children, enabled, isValidEvent = () => false } = $$props;
		const dismissibleLayerState = useDismissibleLayer({
			id: box.with(() => id),
			interactOutsideBehavior: box.with(() => interactOutsideBehavior),
			onInteractOutside: box.with(() => onInteractOutside),
			enabled: box.with(() => enabled),
			onFocusOutside: box.with(() => onFocusOutside),
			isValidEvent: box.with(() => isValidEvent)
		});
		children?.($$renderer, { props: dismissibleLayerState.props });
		$$renderer.push(`<!---->`);
	}, Dismissible_layer);
}
Dismissible_layer.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/escape-layer/use-escape-layer.svelte.js
globalThis.bitsEscapeLayers ??= /* @__PURE__ */ new Map();
var EscapeLayerState = class {
	opts;
	constructor(opts) {
		this.opts = opts;
		let unsubEvents = noop$1;
		watch$2(() => opts.enabled.current, (enabled) => {
			if (enabled) {
				globalThis.bitsEscapeLayers.set(this, opts.escapeKeydownBehavior);
				unsubEvents = this.#addEventListener();
			}
			return () => {
				unsubEvents();
				globalThis.bitsEscapeLayers.delete(this);
			};
		});
	}
	#addEventListener = () => {
		return on(document, "keydown", this.#onkeydown, { passive: false });
	};
	#onkeydown = (e) => {
		if (e.key !== "Escape" || !isResponsibleEscapeLayer(this)) return;
		const clonedEvent = new KeyboardEvent(e.type, e);
		e.preventDefault();
		const behaviorType = this.opts.escapeKeydownBehavior.current;
		if (behaviorType !== "close" && behaviorType !== "defer-otherwise-close") return;
		this.opts.onEscapeKeydown.current(clonedEvent);
	};
};
function useEscapeLayer(props) {
	return new EscapeLayerState(props);
}
function isResponsibleEscapeLayer(instance) {
	const layersArr = [...globalThis.bitsEscapeLayers];
	/**
	* We first check if we can find a top layer with `close` or `ignore`.
	* If that top layer was found and matches the provided node, then the node is
	* responsible for the escape. Otherwise, we know that all layers defer so
	* the first layer is the responsible one.
	*/
	const topMostLayer = layersArr.findLast(([_, { current: behaviorType }]) => behaviorType === "close" || behaviorType === "ignore");
	if (topMostLayer) return topMostLayer[0] === instance;
	const [firstLayerNode] = layersArr[0];
	return firstLayerNode === instance;
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/escape-layer/escape-layer.svelte
Escape_layer[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/escape-layer/escape-layer.svelte";
function Escape_layer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { escapeKeydownBehavior = "close", onEscapeKeydown = noop$1, children, enabled } = $$props;
		useEscapeLayer({
			escapeKeydownBehavior: box.with(() => escapeKeydownBehavior),
			onEscapeKeydown: box.with(() => onEscapeKeydown),
			enabled: box.with(() => enabled)
		});
		children?.($$renderer);
		$$renderer.push(`<!---->`);
	}, Escape_layer);
}
Escape_layer.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/focus-scope/focus-scope-stack.svelte.js
var focusStack = box([]);
function createFocusScopeStack() {
	return {
		add(focusScope) {
			const activeFocusScope = focusStack.current[0];
			if (activeFocusScope && focusScope.id !== activeFocusScope.id) activeFocusScope.pause();
			focusStack.current = removeFromFocusScopeArray(focusStack.current, focusScope);
			focusStack.current.unshift(focusScope);
		},
		remove(focusScope) {
			focusStack.current = removeFromFocusScopeArray(focusStack.current, focusScope);
			focusStack.current[0]?.resume();
		},
		get current() {
			return focusStack.current;
		}
	};
}
function createFocusScopeAPI() {
	let paused = false;
	let isHandlingFocus = false;
	return {
		id: useId$1(),
		get paused() {
			return paused;
		},
		get isHandlingFocus() {
			return isHandlingFocus;
		},
		set isHandlingFocus(value) {
			isHandlingFocus = value;
		},
		pause() {
			paused = true;
		},
		resume() {
			paused = false;
		}
	};
}
function removeFromFocusScopeArray(arr, item) {
	return [...arr].filter((i) => i.id !== item.id);
}
function removeLinks(items) {
	return items.filter((item) => item.tagName !== "A");
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/internal/focus.js
/**
* A utility function that focuses an element.
*/
function focus(element, { select = false } = {}) {
	if (!(element && element.focus)) return;
	if (document.activeElement === element) return;
	const previouslyFocusedElement = document.activeElement;
	element.focus({ preventScroll: true });
	if (element !== previouslyFocusedElement && isSelectableInput(element) && select) element.select();
}
/**
* Attempts to focus the first element in a list of candidates.
* Stops when focus is successful.
*/
function focusFirst(candidates, { select = false } = {}) {
	const previouslyFocusedElement = document.activeElement;
	for (const candidate of candidates) {
		focus(candidate, { select });
		if (document.activeElement !== previouslyFocusedElement) return true;
	}
}
/**
* Returns the first visible element in a list.
* NOTE: Only checks visibility up to the `container`.
*/
function findVisible(elements, container) {
	for (const element of elements) if (!isElementHidden(element, container)) return element;
}
/**
* Returns a list of potential tabbable candidates.
*
* NOTE: This is only a close approximation. For example it doesn't take into account cases like when
* elements are not visible. This cannot be worked out easily by just reading a property, but rather
* necessitate runtime knowledge (computed styles, etc). We deal with these cases separately.
*
* See: https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker
* Credit: https://github.com/discord/focus-layers/blob/master/src/util/wrapFocus.tsx#L1
*/
function getTabbableCandidates(container) {
	const nodes = [];
	const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, { acceptNode: (node) => {
		const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
		if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
		return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
	} });
	while (walker.nextNode()) nodes.push(walker.currentNode);
	return nodes;
}
/**
* A utility function that returns the first and last elements within a container that are
* visible and focusable.
*/
function getTabbableEdges(container) {
	const candidates = getTabbableCandidates(container);
	return [findVisible(candidates, container), findVisible(candidates.reverse(), container)];
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/focus-scope/use-focus-scope.svelte.js
var AutoFocusOnMountEvent = new CustomEventDispatcher("focusScope.autoFocusOnMount", {
	bubbles: false,
	cancelable: true
});
var AutoFocusOnDestroyEvent = new CustomEventDispatcher("focusScope.autoFocusOnDestroy", {
	bubbles: false,
	cancelable: true
});
var FocusScopeContext = new Context$1("FocusScope");
function useFocusScope({ id, loop, enabled, onOpenAutoFocus, onCloseAutoFocus, forceMount }) {
	const focusScopeStack = createFocusScopeStack();
	const focusScope = createFocusScopeAPI();
	const ref = box(null);
	const ctx = FocusScopeContext.getOr({ ignoreCloseAutoFocus: false });
	let lastFocusedElement = null;
	useRefById({
		id,
		ref,
		deps: () => enabled.current
	});
	function manageFocus(event) {
		if (focusScope.paused || !ref.current || focusScope.isHandlingFocus) return;
		focusScope.isHandlingFocus = true;
		try {
			const target = event.target;
			if (!isHTMLElement(target)) return;
			const isWithinActiveScope = ref.current.contains(target);
			if (event.type === "focusin") if (isWithinActiveScope) lastFocusedElement = target;
			else {
				if (ctx.ignoreCloseAutoFocus) return;
				focus(lastFocusedElement, { select: true });
			}
			else if (event.type === "focusout") {
				if (!isWithinActiveScope && !ctx.ignoreCloseAutoFocus) focus(lastFocusedElement, { select: true });
			}
		} finally {
			focusScope.isHandlingFocus = false;
		}
	}
	/**
	* Handles DOM mutations within the container. Specifically checks if the
	* last known focused element inside the container has been removed. If so,
	* and focus has escaped the container (likely moved to document.body),
	* it refocuses the container itself to maintain the trap.
	*/
	function handleMutations(mutations) {
		if (!lastFocusedElement || !ref.current) return;
		let elementWasRemoved = false;
		for (const mutation of mutations) {
			if (mutation.type === "childList" && mutation.removedNodes.length > 0) for (const removedNode of mutation.removedNodes) {
				if (removedNode === lastFocusedElement) {
					elementWasRemoved = true;
					break;
				}
				if (removedNode.nodeType === Node.ELEMENT_NODE && removedNode.contains(lastFocusedElement)) {
					elementWasRemoved = true;
					break;
				}
			}
			if (elementWasRemoved) break;
		}
		/**
		* If the element was removed and focus is now outside the container,
		* (e.g., browser moved it to body), refocus the container.
		*/
		if (elementWasRemoved && ref.current && !ref.current.contains(document.activeElement)) focus(ref.current);
	}
	watch$2([() => ref.current, () => enabled.current], ([container, enabled]) => {
		if (!container || !enabled) return;
		const removeEvents = executeCallbacks(on(document, "focusin", manageFocus), on(document, "focusout", manageFocus));
		const mutationObserver = new MutationObserver(handleMutations);
		mutationObserver.observe(container, {
			childList: true,
			subtree: true,
			attributes: false
		});
		return () => {
			removeEvents();
			mutationObserver.disconnect();
		};
	});
	watch$2([() => forceMount.current, () => ref.current], ([forceMount, container]) => {
		if (forceMount) return;
		const prevFocusedElement = document.activeElement;
		handleOpen(container, prevFocusedElement);
		return () => {
			if (!container) return;
			handleClose(prevFocusedElement);
		};
	});
	watch$2([
		() => forceMount.current,
		() => ref.current,
		() => enabled.current
	], ([forceMount, container]) => {
		if (!forceMount) return;
		const prevFocusedElement = document.activeElement;
		handleOpen(container, prevFocusedElement);
		return () => {
			if (!container) return;
			handleClose(prevFocusedElement);
		};
	});
	function handleOpen(container, prevFocusedElement) {
		if (!container) container = document.getElementById(id.current);
		if (!container || !enabled.current) return;
		focusScopeStack.add(focusScope);
		if (!container.contains(prevFocusedElement)) {
			const mountEvent = AutoFocusOnMountEvent.createEvent();
			onOpenAutoFocus.current(mountEvent);
			if (!mountEvent.defaultPrevented) afterTick(() => {
				if (!container) return;
				if (!focusFirst(removeLinks(getTabbableCandidates(container)), { select: true })) focus(container);
			});
		}
	}
	function handleClose(prevFocusedElement) {
		const destroyEvent = AutoFocusOnDestroyEvent.createEvent();
		onCloseAutoFocus.current?.(destroyEvent);
		const shouldIgnore = ctx.ignoreCloseAutoFocus;
		afterSleep(0, () => {
			if (!destroyEvent.defaultPrevented && prevFocusedElement && !shouldIgnore) focus(isTabbable(prevFocusedElement) ? prevFocusedElement : document.body, { select: true });
			focusScopeStack.remove(focusScope);
		});
	}
	function handleKeydown(e) {
		if (!enabled.current) return;
		if (!loop.current && !enabled.current) return;
		if (focusScope.paused) return;
		const isTabKey = e.key === "Tab" && !e.ctrlKey && !e.altKey && !e.metaKey;
		const focusedElement = document.activeElement;
		if (!(isTabKey && focusedElement)) return;
		const container = ref.current;
		if (!container) return;
		const [first, last] = getTabbableEdges(container);
		if (!(first && last)) {
			if (focusedElement === container) e.preventDefault();
		} else if (!e.shiftKey && focusedElement === last) {
			e.preventDefault();
			if (loop.current) focus(first, { select: true });
		} else if (e.shiftKey && focusedElement === first) {
			e.preventDefault();
			if (loop.current) focus(last, { select: true });
		}
	}
	const props = derived(() => ({
		id: id.current,
		tabindex: -1,
		onkeydown: handleKeydown
	}));
	return { get props() {
		return props();
	} };
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/focus-scope/focus-scope.svelte
Focus_scope[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/focus-scope/focus-scope.svelte";
function Focus_scope($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { id, trapFocus = false, loop = false, onCloseAutoFocus = noop$1, onOpenAutoFocus = noop$1, focusScope, forceMount = false } = $$props;
		const focusScopeState = useFocusScope({
			enabled: box.with(() => trapFocus),
			loop: box.with(() => loop),
			onCloseAutoFocus: box.with(() => onCloseAutoFocus),
			onOpenAutoFocus: box.with(() => onOpenAutoFocus),
			id: box.with(() => id),
			forceMount: box.with(() => forceMount)
		});
		focusScope?.($$renderer, { props: focusScopeState.props });
		$$renderer.push(`<!---->`);
	}, Focus_scope);
}
Focus_scope.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/text-selection-layer/use-text-selection-layer.svelte.js
globalThis.bitsTextSelectionLayers ??= /* @__PURE__ */ new Map();
var TextSelectionLayerState = class {
	opts;
	#unsubSelectionLock = noop$1;
	#ref = box(null);
	constructor(opts) {
		this.opts = opts;
		useRefById({
			id: opts.id,
			ref: this.#ref,
			deps: () => this.opts.enabled.current
		});
		let unsubEvents = noop$1;
		watch$2(() => this.opts.enabled.current, (isEnabled) => {
			if (isEnabled) {
				globalThis.bitsTextSelectionLayers.set(this, this.opts.enabled);
				unsubEvents();
				unsubEvents = this.#addEventListeners();
			}
			return () => {
				unsubEvents();
				this.#resetSelectionLock();
				globalThis.bitsTextSelectionLayers.delete(this);
			};
		});
	}
	#addEventListeners() {
		return executeCallbacks(on(document, "pointerdown", this.#pointerdown), on(document, "pointerup", composeHandlers(this.#resetSelectionLock, this.opts.onPointerUp.current)));
	}
	#pointerdown = (e) => {
		const node = this.#ref.current;
		const target = e.target;
		if (!isHTMLElement(node) || !isHTMLElement(target) || !this.opts.enabled.current) return;
		/**
		* We only lock user-selection overflow if layer is the top most layer and
		* pointerdown occurred inside the node. You are still allowed to select text
		* outside the node provided pointerdown occurs outside the node.
		*/
		if (!isHighestLayer(this) || !isOrContainsTarget(node, target)) return;
		this.opts.onPointerDown.current(e);
		if (e.defaultPrevented) return;
		this.#unsubSelectionLock = preventTextSelectionOverflow(node);
	};
	#resetSelectionLock = () => {
		this.#unsubSelectionLock();
		this.#unsubSelectionLock = noop$1;
	};
};
function useTextSelectionLayer(props) {
	return new TextSelectionLayerState(props);
}
var getUserSelect = (node) => node.style.userSelect || node.style.webkitUserSelect;
function preventTextSelectionOverflow(node) {
	const body = document.body;
	const originalBodyUserSelect = getUserSelect(body);
	const originalNodeUserSelect = getUserSelect(node);
	setUserSelect(body, "none");
	setUserSelect(node, "text");
	return () => {
		setUserSelect(body, originalBodyUserSelect);
		setUserSelect(node, originalNodeUserSelect);
	};
}
function setUserSelect(node, value) {
	node.style.userSelect = value;
	node.style.webkitUserSelect = value;
}
function isHighestLayer(instance) {
	const layersArr = [...globalThis.bitsTextSelectionLayers];
	if (!layersArr.length) return false;
	const highestLayer = layersArr.at(-1);
	if (!highestLayer) return false;
	return highestLayer[0] === instance;
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/text-selection-layer/text-selection-layer.svelte
Text_selection_layer[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/text-selection-layer/text-selection-layer.svelte";
function Text_selection_layer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { preventOverflowTextSelection = true, onPointerDown = noop$1, onPointerUp = noop$1, id, children, enabled } = $$props;
		useTextSelectionLayer({
			id: box.with(() => id),
			onPointerDown: box.with(() => onPointerDown),
			onPointerUp: box.with(() => onPointerUp),
			enabled: box.with(() => enabled && preventOverflowTextSelection)
		});
		children?.($$renderer);
		$$renderer.push(`<!---->`);
	}, Text_selection_layer);
}
Text_selection_layer.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/internal/create-shared-hook.svelte.js
function createSharedHook(factory) {
	return (...args) => {
	};
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/internal/use-body-scroll-lock.svelte.js
var useBodyLockStackCount = createSharedHook();
function useBodyScrollLock(initialState, restoreScrollDelay = () => null) {
	const id = useId$1();
	const countState = useBodyLockStackCount();
	if (!countState) return;
	countState.map.set(id, initialState ?? false);
	return box.with(() => countState.map.get(id) ?? false, (v) => countState.map.set(id, v));
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/scroll-lock/scroll-lock.svelte
Scroll_lock[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/scroll-lock/scroll-lock.svelte";
function Scroll_lock($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { preventScroll = true, restoreScrollDelay = null } = $$props;
		useBodyScrollLock(preventScroll, () => restoreScrollDelay);
	}, Scroll_lock);
}
Scroll_lock.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/internal/should-trap-focus.js
function shouldTrapFocus({ forceMount, present, trapFocus, open }) {
	if (forceMount) return open && trapFocus;
	return present && trapFocus && open;
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/dialog/components/dialog-overlay.svelte
Dialog_overlay$1[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/dialog/components/dialog-overlay.svelte";
function Dialog_overlay$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { id = useId$1(), forceMount = false, child, children, ref = null, $$slots, $$events, ...restProps } = $$props;
		const overlayState = useDialogOverlay({
			id: box.with(() => id),
			ref: box.with(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, overlayState.props));
		{
			prevent_snippet_stringification(presence);
			function presence($$renderer) {
				validate_snippet_args($$renderer);
				if (child) {
					$$renderer.push("<!--[0-->");
					child($$renderer, {
						props: mergeProps(mergedProps()),
						...overlayState.snippetProps
					});
					$$renderer.push(`<!---->`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<div${attributes({ ...mergeProps(mergedProps()) })}>`);
					push_element($$renderer, "div", 33, 3);
					children?.($$renderer, overlayState.snippetProps);
					$$renderer.push(`<!----></div>`);
					pop_element();
				}
				$$renderer.push(`<!--]-->`);
			}
			Presence_layer($$renderer, {
				id,
				present: overlayState.root.opts.open.current || forceMount,
				presence});
		}
		bind_props($$props, { ref });
	}, Dialog_overlay$1);
}
Dialog_overlay$1.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/avatar/avatar.svelte.js
var AVATAR_ROOT_ATTR = "data-avatar-root";
var AVATAR_FALLBACK_ATTR = "data-avatar-fallback";
var AvatarRootState = class {
	opts;
	constructor(opts) {
		this.opts = opts;
		this.loadImage = this.loadImage.bind(this);
		useRefById(opts);
	}
	loadImage(src, crossorigin, referrerPolicy) {
		if (this.opts.loadingStatus.current === "loaded") return;
		let imageTimerId;
		const image = new Image();
		image.src = src;
		if (crossorigin !== void 0) image.crossOrigin = crossorigin;
		if (referrerPolicy) image.referrerPolicy = referrerPolicy;
		this.opts.loadingStatus.current = "loading";
		image.onload = () => {
			imageTimerId = window.setTimeout(() => {
				this.opts.loadingStatus.current = "loaded";
			}, this.opts.delayMs.current);
		};
		image.onerror = () => {
			this.opts.loadingStatus.current = "error";
		};
		return () => {
			window.clearTimeout(imageTimerId);
		};
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		[AVATAR_ROOT_ATTR]: "",
		"data-status": this.opts.loadingStatus.current
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var AvatarFallbackState = class {
	opts;
	root;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		useRefById(opts);
	}
	#style = derived(() => this.root.opts.loadingStatus.current === "loaded" ? { display: "none" } : void 0);
	get style() {
		return this.#style();
	}
	set style($$value) {
		return this.#style($$value);
	}
	#props = derived(() => ({
		style: this.style,
		"data-status": this.root.opts.loadingStatus.current,
		[AVATAR_FALLBACK_ATTR]: ""
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var AvatarRootContext = new Context$1("Avatar.Root");
function useAvatarRoot(props) {
	return AvatarRootContext.set(new AvatarRootState(props));
}
function useAvatarFallback(props) {
	return new AvatarFallbackState(props, AvatarRootContext.get());
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/avatar/components/avatar.svelte
Avatar$1[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/avatar/components/avatar.svelte";
function Avatar$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { delayMs = 0, loadingStatus = "loading", onLoadingStatusChange, child, children, id = useId$1(), ref = null, $$slots, $$events, ...restProps } = $$props;
		const rootState = useAvatarRoot({
			delayMs: box.with(() => delayMs),
			loadingStatus: box.with(() => loadingStatus, (v) => {
				if (loadingStatus !== v) {
					loadingStatus = v;
					onLoadingStatusChange?.(v);
				}
			}),
			id: box.with(() => id),
			ref: box.with(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, rootState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			push_element($$renderer, "div", 42, 1);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
			pop_element();
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, {
			loadingStatus,
			ref
		});
	}, Avatar$1);
}
Avatar$1.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/avatar/components/avatar-fallback.svelte
Avatar_fallback$1[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/avatar/components/avatar-fallback.svelte";
function Avatar_fallback$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { children, child, id = useId$1(), ref = null, $$slots, $$events, ...restProps } = $$props;
		const fallbackState = useAvatarFallback({
			id: box.with(() => id),
			ref: box.with(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, fallbackState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<span${attributes({ ...mergedProps() })}>`);
			push_element($$renderer, "span", 29, 1);
			children?.($$renderer);
			$$renderer.push(`<!----></span>`);
			pop_element();
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	}, Avatar_fallback$1);
}
Avatar_fallback$1.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/hidden-input.svelte
Hidden_input[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/hidden-input.svelte";
function Hidden_input($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { value = void 0, $$slots, $$events, ...restProps } = $$props;
		const mergedProps = derived(() => mergeProps(restProps, {
			"aria-hidden": "true",
			tabindex: -1,
			style: srOnlyStylesString
		}));
		if (mergedProps().type === "checkbox") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<input${attributes({
				...mergedProps(),
				value
			}, void 0, void 0, void 0, 4)}/>`);
			push_element($$renderer, "input", 17, 1);
			pop_element();
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<input${attributes({
				value,
				...mergedProps()
			}, void 0, void 0, void 0, 4)}/>`);
			push_element($$renderer, "input", 19, 1);
			pop_element();
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { value });
	}, Hidden_input);
}
Hidden_input.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/internal/floating-svelte/floating-utils.svelte.js
function get(valueOrGetValue) {
	return typeof valueOrGetValue === "function" ? valueOrGetValue() : valueOrGetValue;
}
function getDPR(element) {
	if (typeof window === "undefined") return 1;
	return (element.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function roundByDPR(element, value) {
	const dpr = getDPR(element);
	return Math.round(value * dpr) / dpr;
}
function getFloatingContentCSSVars(name) {
	return {
		[`--bits-${name}-content-transform-origin`]: `var(--bits-floating-transform-origin)`,
		[`--bits-${name}-content-available-width`]: `var(--bits-floating-available-width)`,
		[`--bits-${name}-content-available-height`]: `var(--bits-floating-available-height)`,
		[`--bits-${name}-anchor-width`]: `var(--bits-floating-anchor-width)`,
		[`--bits-${name}-anchor-height`]: `var(--bits-floating-anchor-height)`
	};
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/internal/floating-svelte/use-floating.svelte.js
function useFloating(options) {
	const middlewareOption = derived(() => get(options.middleware));
	const transformOption = derived(() => get(options.transform) ?? true);
	const placementOption = derived(() => get(options.placement) ?? "bottom");
	const strategyOption = derived(() => get(options.strategy) ?? "absolute");
	const reference = options.reference;
	/** State */
	let x = 0;
	let y = 0;
	const floating = box(null);
	let strategy = strategyOption();
	let placement = placementOption();
	let middlewareData = {};
	let isPositioned = false;
	const floatingStyles = derived(() => {
		const initialStyles = {
			position: strategy,
			left: "0",
			top: "0"
		};
		if (!floating.current) return initialStyles;
		const xVal = roundByDPR(floating.current, x);
		const yVal = roundByDPR(floating.current, y);
		if (transformOption()) return {
			...initialStyles,
			transform: `translate(${xVal}px, ${yVal}px)`,
			...getDPR(floating.current) >= 1.5 && { willChange: "transform" }
		};
		return {
			position: strategy,
			left: `${xVal}px`,
			top: `${yVal}px`
		};
	});
	function update() {
		if (reference.current === null || floating.current === null) return;
		computePosition(reference.current, floating.current, {
			middleware: middlewareOption(),
			placement: placementOption(),
			strategy: strategyOption()
		}).then((position) => {
			x = position.x;
			y = position.y;
			strategy = position.strategy;
			placement = position.placement;
			middlewareData = position.middlewareData;
			isPositioned = true;
		});
	}
	return {
		floating,
		reference,
		get strategy() {
			return strategy;
		},
		get placement() {
			return placement;
		},
		get middlewareData() {
			return middlewareData;
		},
		get isPositioned() {
			return isPositioned;
		},
		get floatingStyles() {
			return floatingStyles();
		},
		get update() {
			return update;
		}
	};
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/floating-layer/use-floating-layer.svelte.js
var OPPOSITE_SIDE = {
	top: "bottom",
	right: "left",
	bottom: "top",
	left: "right"
};
var FloatingRootState = class {
	anchorNode = box(null);
	customAnchorNode = box(null);
	triggerNode = box(null);
	constructor() {}
};
var FloatingContentState = class {
	opts;
	root;
	contentRef = box(null);
	wrapperRef = box(null);
	arrowRef = box(null);
	arrowId = box(useId$1());
	#transformedStyle = derived(() => {
		if (typeof this.opts.style === "string") return cssToStyleObj(this.opts.style);
		if (!this.opts.style) return {};
	});
	#updatePositionStrategy = void 0;
	#arrowSize = new ElementSize(() => this.arrowRef.current ?? void 0);
	#arrowWidth = derived(() => this.#arrowSize?.width ?? 0);
	#arrowHeight = derived(() => this.#arrowSize?.height ?? 0);
	#desiredPlacement = derived(() => this.opts.side?.current + (this.opts.align.current !== "center" ? `-${this.opts.align.current}` : ""));
	#boundary = derived(() => Array.isArray(this.opts.collisionBoundary.current) ? this.opts.collisionBoundary.current : [this.opts.collisionBoundary.current]);
	#hasExplicitBoundaries = derived(() => this.#boundary().length > 0);
	get hasExplicitBoundaries() {
		return this.#hasExplicitBoundaries();
	}
	set hasExplicitBoundaries($$value) {
		return this.#hasExplicitBoundaries($$value);
	}
	#detectOverflowOptions = derived(() => ({
		padding: this.opts.collisionPadding.current,
		boundary: this.#boundary().filter(isNotNull),
		altBoundary: this.hasExplicitBoundaries
	}));
	get detectOverflowOptions() {
		return this.#detectOverflowOptions();
	}
	set detectOverflowOptions($$value) {
		return this.#detectOverflowOptions($$value);
	}
	#availableWidth = void 0;
	#availableHeight = void 0;
	#anchorWidth = void 0;
	#anchorHeight = void 0;
	#middleware = derived(() => [
		offset({
			mainAxis: this.opts.sideOffset.current + this.#arrowHeight(),
			alignmentAxis: this.opts.alignOffset.current
		}),
		this.opts.avoidCollisions.current && shift({
			mainAxis: true,
			crossAxis: false,
			limiter: this.opts.sticky.current === "partial" ? limitShift() : void 0,
			...this.detectOverflowOptions
		}),
		this.opts.avoidCollisions.current && flip({ ...this.detectOverflowOptions }),
		size({
			...this.detectOverflowOptions,
			apply: ({ rects, availableWidth, availableHeight }) => {
				const { width: anchorWidth, height: anchorHeight } = rects.reference;
				this.#availableWidth = availableWidth;
				this.#availableHeight = availableHeight;
				this.#anchorWidth = anchorWidth;
				this.#anchorHeight = anchorHeight;
			}
		}),
		this.arrowRef.current && arrow({
			element: this.arrowRef.current,
			padding: this.opts.arrowPadding.current
		}),
		transformOrigin({
			arrowWidth: this.#arrowWidth(),
			arrowHeight: this.#arrowHeight()
		}),
		this.opts.hideWhenDetached.current && hide({
			strategy: "referenceHidden",
			...this.detectOverflowOptions
		})
	].filter(Boolean));
	get middleware() {
		return this.#middleware();
	}
	set middleware($$value) {
		return this.#middleware($$value);
	}
	floating;
	#placedSide = derived(() => getSideFromPlacement(this.floating.placement));
	get placedSide() {
		return this.#placedSide();
	}
	set placedSide($$value) {
		return this.#placedSide($$value);
	}
	#placedAlign = derived(() => getAlignFromPlacement(this.floating.placement));
	get placedAlign() {
		return this.#placedAlign();
	}
	set placedAlign($$value) {
		return this.#placedAlign($$value);
	}
	#arrowX = derived(() => this.floating.middlewareData.arrow?.x ?? 0);
	get arrowX() {
		return this.#arrowX();
	}
	set arrowX($$value) {
		return this.#arrowX($$value);
	}
	#arrowY = derived(() => this.floating.middlewareData.arrow?.y ?? 0);
	get arrowY() {
		return this.#arrowY();
	}
	set arrowY($$value) {
		return this.#arrowY($$value);
	}
	#cannotCenterArrow = derived(() => this.floating.middlewareData.arrow?.centerOffset !== 0);
	get cannotCenterArrow() {
		return this.#cannotCenterArrow();
	}
	set cannotCenterArrow($$value) {
		return this.#cannotCenterArrow($$value);
	}
	contentZIndex;
	#arrowBaseSide = derived(() => OPPOSITE_SIDE[this.placedSide]);
	get arrowBaseSide() {
		return this.#arrowBaseSide();
	}
	set arrowBaseSide($$value) {
		return this.#arrowBaseSide($$value);
	}
	#wrapperProps = derived(() => ({
		id: this.opts.wrapperId.current,
		"data-bits-floating-content-wrapper": "",
		style: {
			...this.floating.floatingStyles,
			transform: this.floating.isPositioned ? this.floating.floatingStyles.transform : "translate(0, -200%)",
			minWidth: "max-content",
			zIndex: this.contentZIndex,
			"--bits-floating-transform-origin": `${this.floating.middlewareData.transformOrigin?.x} ${this.floating.middlewareData.transformOrigin?.y}`,
			"--bits-floating-available-width": `${this.#availableWidth}px`,
			"--bits-floating-available-height": `${this.#availableHeight}px`,
			"--bits-floating-anchor-width": `${this.#anchorWidth}px`,
			"--bits-floating-anchor-height": `${this.#anchorHeight}px`,
			...this.floating.middlewareData.hide?.referenceHidden && {
				visibility: "hidden",
				"pointer-events": "none"
			},
			...this.#transformedStyle()
		},
		dir: this.opts.dir.current
	}));
	get wrapperProps() {
		return this.#wrapperProps();
	}
	set wrapperProps($$value) {
		return this.#wrapperProps($$value);
	}
	#props = derived(() => ({
		"data-side": this.placedSide,
		"data-align": this.placedAlign,
		style: styleToString({ ...this.#transformedStyle() })
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
	#arrowStyle = derived(() => ({
		position: "absolute",
		left: this.arrowX ? `${this.arrowX}px` : void 0,
		top: this.arrowY ? `${this.arrowY}px` : void 0,
		[this.arrowBaseSide]: 0,
		"transform-origin": {
			top: "",
			right: "0 0",
			bottom: "center 0",
			left: "100% 0"
		}[this.placedSide],
		transform: {
			top: "translateY(100%)",
			right: "translateY(50%) rotate(90deg) translateX(-50%)",
			bottom: "rotate(180deg)",
			left: "translateY(50%) rotate(-90deg) translateX(50%)"
		}[this.placedSide],
		visibility: this.cannotCenterArrow ? "hidden" : void 0
	}));
	get arrowStyle() {
		return this.#arrowStyle();
	}
	set arrowStyle($$value) {
		return this.#arrowStyle($$value);
	}
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		if (opts.customAnchor) this.root.customAnchorNode.current = opts.customAnchor.current;
		watch$2(() => opts.customAnchor.current, (customAnchor) => {
			this.root.customAnchorNode.current = customAnchor;
		});
		useRefById({
			id: this.opts.wrapperId,
			ref: this.wrapperRef,
			deps: () => this.opts.enabled.current
		});
		useRefById({
			id: this.opts.id,
			ref: this.contentRef,
			deps: () => this.opts.enabled.current
		});
		this.floating = useFloating({
			strategy: () => this.opts.strategy.current,
			placement: () => this.#desiredPlacement(),
			middleware: () => this.middleware,
			reference: this.root.anchorNode});
		watch$2(() => this.contentRef.current, (contentNode) => {
			if (!contentNode) return;
			this.contentZIndex = window.getComputedStyle(contentNode).zIndex;
		});
	}
};
var FloatingArrowState = class {
	opts;
	content;
	constructor(opts, content) {
		this.opts = opts;
		this.content = content;
		useRefById({
			...opts,
			onRefChange: (node) => {
				this.content.arrowRef.current = node;
			},
			deps: () => this.content.opts.enabled.current
		});
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		style: this.content.arrowStyle,
		"data-side": this.content.placedSide
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var FloatingAnchorState = class {
	opts;
	root;
	ref = box(null);
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		if (opts.virtualEl && opts.virtualEl.current) root.triggerNode = box.from(opts.virtualEl.current);
		else useRefById({
			id: opts.id,
			ref: this.ref,
			onRefChange: (node) => {
				root.triggerNode.current = node;
			}
		});
	}
};
var FloatingRootContext = new Context$1("Floating.Root");
var FloatingContentContext = new Context$1("Floating.Content");
function useFloatingRootState() {
	return FloatingRootContext.set(new FloatingRootState());
}
function useFloatingContentState(props) {
	return FloatingContentContext.set(new FloatingContentState(props, FloatingRootContext.get()));
}
function useFloatingArrowState(props) {
	return new FloatingArrowState(props, FloatingContentContext.get());
}
function useFloatingAnchorState(props) {
	return new FloatingAnchorState(props, FloatingRootContext.get());
}
function transformOrigin(options) {
	return {
		name: "transformOrigin",
		options,
		fn(data) {
			const { placement, rects, middlewareData } = data;
			const isArrowHidden = middlewareData.arrow?.centerOffset !== 0;
			const arrowWidth = isArrowHidden ? 0 : options.arrowWidth;
			const arrowHeight = isArrowHidden ? 0 : options.arrowHeight;
			const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
			const noArrowAlign = {
				start: "0%",
				center: "50%",
				end: "100%"
			}[placedAlign];
			const arrowXCenter = (middlewareData.arrow?.x ?? 0) + arrowWidth / 2;
			const arrowYCenter = (middlewareData.arrow?.y ?? 0) + arrowHeight / 2;
			let x = "";
			let y = "";
			if (placedSide === "bottom") {
				x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
				y = `${-arrowHeight}px`;
			} else if (placedSide === "top") {
				x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
				y = `${rects.floating.height + arrowHeight}px`;
			} else if (placedSide === "right") {
				x = `${-arrowHeight}px`;
				y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
			} else if (placedSide === "left") {
				x = `${rects.floating.width + arrowHeight}px`;
				y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
			}
			return { data: {
				x,
				y
			} };
		}
	};
}
function getSideAndAlignFromPlacement(placement) {
	const [side, align = "center"] = placement.split("-");
	return [side, align];
}
function getSideFromPlacement(placement) {
	return getSideAndAlignFromPlacement(placement)[0];
}
function getAlignFromPlacement(placement) {
	return getSideAndAlignFromPlacement(placement)[1];
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer.svelte
Floating_layer[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer.svelte";
function Floating_layer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { children } = $$props;
		useFloatingRootState();
		children?.($$renderer);
		$$renderer.push(`<!---->`);
	}, Floating_layer);
}
Floating_layer.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/internal/box-auto-reset.svelte.js
function boxAutoReset(defaultValue, afterMs = 1e4, onChange = noop$1) {
	let timeout = null;
	let value = defaultValue;
	function resetAfter() {
		return window.setTimeout(() => {
			value = defaultValue;
			onChange(defaultValue);
		}, afterMs);
	}
	return box.with(() => value, (v) => {
		value = v;
		onChange(v);
		if (timeout) clearTimeout(timeout);
		timeout = resetAfter();
	});
}
var SelectBaseRootState = class {
	opts;
	touchedInput = false;
	inputValue = "";
	inputNode = null;
	contentNode = null;
	triggerNode = null;
	valueId = "";
	highlightedNode = null;
	#highlightedValue = derived(() => {
		if (!this.highlightedNode) return null;
		return this.highlightedNode.getAttribute("data-value");
	});
	get highlightedValue() {
		return this.#highlightedValue();
	}
	set highlightedValue($$value) {
		return this.#highlightedValue($$value);
	}
	#highlightedId = derived(() => {
		if (!this.highlightedNode) return void 0;
		return this.highlightedNode.id;
	});
	get highlightedId() {
		return this.#highlightedId();
	}
	set highlightedId($$value) {
		return this.#highlightedId($$value);
	}
	#highlightedLabel = derived(() => {
		if (!this.highlightedNode) return null;
		return this.highlightedNode.getAttribute("data-label");
	});
	get highlightedLabel() {
		return this.#highlightedLabel();
	}
	set highlightedLabel($$value) {
		return this.#highlightedLabel($$value);
	}
	isUsingKeyboard = false;
	isCombobox = false;
	bitsAttrs;
	constructor(opts) {
		this.opts = opts;
		this.isCombobox = opts.isCombobox;
		this.bitsAttrs = getSelectBitsAttrs(this);
	}
	setHighlightedNode(node, initial = false) {
		this.highlightedNode = node;
		if (node && (this.isUsingKeyboard || initial)) node.scrollIntoView({ block: this.opts.scrollAlignment.current });
	}
	getCandidateNodes() {
		const node = this.contentNode;
		if (!node) return [];
		return Array.from(node.querySelectorAll(`[${this.bitsAttrs.item}]:not([data-disabled])`));
	}
	setHighlightedToFirstCandidate() {
		this.setHighlightedNode(null);
		const candidateNodes = this.getCandidateNodes();
		if (!candidateNodes.length) return;
		this.setHighlightedNode(candidateNodes[0]);
	}
	getNodeByValue(value) {
		return this.getCandidateNodes().find((node) => node.dataset.value === value) ?? null;
	}
	setOpen(open) {
		this.opts.open.current = open;
	}
	toggleOpen() {
		this.opts.open.current = !this.opts.open.current;
	}
	handleOpen() {
		this.setOpen(true);
	}
	handleClose() {
		this.setHighlightedNode(null);
		this.setOpen(false);
	}
	toggleMenu() {
		this.toggleOpen();
	}
};
var SelectSingleRootState = class extends SelectBaseRootState {
	opts;
	isMulti = false;
	#hasValue = derived(() => this.opts.value.current !== "");
	get hasValue() {
		return this.#hasValue();
	}
	set hasValue($$value) {
		return this.#hasValue($$value);
	}
	#currentLabel = derived(() => {
		if (!this.opts.items.current.length) return "";
		return this.opts.items.current.find((item) => item.value === this.opts.value.current)?.label ?? "";
	});
	get currentLabel() {
		return this.#currentLabel();
	}
	set currentLabel($$value) {
		return this.#currentLabel($$value);
	}
	#candidateLabels = derived(() => {
		if (!this.opts.items.current.length) return [];
		return this.opts.items.current.filter((item) => !item.disabled).map((item) => item.label);
	});
	get candidateLabels() {
		return this.#candidateLabels();
	}
	set candidateLabels($$value) {
		return this.#candidateLabels($$value);
	}
	#dataTypeaheadEnabled = derived(() => {
		if (this.isMulti) return false;
		if (this.opts.items.current.length === 0) return false;
		return true;
	});
	get dataTypeaheadEnabled() {
		return this.#dataTypeaheadEnabled();
	}
	set dataTypeaheadEnabled($$value) {
		return this.#dataTypeaheadEnabled($$value);
	}
	constructor(opts) {
		super(opts);
		this.opts = opts;
		watch$2(() => this.opts.open.current, () => {
			if (!this.opts.open.current) return;
			this.setInitialHighlightedNode();
		});
	}
	includesItem(itemValue) {
		return this.opts.value.current === itemValue;
	}
	toggleItem(itemValue, itemLabel = itemValue) {
		this.opts.value.current = this.includesItem(itemValue) ? "" : itemValue;
		this.inputValue = itemLabel;
	}
	setInitialHighlightedNode() {
		afterTick(() => {
			if (this.highlightedNode && document.contains(this.highlightedNode)) return;
			if (this.opts.value.current !== "") {
				const node = this.getNodeByValue(this.opts.value.current);
				if (node) {
					this.setHighlightedNode(node, true);
					return;
				}
			}
			const firstCandidate = this.getCandidateNodes()[0];
			if (!firstCandidate) return;
			this.setHighlightedNode(firstCandidate, true);
		});
	}
};
var SelectMultipleRootState = class extends SelectBaseRootState {
	opts;
	isMulti = true;
	#hasValue = derived(() => this.opts.value.current.length > 0);
	get hasValue() {
		return this.#hasValue();
	}
	set hasValue($$value) {
		return this.#hasValue($$value);
	}
	constructor(opts) {
		super(opts);
		this.opts = opts;
		watch$2(() => this.opts.open.current, () => {
			if (!this.opts.open.current) return;
			this.setInitialHighlightedNode();
		});
	}
	includesItem(itemValue) {
		return this.opts.value.current.includes(itemValue);
	}
	toggleItem(itemValue, itemLabel = itemValue) {
		if (this.includesItem(itemValue)) this.opts.value.current = this.opts.value.current.filter((v) => v !== itemValue);
		else this.opts.value.current = [...this.opts.value.current, itemValue];
		this.inputValue = itemLabel;
	}
	setInitialHighlightedNode() {
		afterTick(() => {
			if (this.highlightedNode && document.contains(this.highlightedNode)) return;
			if (this.opts.value.current.length && this.opts.value.current[0] !== "") {
				const node = this.getNodeByValue(this.opts.value.current[0]);
				if (node) {
					this.setHighlightedNode(node, true);
					return;
				}
			}
			const firstCandidate = this.getCandidateNodes()[0];
			if (!firstCandidate) return;
			this.setHighlightedNode(firstCandidate, true);
		});
	}
};
var SelectHiddenInputState = class {
	opts;
	root;
	#shouldRender = derived(() => this.root.opts.name.current !== "");
	get shouldRender() {
		return this.#shouldRender();
	}
	set shouldRender($$value) {
		return this.#shouldRender($$value);
	}
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.onfocus = this.onfocus.bind(this);
	}
	onfocus(e) {
		e.preventDefault();
		if (!this.root.isCombobox) this.root.triggerNode?.focus();
		else this.root.inputNode?.focus();
	}
	#props = derived(() => ({
		disabled: getDisabled(this.root.opts.disabled.current),
		required: getRequired(this.root.opts.required.current),
		name: this.root.opts.name.current,
		value: this.opts.value.current,
		onfocus: this.onfocus
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var SelectRootContext = new Context$1("Select.Root | Combobox.Root");
function useSelectRoot(props) {
	const { type, ...rest } = props;
	const rootState = type === "single" ? new SelectSingleRootState(rest) : new SelectMultipleRootState(rest);
	return SelectRootContext.set(rootState);
}
function useSelectHiddenInput(props) {
	return new SelectHiddenInputState(props, SelectRootContext.get());
}
var selectParts = [
	"trigger",
	"content",
	"item",
	"viewport",
	"scroll-up-button",
	"scroll-down-button",
	"group",
	"group-label",
	"separator",
	"arrow",
	"input",
	"content-wrapper",
	"item-text",
	"value"
];
function getSelectBitsAttrs(root) {
	const isCombobox = root.isCombobox;
	const attrObj = {};
	for (const part of selectParts) attrObj[part] = isCombobox ? `data-combobox-${part}` : `data-select-${part}`;
	return attrObj;
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/select/components/select-hidden-input.svelte
Select_hidden_input[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/select/components/select-hidden-input.svelte";
function Select_hidden_input($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { value = "" } = $$props;
		const hiddenInputState = useSelectHiddenInput({ value: box.with(() => value) });
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (hiddenInputState.shouldRender) {
				$$renderer.push("<!--[0-->");
				Hidden_input($$renderer, spread_props([hiddenInputState.props, {
					get value() {
						return value;
					},
					set value($$value) {
						value = $$value;
						$$settled = false;
					}
				}]));
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { value });
	}, Select_hidden_input);
}
Select_hidden_input.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer-anchor.svelte
Floating_layer_anchor[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer-anchor.svelte";
function Floating_layer_anchor($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { id, children, virtualEl } = $$props;
		useFloatingAnchorState({
			id: box.with(() => id),
			virtualEl: box.with(() => virtualEl)
		});
		children?.($$renderer);
		$$renderer.push(`<!---->`);
	}, Floating_layer_anchor);
}
Floating_layer_anchor.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/arrow/arrow.svelte
Arrow[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/arrow/arrow.svelte";
function Arrow($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { id = useId$1(), children, child, width = 10, height = 5, $$slots, $$events, ...restProps } = $$props;
		const mergedProps = derived(() => mergeProps(restProps, { id }));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<span${attributes({ ...mergedProps() })}>`);
			push_element($$renderer, "span", 21, 1);
			if (children) {
				$$renderer.push("<!--[0-->");
				children?.($$renderer);
				$$renderer.push(`<!---->`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<svg${attr("width", width)}${attr("height", height)} viewBox="0 0 30 10" preserveAspectRatio="none" data-arrow="">`);
				push_element($$renderer, "svg", 25, 3);
				$$renderer.push(`<polygon points="0,0 30,0 15,10" fill="currentColor">`);
				push_element($$renderer, "polygon", 26, 4);
				$$renderer.push(`</polygon>`);
				pop_element();
				$$renderer.push(`</svg>`);
				pop_element();
			}
			$$renderer.push(`<!--]--></span>`);
			pop_element();
		}
		$$renderer.push(`<!--]-->`);
	}, Arrow);
}
Arrow.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer-arrow.svelte
Floating_layer_arrow[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer-arrow.svelte";
function Floating_layer_arrow($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { id = useId$1(), ref = null, $$slots, $$events, ...restProps } = $$props;
		const arrowState = useFloatingArrowState({
			id: box.with(() => id),
			ref: box.with(() => ref, (v) => ref = v)
		});
		Arrow($$renderer, spread_props([derived(() => mergeProps(restProps, arrowState.props))()]));
		bind_props($$props, { ref });
	}, Floating_layer_arrow);
}
Floating_layer_arrow.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer-content.svelte
Floating_layer_content[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer-content.svelte";
function Floating_layer_content($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { content, side = "bottom", sideOffset = 0, align = "center", alignOffset = 0, id, arrowPadding = 0, avoidCollisions = true, collisionBoundary = [], collisionPadding = 0, hideWhenDetached = false, onPlaced = () => {}, sticky = "partial", updatePositionStrategy = "optimized", strategy = "fixed", dir = "ltr", style = {}, wrapperId = useId$1(), customAnchor = null, enabled } = $$props;
		const contentState = useFloatingContentState({
			side: box.with(() => side),
			sideOffset: box.with(() => sideOffset),
			align: box.with(() => align),
			alignOffset: box.with(() => alignOffset),
			id: box.with(() => id),
			arrowPadding: box.with(() => arrowPadding),
			avoidCollisions: box.with(() => avoidCollisions),
			collisionBoundary: box.with(() => collisionBoundary),
			collisionPadding: box.with(() => collisionPadding),
			hideWhenDetached: box.with(() => hideWhenDetached),
			onPlaced: box.with(() => onPlaced),
			sticky: box.with(() => sticky),
			updatePositionStrategy: box.with(() => updatePositionStrategy),
			strategy: box.with(() => strategy),
			dir: box.with(() => dir),
			style: box.with(() => style),
			enabled: box.with(() => enabled),
			wrapperId: box.with(() => wrapperId),
			customAnchor: box.with(() => customAnchor)
		});
		const mergedProps = derived(() => mergeProps(contentState.wrapperProps, { style: { pointerEvents: "auto" } }));
		content?.($$renderer, {
			props: contentState.props,
			wrapperProps: mergedProps()
		});
		$$renderer.push(`<!---->`);
	}, Floating_layer_content);
}
Floating_layer_content.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer-content-static.svelte
Floating_layer_content_static[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer-content-static.svelte";
function Floating_layer_content_static($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { content, onPlaced } = $$props;
		content?.($$renderer, {
			props: {},
			wrapperProps: {}
		});
		$$renderer.push(`<!---->`);
	}, Floating_layer_content_static);
}
Floating_layer_content_static.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-content.svelte
Popper_content[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-content.svelte";
function Popper_content($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { content, isStatic = false, onPlaced, $$slots, $$events, ...restProps } = $$props;
		if (isStatic) {
			$$renderer.push("<!--[0-->");
			Floating_layer_content_static($$renderer, {
				content,
				onPlaced
			});
		} else {
			$$renderer.push("<!--[-1-->");
			Floating_layer_content($$renderer, spread_props([{
				content,
				onPlaced
			}, restProps]));
		}
		$$renderer.push(`<!--]-->`);
	}, Popper_content);
}
Popper_content.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-layer-inner.svelte
Popper_layer_inner[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-layer-inner.svelte";
function Popper_layer_inner($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { popper, onEscapeKeydown, escapeKeydownBehavior, preventOverflowTextSelection, id, onPointerDown, onPointerUp, side, sideOffset, align, alignOffset, arrowPadding, avoidCollisions, collisionBoundary, collisionPadding, sticky, hideWhenDetached, updatePositionStrategy, strategy, dir, preventScroll, wrapperId, style, onPlaced, onInteractOutside, onCloseAutoFocus, onOpenAutoFocus, onFocusOutside, interactOutsideBehavior = "close", loop, trapFocus = true, isValidEvent = () => false, customAnchor = null, isStatic = false, enabled, $$slots, $$events, ...restProps } = $$props;
		{
			prevent_snippet_stringification(content);
			function content($$renderer, { props: floatingProps, wrapperProps }) {
				validate_snippet_args($$renderer);
				if (restProps.forceMount && enabled) {
					$$renderer.push("<!--[0-->");
					Scroll_lock($$renderer, { preventScroll });
				} else if (!restProps.forceMount) {
					$$renderer.push("<!--[1-->");
					Scroll_lock($$renderer, { preventScroll });
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				{
					prevent_snippet_stringification(focusScope);
					function focusScope($$renderer, { props: focusScopeProps }) {
						validate_snippet_args($$renderer);
						Escape_layer($$renderer, {
							onEscapeKeydown,
							escapeKeydownBehavior,
							enabled,
							children: prevent_snippet_stringification(($$renderer) => {
								{
									prevent_snippet_stringification(children);
									function children($$renderer, { props: dismissibleProps }) {
										validate_snippet_args($$renderer);
										Text_selection_layer($$renderer, {
											id,
											preventOverflowTextSelection,
											onPointerDown,
											onPointerUp,
											enabled,
											children: prevent_snippet_stringification(($$renderer) => {
												popper?.($$renderer, {
													props: mergeProps(restProps, floatingProps, dismissibleProps, focusScopeProps, { style: { pointerEvents: "auto" } }),
													wrapperProps
												});
												$$renderer.push(`<!---->`);
											})});
									}
									Dismissible_layer($$renderer, {
										id,
										onInteractOutside,
										onFocusOutside,
										interactOutsideBehavior,
										isValidEvent,
										enabled,
										children});
								}
							})});
					}
					Focus_scope($$renderer, {
						id,
						onOpenAutoFocus,
						onCloseAutoFocus,
						loop,
						trapFocus: enabled && trapFocus,
						forceMount: restProps.forceMount,
						focusScope});
				}
				$$renderer.push(`<!---->`);
			}
			Popper_content($$renderer, {
				isStatic,
				id,
				side,
				sideOffset,
				align,
				alignOffset,
				arrowPadding,
				avoidCollisions,
				collisionBoundary,
				collisionPadding,
				sticky,
				hideWhenDetached,
				updatePositionStrategy,
				strategy,
				dir,
				wrapperId,
				style,
				onPlaced,
				customAnchor,
				enabled,
				content,
				$$slots: { content: true }
			});
		}
	}, Popper_layer_inner);
}
Popper_layer_inner.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-layer.svelte
Popper_layer[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-layer.svelte";
function Popper_layer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { popper, present, onEscapeKeydown, escapeKeydownBehavior, preventOverflowTextSelection, id, onPointerDown, onPointerUp, side, sideOffset, align, alignOffset, arrowPadding, avoidCollisions, collisionBoundary, collisionPadding, sticky, hideWhenDetached, updatePositionStrategy, strategy, dir, preventScroll, wrapperId, style, onPlaced, onInteractOutside, onCloseAutoFocus, onOpenAutoFocus, onFocusOutside, interactOutsideBehavior = "close", loop, trapFocus = true, isValidEvent = () => false, customAnchor = null, isStatic = false, $$slots, $$events, ...restProps } = $$props;
		{
			prevent_snippet_stringification(presence);
			function presence($$renderer) {
				validate_snippet_args($$renderer);
				Popper_layer_inner($$renderer, spread_props([{
					popper,
					onEscapeKeydown,
					escapeKeydownBehavior,
					preventOverflowTextSelection,
					id,
					onPointerDown,
					onPointerUp,
					side,
					sideOffset,
					align,
					alignOffset,
					arrowPadding,
					avoidCollisions,
					collisionBoundary,
					collisionPadding,
					sticky,
					hideWhenDetached,
					updatePositionStrategy,
					strategy,
					dir,
					preventScroll,
					wrapperId,
					style,
					onPlaced,
					customAnchor,
					isStatic,
					enabled: present,
					onInteractOutside,
					onCloseAutoFocus,
					onOpenAutoFocus,
					interactOutsideBehavior,
					loop,
					trapFocus,
					isValidEvent,
					onFocusOutside,
					forceMount: false
				}, restProps]));
			}
			Presence_layer($$renderer, spread_props([
				{
					id,
					present
				},
				restProps,
				{
					presence,
					$$slots: { presence: true }
				}
			]));
		}
	}, Popper_layer);
}
Popper_layer.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-layer-force-mount.svelte
Popper_layer_force_mount[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-layer-force-mount.svelte";
function Popper_layer_force_mount($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { popper, onEscapeKeydown, escapeKeydownBehavior, preventOverflowTextSelection, id, onPointerDown, onPointerUp, side, sideOffset, align, alignOffset, arrowPadding, avoidCollisions, collisionBoundary, collisionPadding, sticky, hideWhenDetached, updatePositionStrategy, strategy, dir, preventScroll, wrapperId, style, onPlaced, onInteractOutside, onCloseAutoFocus, onOpenAutoFocus, onFocusOutside, interactOutsideBehavior = "close", loop, trapFocus = true, isValidEvent = () => false, customAnchor = null, isStatic = false, enabled, $$slots, $$events, ...restProps } = $$props;
		Popper_layer_inner($$renderer, spread_props([
			{
				popper,
				onEscapeKeydown,
				escapeKeydownBehavior,
				preventOverflowTextSelection,
				id,
				onPointerDown,
				onPointerUp,
				side,
				sideOffset,
				align,
				alignOffset,
				arrowPadding,
				avoidCollisions,
				collisionBoundary,
				collisionPadding,
				sticky,
				hideWhenDetached,
				updatePositionStrategy,
				strategy,
				dir,
				preventScroll,
				wrapperId,
				style,
				onPlaced,
				customAnchor,
				isStatic,
				enabled,
				onInteractOutside,
				onCloseAutoFocus,
				onOpenAutoFocus,
				interactOutsideBehavior,
				loop,
				trapFocus,
				isValidEvent,
				onFocusOutside
			},
			restProps,
			{ forceMount: true }
		]));
	}, Popper_layer_force_mount);
}
Popper_layer_force_mount.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/internal/use-grace-area.svelte.js
function useGraceArea(opts) {
	const enabled = derived(() => opts.enabled());
	const isPointerInTransit = boxAutoReset(false, opts.transitTimeout ?? 300, (value) => {
		if (enabled()) opts.setIsPointerInTransit?.(value);
	});
	let pointerGraceArea = null;
	function handleRemoveGraceArea() {
		pointerGraceArea = null;
		isPointerInTransit.current = false;
	}
	function handleCreateGraceArea(e, hoverTarget) {
		const currentTarget = e.currentTarget;
		if (!isHTMLElement(currentTarget)) return;
		const exitPoint = {
			x: e.clientX,
			y: e.clientY
		};
		const paddedExitPoints = getPaddedExitPoints(exitPoint, getExitSideFromRect(exitPoint, currentTarget.getBoundingClientRect()));
		const hoverTargetPoints = getPointsFromRect(hoverTarget.getBoundingClientRect());
		pointerGraceArea = getHull([...paddedExitPoints, ...hoverTargetPoints]);
		isPointerInTransit.current = true;
	}
	watch$2([
		opts.triggerNode,
		opts.contentNode,
		opts.enabled
	], ([triggerNode, contentNode, enabled]) => {
		if (!triggerNode || !contentNode || !enabled) return;
		const handleTriggerLeave = (e) => {
			handleCreateGraceArea(e, contentNode);
		};
		const handleContentLeave = (e) => {
			handleCreateGraceArea(e, triggerNode);
		};
		return executeCallbacks(on(triggerNode, "pointerleave", handleTriggerLeave), on(contentNode, "pointerleave", handleContentLeave));
	});
	watch$2(() => pointerGraceArea, () => {
		const handleTrackPointerGrace = (e) => {
			if (!pointerGraceArea) return;
			const target = e.target;
			if (!isElement(target)) return;
			const pointerPosition = {
				x: e.clientX,
				y: e.clientY
			};
			const hasEnteredTarget = opts.triggerNode()?.contains(target) || opts.contentNode()?.contains(target);
			const isPointerOutsideGraceArea = !isPointInPolygon(pointerPosition, pointerGraceArea);
			if (hasEnteredTarget) handleRemoveGraceArea();
			else if (isPointerOutsideGraceArea) {
				handleRemoveGraceArea();
				opts.onPointerExit();
			}
		};
		return on(document, "pointermove", handleTrackPointerGrace);
	});
	return { isPointerInTransit };
}
function getExitSideFromRect(point, rect) {
	const top = Math.abs(rect.top - point.y);
	const bottom = Math.abs(rect.bottom - point.y);
	const right = Math.abs(rect.right - point.x);
	const left = Math.abs(rect.left - point.x);
	switch (Math.min(top, bottom, right, left)) {
		case left: return "left";
		case right: return "right";
		case top: return "top";
		case bottom: return "bottom";
		default: throw new Error("unreachable");
	}
}
function getPaddedExitPoints(exitPoint, exitSide, padding = 5) {
	const tipPadding = padding * 1.5;
	switch (exitSide) {
		case "top": return [
			{
				x: exitPoint.x - padding,
				y: exitPoint.y + padding
			},
			{
				x: exitPoint.x,
				y: exitPoint.y - tipPadding
			},
			{
				x: exitPoint.x + padding,
				y: exitPoint.y + padding
			}
		];
		case "bottom": return [
			{
				x: exitPoint.x - padding,
				y: exitPoint.y - padding
			},
			{
				x: exitPoint.x,
				y: exitPoint.y + tipPadding
			},
			{
				x: exitPoint.x + padding,
				y: exitPoint.y - padding
			}
		];
		case "left": return [
			{
				x: exitPoint.x + padding,
				y: exitPoint.y - padding
			},
			{
				x: exitPoint.x - tipPadding,
				y: exitPoint.y
			},
			{
				x: exitPoint.x + padding,
				y: exitPoint.y + padding
			}
		];
		case "right": return [
			{
				x: exitPoint.x - padding,
				y: exitPoint.y - padding
			},
			{
				x: exitPoint.x + tipPadding,
				y: exitPoint.y
			},
			{
				x: exitPoint.x - padding,
				y: exitPoint.y + padding
			}
		];
	}
}
function getPointsFromRect(rect) {
	const { top, right, bottom, left } = rect;
	return [
		{
			x: left,
			y: top
		},
		{
			x: right,
			y: top
		},
		{
			x: right,
			y: bottom
		},
		{
			x: left,
			y: bottom
		}
	];
}
function isPointInPolygon(point, polygon) {
	const { x, y } = point;
	let inside = false;
	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		const xi = polygon[i].x;
		const yi = polygon[i].y;
		const xj = polygon[j].x;
		const yj = polygon[j].y;
		if (yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
	}
	return inside;
}
function getHull(points) {
	const newPoints = points.slice();
	newPoints.sort((a, b) => {
		if (a.x < b.x) return -1;
		else if (a.x > b.x) return 1;
		else if (a.y < b.y) return -1;
		else if (a.y > b.y) return 1;
		else return 0;
	});
	return getHullPresorted(newPoints);
}
function getHullPresorted(points) {
	if (points.length <= 1) return points.slice();
	const upperHull = [];
	for (let i = 0; i < points.length; i++) {
		const p = points[i];
		while (upperHull.length >= 2) {
			const q = upperHull[upperHull.length - 1];
			const r = upperHull[upperHull.length - 2];
			if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) upperHull.pop();
			else break;
		}
		upperHull.push(p);
	}
	upperHull.pop();
	const lowerHull = [];
	for (let i = points.length - 1; i >= 0; i--) {
		const p = points[i];
		while (lowerHull.length >= 2) {
			const q = lowerHull[lowerHull.length - 1];
			const r = lowerHull[lowerHull.length - 2];
			if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) lowerHull.pop();
			else break;
		}
		lowerHull.push(p);
	}
	lowerHull.pop();
	if (upperHull.length === 1 && lowerHull.length === 1 && upperHull[0].x === lowerHull[0].x && upperHull[0].y === lowerHull[0].y) return upperHull;
	else return upperHull.concat(lowerHull);
}
var MenuRootContext = new Context$1("Menu.Root");
var MenuMenuContext = new Context$1("Menu.Root | Menu.Sub");
var MenuRootState = class {
	opts;
	isUsingKeyboard = new IsUsingKeyboard();
	ignoreCloseAutoFocus = false;
	isPointerInTransit = false;
	constructor(opts) {
		this.opts = opts;
	}
	getAttr(name) {
		return `data-${this.opts.variant.current}-${name}`;
	}
};
var MenuMenuState = class {
	opts;
	root;
	parentMenu;
	contentId = box.with(() => "");
	contentNode = null;
	triggerNode = null;
	constructor(opts, root, parentMenu) {
		this.opts = opts;
		this.root = root;
		this.parentMenu = parentMenu;
		if (parentMenu) watch$2(() => parentMenu.opts.open.current, () => {
			if (parentMenu.opts.open.current) return;
			this.opts.open.current = false;
		});
	}
	toggleOpen() {
		this.opts.open.current = !this.opts.open.current;
	}
	onOpen() {
		this.opts.open.current = true;
	}
	onClose() {
		this.opts.open.current = false;
	}
};
function useMenuRoot(props) {
	const root = new MenuRootState(props);
	FocusScopeContext.set({ get ignoreCloseAutoFocus() {
		return root.ignoreCloseAutoFocus;
	} });
	return MenuRootContext.set(root);
}
function useMenuMenu(root, props) {
	return MenuMenuContext.set(new MenuMenuState(props, root, null));
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/context-menu/components/context-menu.svelte
Context_menu$1[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/context-menu/components/context-menu.svelte";
function Context_menu$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open = false, dir = "ltr", onOpenChange = noop$1, children } = $$props;
		useMenuMenu(useMenuRoot({
			variant: box.with(() => "context-menu"),
			dir: box.with(() => dir),
			onClose: () => {
				open = false;
				onOpenChange?.(false);
			}
		}), { open: box.with(() => open, (v) => {
			open = v;
			onOpenChange(v);
		}) });
		Floating_layer($$renderer, {
			children: prevent_snippet_stringification(($$renderer) => {
				children?.($$renderer);
				$$renderer.push(`<!---->`);
			})});
		bind_props($$props, { open });
	}, Context_menu$1);
}
Context_menu$1.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/dialog/components/dialog.svelte
Dialog$1[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/dialog/components/dialog.svelte";
function Dialog$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open = false, onOpenChange = noop$1, children } = $$props;
		useDialogRoot({
			variant: box.with(() => "dialog"),
			open: box.with(() => open, (v) => {
				open = v;
				onOpenChange(v);
			})
		});
		children?.($$renderer);
		$$renderer.push(`<!---->`);
		bind_props($$props, { open });
	}, Dialog$1);
}
Dialog$1.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/dialog/components/dialog-content.svelte
Dialog_content$1[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/dialog/components/dialog-content.svelte";
function Dialog_content$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { id = useId$1(), children, child, ref = null, forceMount = false, onCloseAutoFocus = noop$1, onOpenAutoFocus = noop$1, onEscapeKeydown = noop$1, onInteractOutside = noop$1, trapFocus = true, preventScroll = true, restoreScrollDelay = null, $$slots, $$events, ...restProps } = $$props;
		const contentState = useDialogContent({
			id: box.with(() => id),
			ref: box.with(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, contentState.props));
		{
			prevent_snippet_stringification(presence);
			function presence($$renderer) {
				validate_snippet_args($$renderer);
				{
					prevent_snippet_stringification(focusScope);
					function focusScope($$renderer, { props: focusScopeProps }) {
						validate_snippet_args($$renderer);
						Escape_layer($$renderer, spread_props([mergedProps(), {
							enabled: contentState.root.opts.open.current,
							onEscapeKeydown: (e) => {
								onEscapeKeydown(e);
								if (e.defaultPrevented) return;
								contentState.root.handleClose();
							},
							children: prevent_snippet_stringification(($$renderer) => {
								Dismissible_layer($$renderer, spread_props([mergedProps(), {
									enabled: contentState.root.opts.open.current,
									onInteractOutside: (e) => {
										onInteractOutside(e);
										if (e.defaultPrevented) return;
										contentState.root.handleClose();
									},
									children: prevent_snippet_stringification(($$renderer) => {
										Text_selection_layer($$renderer, spread_props([mergedProps(), {
											enabled: contentState.root.opts.open.current,
											children: prevent_snippet_stringification(($$renderer) => {
												if (child) {
													$$renderer.push("<!--[0-->");
													if (contentState.root.opts.open.current) {
														$$renderer.push("<!--[0-->");
														Scroll_lock($$renderer, {
															preventScroll,
															restoreScrollDelay
														});
													} else $$renderer.push("<!--[-1-->");
													$$renderer.push(`<!--]--> `);
													child($$renderer, {
														props: mergeProps(mergedProps(), focusScopeProps),
														...contentState.snippetProps
													});
													$$renderer.push(`<!---->`);
												} else {
													$$renderer.push("<!--[-1-->");
													Scroll_lock($$renderer, { preventScroll });
													$$renderer.push(`<!----> <div${attributes({ ...mergeProps(mergedProps(), focusScopeProps) })}>`);
													push_element($$renderer, "div", 97, 8);
													children?.($$renderer);
													$$renderer.push(`<!----></div>`);
													pop_element();
												}
												$$renderer.push(`<!--]-->`);
											}),
											$$slots: { default: true }
										}]));
									}),
									$$slots: { default: true }
								}]));
							}),
							$$slots: { default: true }
						}]));
					}
					Focus_scope($$renderer, {
						loop: true,
						trapFocus: shouldTrapFocus({
							forceMount,
							present: contentState.root.opts.open.current,
							trapFocus,
							open: contentState.root.opts.open.current
						}),
						onOpenAutoFocus,
						id,
						onCloseAutoFocus: (e) => {
							onCloseAutoFocus(e);
							if (e.defaultPrevented) return;
							contentState.root.triggerNode?.focus();
						},
						focusScope});
				}
			}
			Presence_layer($$renderer, spread_props([mergedProps(), {
				forceMount,
				present: contentState.root.opts.open.current || forceMount,
				presence,
				$$slots: { presence: true }
			}]));
		}
		bind_props($$props, { ref });
	}, Dialog_content$1);
}
Dialog_content$1.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/label/label.svelte.js
var ROOT_ATTR = "data-label-root";
var LabelRootState = class {
	opts;
	constructor(opts) {
		this.opts = opts;
		this.onmousedown = this.onmousedown.bind(this);
		useRefById(opts);
	}
	onmousedown(e) {
		if (e.detail > 1) e.preventDefault();
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		[ROOT_ATTR]: "",
		onmousedown: this.onmousedown
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
function setLabelRootState(props) {
	return new LabelRootState(props);
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/label/components/label.svelte
Label$1[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/label/components/label.svelte";
function Label$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { children, child, id = useId$1(), ref = null, for: forProp, $$slots, $$events, ...restProps } = $$props;
		const rootState = setLabelRootState({
			id: box.with(() => id),
			ref: box.with(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, rootState.props, { for: forProp }));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<label${attributes({
				...mergedProps(),
				for: forProp
			})}>`);
			push_element($$renderer, "label", 29, 1);
			children?.($$renderer);
			$$renderer.push(`<!----></label>`);
			pop_element();
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	}, Label$1);
}
Label$1.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/select/components/select.svelte
Select$1[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/select/components/select.svelte";
function Select$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { value = void 0, onValueChange = noop$1, name = "", disabled = false, type, open = false, onOpenChange = noop$1, loop = false, scrollAlignment = "nearest", required = false, items = [], allowDeselect = false, children } = $$props;
		function handleDefaultValue() {
			if (value !== void 0) return;
			value = type === "single" ? "" : [];
		}
		handleDefaultValue();
		watch$2.pre(() => value, () => {
			handleDefaultValue();
		});
		const rootState = useSelectRoot({
			type,
			value: box.with(() => value, (v) => {
				value = v;
				onValueChange(v);
			}),
			disabled: box.with(() => disabled),
			required: box.with(() => required),
			open: box.with(() => open, (v) => {
				open = v;
				onOpenChange(v);
			}),
			loop: box.with(() => loop),
			scrollAlignment: box.with(() => scrollAlignment),
			name: box.with(() => name),
			isCombobox: false,
			items: box.with(() => items),
			allowDeselect: box.with(() => allowDeselect)
		});
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			Floating_layer($$renderer, {
				children: prevent_snippet_stringification(($$renderer) => {
					children?.($$renderer);
					$$renderer.push(`<!---->`);
				})});
			$$renderer.push(`<!----> `);
			if (Array.isArray(rootState.opts.value.current)) {
				$$renderer.push("<!--[0-->");
				if (rootState.opts.value.current.length) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<!--[-->`);
					const each_array = ensure_array_like(rootState.opts.value.current);
					for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
						let item = each_array[$$index];
						Select_hidden_input($$renderer, { value: item });
					}
					$$renderer.push(`<!--]-->`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]-->`);
			} else {
				$$renderer.push("<!--[-1-->");
				Select_hidden_input($$renderer, {
					get value() {
						return rootState.opts.value.current;
					},
					set value($$value) {
						rootState.opts.value.current = $$value;
						$$settled = false;
					}
				});
			}
			$$renderer.push(`<!--]-->`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, {
			value,
			open
		});
	}, Select$1);
}
Select$1.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/internal/use-timeout-fn.svelte.js
function useTimeoutFn(cb, interval, options = {}) {
	const { immediate = true } = options;
	const isPending = box(false);
	let timer;
	function clear() {
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
	}
	function stop() {
		isPending.current = false;
		clear();
	}
	function start(...args) {
		clear();
		isPending.current = true;
		timer = setTimeout(() => {
			isPending.current = false;
			timer = null;
			cb(...args);
		}, interval);
	}
	if (immediate) {
		isPending.current = true;
		if (isBrowser$3) start();
	}
	return {
		isPending: box.readonly(isPending),
		start,
		stop
	};
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/tooltip/tooltip.svelte.js
var TOOLTIP_CONTENT_ATTR = "data-tooltip-content";
var TOOLTIP_TRIGGER_ATTR = "data-tooltip-trigger";
var TooltipRootState = class {
	opts;
	provider;
	#delayDuration = derived(() => this.opts.delayDuration.current ?? this.provider.opts.delayDuration.current);
	get delayDuration() {
		return this.#delayDuration();
	}
	set delayDuration($$value) {
		return this.#delayDuration($$value);
	}
	#disableHoverableContent = derived(() => this.opts.disableHoverableContent.current ?? this.provider.opts.disableHoverableContent.current);
	get disableHoverableContent() {
		return this.#disableHoverableContent();
	}
	set disableHoverableContent($$value) {
		return this.#disableHoverableContent($$value);
	}
	#disableCloseOnTriggerClick = derived(() => this.opts.disableCloseOnTriggerClick.current ?? this.provider.opts.disableCloseOnTriggerClick.current);
	get disableCloseOnTriggerClick() {
		return this.#disableCloseOnTriggerClick();
	}
	set disableCloseOnTriggerClick($$value) {
		return this.#disableCloseOnTriggerClick($$value);
	}
	#disabled = derived(() => this.opts.disabled.current ?? this.provider.opts.disabled.current);
	get disabled() {
		return this.#disabled();
	}
	set disabled($$value) {
		return this.#disabled($$value);
	}
	#ignoreNonKeyboardFocus = derived(() => this.opts.ignoreNonKeyboardFocus.current ?? this.provider.opts.ignoreNonKeyboardFocus.current);
	get ignoreNonKeyboardFocus() {
		return this.#ignoreNonKeyboardFocus();
	}
	set ignoreNonKeyboardFocus($$value) {
		return this.#ignoreNonKeyboardFocus($$value);
	}
	contentNode = null;
	triggerNode = null;
	#wasOpenDelayed = false;
	#timerFn;
	#stateAttr = derived(() => {
		if (!this.opts.open.current) return "closed";
		return this.#wasOpenDelayed ? "delayed-open" : "instant-open";
	});
	get stateAttr() {
		return this.#stateAttr();
	}
	set stateAttr($$value) {
		return this.#stateAttr($$value);
	}
	constructor(opts, provider) {
		this.opts = opts;
		this.provider = provider;
		this.#timerFn = useTimeoutFn(() => {
			this.#wasOpenDelayed = true;
			this.opts.open.current = true;
		}, this.delayDuration ?? 0, { immediate: false });
		watch$2(() => this.delayDuration, () => {
			if (this.delayDuration === void 0) return;
			this.#timerFn = useTimeoutFn(() => {
				this.#wasOpenDelayed = true;
				this.opts.open.current = true;
			}, this.delayDuration, { immediate: false });
		});
		watch$2(() => this.opts.open.current, (isOpen) => {
			if (isOpen) this.provider.onOpen(this);
			else this.provider.onClose(this);
		});
	}
	handleOpen = () => {
		this.#timerFn.stop();
		this.#wasOpenDelayed = false;
		this.opts.open.current = true;
	};
	handleClose = () => {
		this.#timerFn.stop();
		this.opts.open.current = false;
	};
	#handleDelayedOpen = () => {
		this.#timerFn.stop();
		const shouldSkipDelay = !this.provider.isOpenDelayed;
		const delayDuration = this.delayDuration ?? 0;
		if (shouldSkipDelay || delayDuration === 0) {
			this.#wasOpenDelayed = delayDuration > 0 && shouldSkipDelay;
			this.opts.open.current = true;
		} else this.#timerFn.start();
	};
	onTriggerEnter = () => {
		this.#handleDelayedOpen();
	};
	onTriggerLeave = () => {
		if (this.disableHoverableContent) this.handleClose();
		else this.#timerFn.stop();
	};
};
var TooltipTriggerState = class {
	opts;
	root;
	#isPointerDown = box(false);
	#hasPointerMoveOpened = false;
	#isDisabled = derived(() => this.opts.disabled.current || this.root.disabled);
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		useRefById({
			...opts,
			onRefChange: (node) => {
				this.root.triggerNode = node;
			}
		});
	}
	handlePointerUp = () => {
		this.#isPointerDown.current = false;
	};
	#onpointerup = () => {
		if (this.#isDisabled()) return;
		this.#isPointerDown.current = false;
	};
	#onpointerdown = () => {
		if (this.#isDisabled()) return;
		this.#isPointerDown.current = true;
		document.addEventListener("pointerup", () => {
			this.handlePointerUp();
		}, { once: true });
	};
	#onpointermove = (e) => {
		if (this.#isDisabled()) return;
		if (e.pointerType === "touch") return;
		if (this.#hasPointerMoveOpened) return;
		if (this.root.provider.isPointerInTransit.current) return;
		this.root.onTriggerEnter();
		this.#hasPointerMoveOpened = true;
	};
	#onpointerleave = () => {
		if (this.#isDisabled()) return;
		this.root.onTriggerLeave();
		this.#hasPointerMoveOpened = false;
	};
	#onfocus = (e) => {
		if (this.#isPointerDown.current || this.#isDisabled()) return;
		if (this.root.ignoreNonKeyboardFocus && !isFocusVisible(e.currentTarget)) return;
		this.root.handleOpen();
	};
	#onblur = () => {
		if (this.#isDisabled()) return;
		this.root.handleClose();
	};
	#onclick = () => {
		if (this.root.disableCloseOnTriggerClick || this.#isDisabled()) return;
		this.root.handleClose();
	};
	#props = derived(() => ({
		id: this.opts.id.current,
		"aria-describedby": this.root.opts.open.current ? this.root.contentNode?.id : void 0,
		"data-state": this.root.stateAttr,
		"data-disabled": getDataDisabled(this.#isDisabled()),
		"data-delay-duration": `${this.root.delayDuration}`,
		[TOOLTIP_TRIGGER_ATTR]: "",
		tabindex: this.#isDisabled() ? void 0 : 0,
		disabled: this.opts.disabled.current,
		onpointerup: this.#onpointerup,
		onpointerdown: this.#onpointerdown,
		onpointermove: this.#onpointermove,
		onpointerleave: this.#onpointerleave,
		onfocus: this.#onfocus,
		onblur: this.#onblur,
		onclick: this.#onclick
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var TooltipContentState = class {
	opts;
	root;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		useRefById({
			...opts,
			onRefChange: (node) => {
				this.root.contentNode = node;
			},
			deps: () => this.root.opts.open.current
		});
		useGraceArea({
			triggerNode: () => this.root.triggerNode,
			contentNode: () => this.root.contentNode,
			enabled: () => this.root.opts.open.current && !this.root.disableHoverableContent,
			onPointerExit: () => {
				if (this.root.provider.isTooltipOpen(this.root)) this.root.handleClose();
			},
			setIsPointerInTransit: (value) => {
				this.root.provider.isPointerInTransit.current = value;
			},
			transitTimeout: this.root.provider.opts.skipDelayDuration.current
		});
	}
	onInteractOutside = (e) => {
		if (isElement(e.target) && this.root.triggerNode?.contains(e.target) && this.root.disableCloseOnTriggerClick) {
			e.preventDefault();
			return;
		}
		this.opts.onInteractOutside.current(e);
		if (e.defaultPrevented) return;
		this.root.handleClose();
	};
	onEscapeKeydown = (e) => {
		this.opts.onEscapeKeydown.current?.(e);
		if (e.defaultPrevented) return;
		this.root.handleClose();
	};
	onOpenAutoFocus = (e) => {
		e.preventDefault();
	};
	onCloseAutoFocus = (e) => {
		e.preventDefault();
	};
	#snippetProps = derived(() => ({ open: this.root.opts.open.current }));
	get snippetProps() {
		return this.#snippetProps();
	}
	set snippetProps($$value) {
		return this.#snippetProps($$value);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		"data-state": this.root.stateAttr,
		"data-disabled": getDataDisabled(this.root.disabled),
		style: {
			pointerEvents: "auto",
			outline: "none"
		},
		[TOOLTIP_CONTENT_ATTR]: ""
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
	popperProps = {
		onInteractOutside: this.onInteractOutside,
		onEscapeKeydown: this.onEscapeKeydown,
		onOpenAutoFocus: this.onOpenAutoFocus,
		onCloseAutoFocus: this.onCloseAutoFocus
	};
};
var TooltipProviderContext = new Context$1("Tooltip.Provider");
var TooltipRootContext = new Context$1("Tooltip.Root");
function useTooltipRoot(props) {
	return TooltipRootContext.set(new TooltipRootState(props, TooltipProviderContext.get()));
}
function useTooltipTrigger(props) {
	return new TooltipTriggerState(props, TooltipRootContext.get());
}
function useTooltipContent(props) {
	return new TooltipContentState(props, TooltipRootContext.get());
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/tooltip/components/tooltip.svelte
Tooltip$1[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/tooltip/components/tooltip.svelte";
function Tooltip$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open = false, onOpenChange = noop$1, disabled, delayDuration, disableCloseOnTriggerClick, disableHoverableContent, ignoreNonKeyboardFocus, children } = $$props;
		useTooltipRoot({
			open: box.with(() => open, (v) => {
				open = v;
				onOpenChange(v);
			}),
			delayDuration: box.with(() => delayDuration),
			disableCloseOnTriggerClick: box.with(() => disableCloseOnTriggerClick),
			disableHoverableContent: box.with(() => disableHoverableContent),
			ignoreNonKeyboardFocus: box.with(() => ignoreNonKeyboardFocus),
			disabled: box.with(() => disabled)
		});
		Floating_layer($$renderer, {
			children: prevent_snippet_stringification(($$renderer) => {
				children?.($$renderer);
				$$renderer.push(`<!---->`);
			})});
		bind_props($$props, { open });
	}, Tooltip$1);
}
Tooltip$1.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/tooltip/components/tooltip-content.svelte
Tooltip_content$1[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/tooltip/components/tooltip-content.svelte";
function Tooltip_content$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { children, child, id = useId$1(), ref = null, side = "top", sideOffset = 0, align = "center", avoidCollisions = true, arrowPadding = 0, sticky = "partial", hideWhenDetached = false, collisionPadding = 0, onInteractOutside = noop$1, onEscapeKeydown = noop$1, forceMount = false, $$slots, $$events, ...restProps } = $$props;
		const contentState = useTooltipContent({
			id: box.with(() => id),
			ref: box.with(() => ref, (v) => ref = v),
			onInteractOutside: box.with(() => onInteractOutside),
			onEscapeKeydown: box.with(() => onEscapeKeydown)
		});
		const floatingProps = derived(() => ({
			side,
			sideOffset,
			align,
			avoidCollisions,
			arrowPadding,
			sticky,
			hideWhenDetached,
			collisionPadding
		}));
		const mergedProps = derived(() => mergeProps(restProps, floatingProps(), contentState.props));
		if (forceMount) {
			$$renderer.push("<!--[0-->");
			{
				prevent_snippet_stringification(popper);
				function popper($$renderer, { props, wrapperProps }) {
					validate_snippet_args($$renderer);
					const mergedProps = mergeProps(props, { style: getFloatingContentCSSVars("tooltip") });
					if (child) {
						$$renderer.push("<!--[0-->");
						child($$renderer, {
							props: mergedProps,
							wrapperProps,
							...contentState.snippetProps
						});
						$$renderer.push(`<!---->`);
					} else {
						$$renderer.push("<!--[-1-->");
						$$renderer.push(`<div${attributes({ ...wrapperProps })}>`);
						push_element($$renderer, "div", 72, 4);
						$$renderer.push(`<div${attributes({ ...mergedProps })}>`);
						push_element($$renderer, "div", 73, 5);
						children?.($$renderer);
						$$renderer.push(`<!----></div>`);
						pop_element();
						$$renderer.push(`</div>`);
						pop_element();
					}
					$$renderer.push(`<!--]-->`);
				}
				Popper_layer_force_mount($$renderer, spread_props([
					mergedProps(),
					contentState.popperProps,
					{
						enabled: contentState.root.opts.open.current,
						id,
						trapFocus: false,
						loop: false,
						preventScroll: false,
						forceMount: true,
						popper,
						$$slots: { popper: true }
					}
				]));
			}
		} else if (!forceMount) {
			$$renderer.push("<!--[1-->");
			{
				prevent_snippet_stringification(popper);
				function popper($$renderer, { props, wrapperProps }) {
					validate_snippet_args($$renderer);
					const mergedProps = mergeProps(props, { style: getFloatingContentCSSVars("tooltip") });
					if (child) {
						$$renderer.push("<!--[0-->");
						child($$renderer, {
							props: mergedProps,
							wrapperProps,
							...contentState.snippetProps
						});
						$$renderer.push(`<!---->`);
					} else {
						$$renderer.push("<!--[-1-->");
						$$renderer.push(`<div${attributes({ ...wrapperProps })}>`);
						push_element($$renderer, "div", 98, 4);
						$$renderer.push(`<div${attributes({ ...mergedProps })}>`);
						push_element($$renderer, "div", 99, 5);
						children?.($$renderer);
						$$renderer.push(`<!----></div>`);
						pop_element();
						$$renderer.push(`</div>`);
						pop_element();
					}
					$$renderer.push(`<!--]-->`);
				}
				Popper_layer($$renderer, spread_props([
					mergedProps(),
					contentState.popperProps,
					{
						present: contentState.root.opts.open.current,
						id,
						trapFocus: false,
						loop: false,
						preventScroll: false,
						forceMount: false,
						popper,
						$$slots: { popper: true }
					}
				]));
			}
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	}, Tooltip_content$1);
}
Tooltip_content$1.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/tooltip/components/tooltip-trigger.svelte
Tooltip_trigger$1[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/tooltip/components/tooltip-trigger.svelte";
function Tooltip_trigger$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { children, child, id = useId$1(), disabled = false, type = "button", ref = null, $$slots, $$events, ...restProps } = $$props;
		const triggerState = useTooltipTrigger({
			id: box.with(() => id),
			disabled: box.with(() => disabled ?? false),
			ref: box.with(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, triggerState.props, { type }));
		Floating_layer_anchor($$renderer, {
			id,
			children: prevent_snippet_stringification(($$renderer) => {
				if (child) {
					$$renderer.push("<!--[0-->");
					child($$renderer, { props: mergedProps() });
					$$renderer.push(`<!---->`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<button${attributes({ ...mergedProps() })}>`);
					push_element($$renderer, "button", 34, 2);
					children?.($$renderer);
					$$renderer.push(`<!----></button>`);
					pop_element();
				}
				$$renderer.push(`<!--]-->`);
			})});
		bind_props($$props, { ref });
	}, Tooltip_trigger$1);
}
Tooltip_trigger$1.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/tooltip/components/tooltip-arrow.svelte
Tooltip_arrow[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/tooltip/components/tooltip-arrow.svelte";
function Tooltip_arrow($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			Floating_layer_arrow($$renderer, spread_props([restProps, {
				get ref() {
					return ref;
				},
				set ref($$value) {
					ref = $$value;
					$$settled = false;
				}
			}]));
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	}, Tooltip_arrow);
}
Tooltip_arrow.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@1.8.0_svelte@5.56.0/node_modules/bits-ui/dist/bits/utilities/is-using-keyboard/is-using-keyboard.svelte.js
var isUsingKeyboard = false;
var IsUsingKeyboard = class {
	static _refs = 0;
	static _cleanup;
	constructor() {}
	get current() {
		return isUsingKeyboard;
	}
	set current(value) {
		isUsingKeyboard = value;
	}
};
//#endregion
//#region ../../packages/ui/src/components/label/label.svelte
Label[FILENAME] = "/home/runner/workspace/packages/ui/src/components/label/label.svelte";
function Label($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Label$1) {
				$$renderer.push("<!--[-->");
				Label$1($$renderer, spread_props([
					{
						"data-slot": "label",
						class: cn$1("cn-label flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed", className)
					},
					restProps,
					{
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						}
					}
				]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	}, Label);
}
Label.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
tv({
	base: "h-5 gap-1 rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium transition-all has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:size-3! focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden whitespace-nowrap transition-colors focus-visible:ring-[3px] [&>svg]:pointer-events-none",
	variants: { variant: {
		default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
		secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
		destructive: "bg-destructive/10 [a]:hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive dark:bg-destructive/20",
		outline: "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
		ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
		link: "text-primary underline-offset-4 hover:underline"
	} },
	defaultVariants: { variant: "default" }
});
//#endregion
//#region ../../packages/ui/src/components/avatar/avatar-fallback.svelte
Avatar_fallback[FILENAME] = "/home/runner/workspace/packages/ui/src/components/avatar/avatar-fallback.svelte";
function Avatar_fallback($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Avatar_fallback$1) {
				$$renderer.push("<!--[-->");
				Avatar_fallback$1($$renderer, spread_props([
					{
						"data-slot": "avatar-fallback",
						class: cn$1("cn-avatar-fallback flex size-full items-center justify-center text-sm group-data-[size=sm]/avatar:text-xs", className)
					},
					restProps,
					{
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						}
					}
				]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	}, Avatar_fallback);
}
Avatar_fallback.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../packages/ui/src/components/avatar/avatar.svelte
Avatar[FILENAME] = "/home/runner/workspace/packages/ui/src/components/avatar/avatar.svelte";
function Avatar($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, loadingStatus = "loading", size = "default", fallback, class: className, children, $$slots, $$events, ...restProps } = $$props;
		const initials = derived(() => fallback ? fallback.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("") : "");
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Avatar$1) {
				$$renderer.push("<!--[-->");
				Avatar$1($$renderer, spread_props([
					{
						"data-slot": "avatar",
						"data-size": size,
						class: cn$1("cn-avatar after:border-border group/avatar relative flex shrink-0 select-none after:absolute after:inset-0 after:border after:mix-blend-darken dark:after:mix-blend-lighten", className)
					},
					restProps,
					{
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						},
						get loadingStatus() {
							return loadingStatus;
						},
						set loadingStatus($$value) {
							loadingStatus = $$value;
							$$settled = false;
						},
						children: prevent_snippet_stringification(($$renderer) => {
							if (fallback !== void 0) {
								$$renderer.push("<!--[0-->");
								Avatar_fallback($$renderer, {
									children: prevent_snippet_stringification(($$renderer) => {
										$$renderer.push(`<!---->${escape_html(initials() || "?")}`);
									}),
									$$slots: { default: true }
								});
							} else {
								$$renderer.push("<!--[-1-->");
								children?.($$renderer);
								$$renderer.push(`<!---->`);
							}
							$$renderer.push(`<!--]-->`);
						}),
						$$slots: { default: true }
					}
				]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, {
			ref,
			loadingStatus
		});
	}, Avatar);
}
Avatar.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/defaultAttributes.js
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
var defaultAttributes = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": 2,
	"stroke-linecap": "round",
	"stroke-linejoin": "round"
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/utils/hasA11yProp.js
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
/**
* Check if a component has an accessibility prop
*
* @param {object} props
* @returns {boolean} Whether the component has an accessibility prop
*/
var hasA11yProp = (props) => {
	for (const prop in props) if (prop.startsWith("aria-") || prop === "role" || prop === "title") return true;
	return false;
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/utils/mergeClasses.js
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
/**
* Merges classes into a single string
*
* @param {array} classes
* @returns {string} A string of classes
*/
var mergeClasses = (...classes) => classes.filter((className, index, array) => {
	return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/Icon.svelte
Icon[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/Icon.svelte";
function Icon($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);
	const $$restProps = rest_props($$sanitized_props, [
		"name",
		"color",
		"size",
		"strokeWidth",
		"absoluteStrokeWidth",
		"iconNode"
	]);
	$$renderer.component(($$renderer) => {
		let name = fallback($$props["name"], void 0);
		let color = fallback($$props["color"], "currentColor");
		let size = fallback($$props["size"], 24);
		let strokeWidth = fallback($$props["strokeWidth"], 2);
		let absoluteStrokeWidth = fallback($$props["absoluteStrokeWidth"], false);
		let iconNode = fallback($$props["iconNode"], () => [], true);
		$$renderer.push(`<svg${attributes({
			...defaultAttributes,
			...!hasA11yProp($$restProps) ? { "aria-hidden": "true" } : void 0,
			...$$restProps,
			width: size,
			height: size,
			stroke: color,
			"stroke-width": absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
			class: clsx$1(mergeClasses("lucide-icon", "lucide", name ? `lucide-${name}` : "", $$sanitized_props.class))
		}, void 0, void 0, void 0, 3)}>`);
		push_element($$renderer, "svg", 12, 0);
		$$renderer.push(`<!--[-->`);
		const each_array = ensure_array_like(iconNode);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let [tag, attrs] = each_array[$$index];
			validate_dynamic_element_tag(() => tag);
			push_element($$renderer, tag, 34, 4);
			element($$renderer, tag, () => {
				$$renderer.push(`${attributes({ ...attrs }, void 0, void 0, void 0, 3)}`);
			});
			pop_element();
		}
		$$renderer.push(`<!--]--><!--[-->`);
		slot($$renderer, $$props, "default", {});
		$$renderer.push(`<!--]--></svg>`);
		pop_element();
		bind_props($$props, {
			name,
			color,
			size,
			strokeWidth,
			absoluteStrokeWidth,
			iconNode
		});
	}, Icon);
}
Icon.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/check.svelte
Check[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/check.svelte";
function Check($$renderer, $$props) {
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
			{ name: "check" },
			$$sanitized_props,
			{
				/**
				* @component @name Check
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjAgNiA5IDE3bC01LTUiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/check
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [["path", { "d": "M20 6 9 17l-5-5" }]],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Check);
}
Check.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/chevron-down.svelte
Chevron_down[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/chevron-down.svelte";
function Chevron_down($$renderer, $$props) {
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
			{ name: "chevron-down" },
			$$sanitized_props,
			{
				/**
				* @component @name ChevronDown
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtNiA5IDYgNiA2LTYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/chevron-down
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [["path", { "d": "m6 9 6 6 6-6" }]],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Chevron_down);
}
Chevron_down.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/chevron-right.svelte
Chevron_right[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/chevron-right.svelte";
function Chevron_right($$renderer, $$props) {
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
			{ name: "chevron-right" },
			$$sanitized_props,
			{
				/**
				* @component @name ChevronRight
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtOSAxOCA2LTYtNi02IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/chevron-right
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [["path", { "d": "m9 18 6-6-6-6" }]],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Chevron_right);
}
Chevron_right.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/ellipsis.svelte
Ellipsis[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/ellipsis.svelte";
function Ellipsis($$renderer, $$props) {
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
			{ name: "ellipsis" },
			$$sanitized_props,
			{
				/**
				* @component @name Ellipsis
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxIiAvPgogIDxjaXJjbGUgY3g9IjE5IiBjeT0iMTIiIHI9IjEiIC8+CiAgPGNpcmNsZSBjeD0iNSIgY3k9IjEyIiByPSIxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/ellipsis
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
						"r": "1"
					}],
					["circle", {
						"cx": "19",
						"cy": "12",
						"r": "1"
					}],
					["circle", {
						"cx": "5",
						"cy": "12",
						"r": "1"
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
	}, Ellipsis);
}
Ellipsis.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/info.svelte
Info[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/info.svelte";
function Info($$renderer, $$props) {
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
			{ name: "info" },
			$$sanitized_props,
			{
				/**
				* @component @name Info
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8cGF0aCBkPSJNMTIgMTZ2LTQiIC8+CiAgPHBhdGggZD0iTTEyIDhoLjAxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/info
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
					["path", { "d": "M12 16v-4" }],
					["path", { "d": "M12 8h.01" }]
				],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Info);
}
Info.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/loader-circle.svelte
Loader_circle[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/loader-circle.svelte";
function Loader_circle($$renderer, $$props) {
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
			{ name: "loader-circle" },
			$$sanitized_props,
			{
				/**
				* @component @name LoaderCircle
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEgMTJhOSA5IDAgMSAxLTYuMjE5LTguNTYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/loader-circle
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [["path", { "d": "M21 12a9 9 0 1 1-6.219-8.56" }]],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Loader_circle);
}
Loader_circle.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/triangle-alert.svelte
Triangle_alert[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/triangle-alert.svelte";
function Triangle_alert($$renderer, $$props) {
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
			{ name: "triangle-alert" },
			$$sanitized_props,
			{
				/**
				* @component @name TriangleAlert
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMjEuNzMgMTgtOC0xNGEyIDIgMCAwIDAtMy40OCAwbC04IDE0QTIgMiAwIDAgMCA0IDIxaDE2YTIgMiAwIDAgMCAxLjczLTMiIC8+CiAgPHBhdGggZD0iTTEyIDl2NCIgLz4KICA8cGF0aCBkPSJNMTIgMTdoLjAxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/triangle-alert
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [
					["path", { "d": "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" }],
					["path", { "d": "M12 9v4" }],
					["path", { "d": "M12 17h.01" }]
				],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Triangle_alert);
}
Triangle_alert.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/x.svelte
X[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/x.svelte";
function X($$renderer, $$props) {
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
			{ name: "x" },
			$$sanitized_props,
			{
				/**
				* @component @name X
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTggNiA2IDE4IiAvPgogIDxwYXRoIGQ9Im02IDYgMTIgMTIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/x
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [["path", { "d": "M18 6 6 18" }], ["path", { "d": "m6 6 12 12" }]],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, X);
}
X.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/vaul-svelte@1.0.0-next.7_svelte@5.56.0/node_modules/vaul-svelte/dist/internal/noop.js
function noop() {}
//#endregion
//#region ../../node_modules/.pnpm/vaul-svelte@1.0.0-next.7_svelte@5.56.0/node_modules/vaul-svelte/dist/internal/constants.js
var TRANSITIONS = {
	DURATION: .5,
	EASE: [
		.32,
		.72,
		0,
		1
	]
};
var CLOSE_THRESHOLD = .25;
var DRAG_CLASS = "vaul-dragging";
//#endregion
//#region ../../node_modules/.pnpm/vaul-svelte@1.0.0-next.7_svelte@5.56.0/node_modules/vaul-svelte/dist/helpers.js
var cache = /* @__PURE__ */ new WeakMap();
function set(el, styles, ignoreCache = false) {
	if (!el || !(el instanceof HTMLElement)) return;
	let originalStyles = {};
	Object.entries(styles).forEach(([key, value]) => {
		if (key.startsWith("--")) {
			el.style.setProperty(key, value);
			return;
		}
		originalStyles[key] = el.style[key];
		el.style[key] = value;
	});
	if (ignoreCache) return;
	cache.set(el, originalStyles);
}
function reset(el, prop) {
	if (!el || !(el instanceof HTMLElement)) return;
	let originalStyles = cache.get(el);
	if (!originalStyles) return;
	el.style[prop] = originalStyles[prop];
}
var isVertical = (direction) => {
	switch (direction) {
		case "top":
		case "bottom": return true;
		case "left":
		case "right": return false;
		default: return direction;
	}
};
function getTranslate(element, direction) {
	if (!element) return null;
	const style = window.getComputedStyle(element);
	const transform = style.transform || style.webkitTransform || style.mozTransform;
	let mat = transform.match(/^matrix3d\((.+)\)$/);
	if (mat) return parseFloat(mat[1].split(", ")[isVertical(direction) ? 13 : 12]);
	mat = transform.match(/^matrix\((.+)\)$/);
	return mat ? parseFloat(mat[1].split(", ")[isVertical(direction) ? 5 : 4]) : null;
}
function dampenValue(v) {
	return 8 * (Math.log(v + 1) - 2);
}
function assignStyle(element, style) {
	if (!element) return () => {};
	const prevStyle = element.style.cssText;
	Object.assign(element.style, style);
	return () => {
		element.style.cssText = prevStyle;
	};
}
//#endregion
//#region ../../node_modules/.pnpm/vaul-svelte@1.0.0-next.7_svelte@5.56.0/node_modules/vaul-svelte/dist/use-snap-points.svelte.js
function useSnapPoints({ snapPoints, drawerNode, overlayNode, fadeFromIndex, setOpenTime, direction, container, snapToSequentialPoint, activeSnapPoint, open, isReleasing }) {
	let windowDimensions = typeof window !== "undefined" ? {
		} : void 0;
	const isLastSnapPoint = derived(() => activeSnapPoint.current === snapPoints.current?.[snapPoints.current.length - 1] || null);
	const activeSnapPointIndex = derived(() => snapPoints.current?.findIndex((snapPoint) => snapPoint === activeSnapPoint.current));
	const shouldFade = derived(() => snapPoints.current && snapPoints.current.length > 0 && (fadeFromIndex.current || fadeFromIndex.current === 0) && !Number.isNaN(fadeFromIndex.current) && snapPoints.current[fadeFromIndex.current] === activeSnapPoint.current || !snapPoints.current);
	const snapPointsOffset = derived(() => {
		open.current;
		const containerSize = container.current ? {
			width: container.current.getBoundingClientRect().width,
			height: container.current.getBoundingClientRect().height
		} : typeof window !== "undefined" ? {
			width: window.innerWidth,
			height: window.innerHeight
		} : {
			width: 0,
			height: 0
		};
		return snapPoints.current?.map((snapPoint) => {
			const isPx = typeof snapPoint === "string";
			let snapPointAsNumber = 0;
			if (isPx) snapPointAsNumber = parseInt(snapPoint, 10);
			if (isVertical(direction.current)) {
				const height = isPx ? snapPointAsNumber : windowDimensions ? snapPoint * containerSize.height : 0;
				if (windowDimensions) return direction.current === "bottom" ? containerSize.height - height : -containerSize.height + height;
				return height;
			}
			const width = isPx ? snapPointAsNumber : windowDimensions ? snapPoint * containerSize.width : 0;
			if (windowDimensions) return direction.current === "right" ? containerSize.width - width : -containerSize.width + width;
			return width;
		}) ?? [];
	});
	const activeSnapPointOffset = derived(() => {
		if (activeSnapPointIndex() !== null) {
			if (activeSnapPointIndex() !== void 0) return snapPointsOffset()[activeSnapPointIndex()];
		}
		return null;
	});
	function onSnapPointChange(activeSnapPointIndex) {
		if (snapPoints.current && activeSnapPointIndex === snapPointsOffset().length - 1) setOpenTime(/* @__PURE__ */ new Date());
	}
	function snapToPoint(dimension) {
		const newSnapPointIndex = snapPointsOffset()?.findIndex((snapPointDim) => snapPointDim === dimension) ?? null;
		onSnapPointChange(newSnapPointIndex);
		set(drawerNode(), {
			transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
			transform: isVertical(direction.current) ? `translate3d(0, ${dimension}px, 0)` : `translate3d(${dimension}px, 0, 0)`
		});
		if (snapPointsOffset() && newSnapPointIndex !== snapPointsOffset().length - 1 && fadeFromIndex.current !== void 0 && newSnapPointIndex !== fadeFromIndex.current && newSnapPointIndex < fadeFromIndex.current) set(overlayNode(), {
			transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
			opacity: "0"
		});
		else set(overlayNode(), {
			transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
			opacity: "1"
		});
		activeSnapPoint.current = snapPoints.current?.[Math.max(newSnapPointIndex, 0)];
	}
	watch$2([() => activeSnapPoint.current, () => open.current], () => {
		const releasing = isReleasing();
		if (!activeSnapPoint.current || releasing) return;
		const newIndex = snapPoints.current?.findIndex((snapPoint) => snapPoint === activeSnapPoint.current) ?? -1;
		if (snapPointsOffset() && newIndex !== -1 && typeof snapPointsOffset()[newIndex] === "number") {
			if (snapPointsOffset()[newIndex] === activeSnapPoint.current) return;
			snapToPoint(snapPointsOffset()[newIndex]);
		}
	});
	function onRelease({ draggedDistance, closeDrawer, velocity, dismissible }) {
		if (fadeFromIndex.current === void 0) return;
		const dir = direction.current;
		const currentPosition = dir === "bottom" || dir === "right" ? (activeSnapPointOffset() ?? 0) - draggedDistance : (activeSnapPointOffset() ?? 0) + draggedDistance;
		const isOverlaySnapPoint = activeSnapPointIndex() === fadeFromIndex.current - 1;
		const isFirst = activeSnapPointIndex() === 0;
		const hasDraggedUp = draggedDistance > 0;
		if (isOverlaySnapPoint) set(overlayNode(), { transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})` });
		if (!snapToSequentialPoint.current && velocity > 2 && !hasDraggedUp) {
			if (dismissible) closeDrawer();
			else snapToPoint(snapPointsOffset()[0]);
			return;
		}
		if (!snapToSequentialPoint.current && velocity > 2 && hasDraggedUp && snapPointsOffset() && snapPoints.current) {
			snapToPoint(snapPointsOffset()[snapPoints.current.length - 1]);
			return;
		}
		const closestSnapPoint = snapPointsOffset()?.reduce((prev, curr) => {
			if (typeof prev !== "number" || typeof curr !== "number") return prev;
			return Math.abs(curr - currentPosition) < Math.abs(prev - currentPosition) ? curr : prev;
		});
		const dim = isVertical(dir) ? window.innerHeight : window.innerWidth;
		if (velocity > .4 && Math.abs(draggedDistance) < dim * .4) {
			const dragDirection = hasDraggedUp ? 1 : -1;
			if (dragDirection > 0 && isLastSnapPoint() && snapPoints.current) {
				snapToPoint(snapPointsOffset()[snapPoints.current.length - 1]);
				return;
			}
			if (isFirst && dragDirection < 0 && dismissible) closeDrawer();
			if (activeSnapPointIndex() === null) return;
			snapToPoint(snapPointsOffset()[activeSnapPointIndex() + dragDirection]);
			return;
		}
		snapToPoint(closestSnapPoint);
	}
	function onDrag({ draggedDistance }) {
		if (activeSnapPointOffset() === null) return;
		const dir = direction.current;
		const newValue = isBottomOrRight(dir) ? activeSnapPointOffset() - draggedDistance : activeSnapPointOffset() + draggedDistance;
		const lastSnapPoint = snapPointsOffset()[snapPointsOffset().length - 1];
		if (isBottomOrRight(dir) && newValue < lastSnapPoint) return;
		if (!isBottomOrRight(dir) && newValue > lastSnapPoint) return;
		set(drawerNode(), { transform: isVertical(dir) ? `translate3d(0, ${newValue}px, 0)` : `translate3d(${newValue}px, 0, 0)` });
	}
	function getPercentageDragged(absDraggedDistance, isDraggingDown) {
		if (!snapPoints.current || typeof activeSnapPointIndex() !== "number" || !snapPointsOffset() || fadeFromIndex.current === void 0) return null;
		const isOverlaySnapPoint = activeSnapPointIndex() === fadeFromIndex.current - 1;
		if (activeSnapPointIndex() >= fadeFromIndex.current && isDraggingDown) return 0;
		if (isOverlaySnapPoint && !isDraggingDown) return 1;
		if (!shouldFade() && !isOverlaySnapPoint) return null;
		const targetSnapPointIndex = isOverlaySnapPoint ? activeSnapPointIndex() + 1 : activeSnapPointIndex() - 1;
		const snapPointDistance = isOverlaySnapPoint ? snapPointsOffset()[targetSnapPointIndex] - snapPointsOffset()[targetSnapPointIndex - 1] : snapPointsOffset()[targetSnapPointIndex + 1] - snapPointsOffset()[targetSnapPointIndex];
		const percentageDragged = absDraggedDistance / Math.abs(snapPointDistance);
		if (isOverlaySnapPoint) return 1 - percentageDragged;
		else return percentageDragged;
	}
	return {
		get isLastSnapPoint() {
			return isLastSnapPoint();
		},
		get shouldFade() {
			return shouldFade();
		},
		get activeSnapPointIndex() {
			return activeSnapPointIndex();
		},
		get snapPointsOffset() {
			return snapshot(snapPointsOffset());
		},
		getPercentageDragged,
		onRelease,
		onDrag
	};
}
function isBottomOrRight(direction) {
	if (direction === "bottom" || direction === "right") return true;
	return false;
}
//#endregion
//#region ../../node_modules/.pnpm/vaul-svelte@1.0.0-next.7_svelte@5.56.0/node_modules/vaul-svelte/dist/internal/browser.js
var isBrowser$2 = typeof document !== "undefined";
function isMobileFirefox() {
	const userAgent = navigator.userAgent;
	return typeof window !== "undefined" && (/Firefox/.test(userAgent) && /Mobile/.test(userAgent) || /FxiOS/.test(userAgent));
}
function isMac() {
	return testPlatform(/^Mac/);
}
function isIPhone() {
	return testPlatform(/^iPhone/);
}
function isSafari() {
	return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
function isIPad() {
	return testPlatform(/^iPad/) || isMac() && navigator.maxTouchPoints > 1;
}
function isIOS() {
	return isIPhone() || isIPad();
}
function testPlatform(re) {
	return typeof window !== "undefined" && window.navigator != null ? re.test(window.navigator.platform) : void 0;
}
//#endregion
//#region ../../node_modules/.pnpm/vaul-svelte@1.0.0-next.7_svelte@5.56.0/node_modules/vaul-svelte/dist/use-prevent-scroll.svelte.js
var KEYBOARD_BUFFER = 24;
function chain(...callbacks) {
	return (...args) => {
		for (let callback of callbacks) if (typeof callback === "function") callback(...args);
	};
}
var visualViewport = isBrowser$2 && window.visualViewport;
function isScrollable(node) {
	let style = window.getComputedStyle(node);
	return /(auto|scroll)/.test(style.overflow + style.overflowX + style.overflowY);
}
function getScrollParent(node) {
	if (isScrollable(node)) node = node.parentElement;
	while (node && !isScrollable(node)) node = node.parentElement;
	return node || document.scrollingElement || document.documentElement;
}
var nonTextInputTypes = new Set([
	"checkbox",
	"radio",
	"range",
	"color",
	"file",
	"image",
	"button",
	"submit",
	"reset"
]);
var preventScrollCount = 0;
var restore;
/**
* Prevents scrolling on the document body on mount, and
* restores it on unmount. Also ensures that content does not
* shift due to the scrollbars disappearing.
*/
function usePreventScroll(opts) {
	watch$2(opts.isDisabled, () => {
		if (opts.isDisabled()) return;
		preventScrollCount++;
		if (preventScrollCount === 1) {
			if (isIOS()) restore = preventScrollMobileSafari();
		}
		return () => {
			preventScrollCount--;
			if (preventScrollCount === 0) restore?.();
		};
	});
}
function preventScrollMobileSafari() {
	let scrollable;
	let lastY = 0;
	const onTouchStart = (e) => {
		scrollable = getScrollParent(e.target);
		if (scrollable === document.documentElement && scrollable === document.body) return;
		lastY = e.changedTouches[0].pageY;
	};
	let onTouchMove = (e) => {
		if (!scrollable || scrollable === document.documentElement || scrollable === document.body) {
			e.preventDefault();
			return;
		}
		let y = e.changedTouches[0].pageY;
		let scrollTop = scrollable.scrollTop;
		let bottom = scrollable.scrollHeight - scrollable.clientHeight;
		if (bottom === 0) return;
		if (scrollTop <= 0 && y > lastY || scrollTop >= bottom && y < lastY) e.preventDefault();
		lastY = y;
	};
	let onTouchEnd = (e) => {
		let target = e.target;
		if (isInput(target) && target !== document.activeElement) {
			e.preventDefault();
			target.style.transform = "translateY(-2000px)";
			target.focus();
			requestAnimationFrame(() => {
				target.style.transform = "";
			});
		}
	};
	const onFocus = (e) => {
		let target = e.target;
		if (isInput(target)) {
			target.style.transform = "translateY(-2000px)";
			requestAnimationFrame(() => {
				target.style.transform = "";
				if (visualViewport) if (visualViewport.height < window.innerHeight) requestAnimationFrame(() => {
					scrollIntoView(target);
				});
				else visualViewport.addEventListener("resize", () => scrollIntoView(target), { once: true });
			});
		}
	};
	let onWindowScroll = () => {
		window.scrollTo(0, 0);
	};
	let scrollX = window.pageXOffset;
	let scrollY = window.pageYOffset;
	let restoreStyles = chain(setStyle(document.documentElement, "paddingRight", `${window.innerWidth - document.documentElement.clientWidth}px`));
	window.scrollTo(0, 0);
	let removeEvents = chain(on(document, "touchstart", onTouchStart, {
		passive: false,
		capture: true
	}), on(document, "touchmove", onTouchMove, {
		passive: false,
		capture: true
	}), on(document, "touchend", onTouchEnd, {
		passive: false,
		capture: true
	}), on(document, "focus", onFocus, { capture: true }), on(window, "scroll", onWindowScroll));
	return () => {
		restoreStyles();
		removeEvents();
		window.scrollTo(scrollX, scrollY);
	};
}
function setStyle(element, style, value) {
	let cur = element.style[style];
	element.style[style] = value;
	return () => {
		element.style[style] = cur;
	};
}
function scrollIntoView(target) {
	let root = document.scrollingElement || document.documentElement;
	while (target && target !== root) {
		let scrollable = getScrollParent(target);
		if (scrollable !== document.documentElement && scrollable !== document.body && scrollable !== target) {
			let scrollableTop = scrollable.getBoundingClientRect().top;
			let targetTop = target.getBoundingClientRect().top;
			if (target.getBoundingClientRect().bottom > scrollable.getBoundingClientRect().bottom + KEYBOARD_BUFFER) scrollable.scrollTop += targetTop - scrollableTop;
		}
		target = scrollable.parentElement;
	}
}
function isInput(target) {
	return target instanceof HTMLInputElement && !nonTextInputTypes.has(target.type) || target instanceof HTMLTextAreaElement || target instanceof HTMLElement && target.isContentEditable;
}
//#endregion
//#region ../../node_modules/.pnpm/vaul-svelte@1.0.0-next.7_svelte@5.56.0/node_modules/vaul-svelte/dist/use-position-fixed.svelte.js
var previousBodyPosition = null;
function usePositionFixed({ open, modal, nested, hasBeenOpened, preventScrollRestoration, noBodyStyles }) {
	let activeUrl = typeof window !== "undefined" ? window.location.href : "";
	let scrollPos = 0;
	function setPositionFixed() {
		if (!isSafari()) return;
		if (previousBodyPosition === null && open.current && !noBodyStyles.current) {
			previousBodyPosition = {
				position: document.body.style.position,
				top: document.body.style.top,
				left: document.body.style.left,
				height: document.body.style.height,
				right: "unset"
			};
			const { scrollX, innerHeight } = window;
			document.body.style.setProperty("position", "fixed", "important");
			Object.assign(document.body.style, {
				top: `0px`,
				left: `${-scrollX}px`,
				right: "0px",
				height: "auto"
			});
			window.setTimeout(() => window.requestAnimationFrame(() => {
				const bottomBarHeight = innerHeight - window.innerHeight;
				if (bottomBarHeight && scrollPos >= innerHeight) document.body.style.top = `${-(scrollPos + bottomBarHeight)}px`;
			}), 300);
		}
	}
	function restorePositionSetting() {
		if (!isSafari()) return;
		if (previousBodyPosition !== null && !noBodyStyles.current) {
			const y = -parseInt(document.body.style.top, 10);
			const x = -parseInt(document.body.style.left, 10);
			Object.assign(document.body.style, previousBodyPosition);
			window.requestAnimationFrame(() => {
				if (preventScrollRestoration.current && activeUrl !== window.location.href) {
					activeUrl = window.location.href;
					return;
				}
				window.scrollTo(x, y);
			});
			previousBodyPosition = null;
		}
	}
	watch$2([() => modal.current, () => activeUrl], () => {
		if (!modal.current) return;
		return () => {
			if (typeof document === "undefined") return;
			if (!!document.querySelector("[data-vaul-drawer]")) return;
			restorePositionSetting();
		};
	});
	watch$2([
		() => open.current,
		() => hasBeenOpened(),
		() => activeUrl,
		() => modal.current,
		() => nested.current
	], () => {
		if (nested.current || !hasBeenOpened()) return;
		if (open.current) {
			!window.matchMedia("(display-mode: standalone)").matches && setPositionFixed();
			if (!modal.current) window.setTimeout(() => {
				restorePositionSetting();
			}, 500);
		} else restorePositionSetting();
	});
	return { restorePositionSetting };
}
//#endregion
//#region ../../node_modules/.pnpm/vaul-svelte@1.0.0-next.7_svelte@5.56.0/node_modules/vaul-svelte/dist/context.js
var DrawerContext = new Context$1("Drawer.Root");
//#endregion
//#region ../../node_modules/.pnpm/vaul-svelte@1.0.0-next.7_svelte@5.56.0/node_modules/vaul-svelte/dist/use-drawer-root.svelte.js
function useDrawerRoot(opts) {
	let hasBeenOpened = false;
	let isDragging = false;
	let justReleased = false;
	let overlayNode = null;
	let drawerNode = null;
	let openTime = null;
	let dragStartTime = null;
	let dragEndTime = null;
	let lastTimeDragPrevented = null;
	let isAllowedToDrag = false;
	let nestedOpenChangeTimer = null;
	let pointerStart = 0;
	let keyboardIsOpen = box(false);
	let shouldAnimate = !opts.open.current;
	let previousDiffFromInitial = 0;
	let drawerHeight = 0;
	let drawerWidth = 0;
	let initialDrawerHeight = 0;
	let isReleasing = false;
	const snapPointsState = useSnapPoints({
		snapPoints: opts.snapPoints,
		drawerNode: () => drawerNode,
		activeSnapPoint: opts.activeSnapPoint,
		container: opts.container,
		direction: opts.direction,
		fadeFromIndex: opts.fadeFromIndex,
		overlayNode: () => overlayNode,
		setOpenTime: (time) => {
			openTime = time;
		},
		snapToSequentialPoint: opts.snapToSequentialPoint,
		open: opts.open,
		isReleasing: () => isReleasing
	});
	usePreventScroll({ isDisabled: () => !opts.open.current || isDragging || !opts.modal.current || justReleased || !hasBeenOpened || !opts.repositionInputs.current || !opts.disablePreventScroll.current });
	const { restorePositionSetting } = usePositionFixed({
		...opts,
		hasBeenOpened: () => hasBeenOpened
	});
	function getScale() {
		return (window.innerWidth - 26) / window.innerWidth;
	}
	function onPress(event) {
		if (!opts.dismissible.current && !opts.snapPoints.current) return;
		if (drawerNode && !drawerNode.contains(event.target)) return;
		drawerHeight = drawerNode?.getBoundingClientRect().height || 0;
		drawerWidth = drawerNode?.getBoundingClientRect().width || 0;
		isDragging = true;
		dragStartTime = /* @__PURE__ */ new Date();
		if (isIOS()) on(window, "touchend", () => isAllowedToDrag = false, { once: true });
		event.target.setPointerCapture(event.pointerId);
		pointerStart = isVertical(opts.direction.current) ? event.pageY : event.pageX;
	}
	function shouldDrag(el, isDraggingInDirection) {
		let element = el;
		const highlightedText = window.getSelection()?.toString();
		const swipeAmount = drawerNode ? getTranslate(drawerNode, opts.direction.current) : null;
		const date = /* @__PURE__ */ new Date();
		if (element.tagName === "SELECT") return false;
		if (element.hasAttribute("data-vaul-no-drag") || element.closest("[data-vaul-no-drag]")) return false;
		if (opts.direction.current === "right" || opts.direction.current === "left") return true;
		if (openTime && date.getTime() - openTime.getTime() < 500) return false;
		if (swipeAmount !== null) {
			if (opts.direction.current === "bottom" ? swipeAmount > 0 : swipeAmount < 0) return true;
		}
		if (highlightedText && highlightedText.length > 0) return false;
		if (lastTimeDragPrevented && date.getTime() - lastTimeDragPrevented.getTime() < opts.scrollLockTimeout.current && swipeAmount === 0) {
			lastTimeDragPrevented = date;
			return false;
		}
		if (isDraggingInDirection) {
			lastTimeDragPrevented = date;
			return false;
		}
		while (element) {
			if (element.scrollHeight > element.clientHeight) {
				if (element.scrollTop !== 0) {
					lastTimeDragPrevented = /* @__PURE__ */ new Date();
					return false;
				}
				if (element.getAttribute("role") === "dialog") return true;
			}
			element = element.parentNode;
		}
		return true;
	}
	function onDrag(event) {
		if (!drawerNode || !isDragging) return;
		const directionMultiplier = opts.direction.current === "bottom" || opts.direction.current === "right" ? 1 : -1;
		const draggedDistance = (pointerStart - (isVertical(opts.direction.current) ? event.pageY : event.pageX)) * directionMultiplier;
		const isDraggingInDirection = draggedDistance > 0;
		const noCloseSnapPointsPreCondition = opts.snapPoints.current && !opts.dismissible.current && !isDraggingInDirection;
		if (noCloseSnapPointsPreCondition && snapPointsState.activeSnapPointIndex === 0) return;
		const absDraggedDistance = Math.abs(draggedDistance);
		const wrapper = document.querySelector("[data-vaul-drawer-wrapper]");
		let percentageDragged = absDraggedDistance / (opts.direction.current === "bottom" || opts.direction.current === "top" ? drawerHeight : drawerWidth);
		const snapPointPercentageDragged = snapPointsState.getPercentageDragged(absDraggedDistance, isDraggingInDirection);
		if (snapPointPercentageDragged !== null) percentageDragged = snapPointPercentageDragged;
		if (noCloseSnapPointsPreCondition && percentageDragged >= 1) return;
		if (!isAllowedToDrag && !shouldDrag(event.target, isDraggingInDirection)) return;
		drawerNode.classList.add(DRAG_CLASS);
		isAllowedToDrag = true;
		set(drawerNode, { transition: "none" });
		set(overlayNode, { transition: "none" });
		if (opts.snapPoints.current) snapPointsState.onDrag({ draggedDistance });
		if (isDraggingInDirection && !opts.snapPoints.current) {
			const dampenedDraggedDistance = dampenValue(draggedDistance);
			const translateValue = Math.min(dampenedDraggedDistance * -1, 0) * directionMultiplier;
			set(drawerNode, { transform: isVertical(opts.direction.current) ? `translate3d(0, ${translateValue}px, 0)` : `translate3d(${translateValue}px, 0, 0)` });
			return;
		}
		const opacityValue = 1 - percentageDragged;
		if (snapPointsState.shouldFade || opts.fadeFromIndex.current && snapPointsState.activeSnapPointIndex === opts.fadeFromIndex.current - 1) {
			opts.onDrag.current?.(event, percentageDragged);
			set(overlayNode, {
				opacity: `${opacityValue}`,
				transition: "none"
			}, true);
		}
		if (wrapper && overlayNode && opts.shouldScaleBackground.current) {
			const scaleValue = Math.min(getScale() + percentageDragged * (1 - getScale()), 1);
			const borderRadiusValue = 8 - percentageDragged * 8;
			const translateValue = Math.max(0, 14 - percentageDragged * 14);
			set(wrapper, {
				borderRadius: `${borderRadiusValue}px`,
				transform: isVertical(opts.direction.current) ? `scale(${scaleValue}) translate3d(0, ${translateValue}px, 0)` : `scale(${scaleValue}) translate3d(${translateValue}px, 0, 0)`,
				transition: "none"
			}, true);
		}
		if (!opts.snapPoints.current) {
			const translateValue = absDraggedDistance * directionMultiplier;
			set(drawerNode, { transform: isVertical(opts.direction.current) ? `translate3d(0, ${translateValue}px, 0)` : `translate3d(${translateValue}px, 0, 0)` });
		}
	}
	function onDialogOpenChange(o) {
		if (!opts.dismissible.current && !o) return;
		if (o) hasBeenOpened = true;
		else closeDrawer(true);
		opts.open.current = o;
	}
	function onVisualViewportChange() {
		if (!drawerNode || !opts.repositionInputs.current) return;
		const focusedElement = document.activeElement;
		if (isInput(focusedElement) || keyboardIsOpen.current) {
			const visualViewportHeight = window.visualViewport?.height || 0;
			const totalHeight = window.innerHeight;
			let diffFromInitial = totalHeight - visualViewportHeight;
			const drawerHeight = drawerNode.getBoundingClientRect().height || 0;
			const isTallEnough = drawerHeight > totalHeight * .8;
			if (!initialDrawerHeight) initialDrawerHeight = drawerHeight;
			const offsetFromTop = drawerNode.getBoundingClientRect().top;
			if (Math.abs(previousDiffFromInitial - diffFromInitial) > 60) keyboardIsOpen.current = !keyboardIsOpen.current;
			if (opts.snapPoints.current && opts.snapPoints.current.length > 0 && snapPointsState.snapPointsOffset && snapPointsState.activeSnapPointIndex) {
				const activeSnapPointHeight = snapPointsState.snapPointsOffset[snapPointsState.activeSnapPointIndex] || 0;
				diffFromInitial += activeSnapPointHeight;
			}
			previousDiffFromInitial = diffFromInitial;
			if (drawerHeight > visualViewportHeight || keyboardIsOpen.current) {
				const height = drawerNode.getBoundingClientRect().height;
				let newDrawerHeight = height;
				if (height > visualViewportHeight) newDrawerHeight = visualViewportHeight - (isTallEnough ? offsetFromTop : 26);
				if (opts.fixed.current) drawerNode.style.height = `${height - Math.max(diffFromInitial, 0)}px`;
				else drawerNode.style.height = `${Math.max(newDrawerHeight, visualViewportHeight - offsetFromTop)}px`;
			} else if (!isMobileFirefox()) drawerNode.style.height = `${initialDrawerHeight}px`;
			if (opts.snapPoints.current && opts.snapPoints.current.length > 0 && !keyboardIsOpen.current) drawerNode.style.bottom = `0px`;
			else drawerNode.style.bottom = `${Math.max(diffFromInitial, 0)}px`;
		}
	}
	watch$2([
		() => snapPointsState.activeSnapPointIndex,
		() => opts.snapPoints.current,
		() => snapPointsState.snapPointsOffset,
		() => drawerNode
	], () => {
		if (!window.visualViewport) return;
		return on(window.visualViewport, "resize", onVisualViewportChange);
	});
	function cancelDrag() {
		if (!isDragging || !drawerNode) return;
		drawerNode.classList.remove(DRAG_CLASS);
		isAllowedToDrag = false;
		isDragging = false;
		dragEndTime = /* @__PURE__ */ new Date();
	}
	function closeDrawer(fromWithin) {
		cancelDrag();
		opts.onClose?.current();
		if (!fromWithin) {
			handleOpenChange(false);
			opts.open.current = false;
		}
		window.setTimeout(() => {
			if (opts.snapPoints.current && opts.snapPoints.current.length > 0) opts.activeSnapPoint.current = opts.snapPoints.current[0];
		}, TRANSITIONS.DURATION * 1e3);
	}
	function resetDrawer() {
		if (!drawerNode) return;
		const wrapper = document.querySelector("[data-vaul-drawer-wrapper]");
		const currentSwipeAmount = getTranslate(drawerNode, opts.direction.current);
		set(drawerNode, {
			transform: "translate3d(0, 0, 0)",
			transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`
		});
		set(overlayNode, {
			transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
			opacity: "1"
		});
		if (opts.shouldScaleBackground.current && currentSwipeAmount && currentSwipeAmount > 0 && opts.open.current) set(wrapper, {
			borderRadius: `8px`,
			overflow: "hidden",
			...isVertical(opts.direction.current) ? {
				transform: `scale(${getScale()}) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)`,
				transformOrigin: "top"
			} : {
				transform: `scale(${getScale()}) translate3d(calc(env(safe-area-inset-top) + 14px), 0, 0)`,
				transformOrigin: "left"
			},
			transitionProperty: "transform, border-radius",
			transitionDuration: `${TRANSITIONS.DURATION}s`,
			transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(",")})`
		}, true);
	}
	function onRelease(event) {
		isReleasing = true;
		handleRelease(event);
		afterTick(() => {
			isReleasing = false;
		});
	}
	function handleRelease(event) {
		if (!isDragging || !drawerNode) return;
		drawerNode.classList.remove(DRAG_CLASS);
		isAllowedToDrag = false;
		isDragging = false;
		dragEndTime = /* @__PURE__ */ new Date();
		const swipeAmount = getTranslate(drawerNode, opts.direction.current);
		if (!event || event.target && !shouldDrag(event.target, false) || !swipeAmount || Number.isNaN(swipeAmount)) return;
		if (dragStartTime === null) return;
		const timeTaken = dragEndTime.getTime() - dragStartTime.getTime();
		const distMoved = pointerStart - (isVertical(opts.direction.current) ? event.pageY : event.pageX);
		const velocity = Math.abs(distMoved) / timeTaken;
		if (velocity > .05) {
			justReleased = true;
			setTimeout(() => {
				justReleased = false;
			}, 200);
		}
		if (opts.snapPoints.current) {
			const directionMultiplier = opts.direction.current === "bottom" || opts.direction.current === "right" ? 1 : -1;
			snapPointsState.onRelease({
				draggedDistance: distMoved * directionMultiplier,
				closeDrawer,
				velocity,
				dismissible: opts.dismissible.current
			});
			opts.onRelease.current?.(event, true);
			return;
		}
		if (opts.direction.current === "bottom" || opts.direction.current === "right" ? distMoved > 0 : distMoved < 0) {
			resetDrawer();
			opts.onRelease.current?.(event, true);
			return;
		}
		if (velocity > .4) {
			closeDrawer();
			opts.onRelease.current?.(event, false);
			return;
		}
		const visibleDrawerHeight = Math.min(drawerNode.getBoundingClientRect().height ?? 0, window.innerHeight);
		const visibleDrawerWidth = Math.min(drawerNode.getBoundingClientRect().width ?? 0, window.innerWidth);
		const isHorizontalSwipe = opts.direction.current === "left" || opts.direction.current === "right";
		if (Math.abs(swipeAmount) >= (isHorizontalSwipe ? visibleDrawerWidth : visibleDrawerHeight) * opts.closeThreshold.current) {
			closeDrawer();
			opts.onRelease.current?.(event, false);
			return;
		}
		opts.onRelease.current?.(event, true);
		resetDrawer();
	}
	watch$2(() => opts.open.current, () => {
		if (opts.open.current) {
			set(document.documentElement, { scrollBehavior: "auto" });
			openTime = /* @__PURE__ */ new Date();
		}
		return () => {
			reset(document.documentElement, "scrollBehavior");
		};
	});
	function onNestedOpenChange(o) {
		const scale = o ? (window.innerWidth - 16) / window.innerWidth : 1;
		const initialTranslate = o ? -16 : 0;
		if (nestedOpenChangeTimer) window.clearTimeout(nestedOpenChangeTimer);
		set(drawerNode, {
			transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
			transform: isVertical(opts.direction.current) ? `scale(${scale}) translate3d(0, ${initialTranslate}px, 0)` : `scale(${scale}) translate3d(${initialTranslate}px, 0, 0)`
		});
		if (!o && drawerNode) nestedOpenChangeTimer = window.setTimeout(() => {
			const translateValue = getTranslate(drawerNode, opts.direction.current);
			set(drawerNode, {
				transition: "none",
				transform: isVertical(opts.direction.current) ? `translate3d(0, ${translateValue}px, 0)` : `translate3d(${translateValue}px, 0, 0)`
			});
		}, 500);
	}
	function onNestedDrag(_event, percentageDragged) {
		if (percentageDragged < 0) return;
		const initialScale = (window.innerWidth - 16) / window.innerWidth;
		const newScale = initialScale + percentageDragged * (1 - initialScale);
		const newTranslate = -16 + percentageDragged * 16;
		set(drawerNode, {
			transform: isVertical(opts.direction.current) ? `scale(${newScale}) translate3d(0, ${newTranslate}px, 0)` : `scale(${newScale}) translate3d(${newTranslate}px, 0, 0)`,
			transition: "none"
		});
	}
	function onNestedRelease(_event, o) {
		const dim = isVertical(opts.direction.current) ? window.innerHeight : window.innerWidth;
		const scale = o ? (dim - 16) / dim : 1;
		const translate = o ? -16 : 0;
		if (o) set(drawerNode, {
			transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
			transform: isVertical(opts.direction.current) ? `scale(${scale}) translate3d(0, ${translate}px, 0)` : `scale(${scale}) translate3d(${translate}px, 0, 0)`
		});
	}
	let bodyStyles;
	function handleOpenChange(o) {
		opts.onOpenChange.current?.(o);
		if (o && !opts.nested.current) bodyStyles = document.body.style.cssText;
		else if (!o && !opts.nested.current) afterSleep(TRANSITIONS.DURATION * 1e3, () => {
			document.body.style.cssText = bodyStyles;
		});
		if (!o && !opts.nested.current) restorePositionSetting();
		setTimeout(() => {
			opts.onAnimationEnd.current?.(o);
		}, TRANSITIONS.DURATION * 1e3);
		if (o && !opts.modal.current) {
			if (typeof window !== "undefined") window.requestAnimationFrame(() => {
				document.body.style.pointerEvents = "auto";
			});
		}
		if (!o) document.body.style.pointerEvents = "auto";
	}
	watch$2(() => opts.modal.current, () => {
		if (!opts.modal.current) window.requestAnimationFrame(() => {
			document.body.style.pointerEvents = "auto";
		});
	});
	function setOverlayNode(node) {
		overlayNode = node;
	}
	function setDrawerNode(node) {
		drawerNode = node;
	}
	return DrawerContext.set({
		...opts,
		keyboardIsOpen,
		closeDrawer,
		setDrawerNode,
		setOverlayNode,
		onDrag,
		onNestedDrag,
		onNestedOpenChange,
		onNestedRelease,
		onRelease,
		onPress,
		onDialogOpenChange,
		get shouldAnimate() {
			return shouldAnimate;
		},
		get isDragging() {
			return isDragging;
		},
		get overlayNode() {
			return overlayNode;
		},
		get drawerNode() {
			return drawerNode;
		},
		get snapPointsOffset() {
			return snapPointsState.snapPointsOffset;
		},
		get shouldFade() {
			return snapPointsState.shouldFade;
		},
		restorePositionSetting,
		handleOpenChange
	});
}
//#endregion
//#region ../../node_modules/.pnpm/vaul-svelte@1.0.0-next.7_svelte@5.56.0/node_modules/vaul-svelte/dist/components/drawer/drawer.svelte
Drawer$1[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/vaul-svelte@1.0.0-next.7_svelte@5.56.0/node_modules/vaul-svelte/dist/components/drawer/drawer.svelte";
function Drawer$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open = false, onOpenChange = noop, onDrag = noop, onRelease = noop, snapPoints, shouldScaleBackground = false, setBackgroundColorOnScale = true, closeThreshold = CLOSE_THRESHOLD, scrollLockTimeout = 100, dismissible = true, handleOnly = false, fadeFromIndex = snapPoints && snapPoints.length - 1, activeSnapPoint = null, onActiveSnapPointChange = noop, fixed = false, modal = true, onClose = noop, nested = false, noBodyStyles = false, direction = "bottom", snapToSequentialPoint = false, preventScrollRestoration = false, repositionInputs = true, onAnimationEnd = noop, container = null, autoFocus = false, disablePreventScroll = true, $$slots, $$events, ...restProps } = $$props;
		const rootState = useDrawerRoot({
			open: box.with(() => open, (o) => {
				open = o;
				rootState.handleOpenChange(o);
			}),
			closeThreshold: box.with(() => closeThreshold),
			scrollLockTimeout: box.with(() => scrollLockTimeout),
			snapPoints: box.with(() => snapPoints),
			fadeFromIndex: box.with(() => fadeFromIndex),
			nested: box.with(() => nested),
			shouldScaleBackground: box.with(() => shouldScaleBackground),
			activeSnapPoint: box.with(() => activeSnapPoint, (v) => {
				activeSnapPoint = v;
				onActiveSnapPointChange(v);
			}),
			onRelease: box.with(() => onRelease),
			onDrag: box.with(() => onDrag),
			onClose: box.with(() => onClose),
			dismissible: box.with(() => dismissible),
			direction: box.with(() => direction),
			fixed: box.with(() => fixed),
			modal: box.with(() => modal),
			handleOnly: box.with(() => handleOnly),
			noBodyStyles: box.with(() => noBodyStyles),
			preventScrollRestoration: box.with(() => preventScrollRestoration),
			setBackgroundColorOnScale: box.with(() => setBackgroundColorOnScale),
			repositionInputs: box.with(() => repositionInputs),
			autoFocus: box.with(() => autoFocus),
			snapToSequentialPoint: box.with(() => snapToSequentialPoint),
			container: box.with(() => container),
			disablePreventScroll: box.with(() => disablePreventScroll),
			onOpenChange: box.with(() => onOpenChange),
			onAnimationEnd: box.with(() => onAnimationEnd)
		});
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			var bind_get = () => rootState.open.current;
			var bind_set = (o) => {
				rootState.onDialogOpenChange(o);
			};
			if (Dialog$1) {
				$$renderer.push("<!--[-->");
				Dialog$1($$renderer, spread_props([{
					get open() {
						return bind_get();
					},
					set open($$value) {
						bind_set($$value);
					}
				}, restProps]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, {
			open,
			activeSnapPoint
		});
	}, Drawer$1);
}
Drawer$1.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/vaul-svelte@1.0.0-next.7_svelte@5.56.0/node_modules/vaul-svelte/dist/internal/use-id.js
globalThis.vaulIdCounter ??= { current: 0 };
/**
* Generates a unique ID based on a global counter.
*/
function useId(prefix = "vaul-svelte") {
	globalThis.vaulIdCounter.current++;
	return `${prefix}-${globalThis.vaulIdCounter.current}`;
}
//#endregion
//#region ../../node_modules/.pnpm/vaul-svelte@1.0.0-next.7_svelte@5.56.0/node_modules/vaul-svelte/dist/use-scale-background.svelte.js
function useScaleBackground() {
	const ctx = DrawerContext.get();
	let timeoutId = null;
	const initialBackgroundColor = typeof document !== "undefined" ? document.body.style.backgroundColor : "";
	function getScale() {
		return (window.innerWidth - 26) / window.innerWidth;
	}
	watch$2([
		() => ctx.open.current,
		() => ctx.shouldScaleBackground.current,
		() => ctx.setBackgroundColorOnScale.current
	], () => {
		if (ctx.open.current && ctx.shouldScaleBackground.current) {
			if (timeoutId) clearTimeout(timeoutId);
			const wrapper = document.querySelector("[data-vaul-drawer-wrapper]") || document.querySelector("[data-vaul-drawer-wrapper]");
			if (!wrapper) return;
			ctx.setBackgroundColorOnScale.current && !ctx.noBodyStyles.current && assignStyle(document.body, { background: "black" }), assignStyle(wrapper, {
				transformOrigin: isVertical(ctx.direction.current) ? "top" : "left",
				transitionProperty: "transform, border-radius",
				transitionDuration: `${TRANSITIONS.DURATION}s`,
				transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(",")})`
			});
			const wrapperStylesCleanup = assignStyle(wrapper, {
				borderRadius: `8px`,
				overflow: "hidden",
				...isVertical(ctx.direction.current) ? { transform: `scale(${getScale()}) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)` } : { transform: `scale(${getScale()}) translate3d(calc(env(safe-area-inset-top) + 14px), 0, 0)` }
			});
			return () => {
				wrapperStylesCleanup();
				timeoutId = window.setTimeout(() => {
					if (initialBackgroundColor) document.body.style.background = initialBackgroundColor;
					else document.body.style.removeProperty("background");
				}, TRANSITIONS.DURATION * 1e3);
			};
		}
	});
}
//#endregion
//#region ../../node_modules/.pnpm/vaul-svelte@1.0.0-next.7_svelte@5.56.0/node_modules/vaul-svelte/dist/use-drawer-content.svelte.js
function useDrawerContent(opts) {
	const ctx = DrawerContext.get();
	let mounted = false;
	useRefById({
		id: opts.id,
		ref: opts.ref,
		deps: () => [mounted, ctx.open.current],
		onRefChange: (node) => {
			if (!mounted) ctx.setDrawerNode(null);
			else ctx.setDrawerNode(node);
		}
	});
	let delayedSnapPoints = false;
	let pointerStart = null;
	let lastKnownPointerEvent = null;
	let wasBeyondThePoint = false;
	const hasSnapPoints = derived(() => ctx.snapPoints.current && ctx.snapPoints.current.length > 0);
	useScaleBackground();
	function isDeltaInDirection(delta, direction, threshold = 0) {
		if (wasBeyondThePoint) return true;
		const deltaY = Math.abs(delta.y);
		const deltaX = Math.abs(delta.x);
		const isDeltaX = deltaX > deltaY;
		const dFactor = ["bottom", "right"].includes(direction) ? 1 : -1;
		if (direction === "left" || direction === "right") {
			if (!(delta.x * dFactor < 0) && deltaX >= 0 && deltaX <= threshold) return isDeltaX;
		} else if (!(delta.y * dFactor < 0) && deltaY >= 0 && deltaY <= threshold) return !isDeltaX;
		wasBeyondThePoint = true;
		return true;
	}
	watch$2([() => hasSnapPoints(), () => ctx.open.current], () => {
		if (hasSnapPoints() && ctx.open.current) window.requestAnimationFrame(() => {
			delayedSnapPoints = true;
		});
		else delayedSnapPoints = false;
	});
	function handleOnPointerUp(e) {
		pointerStart = null;
		wasBeyondThePoint = false;
		ctx.onRelease(e);
	}
	function onpointerdown(e) {
		if (ctx.handleOnly.current) return;
		opts.onpointerdown.current?.(e);
		pointerStart = {
			x: e.pageX,
			y: e.pageY
		};
		ctx.onPress(e);
	}
	function onOpenAutoFocus(e) {
		opts.onOpenAutoFocus.current?.(e);
		if (!ctx.autoFocus.current) e.preventDefault();
	}
	function onInteractOutside(e) {
		opts.onInteractOutside.current?.(e);
		if (!ctx.modal.current || e.defaultPrevented) {
			e.preventDefault();
			return;
		}
		if (ctx.keyboardIsOpen.current) ctx.keyboardIsOpen.current = false;
	}
	function onFocusOutside(e) {
		if (!ctx.modal.current) {
			e.preventDefault();
			return;
		}
	}
	function onpointermove(e) {
		lastKnownPointerEvent = e;
		if (ctx.handleOnly.current) return;
		opts.onpointermove.current?.(e);
		if (!pointerStart) return;
		const yPosition = e.pageY - pointerStart.y;
		const xPosition = e.pageX - pointerStart.x;
		const swipeStartThreshold = e.pointerType === "touch" ? 10 : 2;
		if (isDeltaInDirection({
			x: xPosition,
			y: yPosition
		}, ctx.direction.current, swipeStartThreshold)) ctx.onDrag(e);
		else if (Math.abs(xPosition) > swipeStartThreshold || Math.abs(yPosition) > swipeStartThreshold) pointerStart = null;
	}
	function onpointerup(e) {
		opts.onpointerup.current?.(e);
		pointerStart = null;
		wasBeyondThePoint = false;
		ctx.onRelease(e);
	}
	function onpointerout(e) {
		opts.onpointerout.current?.(e);
		handleOnPointerUp(lastKnownPointerEvent);
	}
	function oncontextmenu(e) {
		opts.oncontextmenu.current?.(e);
		if (lastKnownPointerEvent) handleOnPointerUp(lastKnownPointerEvent);
	}
	const props = derived(() => ({
		id: opts.id.current,
		"data-vaul-drawer-direction": ctx.direction.current,
		"data-vaul-drawer": "",
		"data-vaul-delayed-snap-points": delayedSnapPoints ? "true" : "false",
		"data-vaul-snap-points": ctx.open.current && hasSnapPoints() ? "true" : "false",
		"data-vaul-custom-container": ctx.container.current ? "true" : "false",
		"data-vaul-animate": ctx.shouldAnimate ? "true" : "false",
		onpointerdown,
		onOpenAutoFocus,
		onInteractOutside,
		onFocusOutside,
		onpointerup,
		onpointermove,
		onpointerout,
		oncontextmenu,
		preventScroll: ctx.modal.current
	}));
	return {
		get props() {
			return props();
		},
		ctx,
		setMounted: (value) => {
			mounted = value;
		}
	};
}
//#endregion
//#region ../../node_modules/.pnpm/vaul-svelte@1.0.0-next.7_svelte@5.56.0/node_modules/vaul-svelte/dist/components/utils/mounted.svelte
Mounted[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/vaul-svelte@1.0.0-next.7_svelte@5.56.0/node_modules/vaul-svelte/dist/components/utils/mounted.svelte";
function Mounted($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { onMounted } = $$props;
	}, Mounted);
}
Mounted.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/vaul-svelte@1.0.0-next.7_svelte@5.56.0/node_modules/vaul-svelte/dist/components/drawer/drawer-content.svelte
Drawer_content$1[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/vaul-svelte@1.0.0-next.7_svelte@5.56.0/node_modules/vaul-svelte/dist/components/drawer/drawer-content.svelte";
function Drawer_content$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { id = useId(), ref = null, onOpenAutoFocus = noop, onInteractOutside = noop, onFocusOutside = noop, oncontextmenu = noop, onpointerdown = noop, onpointerup = noop, onpointerout = noop, onpointermove = noop, children, $$slots, $$events, ...restProps } = $$props;
		const contentState = useDrawerContent({
			id: box.with(() => id),
			ref: box.with(() => ref, (v) => ref = v),
			oncontextmenu: box.with(() => oncontextmenu ?? noop),
			onInteractOutside: box.with(() => onInteractOutside),
			onpointerdown: box.with(() => onpointerdown ?? noop),
			onpointermove: box.with(() => onpointermove ?? noop),
			onpointerout: box.with(() => onpointerout ?? noop),
			onpointerup: box.with(() => onpointerup ?? noop),
			onOpenAutoFocus: box.with(() => onOpenAutoFocus),
			onFocusOutside: box.with(() => onFocusOutside)
		});
		const snapPointsOffset = contentState.ctx.snapPointsOffset;
		const styleProp = derived(() => snapPointsOffset && snapPointsOffset.length > 0 ? { "--snap-point-height": `${snapPointsOffset[contentState.ctx.activeSnapPointIndex ?? 0]}px` } : {});
		const mergedProps = derived(() => mergeProps(restProps, contentState.props, { style: styleProp() }));
		if (Dialog_content$1) {
			$$renderer.push("<!--[-->");
			Dialog_content$1($$renderer, spread_props([mergedProps(), {
				children: prevent_snippet_stringification(($$renderer) => {
					children?.($$renderer);
					$$renderer.push(`<!----> `);
					Mounted($$renderer, { onMounted: contentState.setMounted });
					$$renderer.push(`<!---->`);
				}),
				$$slots: { default: true }
			}]));
			$$renderer.push("<!--]-->");
		} else {
			$$renderer.push("<!--[!-->");
			$$renderer.push("<!--]-->");
		}
		bind_props($$props, { ref });
	}, Drawer_content$1);
}
Drawer_content$1.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/vaul-svelte@1.0.0-next.7_svelte@5.56.0/node_modules/vaul-svelte/dist/use-drawer-overlay.svelte.js
function useDrawerOverlay(opts) {
	const ctx = DrawerContext.get();
	let mounted = false;
	useRefById({
		id: opts.id,
		ref: opts.ref,
		deps: () => mounted,
		onRefChange: (node) => {
			if (!mounted) ctx.setOverlayNode(null);
			else ctx.setOverlayNode(node);
		}
	});
	const hasSnapPoints = derived(() => ctx.snapPoints.current && ctx.snapPoints.current.length > 0);
	const shouldRender = derived(() => ctx.modal.current);
	const props = derived(() => ({
		id: opts.id.current,
		onmouseup: ctx.onRelease,
		"data-vaul-overlay": "",
		"data-vaul-snap-points": ctx.open.current && hasSnapPoints() ? "true" : "false",
		"data-vaul-snap-points-overlay": ctx.open.current && ctx.shouldFade ? "true" : "false",
		"data-vaul-animate": ctx.shouldAnimate ? "true" : "false"
	}));
	return {
		get props() {
			return props();
		},
		get shouldRender() {
			return shouldRender();
		},
		setMounted: (value) => {
			mounted = value;
		}
	};
}
//#endregion
//#region ../../node_modules/.pnpm/vaul-svelte@1.0.0-next.7_svelte@5.56.0/node_modules/vaul-svelte/dist/components/drawer/drawer-overlay.svelte
Drawer_overlay$1[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/vaul-svelte@1.0.0-next.7_svelte@5.56.0/node_modules/vaul-svelte/dist/components/drawer/drawer-overlay.svelte";
function Drawer_overlay$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { id = useId(), ref = null, children, $$slots, $$events, ...restProps } = $$props;
		const overlayState = useDrawerOverlay({
			id: box.with(() => id),
			ref: box.with(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, overlayState.props));
		if (overlayState.shouldRender) {
			$$renderer.push("<!--[0-->");
			if (Dialog_overlay$1) {
				$$renderer.push("<!--[-->");
				Dialog_overlay$1($$renderer, spread_props([mergedProps(), {
					children: prevent_snippet_stringification(($$renderer) => {
						Mounted($$renderer, { onMounted: overlayState.setMounted });
						$$renderer.push(`<!----> `);
						children?.($$renderer);
						$$renderer.push(`<!---->`);
					}),
					$$slots: { default: true }
				}]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	}, Drawer_overlay$1);
}
Drawer_overlay$1.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/vaul-svelte@1.0.0-next.7_svelte@5.56.0/node_modules/vaul-svelte/dist/components/drawer/drawer-portal.svelte
Drawer_portal$1[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/vaul-svelte@1.0.0-next.7_svelte@5.56.0/node_modules/vaul-svelte/dist/components/drawer/drawer-portal.svelte";
function Drawer_portal$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = DrawerContext.get();
		let { to = ctx.container.current ?? void 0, $$slots, $$events, ...restProps } = $$props;
		if (Portal) {
			$$renderer.push("<!--[-->");
			Portal($$renderer, spread_props([{ to }, restProps]));
			$$renderer.push("<!--]-->");
		} else {
			$$renderer.push("<!--[!-->");
			$$renderer.push("<!--]-->");
		}
	}, Drawer_portal$1);
}
Drawer_portal$1.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../packages/ui/src/components/drawer/drawer.svelte
Drawer[FILENAME] = "/home/runner/workspace/packages/ui/src/components/drawer/drawer.svelte";
function Drawer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { shouldScaleBackground = true, open = false, activeSnapPoint = null, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Drawer$1) {
				$$renderer.push("<!--[-->");
				Drawer$1($$renderer, spread_props([
					{ shouldScaleBackground },
					restProps,
					{
						get open() {
							return open;
						},
						set open($$value) {
							open = $$value;
							$$settled = false;
						},
						get activeSnapPoint() {
							return activeSnapPoint;
						},
						set activeSnapPoint($$value) {
							activeSnapPoint = $$value;
							$$settled = false;
						}
					}
				]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, {
			open,
			activeSnapPoint
		});
	}, Drawer);
}
Drawer.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../packages/ui/src/components/drawer/drawer-portal.svelte
Drawer_portal[FILENAME] = "/home/runner/workspace/packages/ui/src/components/drawer/drawer-portal.svelte";
function Drawer_portal($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { $$slots, $$events, ...restProps } = $$props;
		if (Drawer_portal$1) {
			$$renderer.push("<!--[-->");
			Drawer_portal$1($$renderer, spread_props([restProps]));
			$$renderer.push("<!--]-->");
		} else {
			$$renderer.push("<!--[!-->");
			$$renderer.push("<!--]-->");
		}
	}, Drawer_portal);
}
Drawer_portal.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../packages/ui/src/components/drawer/drawer-overlay.svelte
Drawer_overlay[FILENAME] = "/home/runner/workspace/packages/ui/src/components/drawer/drawer-overlay.svelte";
function Drawer_overlay($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Drawer_overlay$1) {
				$$renderer.push("<!--[-->");
				Drawer_overlay$1($$renderer, spread_props([
					{
						"data-slot": "drawer-overlay",
						class: cn$1("cn-drawer-overlay fixed inset-0 z-50", className)
					},
					restProps,
					{
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						}
					}
				]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	}, Drawer_overlay);
}
Drawer_overlay.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../packages/ui/src/components/drawer/drawer-content.svelte
Drawer_content[FILENAME] = "/home/runner/workspace/packages/ui/src/components/drawer/drawer-content.svelte";
function Drawer_content($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, portalProps, children, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			Drawer_portal($$renderer, spread_props([portalProps, {
				children: prevent_snippet_stringification(($$renderer) => {
					Drawer_overlay($$renderer, {});
					$$renderer.push(`<!----> `);
					if (Drawer_content$1) {
						$$renderer.push("<!--[-->");
						Drawer_content$1($$renderer, spread_props([
							{
								"data-slot": "drawer-content",
								class: cn$1("cn-drawer-content group/drawer-content fixed z-50", className)
							},
							restProps,
							{
								get ref() {
									return ref;
								},
								set ref($$value) {
									ref = $$value;
									$$settled = false;
								},
								children: prevent_snippet_stringification(($$renderer) => {
									$$renderer.push(`<div class="cn-drawer-handle bg-muted mx-auto hidden shrink-0 group-data-[vaul-drawer-direction=bottom]/drawer-content:block">`);
									push_element($$renderer, "div", 28, 2);
									$$renderer.push(`</div>`);
									pop_element();
									$$renderer.push(` `);
									children?.($$renderer);
									$$renderer.push(`<!---->`);
								}),
								$$slots: { default: true }
							}
						]));
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
				}),
				$$slots: { default: true }
			}]));
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	}, Drawer_content);
}
Drawer_content.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../packages/ui/src/components/alert/alert.svelte
Alert[FILENAME] = "/home/runner/workspace/packages/ui/src/components/alert/alert.svelte";
var alertVariants = tv({
	base: "cn-alert group/alert relative w-full",
	variants: { variant: {
		default: "cn-alert-variant-default",
		destructive: "cn-alert-variant-destructive"
	} },
	defaultVariants: { variant: "default" }
});
function Alert($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, variant = "default", children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			"data-slot": "alert",
			role: "alert",
			class: clsx$1(cn$1(alertVariants({ variant }), className)),
			...restProps
		})}>`);
		push_element($$renderer, "div", 35, 0);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
		pop_element();
		bind_props($$props, { ref });
	}, Alert);
}
Alert.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../packages/ui/src/components/tooltip/tooltip-portal.svelte
Tooltip_portal[FILENAME] = "/home/runner/workspace/packages/ui/src/components/tooltip/tooltip-portal.svelte";
function Tooltip_portal($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { $$slots, $$events, ...restProps } = $$props;
		if (Portal) {
			$$renderer.push("<!--[-->");
			Portal($$renderer, spread_props([restProps]));
			$$renderer.push("<!--]-->");
		} else {
			$$renderer.push("<!--[!-->");
			$$renderer.push("<!--]-->");
		}
	}, Tooltip_portal);
}
Tooltip_portal.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../packages/ui/src/components/tooltip/tooltip-content.svelte
Tooltip_content[FILENAME] = "/home/runner/workspace/packages/ui/src/components/tooltip/tooltip-content.svelte";
function Tooltip_content($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, sideOffset = 0, side = "top", children, arrowClasses, portalProps, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			Tooltip_portal($$renderer, spread_props([portalProps, {
				children: prevent_snippet_stringification(($$renderer) => {
					if (Tooltip_content$1) {
						$$renderer.push("<!--[-->");
						Tooltip_content$1($$renderer, spread_props([
							{
								"data-slot": "tooltip-content",
								sideOffset,
								side,
								class: cn$1("cn-tooltip-content bg-foreground text-background z-50 w-fit max-w-xs origin-(--bits-tooltip-content-transform-origin)", className)
							},
							restProps,
							{
								get ref() {
									return ref;
								},
								set ref($$value) {
									ref = $$value;
									$$settled = false;
								},
								children: prevent_snippet_stringification(($$renderer) => {
									children?.($$renderer);
									$$renderer.push(`<!----> `);
									{
										prevent_snippet_stringification(child);
										function child($$renderer, { props }) {
											validate_snippet_args($$renderer);
											$$renderer.push(`<div${attributes({
												class: clsx$1(cn$1("cn-tooltip-arrow bg-foreground fill-foreground z-50", "data-[side=top]:translate-x-1/2 data-[side=top]:translate-y-[calc(-50%+2px)]", "data-[side=bottom]:-translate-x-1/2 data-[side=bottom]:-translate-y-[calc(-50%+1px)]", "data-[side=right]:translate-x-[calc(50%+2px)] data-[side=right]:translate-y-1/2", "data-[side=left]:-translate-y-[calc(50%-3px)]", arrowClasses)),
												...props
											})}>`);
											push_element($$renderer, "div", 38, 4);
											$$renderer.push(`</div>`);
											pop_element();
										}
										if (Tooltip_arrow) {
											$$renderer.push("<!--[-->");
											Tooltip_arrow($$renderer, {
												child,
												$$slots: { child: true }
											});
											$$renderer.push("<!--]-->");
										} else {
											$$renderer.push("<!--[!-->");
											$$renderer.push("<!--]-->");
										}
									}
								}),
								$$slots: { default: true }
							}
						]));
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
				}),
				$$slots: { default: true }
			}]));
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	}, Tooltip_content);
}
Tooltip_content.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../packages/ui/src/components/tooltip/tooltip.svelte
Tooltip[FILENAME] = "/home/runner/workspace/packages/ui/src/components/tooltip/tooltip.svelte";
function Tooltip($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open = false, content, shortcut, side = "top", class: className, children, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Tooltip$1) {
				$$renderer.push("<!--[-->");
				Tooltip$1($$renderer, spread_props([restProps, {
					get open() {
						return open;
					},
					set open($$value) {
						open = $$value;
						$$settled = false;
					},
					children: prevent_snippet_stringification(($$renderer) => {
						if (content !== void 0) {
							$$renderer.push("<!--[0-->");
							{
								prevent_snippet_stringification(child);
								function child($$renderer, { props }) {
									validate_snippet_args($$renderer);
									$$renderer.push(`<span${attributes({
										...props,
										class: clsx$1(className),
										style: "display:contents"
									})}>`);
									push_element($$renderer, "span", 29, 8);
									children?.($$renderer);
									$$renderer.push(`<!----></span>`);
									pop_element();
								}
								if (Tooltip_trigger$1) {
									$$renderer.push("<!--[-->");
									Tooltip_trigger$1($$renderer, {
										child,
										$$slots: { child: true }
									});
									$$renderer.push("<!--]-->");
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push("<!--]-->");
								}
							}
							$$renderer.push(` `);
							Tooltip_content($$renderer, {
								side,
								children: prevent_snippet_stringification(($$renderer) => {
									$$renderer.push(`<!---->${escape_html(content)}`);
									if (shortcut) {
										$$renderer.push("<!--[0-->");
										$$renderer.push(`<span class="ml-1 text-[10px] opacity-60">`);
										push_element($$renderer, "span", 35, 29);
										$$renderer.push(`${escape_html(shortcut)}</span>`);
										pop_element();
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]-->`);
								}),
								$$slots: { default: true }
							});
							$$renderer.push(`<!---->`);
						} else {
							$$renderer.push("<!--[-1-->");
							children?.($$renderer);
							$$renderer.push(`<!---->`);
						}
						$$renderer.push(`<!--]-->`);
					}),
					$$slots: { default: true }
				}]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { open });
	}, Tooltip);
}
Tooltip.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../packages/ui/src/components/select/select.svelte
Select[FILENAME] = "/home/runner/workspace/packages/ui/src/components/select/select.svelte";
function Select($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open = false, value = void 0, options, onValueChange, placeholder, class: className, renderItem, footer, children, $$slots, $$events, ...restProps } = $$props;
		const isCustom = derived(() => options !== void 0);
		let dropdownOpen = false;
		const stringValue = derived(() => Array.isArray(value) ? value[0] ?? null : value ?? null);
		const selectedOption = derived(() => options?.find((o) => o.value === stringValue()));
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (isCustom()) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div${attr_class(clsx$1(cn$1("relative", className)))}>`);
				push_element($$renderer, "div", 58, 2);
				$$renderer.push(`<button type="button" class="flex w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"${attr("aria-expanded", dropdownOpen)}>`);
				push_element($$renderer, "button", 59, 4);
				if (selectedOption() && renderItem) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="flex items-center gap-2 min-w-0 flex-1">`);
					push_element($$renderer, "span", 66, 8);
					renderItem($$renderer, selectedOption(), true);
					$$renderer.push(`<!----></span>`);
					pop_element();
				} else if (selectedOption()) {
					$$renderer.push("<!--[1-->");
					$$renderer.push(`<span class="truncate flex-1 text-left">`);
					push_element($$renderer, "span", 70, 8);
					$$renderer.push(`${escape_html(selectedOption().label)}</span>`);
					pop_element();
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<span class="text-muted-foreground flex-1 text-left">`);
					push_element($$renderer, "span", 72, 8);
					$$renderer.push(`${escape_html(placeholder ?? "Select…")}</span>`);
					pop_element();
				}
				$$renderer.push(`<!--]--> `);
				Chevron_down($$renderer, { class: "w-4 h-4 shrink-0 text-muted-foreground" });
				$$renderer.push(`<!----></button>`);
				pop_element();
				$$renderer.push(` `);
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
				pop_element();
			} else {
				$$renderer.push("<!--[-1-->");
				if (Select$1) {
					$$renderer.push("<!--[-->");
					Select$1($$renderer, spread_props([restProps, {
						get open() {
							return open;
						},
						set open($$value) {
							open = $$value;
							$$settled = false;
						},
						get value() {
							return value;
						},
						set value($$value) {
							value = $$value;
							$$settled = false;
						}
					}]));
					$$renderer.push("<!--]-->");
				} else {
					$$renderer.push("<!--[!-->");
					$$renderer.push("<!--]-->");
				}
			}
			$$renderer.push(`<!--]-->`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, {
			open,
			value
		});
	}, Select);
}
Select.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../packages/ui/src/components/switch/switch.svelte
Switch[FILENAME] = "/home/runner/workspace/packages/ui/src/components/switch/switch.svelte";
function Switch($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { checked = false, onCheckedChange, disabled = false, "aria-label": ariaLabel, class: className } = $$props;
		$$renderer.push(`<button type="button" role="switch"${attr("aria-checked", checked)}${attr("aria-label", ariaLabel)}${attr("disabled", disabled, true)}${attr_class(clsx$1(cn$1("relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent", "transition-colors duration-200 ease-in-out", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background", checked ? "bg-primary" : "bg-input", disabled && "cursor-not-allowed opacity-50", className)))}>`);
		push_element($$renderer, "button", 35, 0);
		$$renderer.push(`<span${attr_class(clsx$1(cn$1("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-md", "transition-transform duration-200 ease-in-out", checked ? "translate-x-4" : "translate-x-0")))}>`);
		push_element($$renderer, "span", 52, 2);
		$$renderer.push(`</span>`);
		pop_element();
		$$renderer.push(`</button>`);
		pop_element();
	}, Switch);
}
Switch.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../packages/ui/src/components/context-menu/context-menu.svelte
Context_menu[FILENAME] = "/home/runner/workspace/packages/ui/src/components/context-menu/context-menu.svelte";
function Context_menu($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open = false, items, children, $$slots, $$events, ...restProps } = $$props;
		let menuOpen = false;
		let menuX = 0;
		let menuY = 0;
		function openAt(x, y) {
			menuX = x;
			menuY = y;
			menuOpen = true;
		}
		const isCustom = derived(() => items !== void 0);
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (isCustom()) {
				$$renderer.push("<!--[0-->");
				children?.($$renderer, { openAt });
				$$renderer.push(`<!----> `);
				if (menuOpen) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="fixed inset-0 z-40" role="presentation">`);
					push_element($$renderer, "div", 45, 4);
					$$renderer.push(`</div>`);
					pop_element();
					$$renderer.push(` <div class="fixed z-50 min-w-40 rounded-md border border-border bg-popover shadow-lg py-1 overflow-hidden" role="menu"${attr_style("", {
						left: `${stringify(menuX)}px`,
						top: `${stringify(menuY)}px`
					})}>`);
					push_element($$renderer, "div", 51, 4);
					$$renderer.push(`<!--[-->`);
					const each_array = ensure_array_like(items ?? []);
					for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
						let item = each_array[$$index];
						if (item.separator) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<hr class="my-1 border-border"/>`);
							push_element($$renderer, "hr", 59, 10);
							pop_element();
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--> <button role="menuitem"${attr_class(`w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-accent transition-colors ${item.variant === "destructive" ? "text-destructive" : "text-foreground"}`)}>`);
						push_element($$renderer, "button", 61, 8);
						$$renderer.push(`${escape_html(item.label)}</button>`);
						pop_element();
					}
					$$renderer.push(`<!--]--></div>`);
					pop_element();
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]-->`);
			} else {
				$$renderer.push("<!--[-1-->");
				if (Context_menu$1) {
					$$renderer.push("<!--[-->");
					Context_menu$1($$renderer, spread_props([restProps, {
						get open() {
							return open;
						},
						set open($$value) {
							open = $$value;
							$$settled = false;
						},
						children: prevent_snippet_stringification(($$renderer) => {
							children?.($$renderer);
							$$renderer.push(`<!---->`);
						}),
						$$slots: { default: true }
					}]));
					$$renderer.push("<!--]-->");
				} else {
					$$renderer.push("<!--[!-->");
					$$renderer.push("<!--]-->");
				}
			}
			$$renderer.push(`<!--]-->`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { open });
	}, Context_menu);
}
Context_menu.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Array(12).fill(0);
var isBrowser$1 = typeof document !== "undefined";
//#endregion
//#region ../../node_modules/.pnpm/runed@0.28.0_svelte@5.56.0/node_modules/runed/dist/internal/configurable-globals.js
var defaultWindow$1 = void 0;
//#endregion
//#region ../../node_modules/.pnpm/runed@0.28.0_svelte@5.56.0/node_modules/runed/dist/internal/utils/dom.js
/**
* Handles getting the active element in a document or shadow root.
* If the active element is within a shadow root, it will traverse the shadow root
* to find the active element.
* If not, it will return the active element in the document.
*
* @param document A document or shadow root to get the active element from.
* @returns The active element in the document or shadow root.
*/
function getActiveElement$1(document) {
	let activeElement = document.activeElement;
	while (activeElement?.shadowRoot) {
		const node = activeElement.shadowRoot.activeElement;
		if (node === activeElement) break;
		else activeElement = node;
	}
	return activeElement;
}
//#endregion
//#region ../../node_modules/.pnpm/runed@0.28.0_svelte@5.56.0/node_modules/runed/dist/utilities/active-element/active-element.svelte.js
var ActiveElement$1 = class {
	#document;
	#subscribe;
	constructor(options = {}) {
		const { window = defaultWindow$1, document = window?.document } = options;
		if (window === void 0) return;
		this.#document = document;
		this.#subscribe = createSubscriber();
	}
	get current() {
		this.#subscribe?.();
		if (!this.#document) return null;
		return getActiveElement$1(this.#document);
	}
};
new ActiveElement$1();
//#endregion
//#region ../../node_modules/.pnpm/svelte-sonner@1.1.1_svelte@5.56.0/node_modules/svelte-sonner/dist/toast-state.svelte.js
var toastsCounter = 0;
var ToastState = class {
	toasts = [];
	heights = [];
	#findToastIdx = (id) => {
		const idx = this.toasts.findIndex((toast) => toast.id === id);
		if (idx === -1) return null;
		return idx;
	};
	addToast = (data) => {
		if (!isBrowser$1) return;
		this.toasts.unshift(data);
	};
	updateToast = ({ id, data, type, message }) => {
		const toastIdx = this.toasts.findIndex((toast) => toast.id === id);
		const toastToUpdate = this.toasts[toastIdx];
		this.toasts[toastIdx] = {
			...toastToUpdate,
			...data,
			id,
			title: message,
			type,
			updated: true
		};
	};
	create = (data) => {
		const { message, ...rest } = data;
		const id = typeof data?.id === "number" || data.id && data.id?.length > 0 ? data.id : toastsCounter++;
		const dismissible = data.dismissible !== void 0 ? data.dismissible : data.dismissable !== void 0 ? data.dismissable : true;
		const type = data.type === void 0 ? "default" : data.type;
		run(() => {
			if (this.toasts.find((toast) => toast.id === id)) this.updateToast({
				id,
				data,
				type,
				message,
				dismissible
			});
			else this.addToast({
				...rest,
				id,
				title: message,
				dismissible,
				type
			});
		});
		return id;
	};
	dismiss = (id) => {
		run(() => {
			if (id === void 0) {
				this.toasts = this.toasts.map((toast) => ({
					...toast,
					dismiss: true
				}));
				return;
			}
			const toastIdx = this.toasts.findIndex((toast) => toast.id === id);
			if (this.toasts[toastIdx]) this.toasts[toastIdx] = {
				...this.toasts[toastIdx],
				dismiss: true
			};
		});
		return id;
	};
	remove = (id) => {
		if (id === void 0) {
			this.toasts = [];
			return;
		}
		const toastIdx = this.#findToastIdx(id);
		if (toastIdx === null) return;
		this.toasts.splice(toastIdx, 1);
		return id;
	};
	message = (message, data) => {
		return this.create({
			...data,
			type: "default",
			message
		});
	};
	error = (message, data) => {
		return this.create({
			...data,
			type: "error",
			message
		});
	};
	success = (message, data) => {
		return this.create({
			...data,
			type: "success",
			message
		});
	};
	info = (message, data) => {
		return this.create({
			...data,
			type: "info",
			message
		});
	};
	warning = (message, data) => {
		return this.create({
			...data,
			type: "warning",
			message
		});
	};
	loading = (message, data) => {
		return this.create({
			...data,
			type: "loading",
			message
		});
	};
	promise = (promise, data) => {
		if (!data) return;
		let id = void 0;
		if (data.loading !== void 0) id = this.create({
			...data,
			promise,
			type: "loading",
			message: typeof data.loading === "string" ? data.loading : data.loading()
		});
		const p = promise instanceof Promise ? promise : promise();
		let shouldDismiss = id !== void 0;
		p.then((response) => {
			if (typeof response === "object" && response && "ok" in response && typeof response.ok === "boolean" && !response.ok) {
				shouldDismiss = false;
				const message = constructPromiseErrorMessage(response);
				this.create({
					id,
					type: "error",
					message
				});
			} else if (data.success !== void 0) {
				shouldDismiss = false;
				const message = typeof data.success === "function" ? data.success(response) : data.success;
				this.create({
					id,
					type: "success",
					message
				});
			}
		}).catch((error) => {
			if (data.error !== void 0) {
				shouldDismiss = false;
				const message = typeof data.error === "function" ? data.error(error) : data.error;
				this.create({
					id,
					type: "error",
					message
				});
			}
		}).finally(() => {
			if (shouldDismiss) {
				this.dismiss(id);
				id = void 0;
			}
			data.finally?.();
		});
		return id;
	};
	custom = (component, data) => {
		const id = data?.id || toastsCounter++;
		this.create({
			component,
			id,
			...data
		});
		return id;
	};
	removeHeight = (id) => {
		this.heights = this.heights.filter((height) => height.toastId !== id);
	};
	setHeight = (data) => {
		const toastIdx = this.#findToastIdx(data.toastId);
		if (toastIdx === null) {
			this.heights.push(data);
			return;
		}
		this.heights[toastIdx] = data;
	};
	reset = () => {
		this.toasts = [];
		this.heights = [];
	};
};
function constructPromiseErrorMessage(response) {
	if (response && typeof response === "object" && "status" in response) return `HTTP error! Status: ${response.status}`;
	return `Error! ${response}`;
}
var toastState = new ToastState();
function toastFunction(message, data) {
	return toastState.create({
		message,
		...data
	});
}
Object.assign(toastFunction, {
	success: toastState.success,
	info: toastState.info,
	warning: toastState.warning,
	error: toastState.error,
	custom: toastState.custom,
	message: toastState.message,
	promise: toastState.promise,
	dismiss: toastState.dismiss,
	loading: toastState.loading,
	getActiveToasts: () => {
		return toastState.toasts.filter((toast) => !toast.dismiss);
	}
});
//#endregion
//#region ../../node_modules/.pnpm/runed@0.25.0_svelte@5.56.0/node_modules/runed/dist/internal/configurable-globals.js
var defaultWindow = void 0;
//#endregion
//#region ../../node_modules/.pnpm/runed@0.25.0_svelte@5.56.0/node_modules/runed/dist/internal/utils/dom.js
/**
* Handles getting the active element in a document or shadow root.
* If the active element is within a shadow root, it will traverse the shadow root
* to find the active element.
* If not, it will return the active element in the document.
*
* @param document A document or shadow root to get the active element from.
* @returns The active element in the document or shadow root.
*/
function getActiveElement(document) {
	let activeElement = document.activeElement;
	while (activeElement?.shadowRoot) {
		const node = activeElement.shadowRoot.activeElement;
		if (node === activeElement) break;
		else activeElement = node;
	}
	return activeElement;
}
//#endregion
//#region ../../node_modules/.pnpm/runed@0.25.0_svelte@5.56.0/node_modules/runed/dist/utilities/active-element/active-element.svelte.js
var ActiveElement = class {
	#document;
	#subscribe;
	constructor(options = {}) {
		const { window = defaultWindow, document = window?.document } = options;
		if (window === void 0) return;
		this.#document = document;
		this.#subscribe = createSubscriber();
	}
	get current() {
		this.#subscribe?.();
		if (!this.#document) return null;
		return getActiveElement(this.#document);
	}
};
new ActiveElement();
var isBrowser = typeof document !== "undefined";
var SystemPrefersMode = class {
	#defaultValue = void 0;
	#track = true;
	#current = this.#defaultValue;
	#mediaQueryState = typeof window !== "undefined" && typeof window.matchMedia === "function" ? new MediaQuery("prefers-color-scheme: light") : { current: false };
	query() {
		if (!isBrowser) return;
		this.#current = this.#mediaQueryState.current ? "light" : "dark";
	}
	tracking(active) {
		this.#track = active;
	}
	constructor() {
		this.query = this.query.bind(this);
		this.tracking = this.tracking.bind(this);
	}
	get current() {
		return this.#current;
	}
};
/**
* Readable store that represents the system's preferred mode (`"dark"`, `"light"` or `undefined`)
*/
new SystemPrefersMode();

export { Alert as A, Button as B, Check as C, Drawer as D, Ellipsis as E, Icon as I, Label as L, Select as S, Tooltip as T, X, Avatar as a, Chevron_down as b, Chevron_right as c, Context_menu as d, Drawer_content as e, Info as f, Input as g, Input_group as h, Loader_circle as i, Switch as j, Triangle_alert as k };
//# sourceMappingURL=src-CaTbLYjQ.js.map
