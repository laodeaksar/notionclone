var SvelteSet = globalThis.Set;
var MediaQuery = class {
	current;
	/**
	* @param {string} query
	* @param {boolean} [matches]
	*/
	constructor(query, matches = false) {
		this.current = matches;
	}
};
/**
* @param {any} _
*/
function createSubscriber(_) {
	return () => {};
}

export { MediaQuery as M, SvelteSet as S, createSubscriber as c };
//# sourceMappingURL=index-server3-BJHpPivQ.js.map
