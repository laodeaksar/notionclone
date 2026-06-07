import { aw as store_get, aD as unsubscribe_stores, R as head, ae as push_element, ac as prevent_snippet_stringification, ab as pop_element, u as derived, j as attr_class, aG as validate_snippet_args, y as escape_html, i as attr, w as ensure_array_like, m as bind_props, al as sanitize_props, au as spread_props, as as slot, an as setContext, I as getContext, k as attr_style, ax as stringify, F as FILENAME } from './index-server-DF5QiTDW.js';
import { t as themeStore } from './theme-DRdCW6Vm.js';
import { u as useQueryClient, c as createMutation, a as createQuery } from './dist-BVaOiDfh.js';
import { g as goto } from './client-BEw2xY00.js';
import { p as page } from './stores-BUAexBiU.js';
import { u as useSession, a as authClient } from './auth-client-BxKE7wBF.js';
import { b as breadcrumbStore, i as isOnline, W as Wifi_off, a as buildTree, u as userStore, c as currentPageMeta } from './wifi-off-JxkjcGFn.js';
import { d as createPageFn, f as currentWorkspaceId, j as pagesKey, r as reorderPageFn, h as deletePageFn, m as updatePageFn, o as workspacesQueryOptions, k as pagesQueryOptions } from './queries-Du7rYaK9.js';
import { D as Drawer, e as Drawer_content, a as Avatar, S as Select, T as Tooltip, X, c as Chevron_right, i as Loader_circle, I as Icon, j as Switch, B as Button, h as Input_group, b as Chevron_down, E as Ellipsis, d as Context_menu } from './src-BoyCCkns.js';
import { F as File_plus } from './CreateWorkspaceModal-GQkxU-k3.js';
import 'clsx';
import './index-server3-BJHpPivQ.js';
import './internal-CcZaUmqm.js';
import 'hono/client';
import 'tailwind-merge';
import '@floating-ui/dom';
import './Form-Bafe-tyt.js';
import 'valibot';

//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/arrow-down.svelte
Arrow_down[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/arrow-down.svelte";
function Arrow_down($$renderer, $$props) {
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
			{ name: "arrow-down" },
			$$sanitized_props,
			{
				/**
				* @component @name ArrowDown
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgNXYxNCIgLz4KICA8cGF0aCBkPSJtMTkgMTItNyA3LTctNyIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/arrow-down
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [["path", { "d": "M12 5v14" }], ["path", { "d": "m19 12-7 7-7-7" }]],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Arrow_down);
}
Arrow_down.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/arrow-up.svelte
Arrow_up[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/arrow-up.svelte";
function Arrow_up($$renderer, $$props) {
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
			{ name: "arrow-up" },
			$$sanitized_props,
			{
				/**
				* @component @name ArrowUp
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtNSAxMiA3LTcgNyA3IiAvPgogIDxwYXRoIGQ9Ik0xMiAxOVY1IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/arrow-up
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [["path", { "d": "m5 12 7-7 7 7" }], ["path", { "d": "M12 19V5" }]],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Arrow_up);
}
Arrow_up.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/corner-down-left.svelte
Corner_down_left[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/corner-down-left.svelte";
function Corner_down_left($$renderer, $$props) {
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
			{ name: "corner-down-left" },
			$$sanitized_props,
			{
				/**
				* @component @name CornerDownLeft
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjAgNHY3YTQgNCAwIDAgMS00IDRINCIgLz4KICA8cGF0aCBkPSJtOSAxMC01IDUgNSA1IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/corner-down-left
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [["path", { "d": "M20 4v7a4 4 0 0 1-4 4H4" }], ["path", { "d": "m9 10-5 5 5 5" }]],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Corner_down_left);
}
Corner_down_left.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/file.svelte
File[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/file.svelte";
function File($$renderer, $$props) {
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
			{ name: "file" },
			$$sanitized_props,
			{
				/**
				* @component @name File
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNiAyMmEyIDIgMCAwIDEtMi0yVjRhMiAyIDAgMCAxIDItMmg4YTIuNCAyLjQgMCAwIDEgMS43MDQuNzA2bDMuNTg4IDMuNTg4QTIuNCAyLjQgMCAwIDEgMjAgOHYxMmEyIDIgMCAwIDEtMiAyeiIgLz4KICA8cGF0aCBkPSJNMTQgMnY1YTEgMSAwIDAgMCAxIDFoNSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/file
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [["path", { "d": "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" }], ["path", { "d": "M14 2v5a1 1 0 0 0 1 1h5" }]],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, File);
}
File.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/grip-vertical.svelte
Grip_vertical[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/grip-vertical.svelte";
function Grip_vertical($$renderer, $$props) {
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
			{ name: "grip-vertical" },
			$$sanitized_props,
			{
				/**
				* @component @name GripVertical
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSI5IiBjeT0iMTIiIHI9IjEiIC8+CiAgPGNpcmNsZSBjeD0iOSIgY3k9IjUiIHI9IjEiIC8+CiAgPGNpcmNsZSBjeD0iOSIgY3k9IjE5IiByPSIxIiAvPgogIDxjaXJjbGUgY3g9IjE1IiBjeT0iMTIiIHI9IjEiIC8+CiAgPGNpcmNsZSBjeD0iMTUiIGN5PSI1IiByPSIxIiAvPgogIDxjaXJjbGUgY3g9IjE1IiBjeT0iMTkiIHI9IjEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/grip-vertical
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [
					["circle", {
						"cx": "9",
						"cy": "12",
						"r": "1"
					}],
					["circle", {
						"cx": "9",
						"cy": "5",
						"r": "1"
					}],
					["circle", {
						"cx": "9",
						"cy": "19",
						"r": "1"
					}],
					["circle", {
						"cx": "15",
						"cy": "12",
						"r": "1"
					}],
					["circle", {
						"cx": "15",
						"cy": "5",
						"r": "1"
					}],
					["circle", {
						"cx": "15",
						"cy": "19",
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
	}, Grip_vertical);
}
Grip_vertical.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/house.svelte
House[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/house.svelte";
function House($$renderer, $$props) {
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
			{ name: "house" },
			$$sanitized_props,
			{
				/**
				* @component @name House
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTUgMjF2LThhMSAxIDAgMCAwLTEtMWgtNGExIDEgMCAwIDAtMSAxdjgiIC8+CiAgPHBhdGggZD0iTTMgMTBhMiAyIDAgMCAxIC43MDktMS41MjhsNy02YTIgMiAwIDAgMSAyLjU4MiAwbDcgNkEyIDIgMCAwIDEgMjEgMTB2OWEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMnoiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/house
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [["path", { "d": "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" }], ["path", { "d": "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }]],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, House);
}
House.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/log-out.svelte
Log_out[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/log-out.svelte";
function Log_out($$renderer, $$props) {
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
			{ name: "log-out" },
			$$sanitized_props,
			{
				/**
				* @component @name LogOut
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTYgMTcgNS01LTUtNSIgLz4KICA8cGF0aCBkPSJNMjEgMTJIOSIgLz4KICA8cGF0aCBkPSJNOSAyMUg1YTIgMiAwIDAgMS0yLTJWNWEyIDIgMCAwIDEgMi0yaDQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/log-out
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [
					["path", { "d": "m16 17 5-5-5-5" }],
					["path", { "d": "M21 12H9" }],
					["path", { "d": "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }]
				],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Log_out);
}
Log_out.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/menu.svelte
Menu[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/menu.svelte";
function Menu($$renderer, $$props) {
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
			{ name: "menu" },
			$$sanitized_props,
			{
				/**
				* @component @name Menu
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNCA1aDE2IiAvPgogIDxwYXRoIGQ9Ik00IDEyaDE2IiAvPgogIDxwYXRoIGQ9Ik00IDE5aDE2IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/menu
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [
					["path", { "d": "M4 5h16" }],
					["path", { "d": "M4 12h16" }],
					["path", { "d": "M4 19h16" }]
				],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Menu);
}
Menu.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/moon.svelte
Moon[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/moon.svelte";
function Moon($$renderer, $$props) {
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
			{ name: "moon" },
			$$sanitized_props,
			{
				/**
				* @component @name Moon
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjAuOTg1IDEyLjQ4NmE5IDkgMCAxIDEtOS40NzMtOS40NzJjLjQwNS0uMDIyLjYxNy40Ni40MDIuODAzYTYgNiAwIDAgMCA4LjI2OCA4LjI2OGMuMzQ0LS4yMTUuODI1LS4wMDQuODAzLjQwMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/moon
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [["path", { "d": "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" }]],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Moon);
}
Moon.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/panel-left-close.svelte
Panel_left_close[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/panel-left-close.svelte";
function Panel_left_close($$renderer, $$props) {
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
			{ name: "panel-left-close" },
			$$sanitized_props,
			{
				/**
				* @component @name PanelLeftClose
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIiAvPgogIDxwYXRoIGQ9Ik05IDN2MTgiIC8+CiAgPHBhdGggZD0ibTE2IDE1LTMtMyAzLTMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/panel-left-close
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
						"rx": "2"
					}],
					["path", { "d": "M9 3v18" }],
					["path", { "d": "m16 15-3-3 3-3" }]
				],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Panel_left_close);
}
Panel_left_close.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/plus.svelte
Plus[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/plus.svelte";
function Plus($$renderer, $$props) {
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
			{ name: "plus" },
			$$sanitized_props,
			{
				/**
				* @component @name Plus
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNSAxMmgxNCIgLz4KICA8cGF0aCBkPSJNMTIgNXYxNCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/plus
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [["path", { "d": "M5 12h14" }], ["path", { "d": "M12 5v14" }]],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Plus);
}
Plus.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/search.svelte
Search[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/search.svelte";
function Search($$renderer, $$props) {
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
			{ name: "search" },
			$$sanitized_props,
			{
				/**
				* @component @name Search
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMjEgMjEtNC4zNC00LjM0IiAvPgogIDxjaXJjbGUgY3g9IjExIiBjeT0iMTEiIHI9IjgiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/search
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [["path", { "d": "m21 21-4.34-4.34" }], ["circle", {
					"cx": "11",
					"cy": "11",
					"r": "8"
				}]],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Search);
}
Search.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/sun.svelte
Sun[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/sun.svelte";
function Sun($$renderer, $$props) {
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
			{ name: "sun" },
			$$sanitized_props,
			{
				/**
				* @component @name Sun
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI0IiAvPgogIDxwYXRoIGQ9Ik0xMiAydjIiIC8+CiAgPHBhdGggZD0iTTEyIDIwdjIiIC8+CiAgPHBhdGggZD0ibTQuOTMgNC45MyAxLjQxIDEuNDEiIC8+CiAgPHBhdGggZD0ibTE3LjY2IDE3LjY2IDEuNDEgMS40MSIgLz4KICA8cGF0aCBkPSJNMiAxMmgyIiAvPgogIDxwYXRoIGQ9Ik0yMCAxMmgyIiAvPgogIDxwYXRoIGQ9Im02LjM0IDE3LjY2LTEuNDEgMS40MSIgLz4KICA8cGF0aCBkPSJtMTkuMDcgNC45My0xLjQxIDEuNDEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/sun
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
						"r": "4"
					}],
					["path", { "d": "M12 2v2" }],
					["path", { "d": "M12 20v2" }],
					["path", { "d": "m4.93 4.93 1.41 1.41" }],
					["path", { "d": "m17.66 17.66 1.41 1.41" }],
					["path", { "d": "M2 12h2" }],
					["path", { "d": "M20 12h2" }],
					["path", { "d": "m6.34 17.66-1.41 1.41" }],
					["path", { "d": "m19.07 4.93-1.41 1.41" }]
				],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Sun);
}
Sun.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region ../../node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/wifi.svelte
Wifi[FILENAME] = "/home/runner/workspace/node_modules/.pnpm/lucide-svelte@1.0.1_svelte@5.56.0/node_modules/lucide-svelte/dist/icons/wifi.svelte";
function Wifi($$renderer, $$props) {
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
			{ name: "wifi" },
			$$sanitized_props,
			{
				/**
				* @component @name Wifi
				* @description Lucide SVG icon component, renders SVG Element with children.
				*
				* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgMjBoLjAxIiAvPgogIDxwYXRoIGQ9Ik0yIDguODJhMTUgMTUgMCAwIDEgMjAgMCIgLz4KICA8cGF0aCBkPSJNNSAxMi44NTlhMTAgMTAgMCAwIDEgMTQgMCIgLz4KICA8cGF0aCBkPSJNOC41IDE2LjQyOWE1IDUgMCAwIDEgNyAwIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/wifi
				* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
				*
				* @param {Object} props - Lucide icons props and any valid SVG attribute
				* @returns {FunctionalComponent} Svelte component
				*
				*/
				iconNode: [
					["path", { "d": "M12 20h.01" }],
					["path", { "d": "M2 8.82a15 15 0 0 1 20 0" }],
					["path", { "d": "M5 12.859a10 10 0 0 1 14 0" }],
					["path", { "d": "M8.5 16.429a5 5 0 0 1 7 0" }]
				],
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<!--[-->`);
					slot($$renderer, $$props, "default", {});
					$$renderer.push(`<!--]-->`);
				}),
				$$slots: { default: true }
			}
		]));
	}, Wifi);
}
Wifi.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region src/lib/components/PageTreeItem.svelte
PageTreeItem_1[FILENAME] = "src/lib/components/PageTreeItem.svelte";
function PageTreeItem_1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let { node, depth, siblings, parentId, onCreateChild } = $$props;
		const qc = useQueryClient();
		const deletePageMutation = createMutation(() => ({
			mutationFn: deletePageFn,
			onSuccess: async () => {
				await qc.invalidateQueries({ queryKey: pagesKey(node.workspaceId) });
				if (isActive()) goto();
			}
		}));
		createMutation(() => ({
			mutationFn: updatePageFn,
			onSuccess: async () => {
				await qc.invalidateQueries({ queryKey: pagesKey(node.workspaceId) });
			}
		}));
		let renaming = false;
		let renameValue = "";
		let currentPath = derived(() => store_get($$store_subs ??= {}, "$page", page).url.pathname);
		let isActive = derived(() => currentPath() === `/app/${node.id}`);
		const drag = getContext("page-drag");
		let isDragging = derived(() => drag.draggingId === node.id);
		let isDropTarget = derived(() => drag.dragOverId === node.id);
		let showAbove = derived(() => isDropTarget() && drag.dragPos === "above");
		let showBelow = derived(() => isDropTarget() && drag.dragPos === "below");
		const menuItems = derived(() => [
			{
				label: "Rename",
				icon: "pencil",
				onclick: () => {
					renameValue = node.title ?? "";
					renaming = true;
				}
			},
			{
				label: "Add sub-page",
				icon: "file-plus",
				onclick: () => onCreateChild(node.id)
			},
			{
				label: "Copy link",
				icon: "link",
				separator: true,
				onclick: () => {
					const url = `${window.location.origin}/app/${node.id}`;
					navigator.clipboard.writeText(url).catch(() => {});
				}
			},
			{
				label: "Delete",
				icon: "trash",
				variant: "destructive",
				separator: true,
				onclick: () => deletePageMutation.mutate(node.id)
			}
		]);
		$$renderer.push(`<div class="relative" role="listitem"${attr("draggable", !drag.isFiltering)}>`);
		push_element($$renderer, "div", 155, 0);
		if (showAbove()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="absolute top-0 left-0 right-0 h-0.5 bg-primary rounded-full z-10 pointer-events-none">`);
			push_element($$renderer, "div", 171, 4);
			$$renderer.push(`</div>`);
			pop_element();
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		{
			prevent_snippet_stringification(children);
			function children($$renderer, { openAt }) {
				validate_snippet_args($$renderer);
				$$renderer.push(`<div${attr_class(`group flex items-center gap-1 px-1 py-0.5 rounded text-sm hover:bg-accent transition-colors cursor-pointer select-none ${isDragging() ? "opacity-40" : ""}`, void 0, { "bg-accent": isActive() })}${attr_style(`padding-left: ${stringify(depth * 12 + 4)}px`)}>`);
				push_element($$renderer, "div", 176, 6);
				if (!drag.isFiltering) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="opacity-0 group-hover:opacity-100 flex-shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-opacity" aria-hidden="true">`);
					push_element($$renderer, "span", 185, 10);
					Grip_vertical($$renderer, { class: "w-3 h-3" });
					$$renderer.push(`<!----></span>`);
					pop_element();
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <button class="w-4 h-4 text-muted-foreground flex-shrink-0 flex items-center justify-center" tabindex="-1">`);
				push_element($$renderer, "button", 195, 8);
				if (node.children.length > 0) {
					$$renderer.push("<!--[0-->");
					$$renderer.push("<!--[0-->");
					Chevron_down($$renderer, { class: "w-3 h-3" });
					$$renderer.push(`<!--]-->`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></button>`);
				pop_element();
				$$renderer.push(` `);
				File($$renderer, {
					class: "w-3.5 h-3.5 flex-shrink-0 text-muted-foreground",
					strokeWidth: 1.5
				});
				$$renderer.push(`<!----> `);
				if (renaming) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<input${attr("value", renameValue)} class="flex-1 text-sm bg-transparent border-b border-primary outline-none truncate min-w-0 py-px"/>`);
					push_element($$renderer, "input", 214, 10);
					pop_element();
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<button class="flex-1 text-left truncate">`);
					push_element($$renderer, "button", 227, 10);
					$$renderer.push(`${escape_html(node.title || "Untitled")}</button>`);
					pop_element();
				}
				$$renderer.push(`<!--]--> `);
				if (!renaming) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="hidden group-hover:flex items-center gap-0.5 shrink-0">`);
					push_element($$renderer, "div", 237, 10);
					if (Tooltip) {
						$$renderer.push("<!--[-->");
						Tooltip($$renderer, {
							content: "Add sub-page",
							side: "top",
							children: prevent_snippet_stringification(($$renderer) => {
								$$renderer.push(`<button class="w-5 h-5 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-accent-foreground/10 transition-colors" aria-label="Add sub-page">`);
								push_element($$renderer, "button", 239, 14);
								Plus($$renderer, { class: "w-3 h-3" });
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
							content: "More options",
							side: "top",
							children: prevent_snippet_stringification(($$renderer) => {
								$$renderer.push(`<button class="w-5 h-5 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-accent-foreground/10 transition-colors" aria-label="More options">`);
								push_element($$renderer, "button", 250, 14);
								Ellipsis($$renderer, { class: "w-3 h-3" });
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
					$$renderer.push(`</div>`);
					pop_element();
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
				pop_element();
			}
			if (Context_menu) {
				$$renderer.push("<!--[-->");
				Context_menu($$renderer, {
					items: menuItems(),
					children,
					$$slots: { default: true }
				});
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		$$renderer.push(` `);
		if (showBelow()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full z-10 pointer-events-none">`);
			push_element($$renderer, "div", 271, 4);
			$$renderer.push(`</div>`);
			pop_element();
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (node.children.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(node.children);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let child = each_array[$$index];
				PageTreeItem_1($$renderer, {
					node: child,
					depth: depth + 1,
					siblings: node.children,
					parentId: node.id,
					onCreateChild
				});
			}
			$$renderer.push(`<!--]-->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
		pop_element();
		if ($$store_subs) unsubscribe_stores($$store_subs);
	}, PageTreeItem_1);
}
PageTreeItem_1.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region src/lib/components/sidebar/SidebarPageTree.svelte
SidebarPageTree[FILENAME] = "src/lib/components/sidebar/SidebarPageTree.svelte";
function SidebarPageTree($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { currentWs, pagesTree, pagesLoading, createIsPending, onCreatePage } = $$props;
		const qc = useQueryClient();
		let filterQuery = "";
		function filterTree(nodes, query) {
			if (!query.trim()) return nodes;
			const q = query.toLowerCase();
			return nodes.reduce((acc, node) => {
				const filteredChildren = filterTree(node.children, q);
				if ((node.title ?? "").toLowerCase().includes(q) || filteredChildren.length > 0) acc.push({
					...node,
					children: filteredChildren
				});
				return acc;
			}, []);
		}
		const visibleTree = derived(() => filterTree(pagesTree, filterQuery));
		const isFiltering = derived(() => filterQuery.trim().length > 0);
		function countTree(nodes) {
			return nodes.reduce((acc, n) => acc + 1 + countTree(n.children), 0);
		}
		const totalCount = derived(() => countTree(pagesTree));
		const visibleCount = derived(() => countTree(visibleTree()));
		const reorderMutation = createMutation(() => ({
			mutationFn: reorderPageFn,
			onSuccess: async () => {
				if (currentWs) await qc.invalidateQueries({ queryKey: pagesKey(currentWs.id) });
			}
		}));
		const drag = {
			draggingId: null,
			dragOverId: null,
			dragPos: null
		};
		function calcOrder(siblings, targetId, pos) {
			const sorted = [...siblings].sort((a, b) => a.order - b.order);
			const idx = sorted.findIndex((n) => n.id === targetId);
			if (idx === -1) return 0;
			if (pos === "above") {
				const prev = sorted[idx - 1];
				return prev ? (prev.order + sorted[idx].order) / 2 : sorted[idx].order - 1;
			} else {
				const next = sorted[idx + 1];
				return next ? (sorted[idx].order + next.order) / 2 : sorted[idx].order + 1;
			}
		}
		setContext("page-drag", {
			get draggingId() {
				return drag.draggingId;
			},
			get dragOverId() {
				return drag.dragOverId;
			},
			get dragPos() {
				return drag.dragPos;
			},
			get isFiltering() {
				return isFiltering();
			},
			onDragStart(id) {
				drag.draggingId = id;
			},
			onDragOver(id, pos) {
				drag.dragOverId = id;
				drag.dragPos = pos;
			},
			onDrop(opts) {
				const { targetId, pos, siblings, parentId } = opts;
				if (!drag.draggingId || drag.draggingId === targetId) {
					drag.draggingId = null;
					drag.dragOverId = null;
					drag.dragPos = null;
					return;
				}
				const order = calcOrder(siblings, targetId, pos);
				reorderMutation.mutate({
					id: drag.draggingId,
					parentId,
					order
				});
				drag.draggingId = null;
				drag.dragOverId = null;
				drag.dragPos = null;
			},
			onDragEnd() {
				drag.draggingId = null;
				drag.dragOverId = null;
				drag.dragPos = null;
			}
		});
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<div class="flex-1 overflow-y-auto px-2 py-2 flex flex-col gap-2">`);
			push_element($$renderer, "div", 123, 0);
			if (currentWs) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="flex items-center justify-between px-1">`);
				push_element($$renderer, "div", 125, 4);
				$$renderer.push(`<div class="flex items-center gap-1.5">`);
				push_element($$renderer, "div", 126, 6);
				$$renderer.push(`<p class="text-xs text-muted-foreground font-medium">`);
				push_element($$renderer, "p", 127, 8);
				$$renderer.push(`PAGES</p>`);
				pop_element();
				$$renderer.push(` `);
				if (!pagesLoading && totalCount() > 0) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span${attr_class(`inline-flex items-center justify-center rounded-full px-1.5 py-px text-[10px] font-medium leading-none ${isFiltering() ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`)}>`);
					push_element($$renderer, "span", 129, 10);
					$$renderer.push(`${escape_html(isFiltering() ? `${visibleCount()}/${totalCount()}` : totalCount())}</span>`);
					pop_element();
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
				pop_element();
				$$renderer.push(` `);
				if (Tooltip) {
					$$renderer.push("<!--[-->");
					Tooltip($$renderer, {
						content: "New page",
						shortcut: "⌘N",
						side: "right",
						children: prevent_snippet_stringification(($$renderer) => {
							$$renderer.push(`<button${attr("disabled", createIsPending, true)} class="p-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-50" aria-label="New page">`);
							push_element($$renderer, "button", 140, 8);
							Plus($$renderer, { class: "w-3.5 h-3.5" });
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
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(` `);
				{
					prevent_snippet_stringification(leftSection);
					function leftSection($$renderer) {
						validate_snippet_args($$renderer);
						Search($$renderer, { class: "w-3 h-3" });
					}
					prevent_snippet_stringification(rightSection);
					function rightSection($$renderer) {
						validate_snippet_args($$renderer);
						if (filterQuery) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<button class="flex items-center justify-center hover:text-foreground transition-colors" aria-label="Clear filter">`);
							push_element($$renderer, "button", 163, 10);
							X($$renderer, { class: "w-3 h-3" });
							$$renderer.push(`<!----></button>`);
							pop_element();
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]-->`);
					}
					if (Input_group) {
						$$renderer.push("<!--[-->");
						Input_group($$renderer, {
							placeholder: "Filter pages…",
							class: "h-7 text-xs",
							wrapperClass: "px-1",
							get value() {
								return filterQuery;
							},
							set value($$value) {
								filterQuery = $$value;
								$$settled = false;
							},
							leftSection,
							rightSection,
							$$slots: {
								leftSection: true,
								rightSection: true
							}
						});
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
				}
				$$renderer.push(` `);
				if (pagesLoading) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<p class="text-xs text-muted-foreground px-1">`);
					push_element($$renderer, "p", 175, 6);
					$$renderer.push(`Loading…</p>`);
					pop_element();
				} else if (pagesTree.length === 0) {
					$$renderer.push("<!--[1-->");
					$$renderer.push(`<p class="text-xs text-muted-foreground px-1">`);
					push_element($$renderer, "p", 177, 6);
					$$renderer.push(`No pages yet</p>`);
					pop_element();
				} else if (visibleTree().length === 0) {
					$$renderer.push("<!--[2-->");
					$$renderer.push(`<p class="text-xs text-muted-foreground px-1 italic">`);
					push_element($$renderer, "p", 179, 6);
					$$renderer.push(`No pages match "${escape_html(filterQuery)}"</p>`);
					pop_element();
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--[-->`);
					const each_array = ensure_array_like(visibleTree());
					for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
						let node = each_array[$$index];
						PageTreeItem_1($$renderer, {
							node,
							depth: 0,
							siblings: pagesTree,
							parentId: null,
							onCreateChild: onCreatePage
						});
					}
					$$renderer.push(`<!--]-->`);
				}
				$$renderer.push(`<!--]-->`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<p class="text-xs text-muted-foreground px-1">`);
				push_element($$renderer, "p", 192, 4);
				$$renderer.push(`Select a workspace to view pages</p>`);
				pop_element();
			}
			$$renderer.push(`<!--]--></div>`);
			pop_element();
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	}, SidebarPageTree);
}
SidebarPageTree.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region src/lib/components/sidebar/SidebarFooter.svelte
SidebarFooter[FILENAME] = "src/lib/components/sidebar/SidebarFooter.svelte";
function SidebarFooter($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { user, theme, onToggleTheme, onLogout } = $$props;
		if (user) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="border-t border-border px-3 py-2 flex items-center justify-between gap-2">`);
			push_element($$renderer, "div", 20, 2);
			$$renderer.push(`<div class="min-w-0 flex items-center gap-2">`);
			push_element($$renderer, "div", 22, 4);
			if (Avatar) {
				$$renderer.push("<!--[-->");
				Avatar($$renderer, {
					fallback: user.name,
					size: "sm"
				});
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
			$$renderer.push(` <div class="min-w-0">`);
			push_element($$renderer, "div", 24, 6);
			$$renderer.push(`<p class="text-sm font-medium truncate leading-tight">`);
			push_element($$renderer, "p", 25, 8);
			$$renderer.push(`${escape_html(user.name)}</p>`);
			pop_element();
			$$renderer.push(` <p class="text-xs text-muted-foreground truncate">`);
			push_element($$renderer, "p", 26, 8);
			$$renderer.push(`${escape_html(user.email)}</p>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(` <div class="flex items-center gap-2 shrink-0">`);
			push_element($$renderer, "div", 30, 4);
			if (Tooltip) {
				$$renderer.push("<!--[-->");
				Tooltip($$renderer, {
					content: theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
					side: "top",
					children: prevent_snippet_stringification(($$renderer) => {
						$$renderer.push(`<div class="flex items-center gap-1.5">`);
						push_element($$renderer, "div", 36, 8);
						if (theme === "dark") {
							$$renderer.push("<!--[0-->");
							Moon($$renderer, { class: "w-3.5 h-3.5 text-muted-foreground" });
						} else {
							$$renderer.push("<!--[-1-->");
							Sun($$renderer, { class: "w-3.5 h-3.5 text-muted-foreground" });
						}
						$$renderer.push(`<!--]--> `);
						if (Switch) {
							$$renderer.push("<!--[-->");
							Switch($$renderer, {
								checked: theme === "dark",
								onCheckedChange: onToggleTheme,
								"aria-label": theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
							});
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
						$$renderer.push(`</div>`);
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
					content: "Sign out",
					side: "top",
					children: prevent_snippet_stringification(($$renderer) => {
						if (Button) {
							$$renderer.push("<!--[-->");
							Button($$renderer, {
								variant: "ghost",
								size: "icon",
								onclick: onLogout,
								"aria-label": "Sign out",
								class: "h-7 w-7",
								children: prevent_snippet_stringification(($$renderer) => {
									Log_out($$renderer, { class: "w-4 h-4" });
								}),
								$$slots: { default: true }
							});
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
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
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	}, SidebarFooter);
}
SidebarFooter.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region src/lib/components/Sidebar.svelte
Sidebar[FILENAME] = "src/lib/components/Sidebar.svelte";
function Sidebar($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let { onClose } = $$props;
		const qc = useQueryClient();
		let user = derived(() => store_get($$store_subs ??= {}, "$userStore", userStore));
		let theme = derived(() => store_get($$store_subs ??= {}, "$themeStore", themeStore));
		const workspacesQuery = createQuery(() => workspacesQueryOptions());
		const workspaces = derived(() => workspacesQuery.data ?? []);
		const wsOptions = derived(() => workspaces().map((w) => ({
			value: w.id,
			label: w.name,
			description: w.description ?? void 0
		})));
		const pagesQuery = createQuery(() => pagesQueryOptions(store_get($$store_subs ??= {}, "$currentWorkspaceId", currentWorkspaceId) ?? ""));
		const pagesTree = derived(() => buildTree(pagesQuery.data ?? []));
		const pagesLoading = derived(() => pagesQuery.isPending && (store_get($$store_subs ??= {}, "$currentWorkspaceId", currentWorkspaceId)?.length ?? 0) > 0);
		const createPage = createMutation(() => ({
			mutationFn: createPageFn,
			onSuccess: async (page) => {
				if (store_get($$store_subs ??= {}, "$currentWorkspaceId", currentWorkspaceId)) await qc.invalidateQueries({ queryKey: pagesKey(store_get($$store_subs ??= {}, "$currentWorkspaceId", currentWorkspaceId)) });
				goto(`/app/${page.id}`);
			}
		}));
		function handleCreatePage(parentId) {
			if (!store_get($$store_subs ??= {}, "$currentWorkspaceId", currentWorkspaceId)) return;
			createPage.mutate({
				title: "Untitled",
				workspaceId: store_get($$store_subs ??= {}, "$currentWorkspaceId", currentWorkspaceId),
				parentId
			});
		}
		async function logout() {
			await authClient.signOut();
			goto();
		}
		$$renderer.push(`<aside${attr_class(`flex flex-col overflow-hidden transition-all duration-200 h-full bg-background md:border-r md:border-border md:w-64`)}>`);
		push_element($$renderer, "aside", 84, 0);
		$$renderer.push(`<div class="flex items-center gap-1 px-2 py-2.5 border-b border-border min-w-0">`);
		push_element($$renderer, "div", 91, 2);
		$$renderer.push("<!--[0-->");
		{
			prevent_snippet_stringification(renderItem);
			function renderItem($$renderer, opt, isSelected) {
				validate_snippet_args($$renderer);
				if (Avatar) {
					$$renderer.push("<!--[-->");
					Avatar($$renderer, {
						fallback: opt.label,
						size: "sm",
						class: "rounded-md shrink-0"
					});
					$$renderer.push("<!--]-->");
				} else {
					$$renderer.push("<!--[!-->");
					$$renderer.push("<!--]-->");
				}
				$$renderer.push(` <div class="flex-1 min-w-0">`);
				push_element($$renderer, "div", 103, 10);
				$$renderer.push(`<p class="text-sm font-medium truncate">`);
				push_element($$renderer, "p", 104, 12);
				$$renderer.push(`${escape_html(opt.label)}</p>`);
				pop_element();
				$$renderer.push(` `);
				if (opt.description) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<p class="text-xs text-muted-foreground truncate">`);
					push_element($$renderer, "p", 106, 14);
					$$renderer.push(`${escape_html(opt.description)}</p>`);
					pop_element();
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
				pop_element();
			}
			prevent_snippet_stringification(footer);
			function footer($$renderer) {
				validate_snippet_args($$renderer);
				$$renderer.push(`<button class="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">`);
				push_element($$renderer, "button", 112, 10);
				$$renderer.push(`<div class="w-6 h-6 shrink-0 rounded-md border-2 border-dashed border-border flex items-center justify-center">`);
				push_element($$renderer, "div", 117, 12);
				Plus($$renderer, { class: "w-3.5 h-3.5" });
				$$renderer.push(`<!----></div>`);
				pop_element();
				$$renderer.push(` New workspace</button>`);
				pop_element();
			}
			if (Select) {
				$$renderer.push("<!--[-->");
				Select($$renderer, {
					options: wsOptions(),
					value: store_get($$store_subs ??= {}, "$currentWorkspaceId", currentWorkspaceId),
					onValueChange: (id) => currentWorkspaceId.set(id),
					placeholder: "Select workspace",
					class: "flex-1 min-w-0",
					renderItem,
					footer,
					$$slots: {
						renderItem: true,
						footer: true
					}
				});
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		$$renderer.push(`<!--]--> `);
		if (Tooltip) {
			$$renderer.push("<!--[-->");
			Tooltip($$renderer, {
				content: "Collapse sidebar",
				shortcut: "⌘\\",
				side: "right",
				class: "hidden md:inline-flex shrink-0",
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<button class="p-1 rounded hover:bg-accent text-muted-foreground transition-colors"${attr("aria-label", "Collapse sidebar")}>`);
					push_element($$renderer, "button", 134, 6);
					$$renderer.push("<!--[-1-->");
					Panel_left_close($$renderer, { class: "w-4 h-4" });
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
				content: "Close menu",
				side: "right",
				class: "flex md:hidden shrink-0",
				children: prevent_snippet_stringification(($$renderer) => {
					$$renderer.push(`<button class="p-1 rounded hover:bg-accent text-muted-foreground transition-colors" aria-label="Close menu">`);
					push_element($$renderer, "button", 149, 6);
					X($$renderer, { class: "w-4 h-4" });
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
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` `);
		$$renderer.push("<!--[0-->");
		SidebarPageTree($$renderer, {
			currentWs: workspaces().find((w) => w.id === store_get($$store_subs ??= {}, "$currentWorkspaceId", currentWorkspaceId)) ?? null,
			pagesTree: pagesTree(),
			pagesLoading: pagesLoading(),
			createIsPending: createPage.isPending,
			onCreatePage: handleCreatePage
		});
		$$renderer.push(`<!----> `);
		SidebarFooter($$renderer, {
			user: user(),
			theme: theme(),
			onToggleTheme: () => themeStore.toggle(),
			onLogout: logout
		});
		$$renderer.push(`<!---->`);
		$$renderer.push(`<!--]--></aside>`);
		pop_element();
		$$renderer.push(` `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	}, Sidebar);
}
Sidebar.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region src/lib/components/PageBreadcrumb.svelte
PageBreadcrumb[FILENAME] = "src/lib/components/PageBreadcrumb.svelte";
function PageBreadcrumb($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { page, pages } = $$props;
		const ancestors = derived(() => () => {
			const map = new Map(pages.map((p) => [p.id, p]));
			const chain = [];
			let cur = map.get(page.parentId ?? "");
			while (cur) {
				chain.unshift(cur);
				cur = map.get(cur.parentId ?? "");
			}
			return chain;
		});
		$$renderer.push(`<nav class="w-full bg-background/90 backdrop-blur-sm border-b border-border shrink-0" aria-label="Breadcrumb">`);
		push_element($$renderer, "nav", 27, 0);
		$$renderer.push(`<div class="max-w-3xl mx-auto px-8 h-9 flex items-center gap-1 text-xs text-muted-foreground">`);
		push_element($$renderer, "div", 31, 2);
		$$renderer.push(`<button class="flex items-center p-1 rounded hover:bg-accent hover:text-foreground transition-colors" title="Home" aria-label="Home">`);
		push_element($$renderer, "button", 33, 4);
		House($$renderer, { class: "w-3.5 h-3.5" });
		$$renderer.push(`<!----></button>`);
		pop_element();
		$$renderer.push(` <!--[-->`);
		const each_array = ensure_array_like(ancestors()());
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let ancestor = each_array[$$index];
			Chevron_right($$renderer, { class: "w-3 h-3 shrink-0 opacity-40" });
			$$renderer.push(`<!----> <button class="max-w-[140px] truncate px-1.5 py-0.5 rounded hover:bg-accent hover:text-foreground transition-colors">`);
			push_element($$renderer, "button", 44, 6);
			$$renderer.push(`${escape_html(ancestor.title || "Untitled")}</button>`);
			pop_element();
		}
		$$renderer.push(`<!--]--> `);
		Chevron_right($$renderer, { class: "w-3 h-3 shrink-0 opacity-40" });
		$$renderer.push(`<!----> <span class="max-w-[200px] truncate px-1.5 py-0.5 text-foreground font-medium">`);
		push_element($$renderer, "span", 56, 4);
		$$renderer.push(`${escape_html(page.title || "Untitled")}</span>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</nav>`);
		pop_element();
	}, PageBreadcrumb);
}
PageBreadcrumb.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region src/lib/components/CommandPalette.svelte
CommandPalette[FILENAME] = "src/lib/components/CommandPalette.svelte";
function CommandPalette($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let { open = false } = $$props;
		let query = "";
		let selectedIndex = 0;
		const qc = useQueryClient();
		const pagesQuery = createQuery(() => pagesQueryOptions(store_get($$store_subs ??= {}, "$currentWorkspaceId", currentWorkspaceId) ?? ""));
		const createPage = createMutation(() => ({
			mutationFn: createPageFn,
			onSuccess: async (page) => {
				if (store_get($$store_subs ??= {}, "$currentWorkspaceId", currentWorkspaceId)) await qc.invalidateQueries({ queryKey: pagesKey(store_get($$store_subs ??= {}, "$currentWorkspaceId", currentWorkspaceId)) });
				goto(`/app/${page.id}`);
				close();
			}
		}));
		const filtered = derived(() => () => {
			const pages = pagesQuery.data ?? [];
			const q = query.trim().toLowerCase();
			if (!q) return pages.slice(0, 8);
			return pages.filter((p) => (p.title || "Untitled").toLowerCase().includes(q)).slice(0, 8);
		});
		const showCreate = derived(() => query.trim().length > 0);
		const createIndex = derived(() => filtered()().length);
		function close() {
			open = false;
			query = "";
		}
		if (open) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" role="button" tabindex="-1" aria-label="Close command palette">`);
			push_element($$renderer, "div", 101, 2);
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(` <div class="fixed left-1/2 top-[20%] -translate-x-1/2 z-50 w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl overflow-hidden" role="dialog" aria-label="Command palette">`);
			push_element($$renderer, "div", 111, 2);
			$$renderer.push(`<div class="flex items-center gap-3 px-4 py-3 border-b border-border">`);
			push_element($$renderer, "div", 118, 4);
			Search($$renderer, { class: "w-4 h-4 text-muted-foreground shrink-0" });
			$$renderer.push(`<!----> <input${attr("value", query)} type="text" placeholder="Search or create a page…" class="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" aria-label="Search pages"/>`);
			push_element($$renderer, "input", 120, 6);
			pop_element();
			$$renderer.push(` <kbd class="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5 font-mono">`);
			push_element($$renderer, "kbd", 129, 6);
			$$renderer.push(`ESC</kbd>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(` <div class="max-h-80 overflow-y-auto py-1">`);
			push_element($$renderer, "div", 133, 4);
			if (pagesQuery.isPending) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="px-4 py-3 text-xs text-muted-foreground">`);
				push_element($$renderer, "p", 135, 8);
				$$renderer.push(`Loading…</p>`);
				pop_element();
			} else {
				$$renderer.push("<!--[-1-->");
				if (filtered()().length === 0 && !showCreate()) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<p class="px-4 py-6 text-center text-sm text-muted-foreground">`);
					push_element($$renderer, "p", 138, 10);
					$$renderer.push(`No pages found</p>`);
					pop_element();
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <!--[-->`);
				const each_array = ensure_array_like(filtered()());
				for (let i = 0, $$length = each_array.length; i < $$length; i++) {
					let page = each_array[i];
					$$renderer.push(`<button${attr_class(`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${selectedIndex === i ? "bg-accent text-foreground" : "text-foreground/80 hover:bg-accent/50"}`)}>`);
					push_element($$renderer, "button", 142, 10);
					File($$renderer, {
						class: "w-4 h-4 shrink-0 text-muted-foreground",
						strokeWidth: 1.5
					});
					$$renderer.push(`<!----> <span class="flex-1 truncate">`);
					push_element($$renderer, "span", 149, 12);
					$$renderer.push(`${escape_html(page.title || "Untitled")}</span>`);
					pop_element();
					$$renderer.push(` `);
					if (selectedIndex === i) {
						$$renderer.push("<!--[0-->");
						Corner_down_left($$renderer, { class: "w-3.5 h-3.5 shrink-0 text-muted-foreground" });
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></button>`);
					pop_element();
				}
				$$renderer.push(`<!--]--> `);
				if (showCreate()) {
					$$renderer.push("<!--[0-->");
					if (filtered()().length > 0) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<div class="mx-4 my-1 border-t border-border">`);
						push_element($$renderer, "div", 158, 12);
						$$renderer.push(`</div>`);
						pop_element();
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> <button${attr("disabled", createPage.isPending, true)}${attr_class(`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors disabled:opacity-60 ${selectedIndex === createIndex() ? "bg-accent text-foreground" : "text-foreground/80 hover:bg-accent/50"}`)}>`);
					push_element($$renderer, "button", 160, 10);
					if (createPage.isPending) {
						$$renderer.push("<!--[0-->");
						Loader_circle($$renderer, { class: "w-4 h-4 shrink-0 text-muted-foreground animate-spin" });
					} else {
						$$renderer.push("<!--[-1-->");
						File_plus($$renderer, {
							class: "w-4 h-4 shrink-0 text-muted-foreground",
							strokeWidth: 1.5
						});
					}
					$$renderer.push(`<!--]--> <span class="flex-1 truncate">`);
					push_element($$renderer, "span", 172, 12);
					$$renderer.push(`Create page: <span class="font-medium">`);
					push_element($$renderer, "span", 173, 27);
					$$renderer.push(`"${escape_html(query.trim())}"</span>`);
					pop_element();
					$$renderer.push(`</span>`);
					pop_element();
					$$renderer.push(` `);
					if (selectedIndex === createIndex()) {
						$$renderer.push("<!--[0-->");
						Corner_down_left($$renderer, { class: "w-3.5 h-3.5 shrink-0 text-muted-foreground" });
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></button>`);
					pop_element();
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]-->`);
			}
			$$renderer.push(`<!--]--></div>`);
			pop_element();
			$$renderer.push(` <div class="flex items-center gap-3 px-4 py-2 border-t border-border text-[10px] text-muted-foreground">`);
			push_element($$renderer, "div", 184, 4);
			$$renderer.push(`<span class="flex items-center gap-1">`);
			push_element($$renderer, "span", 185, 6);
			Arrow_up($$renderer, { class: "w-3 h-3" });
			$$renderer.push(`<!---->`);
			Arrow_down($$renderer, { class: "w-3 h-3" });
			$$renderer.push(`<!----> navigate</span>`);
			pop_element();
			$$renderer.push(` <span class="flex items-center gap-1">`);
			push_element($$renderer, "span", 186, 6);
			Corner_down_left($$renderer, { class: "w-3 h-3" });
			$$renderer.push(`<!----> open</span>`);
			pop_element();
			$$renderer.push(` <span>`);
			push_element($$renderer, "span", 187, 6);
			$$renderer.push(`ESC close</span>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
			$$renderer.push(`</div>`);
			pop_element();
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
		bind_props($$props, { open });
	}, CommandPalette);
}
CommandPalette.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region src/lib/components/OfflineIndicator.svelte
OfflineIndicator[FILENAME] = "src/lib/components/OfflineIndicator.svelte";
function OfflineIndicator($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let showSynced = false;
		if (derived(() => !store_get($$store_subs ??= {}, "$isOnline", isOnline) || showSynced)()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div${attr_class(`fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-lg transition-all duration-300 ${store_get($$store_subs ??= {}, "$isOnline", isOnline) ? "bg-emerald-500 text-white" : "bg-zinc-800 text-white dark:bg-zinc-700"}`)}>`);
			push_element($$renderer, "div", 27, 2);
			if (store_get($$store_subs ??= {}, "$isOnline", isOnline)) {
				$$renderer.push("<!--[0-->");
				Wifi($$renderer, {
					class: "h-4 w-4",
					strokeWidth: 1.5
				});
				$$renderer.push(`<!----> <span>`);
				push_element($$renderer, "span", 35, 6);
				$$renderer.push(`Kembali online — tersinkron</span>`);
				pop_element();
			} else {
				$$renderer.push("<!--[-1-->");
				Wifi_off($$renderer, {
					class: "h-4 w-4",
					strokeWidth: 1.5
				});
				$$renderer.push(`<!----> <span>`);
				push_element($$renderer, "span", 38, 6);
				$$renderer.push(`Offline — perubahan akan disinkronkan saat terhubung</span>`);
				pop_element();
			}
			$$renderer.push(`<!--]--></div>`);
			pop_element();
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	}, OfflineIndicator);
}
OfflineIndicator.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region src/lib/components/MobileBottomNav.svelte
MobileBottomNav[FILENAME] = "src/lib/components/MobileBottomNav.svelte";
function MobileBottomNav($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { onOpenMenu, onOpenSearch, onNewPage, onScrollTop } = $$props;
		$$renderer.push(`<nav${attr_class(`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 md:hidden flex items-center gap-1 px-2 py-2 bg-background/80 backdrop-blur-md border border-border rounded-2xl transition-shadow duration-200 shadow-lg`)} aria-label="Mobile navigation">`);
		push_element($$renderer, "nav", 41, 0);
		$$renderer.push(`<button class="p-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" aria-label="Home">`);
		push_element($$renderer, "button", 52, 2);
		House($$renderer, { class: "w-5 h-5" });
		$$renderer.push(`<!----></button>`);
		pop_element();
		$$renderer.push(` <button class="p-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" aria-label="Search">`);
		push_element($$renderer, "button", 60, 2);
		Search($$renderer, { class: "w-5 h-5" });
		$$renderer.push(`<!----></button>`);
		pop_element();
		$$renderer.push(` <button class="p-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" aria-label="New page">`);
		push_element($$renderer, "button", 68, 2);
		File_plus($$renderer, { class: "w-5 h-5" });
		$$renderer.push(`<!----></button>`);
		pop_element();
		$$renderer.push(` <button class="p-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" aria-label="Open sidebar">`);
		push_element($$renderer, "button", 76, 2);
		Menu($$renderer, { class: "w-5 h-5" });
		$$renderer.push(`<!----></button>`);
		pop_element();
		$$renderer.push(`</nav>`);
		pop_element();
	}, MobileBottomNav);
}
MobileBottomNav.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
//#endregion
//#region src/routes/(app)/app/+layout.svelte
_layout[FILENAME] = "src/routes/(app)/app/+layout.svelte";
function _layout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let { children } = $$props;
		let paletteOpen = false;
		let drawerOpen = false;
		const session = useSession();
		const ready = derived(() => !!store_get($$store_subs ??= {}, "$session", session).data?.user || store_get($$store_subs ??= {}, "$userStore", userStore) !== null && (store_get($$store_subs ??= {}, "$session", session).isPending || !store_get($$store_subs ??= {}, "$isOnline", isOnline)));
		store_get($$store_subs ??= {}, "$isOnline", isOnline);
		const qc = useQueryClient();
		const createPage = createMutation(() => ({
			mutationFn: createPageFn,
			onSuccess: async (newPage) => {
				if (store_get($$store_subs ??= {}, "$currentWorkspaceId", currentWorkspaceId)) await qc.invalidateQueries({ queryKey: pagesKey(store_get($$store_subs ??= {}, "$currentWorkspaceId", currentWorkspaceId)) });
				goto(`/app/${newPage.id}`);
			}
		}));
		function handleNewPage() {
			if (!store_get($$store_subs ??= {}, "$currentWorkspaceId", currentWorkspaceId)) return;
			createPage.mutate({
				title: "Untitled",
				workspaceId: store_get($$store_subs ??= {}, "$currentWorkspaceId", currentWorkspaceId)
			});
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("cev88s", $$renderer, ($$renderer) => {
				if (store_get($$store_subs ??= {}, "$currentPageMeta", currentPageMeta)) {
					$$renderer.push("<!--[0-->");
					$$renderer.title(($$renderer) => {
						$$renderer.push(`<title>${escape_html(store_get($$store_subs ??= {}, "$currentPageMeta", currentPageMeta).icon ? `${store_get($$store_subs ??= {}, "$currentPageMeta", currentPageMeta).icon} ` : "")}${escape_html(store_get($$store_subs ??= {}, "$currentPageMeta", currentPageMeta).title || "Untitled")}</title>`);
					});
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.title(($$renderer) => {
						$$renderer.push(`<title>Aksar La'ode</title>`);
					});
				}
				$$renderer.push(`<!--]-->`);
			});
			$$renderer.push(`<div class="flex h-screen overflow-hidden bg-background">`);
			push_element($$renderer, "div", 153, 0);
			if (ready()) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="md:hidden">`);
				push_element($$renderer, "div", 156, 4);
				if (Drawer) {
					$$renderer.push("<!--[-->");
					Drawer($$renderer, {
						direction: "left",
						get open() {
							return drawerOpen;
						},
						set open($$value) {
							drawerOpen = $$value;
							$$settled = false;
						},
						children: prevent_snippet_stringification(($$renderer) => {
							if (Drawer_content) {
								$$renderer.push("<!--[-->");
								Drawer_content($$renderer, {
									class: "fixed inset-y-0 left-0 z-[60] flex h-full w-[88vw] max-w-[300px] flex-col\n                 bg-background border-r border-border shadow-2xl outline-none",
									children: prevent_snippet_stringification(($$renderer) => {
										Sidebar($$renderer, { onClose: () => drawerOpen = false });
									}),
									$$slots: { default: true }
								});
								$$renderer.push("<!--]-->");
							} else {
								$$renderer.push("<!--[!-->");
								$$renderer.push("<!--]-->");
							}
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
				$$renderer.push(` <div class="hidden md:block flex-none">`);
				push_element($$renderer, "div", 168, 4);
				Sidebar($$renderer, {});
				$$renderer.push(`<!----></div>`);
				pop_element();
				$$renderer.push(` <div class="flex flex-col flex-1 min-w-0 overflow-hidden">`);
				push_element($$renderer, "div", 173, 4);
				if (store_get($$store_subs ??= {}, "$breadcrumbStore", breadcrumbStore)) {
					$$renderer.push("<!--[0-->");
					PageBreadcrumb($$renderer, {
						page: store_get($$store_subs ??= {}, "$breadcrumbStore", breadcrumbStore).page,
						pages: store_get($$store_subs ??= {}, "$breadcrumbStore", breadcrumbStore).pages
					});
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <main class="flex-1 overflow-y-auto pb-24 md:pb-0">`);
				push_element($$renderer, "main", 181, 6);
				children($$renderer);
				$$renderer.push(`<!----></main>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(` `);
				MobileBottomNav($$renderer, {
					onOpenMenu: () => drawerOpen = true,
					onOpenSearch: () => paletteOpen = true,
					onNewPage: handleNewPage,
					onScrollTop: () => void 0
				});
				$$renderer.push(`<!----> `);
				CommandPalette($$renderer, {
					get open() {
						return paletteOpen;
					},
					set open($$value) {
						paletteOpen = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!---->`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="flex h-full w-full items-center justify-center">`);
				push_element($$renderer, "div", 196, 4);
				$$renderer.push(`<div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full">`);
				push_element($$renderer, "div", 197, 6);
				$$renderer.push(`</div>`);
				pop_element();
				$$renderer.push(`</div>`);
				pop_element();
			}
			$$renderer.push(`<!--]--></div>`);
			pop_element();
			$$renderer.push(` `);
			OfflineIndicator($$renderer);
			$$renderer.push(`<!---->`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	}, _layout);
}
_layout.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _layout as default };
//# sourceMappingURL=_layout.svelte-10TGlmX8.js.map
