import { aI as writable } from './index-server-DF5QiTDW.js';
import { hc } from 'hono/client';

//#region src/lib/stores/workspace.ts
var currentWorkspaceId = writable(null);
var api = hc("", { fetch: (req, options) => fetch(req, {
	...options,
	credentials: "include"
}) });
//#endregion
//#region src/lib/queries.ts
var STALE = {
	STATIC: 6e4,
	CONTENT: 3e4,
	LIVE: 1e4,
	VOLATILE: 0
};
var workspacesKey = () => ["workspaces"];
var pagesKey = (workspaceId) => ["pages", workspaceId];
var pageKey = (pageId) => ["page", pageId];
var versionsKey = (pageId) => ["versions", pageId];
var commentsKey = (pageId) => ["comments", pageId];
var membersKey = (workspaceId) => ["members", workspaceId];
function workspacesQueryOptions() {
	return {
		queryKey: workspacesKey(),
		queryFn: async () => {
			const res = await api.api.workspaces.$get();
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			return res.json();
		},
		staleTime: STALE.STATIC
	};
}
function pagesQueryOptions(workspaceId) {
	return {
		queryKey: pagesKey(workspaceId),
		queryFn: async () => {
			const res = await api.api.pages.$get({ query: { workspaceId } });
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			return res.json();
		},
		enabled: workspaceId.length > 0,
		staleTime: STALE.CONTENT
	};
}
function pageQueryOptions(pageId) {
	return {
		queryKey: pageKey(pageId),
		queryFn: async () => {
			const res = await api.api.pages[":id"].$get({ param: { id: pageId } });
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			return res.json();
		},
		enabled: pageId.length > 0,
		staleTime: STALE.CONTENT
	};
}
function versionsQueryOptions(pageId, enabled) {
	return {
		queryKey: versionsKey(pageId),
		queryFn: async () => {
			const res = await api.api.pages[":id"].versions.$get({ param: { id: pageId } });
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			return res.json();
		},
		enabled: enabled && pageId.length > 0,
		staleTime: STALE.VOLATILE
	};
}
function workspaceMembersQueryOptions(workspaceId) {
	return {
		queryKey: membersKey(workspaceId),
		queryFn: async () => {
			const res = await api.api.workspaces[":id"].members.$get({ param: { id: workspaceId } });
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			return res.json();
		},
		enabled: workspaceId.length > 0,
		staleTime: STALE.STATIC
	};
}
function commentsQueryOptions(pageId, enabled) {
	return {
		queryKey: commentsKey(pageId),
		queryFn: async () => {
			const res = await api.api.pages[":pageId"].comments.$get({ param: { pageId } });
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			return res.json();
		},
		enabled: enabled && pageId.length > 0,
		staleTime: STALE.LIVE
	};
}
async function createPageFn(input) {
	const res = await api.api.pages.$post({ json: input });
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	return res.json();
}
async function updatePageFn({ id, ...input }) {
	const res = await api.api.pages[":id"].$patch({
		param: { id },
		json: input
	});
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	return res.json();
}
async function deletePageFn(id) {
	const res = await api.api.pages[":id"].$delete({ param: { id } });
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
}
async function reorderPageFn({ id, parentId, order }) {
	const res = await api.api.pages[":id"].reorder.$patch({
		param: { id },
		json: {
			parentId,
			order
		}
	});
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	return res.json();
}
async function saveVersionFn(input) {
	const res = await api.api.pages[":id"].versions.$post({
		param: { id: input.pageId },
		json: {
			title: input.title,
			content: input.content
		}
	});
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	return res.json();
}
async function restoreVersionFn(input) {
	const res = await api.api.pages[":id"].versions[":versionId"].restore.$post({ param: {
		id: input.pageId,
		versionId: input.versionId
	} });
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	return res.json();
}
async function createCommentFn(input) {
	const res = await api.api.pages[":pageId"].comments.$post({
		param: { pageId: input.pageId },
		json: {
			content: input.content,
			quote: input.quote
		}
	});
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	return res.json();
}
async function createReplyFn(input) {
	const res = await api.api.pages[":pageId"].comments[":commentId"].replies.$post({
		param: {
			pageId: input.pageId,
			commentId: input.commentId
		},
		json: { content: input.content }
	});
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	return res.json();
}
async function updateCommentFn(input) {
	const { id, ...body } = input;
	const res = await api.api.comments[":id"].$patch({
		param: { id },
		json: body
	});
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
}
async function deleteCommentFn(id) {
	const res = await api.api.comments[":id"].$delete({ param: { id } });
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export { commentsQueryOptions as a, createCommentFn as b, commentsKey as c, createPageFn as d, createReplyFn as e, currentWorkspaceId as f, deleteCommentFn as g, deletePageFn as h, pageQueryOptions as i, pagesKey as j, pagesQueryOptions as k, restoreVersionFn as l, updatePageFn as m, versionsQueryOptions as n, workspacesQueryOptions as o, pageKey as p, reorderPageFn as r, saveVersionFn as s, updateCommentFn as u, versionsKey as v, workspaceMembersQueryOptions as w };
//# sourceMappingURL=queries-Cr0kTyeY.js.map
