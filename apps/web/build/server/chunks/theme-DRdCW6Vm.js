import { aI as writable } from './index-server-DF5QiTDW.js';

//#region src/lib/stores/theme.ts
function getInitialTheme() {
	return "light";
}
function createThemeStore() {
	const { subscribe, set, update } = writable(getInitialTheme());
	return {
		subscribe,
		toggle() {
			update((current) => {
				return current === "dark" ? "light" : "dark";
			});
		},
		init() {}
	};
}
var themeStore = createThemeStore();

export { themeStore as t };
//# sourceMappingURL=theme-DRdCW6Vm.js.map
