/**
 * OpenAPI 3.0 specification for the Notion Clone API.
 * Served at GET /api/openapi.json — consumed by Swagger UI at GET /docs
 */

const securityScheme = {
  cookieAuth: {
    type: "apiKey",
    in: "cookie",
    name: "notion-clone.session_token",
  },
};

const security = [{ cookieAuth: [] }];

// ── Reusable schemas ──────────────────────────────────────────────────────────

const WorkspaceSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    description: { type: "string", nullable: true },
    slug: { type: "string" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
  required: ["id", "name", "slug", "createdAt", "updatedAt"],
};

const PageSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    title: { type: "string" },
    icon: { type: "string", nullable: true },
    coverImage: { type: "string", nullable: true },
    content: { type: "string", nullable: true },
    workspaceId: { type: "string" },
    parentId: { type: "string", nullable: true },
    createdBy: { type: "string" },
    order: { type: "number" },
    isArchived: { type: "boolean" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
  required: [
    "id", "title", "workspaceId", "createdBy",
    "order", "isArchived", "createdAt", "updatedAt",
  ],
};

const PageVersionSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    pageId: { type: "string" },
    title: { type: "string" },
    content: { type: "string" },
    icon: { type: "string", nullable: true },
    coverImage: { type: "string", nullable: true },
    savedBy: { type: "string" },
    createdAt: { type: "string", format: "date-time" },
    savedByUser: {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        email: { type: "string" },
      },
    },
  },
  required: ["id", "pageId", "title", "content", "savedBy", "createdAt"],
};

const WorkspaceMemberSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    workspaceId: { type: "string" },
    userId: { type: "string" },
    role: { type: "string", enum: ["owner", "member"] },
    createdAt: { type: "string", format: "date-time" },
    user: {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        email: { type: "string" },
        image: { type: "string", nullable: true },
      },
    },
  },
  required: ["id", "workspaceId", "userId", "role", "createdAt"],
};

const ErrorSchema = {
  type: "object",
  properties: { error: { type: "string" } },
  required: ["error"],
};

const paginationParams = [
  { name: "limit", in: "query", schema: { type: "integer", default: 50 } },
  { name: "offset", in: "query", schema: { type: "integer", default: 0 } },
];

// ── Spec ─────────────────────────────────────────────────────────────────────

export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Notion Clone API",
    version: "1.0.0",
    description:
      "REST API for the Notion Clone — workspaces, pages, members, uploads, and Liveblocks auth. " +
      "All `/api/*` endpoints (except `/api/auth/*`) require an active session cookie from Better-Auth.",
  },
  servers: [
    { url: "/", description: "Current environment" },
  ],
  components: {
    securitySchemes: securityScheme,
    schemas: {
      Workspace: WorkspaceSchema,
      Page: PageSchema,
      PageVersion: PageVersionSchema,
      WorkspaceMember: WorkspaceMemberSchema,
      Error: ErrorSchema,
    },
  },
  paths: {
    // ── Health ──────────────────────────────────────────────────────────────
    "/health": {
      get: {
        tags: ["System"],
        summary: "Health check",
        responses: {
          "200": {
            description: "API is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "ok" },
                    ts: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
        },
      },
    },

    // ── Workspaces ──────────────────────────────────────────────────────────
    "/api/workspaces": {
      get: {
        tags: ["Workspaces"],
        summary: "List workspaces for the authenticated user",
        security,
        parameters: paginationParams,
        responses: {
          "200": {
            description: "Array of workspaces the user belongs to",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Workspace" } },
              },
            },
          },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
      post: {
        tags: ["Workspaces"],
        summary: "Create a workspace",
        security,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name"],
                properties: {
                  name: { type: "string", minLength: 1, maxLength: 100 },
                  description: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Workspace created",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Workspace" } } },
          },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },

    "/api/workspaces/{id}": {
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      get: {
        tags: ["Workspaces"],
        summary: "Get a workspace by ID",
        security,
        responses: {
          "200": { description: "Workspace", content: { "application/json": { schema: { $ref: "#/components/schemas/Workspace" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
      patch: {
        tags: ["Workspaces"],
        summary: "Update a workspace (owner only)",
        security,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", minLength: 1, maxLength: 100 },
                  description: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Updated workspace", content: { "application/json": { schema: { $ref: "#/components/schemas/Workspace" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "403": { description: "Forbidden — not owner", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
      delete: {
        tags: ["Workspaces"],
        summary: "Delete a workspace (owner only)",
        security,
        responses: {
          "200": { description: "Deleted", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" } } } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "403": { description: "Forbidden — not owner", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },

    // ── Workspace Members ────────────────────────────────────────────────────
    "/api/workspaces/{id}/members": {
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "Workspace ID" }],
      get: {
        tags: ["Members"],
        summary: "List workspace members",
        security,
        responses: {
          "200": {
            description: "Array of members with user info",
            content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/WorkspaceMember" } } } },
          },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "403": { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
      post: {
        tags: ["Members"],
        summary: "Add a member to a workspace (owner only)",
        security,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["userId"],
                properties: {
                  userId: { type: "string" },
                  role: { type: "string", enum: ["owner", "member"], default: "member" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Member added", content: { "application/json": { schema: { $ref: "#/components/schemas/WorkspaceMember" } } } },
          "400": { description: "Already a member", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "403": { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "404": { description: "User not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },

    "/api/workspaces/{id}/members/{memberId}": {
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" }, description: "Workspace ID" },
        { name: "memberId", in: "path", required: true, schema: { type: "string" }, description: "Member record ID" },
      ],
      patch: {
        tags: ["Members"],
        summary: "Update a member's role (owner only)",
        security,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["role"],
                properties: { role: { type: "string", enum: ["owner", "member"] } },
              },
            },
          },
        },
        responses: {
          "200": { description: "Updated member", content: { "application/json": { schema: { $ref: "#/components/schemas/WorkspaceMember" } } } },
          "400": { description: "Bad request", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "403": { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
      delete: {
        tags: ["Members"],
        summary: "Remove a member from a workspace (owner only)",
        security,
        responses: {
          "200": { description: "Removed", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" } } } } } },
          "400": { description: "Bad request", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "403": { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },

    // ── Pages ────────────────────────────────────────────────────────────────
    "/api/pages": {
      get: {
        tags: ["Pages"],
        summary: "List pages in a workspace",
        security,
        parameters: [
          { name: "workspaceId", in: "query", required: true, schema: { type: "string" } },
          ...paginationParams,
        ],
        responses: {
          "200": {
            description: "Non-archived pages ordered by position",
            content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Page" } } } },
          },
          "400": { description: "workspaceId required", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "403": { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
      post: {
        tags: ["Pages"],
        summary: "Create a page",
        security,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "workspaceId"],
                properties: {
                  title: { type: "string" },
                  workspaceId: { type: "string" },
                  parentId: { type: "string" },
                  icon: { type: "string" },
                  coverImage: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Page created", content: { "application/json": { schema: { $ref: "#/components/schemas/Page" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "403": { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },

    "/api/pages/{id}": {
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      get: {
        tags: ["Pages"],
        summary: "Get a page (with children and creator)",
        security,
        responses: {
          "200": { description: "Page", content: { "application/json": { schema: { $ref: "#/components/schemas/Page" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "403": { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
      patch: {
        tags: ["Pages"],
        summary: "Update page metadata",
        security,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  icon: { type: "string" },
                  coverImage: { type: "string" },
                  parentId: { type: "string", nullable: true },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Updated page", content: { "application/json": { schema: { $ref: "#/components/schemas/Page" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "403": { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
      delete: {
        tags: ["Pages"],
        summary: "Archive a page (soft delete)",
        security,
        responses: {
          "200": { description: "Archived", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" } } } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "403": { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },

    "/api/pages/{id}/reorder": {
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      patch: {
        tags: ["Pages"],
        summary: "Reorder / reparent a page",
        security,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["order"],
                properties: {
                  parentId: { type: "string", nullable: true },
                  order: { type: "number" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Updated page", content: { "application/json": { schema: { $ref: "#/components/schemas/Page" } } } },
          "400": { description: "Bad request", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "403": { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },

    // ── Page Versions ────────────────────────────────────────────────────────
    "/api/pages/{id}/versions": {
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "Page ID" }],
      get: {
        tags: ["Versions"],
        summary: "List saved versions of a page",
        security,
        parameters: [
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
          { name: "offset", in: "query", schema: { type: "integer", default: 0 } },
        ],
        responses: {
          "200": {
            description: "Versions newest-first",
            content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/PageVersion" } } } },
          },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "403": { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
      post: {
        tags: ["Versions"],
        summary: "Save a new version snapshot",
        security,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "content"],
                properties: {
                  title: { type: "string" },
                  content: { type: "string", description: "Tiptap JSON string" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Version saved", content: { "application/json": { schema: { $ref: "#/components/schemas/PageVersion" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "403": { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },

    "/api/pages/{id}/versions/{versionId}/restore": {
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" }, description: "Page ID" },
        { name: "versionId", in: "path", required: true, schema: { type: "string" }, description: "Version ID" },
      ],
      post: {
        tags: ["Versions"],
        summary: "Restore a page to a saved version",
        security,
        responses: {
          "200": { description: "Restored page", content: { "application/json": { schema: { $ref: "#/components/schemas/Page" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "403": { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "404": { description: "Page or version not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },

    // ── Upload ───────────────────────────────────────────────────────────────
    "/api/upload/signature": {
      post: {
        tags: ["Upload"],
        summary: "Get a Cloudinary upload signature",
        description: "Returns a signed payload for direct browser-to-Cloudinary upload.",
        security,
        responses: {
          "200": {
            description: "Signature payload",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    signature: { type: "string" },
                    timestamp: { type: "number" },
                    folder: { type: "string" },
                    apiKey: { type: "string" },
                    cloudName: { type: "string" },
                  },
                },
              },
            },
          },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "503": { description: "Cloudinary not configured", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },

    // ── Liveblocks ───────────────────────────────────────────────────────────
    "/api/liveblocks-auth": {
      post: {
        tags: ["Liveblocks"],
        summary: "Authenticate a user for a Liveblocks room",
        description: "Verifies workspace membership and returns a Liveblocks session token for the given room (page ID).",
        security,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["room"],
                properties: { room: { type: "string", description: "Page ID used as the Liveblocks room ID" } },
              },
            },
          },
        },
        responses: {
          "200": { description: "Liveblocks session token (raw response from Liveblocks SDK)" },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "403": { description: "Not a workspace member", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "404": { description: "Page not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
  },
};
