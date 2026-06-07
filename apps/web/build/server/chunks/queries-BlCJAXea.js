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
		staleTime: 6e4
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
		staleTime: 3e4
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
		staleTime: 3e4
	};
}
function versionsQueryOptions(pageId, enabled) {
	return {
		queryKey: versionsKey(pageId),
		queryFn: async () => {
			const res = await fetch(`/api/pages/${pageId}/versions`, { credentials: "include" });
			if (!res.ok) throw new Error("Failed to load history");
			return res.json();
		},
		enabled: enabled && pageId.length > 0,
		staleTime: 0
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
	const res = await fetch(`/api/pages/${input.pageId}/versions`, {
		method: "POST",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			title: input.title,
			content: input.content
		})
	});
	if (!res.ok) throw new Error("Server error");
	return res.json();
}
async function restoreVersionFn(input) {
	const res = await fetch(`/api/pages/${input.pageId}/versions/${input.versionId}/restore`, {
		method: "POST",
		credentials: "include"
	});
	if (!res.ok) throw new Error("Restore failed");
	return res.json();
}
function workspaceMembersQueryOptions(workspaceId) {
	return {
		queryKey: membersKey(workspaceId),
		queryFn: async () => {
			const res = await fetch(`/api/workspaces/${workspaceId}/members`, { credentials: "include" });
			if (!res.ok) throw new Error("Failed to load members");
			return res.json();
		},
		enabled: workspaceId.length > 0,
		staleTime: 6e4
	};
}
function commentsQueryOptions(pageId, enabled) {
	return {
		queryKey: commentsKey(pageId),
		queryFn: async () => {
			const res = await fetch(`/api/pages/${pageId}/comments`, { credentials: "include" });
			if (!res.ok) throw new Error("Failed to load comments");
			return res.json();
		},
		enabled: enabled && pageId.length > 0,
		staleTime: 1e4
	};
}
async function createCommentFn(input) {
	const res = await fetch(`/api/pages/${input.pageId}/comments`, {
		method: "POST",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			content: input.content,
			quote: input.quote
		})
	});
	if (!res.ok) throw new Error("Failed to create comment");
	return res.json();
}
async function createReplyFn(input) {
	const res = await fetch(`/api/pages/${input.pageId}/comments/${input.commentId}/replies`, {
		method: "POST",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ content: input.content })
	});
	if (!res.ok) throw new Error("Failed to create reply");
	return res.json();
}
async function updateCommentFn(input) {
	const { id, ...body } = input;
	if (!(await fetch(`/api/comments/${id}`, {
		method: "PATCH",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body)
	})).ok) throw new Error("Failed to update comment");
}
async function deleteCommentFn(id) {
	if (!(await fetch(`/api/comments/${id}`, {
		method: "DELETE",
		credentials: "include"
	})).ok) throw new Error("Failed to delete comment");
}

export { commentsQueryOptions as a, createCommentFn as b, commentsKey as c, createPageFn as d, createReplyFn as e, currentWorkspaceId as f, deleteCommentFn as g, deletePageFn as h, pageQueryOptions as i, pagesKey as j, pagesQueryOptions as k, restoreVersionFn as l, updatePageFn as m, versionsQueryOptions as n, workspacesQueryOptions as o, pageKey as p, reorderPageFn as r, saveVersionFn as s, updateCommentFn as u, versionsKey as v, workspaceMembersQueryOptions as w };
//# sourceMappingURL=queries-BlCJAXea.js.map
