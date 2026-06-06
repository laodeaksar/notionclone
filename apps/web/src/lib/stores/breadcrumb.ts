import { writable } from "svelte/store";
import type { Page } from "./page.js";

export const breadcrumbStore = writable<{ page: Page; pages: Page[] } | null>(null);
