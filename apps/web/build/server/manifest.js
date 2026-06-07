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
		client: {start:"_app/immutable/entry/start.BiaKNZDh.js",app:"_app/immutable/entry/app.07GVZeq5.js",imports:["_app/immutable/entry/start.BiaKNZDh.js","_app/immutable/chunks/7de_Yw8c.js","_app/immutable/chunks/AowkN6Qv.js","_app/immutable/chunks/CqjRz4PM.js","_app/immutable/entry/app.07GVZeq5.js","_app/immutable/chunks/AowkN6Qv.js","_app/immutable/chunks/kNaey6uv.js","_app/immutable/chunks/xihTtKlq.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-CoEJ_nRx.js')),
			__memo(() => import('./chunks/1-NNokMF6b.js')),
			__memo(() => import('./chunks/2-I53rjiEP.js')),
			__memo(() => import('./chunks/3-B816xlxV.js')),
			__memo(() => import('./chunks/4-BsTmvu1t.js')),
			__memo(() => import('./chunks/5-AsS0q5ZW.js')),
			__memo(() => import('./chunks/6-BN3UF5LN.js')),
			__memo(() => import('./chunks/7-LAT1pWj7.js'))
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
