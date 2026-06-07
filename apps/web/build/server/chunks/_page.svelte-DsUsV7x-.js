import { ae as push_element, ab as pop_element, ac as prevent_snippet_stringification, aG as validate_snippet_args, au as spread_props, y as escape_html, F as FILENAME, aw as store_get, aD as unsubscribe_stores } from './index-server-DF5QiTDW.js';
import { g as goto } from './client-C6e9gHTB.js';
import { p as page } from './stores-A5E6vGkY.js';
import { a as authClient } from './auth-client-BxKE7wBF.js';
import { L as Label, g as Input, B as Button, A as Alert } from './src-HzPwensY.js';
import { c as createForm, a as Form, F as Field, b as SignUpSchema } from './Form-Bx8izpYi.js';
import 'clsx';
import './internal-DBlml9h1.js';
import './index-server3-BJHpPivQ.js';
import 'tailwind-merge';
import '@floating-ui/dom';
import 'valibot';

//#region src/routes/(auth)/signup/+page.svelte
_page[FILENAME] = "src/routes/(auth)/signup/+page.svelte";
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let serverError = "";
		const signupForm = createForm({ schema: SignUpSchema });
		async function onsubmit(output) {
			serverError = "";
			const result = await authClient.signUp.email({
				name: output.name,
				email: output.email,
				password: output.password
			});
			if (result.error) serverError = result.error.message ?? "Sign up failed";
			else goto(store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("redirectTo") ?? "/app");
		}
		$$renderer.push(`<div class="min-h-screen flex items-center justify-center bg-background px-4">`);
		push_element($$renderer, "div", 29, 0);
		$$renderer.push(`<div class="w-full max-w-md space-y-6">`);
		push_element($$renderer, "div", 30, 2);
		$$renderer.push(`<div class="text-center">`);
		push_element($$renderer, "div", 31, 4);
		$$renderer.push(`<h1 class="text-3xl font-bold tracking-tight">`);
		push_element($$renderer, "h1", 32, 6);
		$$renderer.push(`Create an account</h1>`);
		pop_element();
		$$renderer.push(` <p class="mt-2 text-sm text-muted-foreground">`);
		push_element($$renderer, "p", 33, 6);
		$$renderer.push(`Start writing. For free.</p>`);
		pop_element();
		$$renderer.push(`</div>`);
		pop_element();
		$$renderer.push(` `);
		Form($$renderer, {
			of: signupForm,
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
				push_element($$renderer, "div", 41, 6);
				if (Label) {
					$$renderer.push("<!--[-->");
					Label($$renderer, {
						for: "signup-name",
						children: prevent_snippet_stringification(($$renderer) => {
							$$renderer.push(`<!---->Name`);
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
								id: "signup-name",
								type: "text",
								value: field.input ?? "",
								placeholder: "Your Name",
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
							push_element($$renderer, "p", 54, 14);
							$$renderer.push(`${escape_html(field.errors[0])}</p>`);
							pop_element();
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]-->`);
					}
					Field($$renderer, {
						of: signupForm,
						path: ["name"],
						children});
				}
				$$renderer.push(`<!----></div>`);
				pop_element();
				$$renderer.push(` <div class="space-y-2">`);
				push_element($$renderer, "div", 60, 6);
				if (Label) {
					$$renderer.push("<!--[-->");
					Label($$renderer, {
						for: "signup-email",
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
								id: "signup-email",
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
							push_element($$renderer, "p", 73, 14);
							$$renderer.push(`${escape_html(field.errors[0])}</p>`);
							pop_element();
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]-->`);
					}
					Field($$renderer, {
						of: signupForm,
						path: ["email"],
						children});
				}
				$$renderer.push(`<!----></div>`);
				pop_element();
				$$renderer.push(` <div class="space-y-2">`);
				push_element($$renderer, "div", 79, 6);
				if (Label) {
					$$renderer.push("<!--[-->");
					Label($$renderer, {
						for: "signup-password",
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
								id: "signup-password",
								type: "password",
								value: field.input ?? "",
								placeholder: "Min 8 characters",
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
							push_element($$renderer, "p", 92, 14);
							$$renderer.push(`${escape_html(field.errors[0])}</p>`);
							pop_element();
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]-->`);
					}
					Field($$renderer, {
						of: signupForm,
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
						disabled: signupForm.isSubmitting,
						class: "w-full",
						children: prevent_snippet_stringification(($$renderer) => {
							$$renderer.push(`<!---->${escape_html(signupForm.isSubmitting ? "Creating account…" : "Create account")}`);
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
		push_element($$renderer, "p", 107, 4);
		$$renderer.push(`Already have an account? <a href="/login" class="font-medium text-primary hover:underline">`);
		push_element($$renderer, "a", 109, 6);
		$$renderer.push(`Sign in</a>`);
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
//# sourceMappingURL=_page.svelte-DsUsV7x-.js.map
