import { ae as push_element, ab as pop_element, ac as prevent_snippet_stringification, aG as validate_snippet_args, au as spread_props, y as escape_html, F as FILENAME, aw as store_get, aD as unsubscribe_stores } from './index-server-DF5QiTDW.js';
import { g as goto } from './client-CmejShti.js';
import { p as page } from './stores-CHv9lQMV.js';
import { a as authClient } from './auth-client-BxKE7wBF.js';
import { L as Label, g as Input, B as Button, A as Alert } from './src-CHBm6YUz.js';
import { c as createForm, a as Form, F as Field, S as SignInSchema } from './Form-BSMt1DZg.js';
import 'clsx';
import './internal-CYYyrqc2.js';
import './index-server3-BJHpPivQ.js';
import 'tailwind-merge';
import '@floating-ui/dom';
import 'valibot';

//#region src/routes/(auth)/login/+page.svelte
_page[FILENAME] = "src/routes/(auth)/login/+page.svelte";
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let serverError = "";
		const loginForm = createForm({ schema: SignInSchema });
		async function onsubmit(output) {
			serverError = "";
			const result = await authClient.signIn.email({
				email: output.email,
				password: output.password
			});
			if (result.error) serverError = result.error.message ?? "Login failed";
			else goto(store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("redirectTo") ?? "/app");
		}
		$$renderer.push(`<div class="min-h-screen flex items-center justify-center bg-background px-4">`);
		push_element($$renderer, "div", 28, 0);
		$$renderer.push(`<div class="w-full max-w-md space-y-6">`);
		push_element($$renderer, "div", 29, 2);
		$$renderer.push(`<div class="text-center">`);
		push_element($$renderer, "div", 30, 4);
		$$renderer.push(`<h1 class="text-3xl font-bold tracking-tight">`);
		push_element($$renderer, "h1", 31, 6);
		$$renderer.push(`Welcome back</h1>`);
		pop_element();
		$$renderer.push(` <p class="mt-2 text-sm text-muted-foreground">`);
		push_element($$renderer, "p", 32, 6);
		$$renderer.push(`Sign in to your account</p>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` `);
		Form($$renderer, {
			of: loginForm,
			onsubmit,
			class: "space-y-4",
			children: prevent_snippet_stringification(($$renderer) => {
				if (serverError) {
					$$renderer.push("<!--[0-->");
					if (Alert) {
						$$renderer.push("<!--[-->");
						Alert($$renderer, {
							variant: "destructive",
							children: prevent_snippet_stringification(($$renderer) => {
								$$renderer.push(`<!---->${escape_html(serverError)}`);
							}),
							$$slots: { default: true }
						});
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <div class="space-y-2">`);
				push_element($$renderer, "div", 40, 6);
				if (Label) {
					$$renderer.push("<!--[-->");
					Label($$renderer, {
						for: "login-email",
						children: prevent_snippet_stringification(($$renderer) => {
							$$renderer.push(`<!---->Email`);
						}),
						$$slots: { default: true }
					});
					$$renderer.push("<!--]-->");
				} else {
					$$renderer.push("<!--[!-->");
					$$renderer.push("<!--]-->");
				}
				$$renderer.push(` `);
				{
					prevent_snippet_stringification(children);
					function children($$renderer, field) {
						validate_snippet_args($$renderer);
						if (Input) {
							$$renderer.push("<!--[-->");
							Input($$renderer, spread_props([field.props, {
								id: "login-email",
								type: "email",
								value: field.input ?? "",
								placeholder: "you@example.com",
								error: !!field.errors
							}]));
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
						$$renderer.push(` `);
						if (field.errors) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<p class="mt-1 text-xs text-destructive">`);
							push_element($$renderer, "p", 53, 14);
							$$renderer.push(`${escape_html(field.errors[0])}</p>`);
							pop_element();
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]-->`);
					}
					Field($$renderer, {
						of: loginForm,
						path: ["email"],
						children});
				}
				$$renderer.push(`<!----></div>`);
				pop_element();
				$$renderer.push(` <div class="space-y-2">`);
				push_element($$renderer, "div", 59, 6);
				if (Label) {
					$$renderer.push("<!--[-->");
					Label($$renderer, {
						for: "login-password",
						children: prevent_snippet_stringification(($$renderer) => {
							$$renderer.push(`<!---->Password`);
						}),
						$$slots: { default: true }
					});
					$$renderer.push("<!--]-->");
				} else {
					$$renderer.push("<!--[!-->");
					$$renderer.push("<!--]-->");
				}
				$$renderer.push(` `);
				{
					prevent_snippet_stringification(children);
					function children($$renderer, field) {
						validate_snippet_args($$renderer);
						if (Input) {
							$$renderer.push("<!--[-->");
							Input($$renderer, spread_props([field.props, {
								id: "login-password",
								type: "password",
								value: field.input ?? "",
								placeholder: "••••••••",
								error: !!field.errors
							}]));
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
						$$renderer.push(` `);
						if (field.errors) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<p class="mt-1 text-xs text-destructive">`);
							push_element($$renderer, "p", 72, 14);
							$$renderer.push(`${escape_html(field.errors[0])}</p>`);
							pop_element();
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]-->`);
					}
					Field($$renderer, {
						of: loginForm,
						path: ["password"],
						children});
				}
				$$renderer.push(`<!----></div>`);
				pop_element();
				$$renderer.push(` `);
				if (Button) {
					$$renderer.push("<!--[-->");
					Button($$renderer, {
						type: "submit",
						disabled: loginForm.isSubmitting,
						class: "w-full",
						children: prevent_snippet_stringification(($$renderer) => {
							$$renderer.push(`<!---->${escape_html(loginForm.isSubmitting ? "Signing in…" : "Sign in")}`);
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
		$$renderer.push(`<!----> <p class="text-center text-sm text-muted-foreground">`);
		push_element($$renderer, "p", 87, 4);
		$$renderer.push(`Don't have an account? <a href="/signup" class="font-medium text-primary hover:underline">`);
		push_element($$renderer, "a", 89, 6);
		$$renderer.push(`Sign up</a>`);
		pop_element();
		$$renderer.push(`</p>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		if ($$store_subs) unsubscribe_stores($$store_subs);
	}, _page);
}
_page.render = function() {
	throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-CXNuoWM3.js.map
