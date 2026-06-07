const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","icon-192.png","icon-512.png","manifest.webmanifest"]),
	mimeTypes: {".png":"image/png",".webmanifest":"application/manifest+json"},
	_: {
		client: {start:"_app/immutable/entry/start.B90_0cwv.js",app:"_app/immutable/entry/app.DRhFepzW.js",imports:["_app/immutable/entry/start.B90_0cwv.js","_app/immutable/chunks/DOL-cyM-.js","_app/immutable/chunks/AowkN6Qv.js","_app/immutable/chunks/CqjRz4PM.js","_app/immutable/entry/app.DRhFepzW.js","_app/immutable/chunks/AowkN6Qv.js","_app/immutable/chunks/kNaey6uv.js","_app/immutable/chunks/xihTtKlq.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-CoEJ_nRx.js')),
			__memo(() => import('./chunks/1-K9ZCpjpF.js')),
			__memo(() => import('./chunks/2-zVx-W9Tt.js')),
			__memo(() => import('./chunks/3-DEEGyHAg.js')),
			__memo(() => import('./chunks/4-BFPP-7oq.js')),
			__memo(() => import('./chunks/5-D5AdWb_F.js')),
			__memo(() => import('./chunks/6-DHHE3E7Q.js')),
			__memo(() => import('./chunks/7-B35c_ltX.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/(app)/app",
				pattern: /^\/app\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/(app)/app/[pageId]",
				pattern: /^\/app\/([^/]+?)\/?$/,
				params: [{"name":"pageId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/(auth)/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/(auth)/signup",
				pattern: /^\/signup\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
