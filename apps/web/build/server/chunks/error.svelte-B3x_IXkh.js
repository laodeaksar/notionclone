import { ae as push_element, y as escape_html, ab as pop_element, I as getContext, F as FILENAME } from './index-server-DF5QiTDW.js';
import './client-CWyDyZKx.js';
import 'clsx';
import './internal-CAsCd1Nb.js';

//#endregion
//#region ../../node_modules/.pnpm/@sveltejs+kit@2.61.1_@sveltejs+vite-plugin-svelte@5.1.1_svelte@5.56.0_vite@8.0.14_@type_d0f79e6b33a7cda8b8670e40b9808133/node_modules/@sveltejs/kit/src/runtime/app/state/server.js
function context() {
	return getContext("__request__");
}
/** @param {string} name */
function context_dev(name) {
	try {
		return context();
	} catch {
		throw new Error(`Can only read '${name}' on the server during rendering (not in e.g. \`load\` functions), as it is bound to the current request via component context. This prevents state from leaking between users. For more information, see https://svelte.dev/docs/kit/state-management#avoid-shared-state-on-the-server`);
	}
}
//#endregion
//#region ../../node_modules/.pnpm/@sveltejs+kit@2.61.1_@sveltejs+vite-plugin-svelte@5.1.1_svelte@5.56.0_vite@8.0.14_@type_d0f79e6b33a7cda8b8670e40b9808133/node_modules/@sveltejs/kit/src/runtime/app/state/index.js
/**
* A read-only reactive object with information about the current page, serving several use cases:
* - retrieving the combined `data` of all pages/layouts anywhere in your component tree (also see [loading data](https://svelte.dev/docs/kit/load))
* - retrieving the current value of the `form` prop anywhere in your component tree (also see [form actions](https://svelte.dev/docs/kit/form-actions))
* - retrieving the page state that was set through `goto`, `pushState` or `replaceState` (also see [goto](https://svelte.dev/docs/kit/$app-navigation#goto) and [shallow routing](https://svelte.dev/docs/kit/shallow-routing))
* - retrieving metadata such as the URL you're on, the current route and its parameters, and whether or not there was an error
*
* ```svelte
* <!--- file: +layout.svelte --->
* <script>
* 	import { page } from '$app/state';
* <\/script>
*
* <p>Currently at {page.url.pathname}</p>
*
* {#if page.error}
* 	<span class="red">Problem detected</span>
* {:else}
* 	<span class="small">All systems operational</span>
* {/if}
* ```
*
* Changes to `page` are available exclusively with runes. (The legacy reactivity syntax will not reflect any changes)
*
* ```svelte
* <!--- file: +page.svelte --->
* <script>
* 	import { page } from '$app/state';
* 	const id = $derived(page.params.id); // This will correctly update id for usage on this page
* 	$: badId = page.params.id; // Do not use; will never update after initial load
* <\/script>
* ```
*
* On the server, values can only be read during rendering (in other words _not_ in e.g. `load` functions). In the browser, the values can be read at any time.
*
* @type {import('@sveltejs/kit').Page}
*/
var page = {
	get error() {
		return context_dev("page.error").page.error;
	},
	get status() {
		return context_dev("page.status").page.status;
	}};
//#endregion
//#region ../../node_modules/.pnpm/@sveltejs+kit@2.61.1_@sveltejs+vite-plugin-svelte@5.1.1_svelte@5.56.0_vite@8.0.14_@type_d0f79e6b33a7cda8b8670e40b9808133/node_modules/@sveltejs/kit/src/runtime/components/svelte-5/error.svelte
Error$1[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/@sveltejs+kit@2.61.1_@sveltejs+vite-plugin-svelte@5.1.1_svelte@5.56.0_vite@8.0.14_@type_d0f79e6b33a7cda8b8670e40b9808133/node_modules/@sveltejs/kit/src/runtime/components/svelte-5/error.svelte";
function Error$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<h1>`);
		push_element($$renderer, "h1", 7, 0);
		$$renderer.push(`${escape_html(page.status)}</h1>`);
		pop_element();
		$$renderer.push(` <p>`);
		push_element($$renderer, "p", 8, 0);
		$$renderer.push(`${escape_html(page.error?.message)}</p>`);
		pop_element();
	}, Error$1);
}
Error$1.render = function() {
	throw new Error$1("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { Error$1 as default };
//# sourceMappingURL=error.svelte-B3x_IXkh.js.map
