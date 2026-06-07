import { ae as push_element, ab as pop_element, w as ensure_array_like, k as attr_style, y as escape_html, F as FILENAME, ax as stringify } from './index-server-DF5QiTDW.js';
import './client-CWyDyZKx.js';
import './auth-client-BxKE7wBF.js';
import 'clsx';
import './internal-CAsCd1Nb.js';

//#region src/routes/+page.svelte
_page[FILENAME] = "src/routes/+page.svelte";
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<div class="flex h-screen flex-col items-center justify-center gap-8 bg-background svelte-1uha8ag">`);
		push_element($$renderer, "div", 24, 0);
		$$renderer.push(`<div class="flex flex-col items-center gap-3 select-none svelte-1uha8ag">`);
		push_element($$renderer, "div", 26, 2);
		$$renderer.push(`<div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg svelte-1uha8ag">`);
		push_element($$renderer, "div", 27, 4);
		$$renderer.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-7 w-7 text-primary-foreground svelte-1uha8ag">`);
		push_element($$renderer, "svg", 28, 6);
		$$renderer.push(`<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" class="svelte-1uha8ag">`);
		push_element($$renderer, "path", 38, 8);
		$$renderer.push(`</path>`);
		pop_element();
		$$renderer.push(`<polyline points="14 2 14 8 20 8" class="svelte-1uha8ag">`);
		push_element($$renderer, "polyline", 39, 8);
		$$renderer.push(`</polyline>`);
		pop_element();
		$$renderer.push(`<line x1="16" y1="13" x2="8" y2="13" class="svelte-1uha8ag">`);
		push_element($$renderer, "line", 40, 8);
		$$renderer.push(`</line>`);
		pop_element();
		$$renderer.push(`<line x1="16" y1="17" x2="8" y2="17" class="svelte-1uha8ag">`);
		push_element($$renderer, "line", 41, 8);
		$$renderer.push(`</line>`);
		pop_element();
		$$renderer.push(`<line x1="10" y1="9" x2="8" y2="9" class="svelte-1uha8ag">`);
		push_element($$renderer, "line", 42, 8);
		$$renderer.push(`</line>`);
		pop_element();
		$$renderer.push(`</svg>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <span class="text-xl font-bold tracking-tight text-foreground svelte-1uha8ag">`);
		push_element($$renderer, "span", 45, 4);
		$$renderer.push(`Aksar La'ode</span>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` <div class="flex flex-col items-center gap-3 svelte-1uha8ag">`);
		push_element($$renderer, "div", 49, 2);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex gap-1.5 svelte-1uha8ag">`);
			push_element($$renderer, "div", 52, 6);
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like([
				0,
				1,
				2
			]);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let i = each_array[$$index];
				$$renderer.push(`<div class="h-2 w-2 rounded-full bg-muted-foreground/50 svelte-1uha8ag"${attr_style(`animation: bounce 1.2s ease-in-out ${stringify(i * .2)}s infinite`)}>`);
				push_element($$renderer, "div", 54, 10);
				$$renderer.push(`</div>`);
				pop_element();
			}
			$$renderer.push(`<!--]--></div>`);
			pop_element();
			$$renderer.push(` <p class="text-xs text-muted-foreground svelte-1uha8ag">`);
			push_element($$renderer, "p", 60, 6);
			$$renderer.push(`${escape_html("Loading…")}</p>`);
			pop_element();
		}
		$$renderer.push(`<!--]--></div>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
	}, _page);
}
_page.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-Cuxf2aqd.js.map
