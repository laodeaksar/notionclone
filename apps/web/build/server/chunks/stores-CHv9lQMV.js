import { I as getContext } from './index-server-DF5QiTDW.js';
import './client-CmejShti.js';

//#region ../../node_modules/.pnpm/@sveltejs+kit@2.61.1_@sveltejs+vite-plugin-svelte@5.1.1_svelte@5.56.0_vite@8.0.14_@type_d0f79e6b33a7cda8b8670e40b9808133/node_modules/@sveltejs/kit/src/runtime/app/stores.js
/**
* A function that returns all of the contextual stores. On the server, this must be called during component initialization.
* Only use this if you need to defer store subscription until after the component has mounted, for some reason.
*
* @deprecated Use `$app/state` instead (requires Svelte 5, [see docs for more info](https://svelte.dev/docs/kit/migrating-to-sveltekit-2#SvelteKit-2.12:-$app-stores-deprecated))
*/
var getStores = () => {
	const stores$1 = getContext("__svelte__");
	return {
		/** @type {typeof page} */
		page: { subscribe: stores$1.page.subscribe },
		/** @type {typeof navigating} */
		navigating: { subscribe: stores$1.navigating.subscribe },
		/** @type {typeof updated} */
		updated: stores$1.updated
	};
};
/**
* A readable store whose value contains page data.
*
* On the server, this store can only be subscribed to during component initialization. In the browser, it can be subscribed to at any time.
*
* @deprecated Use `page` from `$app/state` instead (requires Svelte 5, [see docs for more info](https://svelte.dev/docs/kit/migrating-to-sveltekit-2#SvelteKit-2.12:-$app-stores-deprecated))
* @type {import('svelte/store').Readable<import('@sveltejs/kit').Page>}
*/
var page = { subscribe(fn) {
	return get_store("page").subscribe(fn);
} };
/**
* @template {keyof ReturnType<typeof getStores>} Name
* @param {Name} name
* @returns {ReturnType<typeof getStores>[Name]}
*/
function get_store(name) {
	try {
		return getStores()[name];
	} catch {
		throw new Error(`Cannot subscribe to '${name}' store on the server outside of a Svelte component, as it is bound to the current request via component context. This prevents state from leaking between users.For more information, see https://svelte.dev/docs/kit/state-management#avoid-shared-state-on-the-server`);
	}
}

export { page as p };
//# sourceMappingURL=stores-CHv9lQMV.js.map
