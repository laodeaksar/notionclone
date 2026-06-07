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
		client: {start:"_app/immutable/entry/start.CsMN3dmL.js",app:"_app/immutable/entry/app.DTMQ7zEj.js",imports:["_app/immutable/entry/start.CsMN3dmL.js","_app/immutable/chunks/DR5QJ9Qt.js","_app/immutable/chunks/AowkN6Qv.js","_app/immutable/chunks/CqjRz4PM.js","_app/immutable/entry/app.DTMQ7zEj.js","_app/immutable/chunks/AowkN6Qv.js","_app/immutable/chunks/kNaey6uv.js","_app/immutable/chunks/xihTtKlq.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-CoEJ_nRx.js')),
			__memo(() => import('./chunks/1-FXUPlVK1.js')),
			__memo(() => import('./chunks/2-Dkdi-ml7.js')),
			__memo(() => import('./chunks/3-DbS4Osf5.js')),
			__memo(() => import('./chunks/4-D_oJx70O.js')),
			__memo(() => import('./chunks/5-CJA3lpJI.js')),
			__memo(() => import('./chunks/6-CZOEoK-f.js')),
			__memo(() => import('./chunks/7-Dp5KT1Wr.js'))
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
