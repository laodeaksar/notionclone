import { ac as prevent_snippet_stringification, F as FILENAME } from './index-server-DF5QiTDW.js';
import './theme-DRdCW6Vm.js';
import { Q as QueryClientProvider, d as dist_exports } from './dist-BVaOiDfh.js';
import '@tanstack/query-persist-client-core';
import 'idb-keyval';
import 'clsx';
import './index-server3-BJHpPivQ.js';

//#endregion
//#region src/routes/+layout.svelte
_layout[FILENAME] = "src/routes/+layout.svelte";
function _layout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { children } = $$props;
		QueryClientProvider($$renderer, {
			client: new dist_exports.QueryClient({ defaultOptions: {
				queries: {
					staleTime: 3e4,
					gcTime: 1440 * 6e4,
					refetchOnWindowFocus: true,
					networkMode: "offlineFirst"
				},
				mutations: { networkMode: "offlineFirst" }
			} }),
			children: prevent_snippet_stringification(($$renderer) => {
				children($$renderer);
				$$renderer.push(`<!---->`);
			})});
	}, _layout);
}
_layout.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _layout as default };
//# sourceMappingURL=_layout.svelte-C7RjEG8T.js.map
