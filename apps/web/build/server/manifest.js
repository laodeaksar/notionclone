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
		client: {start:"_app/immutable/entry/start.BE7x_a0y.js",app:"_app/immutable/entry/app.8vnX_tmj.js",imports:["_app/immutable/entry/start.BE7x_a0y.js","_app/immutable/chunks/D2-ig4bU.js","_app/immutable/chunks/AowkN6Qv.js","_app/immutable/chunks/CqjRz4PM.js","_app/immutable/entry/app.8vnX_tmj.js","_app/immutable/chunks/AowkN6Qv.js","_app/immutable/chunks/kNaey6uv.js","_app/immutable/chunks/xihTtKlq.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-CToa_Ba0.js')),
			__memo(() => import('./chunks/1-uuTfso0X.js')),
			__memo(() => import('./chunks/2-0-jA-3Rz.js')),
			__memo(() => import('./chunks/3-D475iaXk.js')),
			__memo(() => import('./chunks/4-XQrZXKk3.js')),
			__memo(() => import('./chunks/5-CSFQsOqj.js')),
			__memo(() => import('./chunks/6-CBW1UfHq.js')),
			__memo(() => import('./chunks/7-Dicrx-3q.js'))
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
