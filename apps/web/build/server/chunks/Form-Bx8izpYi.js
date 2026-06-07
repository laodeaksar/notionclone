import { l as attributes, ae as push_element, ab as pop_element, u as derived, aj as run, A as ATTACHMENT_KEY, F as FILENAME, ak as rune_outside_svelte } from './index-server-DF5QiTDW.js';
import './internal-DBlml9h1.js';
import * as v from 'valibot';

//#region ../../packages/schemas/src/index.ts
var SignUpSchema = v.object({
	email: v.pipe(v.string(), v.email()),
	password: v.pipe(v.string(), v.minLength(8)),
	name: v.pipe(v.string(), v.minLength(1))
});
var SignInSchema = v.object({
	email: v.pipe(v.string(), v.email()),
	password: v.pipe(v.string(), v.minLength(1))
});
v.object({
	name: v.pipe(v.string(), v.minLength(1), v.maxLength(100)),
	description: v.optional(v.string())
});
v.object({
	name: v.optional(v.pipe(v.string(), v.minLength(1), v.maxLength(100))),
	description: v.optional(v.string())
});
v.object({
	userId: v.pipe(v.string(), v.minLength(1)),
	role: v.optional(v.picklist(["owner", "member"]), "member")
});
v.object({ role: v.picklist(["owner", "member"]) });
v.object({
	title: v.string(),
	workspaceId: v.string(),
	parentId: v.optional(v.string()),
	icon: v.optional(v.string()),
	coverImage: v.optional(v.string())
});
v.object({
	title: v.optional(v.string()),
	icon: v.optional(v.nullable(v.string())),
	coverImage: v.optional(v.nullable(v.string())),
	content: v.optional(v.nullable(v.string())),
	parentId: v.optional(v.nullable(v.string()))
});
v.object({
	parentId: v.optional(v.nullable(v.string())),
	order: v.number()
});
v.object({
	title: v.pipe(v.string(), v.minLength(1)),
	content: v.string()
});
v.object({
	folder: v.optional(v.string()),
	publicId: v.optional(v.string())
});
//#endregion
//#region ../../node_modules/.pnpm/@formisch+svelte@0.8.0_svelte@5.56.0_typescript@5.9.3_valibot@1.4.1_typescript@5.9.3_/node_modules/@formisch/svelte/dist/core/index.svelte.js
function createId() {
	return Math.random().toString(36).slice(2);
}
/**
* Creates a reactive signal with an initial value.
*
* @param initialValue The initial value.
*
* @returns The created signal.
*/
/* @__NO_SIDE_EFFECTS__ */
function createSignal(initialValue) {
	let signal = initialValue;
	return {
		get value() {
			return signal;
		},
		set value(nextValue) {
			signal = nextValue;
		}
	};
}
/**
* Batches multiple signal updates into a single update cycle. This is a
* no-op in Svelte as batching is handled automatically.
*
* @param fn The function to execute.
*
* @returns The return value of the function.
*/
function batch(fn) {
	return fn();
}
/**
* Initializes a field store recursively based on the schema structure. Handles
* array, object, and value schemas, setting up all necessary signals and
* children. Supports wrapped schemas and schema options.
*
* @param internalFieldStore The partial field store to initialize.
* @param schema The Valibot schema defining the field structure.
* @param initialInput The initial input value.
* @param path The path to the field in the form.
* @param nullish Whether the schema is wrapped in a nullish schema.
*/
function initializeFieldStore(internalFieldStore, schema, initialInput, path, nullish = false) {
	if (schema.type === "object_with_rest" || schema.type === "record" || schema.type === "tuple_with_rest" || schema.type === "promise") throw new Error(`"${schema.type}" schema is not supported`);
	else if (schema.type === "lazy") initializeFieldStore(internalFieldStore, schema.getter(void 0), initialInput, path, nullish);
	else if (schema.type === "exact_optional" || schema.type === "nullable" || schema.type === "nullish" || schema.type === "optional" || schema.type === "undefinedable") initializeFieldStore(internalFieldStore, schema.wrapped, initialInput === void 0 ? v.getDefault(schema) : initialInput, path, true);
	else if (schema.type === "non_nullable" || schema.type === "non_nullish" || schema.type === "non_optional") initializeFieldStore(internalFieldStore, schema.wrapped, initialInput, path);
	else if (schema.type === "intersect" || schema.type === "union" || schema.type === "variant") for (const schemaOption of schema.options) initializeFieldStore(internalFieldStore, schemaOption, initialInput, path, nullish);
	else {
		internalFieldStore.schema = schema;
		internalFieldStore.name = JSON.stringify(path);
		const initialElements = [];
		internalFieldStore.initialElements = initialElements;
		internalFieldStore.elements = initialElements;
		internalFieldStore.errors = /* @__PURE__ */ createSignal(null);
		internalFieldStore.isTouched = /* @__PURE__ */ createSignal(false);
		internalFieldStore.isDirty = /* @__PURE__ */ createSignal(false);
		if (schema.type === "array" || schema.type === "loose_tuple" || schema.type === "strict_tuple" || schema.type === "tuple") {
			if (internalFieldStore.kind && internalFieldStore.kind !== "array") throw new Error(`Store initialized as "${internalFieldStore.kind}" cannot be reinitialized as "array"`);
			internalFieldStore.kind = "array";
			if (internalFieldStore.kind === "array") {
				internalFieldStore.children ??= [];
				if (schema.type === "array") {
					if (initialInput) for (let index = 0; index < initialInput.length; index++) {
						internalFieldStore.children[index] = {};
						path.push(index);
						initializeFieldStore(internalFieldStore.children[index], schema.item, initialInput[index], path);
						path.pop();
					}
				} else for (let index = 0; index < schema.items.length; index++) {
					internalFieldStore.children[index] = {};
					path.push(index);
					initializeFieldStore(internalFieldStore.children[index], schema.items[index], initialInput?.[index], path);
					path.pop();
				}
				const arrayInput = nullish && initialInput == null ? initialInput : true;
				internalFieldStore.initialInput = /* @__PURE__ */ createSignal(arrayInput);
				internalFieldStore.startInput = /* @__PURE__ */ createSignal(arrayInput);
				internalFieldStore.input = /* @__PURE__ */ createSignal(arrayInput);
				const initialItems = internalFieldStore.children.map(createId);
				internalFieldStore.initialItems = /* @__PURE__ */ createSignal(initialItems);
				internalFieldStore.startItems = /* @__PURE__ */ createSignal(initialItems);
				internalFieldStore.items = /* @__PURE__ */ createSignal(initialItems);
			}
		} else if (schema.type === "loose_object" || schema.type === "object" || schema.type === "strict_object") {
			if (internalFieldStore.kind && internalFieldStore.kind !== "object") throw new Error(`Store initialized as "${internalFieldStore.kind}" cannot be reinitialized as "object"`);
			internalFieldStore.kind = "object";
			if (internalFieldStore.kind === "object") {
				internalFieldStore.children ??= {};
				for (const key in schema.entries) {
					internalFieldStore.children[key] ??= {};
					path.push(key);
					initializeFieldStore(internalFieldStore.children[key], schema.entries[key], initialInput?.[key], path);
					path.pop();
				}
				const objectInput = nullish && initialInput == null ? initialInput : true;
				internalFieldStore.initialInput = /* @__PURE__ */ createSignal(objectInput);
				internalFieldStore.startInput = /* @__PURE__ */ createSignal(objectInput);
				internalFieldStore.input = /* @__PURE__ */ createSignal(objectInput);
			}
		} else {
			if (internalFieldStore.kind && internalFieldStore.kind !== "value") throw new Error(`Store initialized as "${internalFieldStore.kind}" cannot be reinitialized as "value"`);
			internalFieldStore.kind = "value";
			if (internalFieldStore.kind === "value") {
				internalFieldStore.initialInput = /* @__PURE__ */ createSignal(initialInput);
				internalFieldStore.startInput = /* @__PURE__ */ createSignal(initialInput);
				internalFieldStore.input = /* @__PURE__ */ createSignal(initialInput);
			}
		}
	}
}
/**
* Returns whether the specified boolean property is true for the field store
* or any of its nested children. Recursively checks arrays and objects.
*
* @param internalFieldStore The field store to check.
* @param type The boolean property type to check.
*
* @returns Whether the property is true.
*/
/* @__NO_SIDE_EFFECTS__ */
function getFieldBool(internalFieldStore, type) {
	if (internalFieldStore[type].value) return true;
	if (internalFieldStore.kind === "array") {
		for (let index = 0; index < internalFieldStore.items.value.length; index++) if (/* @__PURE__ */ getFieldBool(internalFieldStore.children[index], type)) return true;
		return false;
	}
	if (internalFieldStore.kind == "object") {
		for (const key in internalFieldStore.children) if (/* @__PURE__ */ getFieldBool(internalFieldStore.children[key], type)) return true;
		return false;
	}
	return false;
}
/**
* Returns the current input of the field store. For arrays and objects,
* recursively collects input from all children. Returns `null` or `undefined`
* for nullish array/object inputs, or the primitive value for value fields.
*
* @param internalFieldStore The field store to get input from.
*
* @returns The field input.
*/
/* @__NO_SIDE_EFFECTS__ */
function getFieldInput(internalFieldStore) {
	if (internalFieldStore.kind === "array") {
		if (internalFieldStore.input.value) {
			const value = [];
			for (let index = 0; index < internalFieldStore.items.value.length; index++) value[index] = /* @__PURE__ */ getFieldInput(internalFieldStore.children[index]);
			return value;
		}
		return internalFieldStore.input.value;
	}
	if (internalFieldStore.kind === "object") {
		if (internalFieldStore.input.value) {
			const value = {};
			for (const key in internalFieldStore.children) value[key] = /* @__PURE__ */ getFieldInput(internalFieldStore.children[key]);
			return value;
		}
		return internalFieldStore.input.value;
	}
	return internalFieldStore.input.value;
}
/**
* Returns the current input of the element. Handles special cases for select
* multiple, checkbox groups, radio groups, and file inputs.
*
* @param element The field element.
* @param internalFieldStore The internal field store.
*
* @returns The element input.
*/
/* @__NO_SIDE_EFFECTS__ */
function getElementInput(element, internalFieldStore) {
	if (element.options && element.multiple) return [...element.options].filter((option) => option.selected && !option.disabled).map((option) => option.value);
	if (element.type === "checkbox") {
		const options = document.getElementsByName(element.name);
		if (options.length > 1) return [...options].filter((option) => option.checked).map((option) => option.value);
		return element.checked;
	}
	if (element.type === "radio") {
		if (element.checked) return element.value;
		return run(() => /* @__PURE__ */ getFieldInput(internalFieldStore));
	}
	if (element.type === "file") {
		if (element.multiple) return [...element.files];
		return element.files[0];
	}
	return element.value;
}
/**
* Returns the field store at the specified path by traversing the form store's
* children hierarchy.
*
* @param internalFormStore The form store to traverse.
* @param path The path to the field store.
*
* @returns The field store.
*/
/* @__NO_SIDE_EFFECTS__ */
function getFieldStore(internalFormStore, path) {
	let internalFieldStore = internalFormStore;
	for (const key of path) internalFieldStore = internalFieldStore.children[key];
	return internalFieldStore;
}
/**
* Sets the specified boolean property for the field store and all nested
* children. Recursively updates arrays and objects.
*
* @param internalFieldStore The field store to update.
* @param type The boolean property type to set.
* @param bool The boolean value to set.
*/
function setFieldBool(internalFieldStore, type, bool) {
	batch(() => {
		if (internalFieldStore.kind === "array") {
			internalFieldStore[type].value = bool;
			for (let index = 0; index < run(() => internalFieldStore.items.value).length; index++) setFieldBool(internalFieldStore.children[index], type, bool);
		} else if (internalFieldStore.kind == "object") for (const key in internalFieldStore.children) setFieldBool(internalFieldStore.children[key], type, bool);
		else internalFieldStore[type].value = bool;
	});
}
/**
* Sets the input for a nested field store and all its children, updating
* touched and dirty states accordingly. Handles dynamic array resizing.
*
* @param internalFieldStore The field store to update.
* @param input The new input value.
*/
function setNestedInput(internalFieldStore, input) {
	internalFieldStore.isTouched.value = true;
	if (internalFieldStore.kind === "array") {
		const arrayInput = input ?? [];
		const items = internalFieldStore.items.value;
		if (arrayInput.length < items.length) internalFieldStore.items.value = items.slice(0, arrayInput.length);
		else if (arrayInput.length > items.length) {
			if (arrayInput.length > internalFieldStore.children.length) {
				const path = JSON.parse(internalFieldStore.name);
				for (let index = internalFieldStore.children.length; index < arrayInput.length; index++) {
					internalFieldStore.children[index] = {};
					path.push(index);
					initializeFieldStore(internalFieldStore.children[index], internalFieldStore.schema.item, arrayInput[index], path);
					path.pop();
				}
			}
			internalFieldStore.items.value = [...items, ...arrayInput.slice(items.length).map(createId)];
		}
		for (let index = 0; index < arrayInput.length; index++) setNestedInput(internalFieldStore.children[index], arrayInput[index]);
		internalFieldStore.input.value = input == null ? input : true;
		internalFieldStore.isDirty.value = internalFieldStore.startInput.value !== internalFieldStore.input.value || internalFieldStore.startItems.value.length !== internalFieldStore.items.value.length;
	} else if (internalFieldStore.kind === "object") {
		for (const key in internalFieldStore.children) setNestedInput(internalFieldStore.children[key], input?.[key]);
		internalFieldStore.input.value = input == null ? input : true;
		internalFieldStore.isDirty.value = internalFieldStore.startInput.value !== internalFieldStore.input.value;
	} else {
		internalFieldStore.input.value = input;
		const startInput = internalFieldStore.startInput.value;
		internalFieldStore.isDirty.value = startInput !== input && (startInput != null || input !== "" && !Number.isNaN(input));
	}
}
/**
* Sets the input for a field at the specified path in the form store,
* traversing the path and updating all parent fields along the way.
*
* @param internalFormStore The form store containing the field.
* @param path The path to the field.
* @param input The new input value.
*/
function setFieldInput(internalFormStore, path, input) {
	batch(() => {
		run(() => {
			let internalFieldStore = internalFormStore;
			for (let index = 0; index < path.length; index++) {
				internalFieldStore = internalFieldStore.children[path[index]];
				if (index < path.length - 1) internalFieldStore.input.value = true;
			}
			setNestedInput(internalFieldStore, input);
		});
	});
}
/**
* Walks through the field store and all nested children, calling the callback
* for each field store in depth-first order.
*
* @param internalFieldStore The field store to walk.
* @param callback The callback to invoke for each field store.
*/
function walkFieldStore(internalFieldStore, callback) {
	callback(internalFieldStore);
	if (internalFieldStore.kind === "array") for (let index = 0; index < run(() => internalFieldStore.items.value).length; index++) walkFieldStore(internalFieldStore.children[index], callback);
	else if (internalFieldStore.kind === "object") for (const key in internalFieldStore.children) walkFieldStore(internalFieldStore.children[key], callback);
}
/**
* Creates a new internal form store from the provided configuration.
* Initializes the field store hierarchy, sets validation modes, and
* creates form state signals.
*
* @param config The form configuration.
* @param parse The schema parse function.
*
* @returns The internal form store.
*/
function createFormStore(config, parse) {
	const store = {};
	initializeFieldStore(store, config.schema, config.initialInput, []);
	store.validators = 0;
	store.validate = config.validate ?? "submit";
	store.revalidate = config.revalidate ?? "input";
	store.parse = parse;
	store.isSubmitting = /* @__PURE__ */ createSignal(false);
	store.isSubmitted = /* @__PURE__ */ createSignal(false);
	store.isValidating = /* @__PURE__ */ createSignal(false);
	return store;
}
/**
* Validates the form input using the configured Valibot schema. Parses the
* current form input, processes validation issues, assigns errors to fields,
* and optionally focuses the first field with an error.
*
* @param internalFormStore The form store to validate.
* @param config The validation configuration.
*
* @returns The Valibot validation result.
*/
async function validateFormInput(internalFormStore, config) {
	internalFormStore.validators++;
	internalFormStore.isValidating.value = true;
	const result = await internalFormStore.parse(run(() => /* @__PURE__ */ getFieldInput(internalFormStore)));
	let rootErrors;
	let nestedErrors;
	if (result.issues) {
		nestedErrors = {};
		for (const issue of result.issues) if (issue.path) {
			const path = [];
			for (const pathItem of issue.path) {
				const key = pathItem.key;
				const keyType = typeof key;
				const itemType = pathItem.type;
				if (keyType !== "string" && keyType !== "number" || itemType === "map" || itemType === "set") break;
				path.push(key);
			}
			const name = JSON.stringify(path);
			const fieldErrors = nestedErrors[name];
			if (fieldErrors) fieldErrors.push(issue.message);
			else nestedErrors[name] = [issue.message];
		} else if (rootErrors) rootErrors.push(issue.message);
		else rootErrors = [issue.message];
	}
	batch(() => {
		walkFieldStore(internalFormStore, (internalFieldStore) => {
			if (internalFieldStore.name === "[]") internalFieldStore.errors.value = rootErrors ?? null;
			else {
				const fieldErrors = nestedErrors?.[internalFieldStore.name] ?? null;
				internalFieldStore.errors.value = fieldErrors;
			}
		});
		internalFormStore.validators--;
		internalFormStore.isValidating.value = internalFormStore.validators > 0;
	});
	return result;
}
/**
* Validates the form input if required based on the validation mode and form
* state. Determines whether to use initial validation mode, revalidation mode,
* or skip validation entirely.
*
* @param internalFormStore The form store to validate.
* @param internalFieldStore The field store that triggered validation.
* @param validationMode The validation mode that triggered this check.
*/
function validateIfRequired(internalFormStore, internalFieldStore, validationMode) {
	if (validationMode === (internalFormStore.validate === "initial" || (internalFormStore.validate === "submit" ? run(() => internalFormStore.isSubmitted.value) : run(() => /* @__PURE__ */ getFieldBool(internalFieldStore, "errors"))) ? internalFormStore.revalidate : internalFormStore.validate)) validateFormInput(internalFormStore);
}
/**
* Internal symbol constant.
*/
var INTERNAL = "~internal";
//#endregion
//#region ../../node_modules/.pnpm/@formisch+svelte@0.8.0_svelte@5.56.0_typescript@5.9.3_valibot@1.4.1_typescript@5.9.3_/node_modules/@formisch/svelte/dist/runes/createForm/createForm.svelte.js
function createForm(config) {
	const internalFormStore = createFormStore(config, (input) => v.safeParseAsync(config.schema, input));
	const isTouched = derived(() => /* @__PURE__ */ getFieldBool(internalFormStore, "isTouched"));
	const isDirty = derived(() => /* @__PURE__ */ getFieldBool(internalFormStore, "isDirty"));
	const isValid = derived(() => !/* @__PURE__ */ getFieldBool(internalFormStore, "errors"));
	return {
		[INTERNAL]: internalFormStore,
		get isSubmitting() {
			return internalFormStore.isSubmitting.value;
		},
		get isSubmitted() {
			return internalFormStore.isSubmitted.value;
		},
		get isValidating() {
			return internalFormStore.isValidating.value;
		},
		get isTouched() {
			return isTouched();
		},
		get isDirty() {
			return isDirty();
		},
		get isValid() {
			return isValid();
		},
		get errors() {
			return internalFormStore.errors.value;
		}
	};
}
{
	/**
	* @param {string} rune
	*/
	function throw_rune_error(rune) {
		if (!(rune in globalThis)) {
			/** @type {any} */
			let value;
			Object.defineProperty(globalThis, rune, {
				configurable: true,
				get: () => {
					if (value !== void 0) return value;
					rune_outside_svelte(rune);
				},
				set: (v) => {
					value = v;
				}
			});
		}
	}
	throw_rune_error("$state");
	throw_rune_error("$effect");
	throw_rune_error("$derived");
	throw_rune_error("$inspect");
	throw_rune_error("$props");
	throw_rune_error("$bindable");
}
//#endregion
//#region ../../node_modules/.pnpm/svelte@5.56.0/node_modules/svelte/src/attachments/index.js
/**
* Creates an object key that will be recognised as an attachment when the object is spread onto an element,
* as a programmatic alternative to using `{@attach ...}`. This can be useful for library authors, though
* is generally not needed when building an app.
*
* ```svelte
* <script>
* 	import { createAttachmentKey } from 'svelte/attachments';
*
* 	const props = {
* 		class: 'cool',
* 		onclick: () => alert('clicked'),
* 		[createAttachmentKey()]: (node) => {
* 			node.textContent = 'attached!';
* 		}
* 	};
* <\/script>
*
* <button {...props}>click me</button>
* ```
* @since 5.29
*/
function createAttachmentKey() {
	return Symbol(ATTACHMENT_KEY);
}
//#endregion
//#region ../../node_modules/.pnpm/@formisch+svelte@0.8.0_svelte@5.56.0_typescript@5.9.3_valibot@1.4.1_typescript@5.9.3_/node_modules/@formisch/svelte/dist/utils/unwrap/unwrap.js
function unwrap(value) {
	if (typeof value === "function") return value();
	return value;
}
//#endregion
//#region ../../node_modules/.pnpm/@formisch+svelte@0.8.0_svelte@5.56.0_typescript@5.9.3_valibot@1.4.1_typescript@5.9.3_/node_modules/@formisch/svelte/dist/runes/useField/useField.svelte.js
function useField(form, config) {
	const path = derived(() => unwrap(config).path);
	const internalFormStore = derived(() => unwrap(form)[INTERNAL]);
	const internalFieldStore = derived(() => /* @__PURE__ */ getFieldStore(internalFormStore(), path()));
	const input = derived(() => /* @__PURE__ */ getFieldInput(internalFieldStore()));
	const isTouched = derived(() => /* @__PURE__ */ getFieldBool(internalFieldStore(), "isTouched"));
	const isDirty = derived(() => /* @__PURE__ */ getFieldBool(internalFieldStore(), "isDirty"));
	const isValid = derived(() => !/* @__PURE__ */ getFieldBool(internalFieldStore(), "errors"));
	return {
		get path() {
			return path();
		},
		get input() {
			return input();
		},
		get errors() {
			return internalFieldStore().errors.value;
		},
		get isTouched() {
			return isTouched();
		},
		get isDirty() {
			return isDirty();
		},
		get isValid() {
			return isValid();
		},
		onInput(value) {
			setFieldInput(internalFormStore(), path(), value);
			validateIfRequired(internalFormStore(), internalFieldStore(), "input");
		},
		props: {
			get name() {
				return internalFieldStore().name;
			},
			autofocus: !!internalFieldStore().errors.value,
			[createAttachmentKey()](element) {
				internalFieldStore().elements.push(element);
				return () => {
					internalFieldStore().elements = internalFieldStore().elements.filter((el) => el !== element);
				};
			},
			onfocus() {
				setFieldBool(internalFieldStore(), "isTouched", true);
				validateIfRequired(internalFormStore(), internalFieldStore(), "touch");
			},
			oninput(event) {
				setFieldInput(internalFormStore(), path(), /* @__PURE__ */ getElementInput(event.currentTarget, internalFieldStore()));
				validateIfRequired(internalFormStore(), internalFieldStore(), "input");
			},
			onchange() {
				validateIfRequired(internalFormStore(), internalFieldStore(), "change");
			},
			onblur() {
				validateIfRequired(internalFormStore(), internalFieldStore(), "blur");
			}
		}
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@formisch+svelte@0.8.0_svelte@5.56.0_typescript@5.9.3_valibot@1.4.1_typescript@5.9.3_/node_modules/@formisch/svelte/dist/components/Field/Field.svelte
Field[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/@formisch+svelte@0.8.0_svelte@5.56.0_typescript@5.9.3_valibot@1.4.1_typescript@5.9.3_/node_modules/@formisch/svelte/dist/components/Field/Field.svelte";
function Field($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* Field component props interface.
		*/
		/**
		* The form store to which the field belongs.
		*/
		/**
		* The path to the field within the form schema.
		*/
		/**
		* The render function that receives the field store and returns JSX.
		*/
		let { of, path, children } = $$props;
		children($$renderer, useField(() => of, () => ({ path })));
		$$renderer.push(`<!---->`);
	}, Field);
}
Field.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/@formisch+svelte@0.8.0_svelte@5.56.0_typescript@5.9.3_valibot@1.4.1_typescript@5.9.3_/node_modules/@formisch/svelte/dist/components/Form/Form.svelte
Form[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/@formisch+svelte@0.8.0_svelte@5.56.0_typescript@5.9.3_valibot@1.4.1_typescript@5.9.3_/node_modules/@formisch/svelte/dist/components/Form/Form.svelte";
function Form($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* Form component props type.
		*/
		/**
		* The form store instance.
		*/
		/**
		* The form store instance.
		*/
		/**
		* The submit handler called when the form is submitted and validation succeeds.
		*/
		/**
		* The child elements to render within the form.
		*/
		let { of, onsubmit, children, $$slots, $$events, ...other } = $$props;
		$$renderer.push(`<form${attributes({
			...other,
			novalidate: true
		})}>`);
		push_element($$renderer, "form", 38, 0);
		children($$renderer);
		$$renderer.push(`<!----></form>`);
		pop_element();
	}, Form);
}
Form.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { Field as F, SignInSchema as S, Form as a, SignUpSchema as b, createForm as c };
//# sourceMappingURL=Form-Bx8izpYi.js.map
