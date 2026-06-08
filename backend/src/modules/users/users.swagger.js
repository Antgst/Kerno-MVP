module.exports = {
  "/users": {
    get: {
      tags: ["Users"],
      summary: "Get users module status",
      description: "Returns the readiness status of the users module.",
      responses: {
        200: {
          description: "Users module status",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  module: { type: "string", example: "users" },
                  message: { type: "string", example: "Users module is ready" },
                },
              },
            },
          },
        },
      },
    },
  },
  "/users/me": {
    get: {
      tags: ["Users"],
      summary: "Get current user",
      description: "Returns the authenticated user's public profile.",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Authenticated user",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  user: { $ref: "#/components/schemas/User" },
                },
              },
              example: {
                success: true,
                user: {
                  id: "usr_123",
                  email: "store@example.com",
                  role: "STORE",
                  firstName: "Grace",
                  lastName: "Hopper",
                  createdAt: "2026-06-08T12:00:00.000Z",
                  updatedAt: "2026-06-08T12:00:00.000Z",
                },
              },
            },
          },
        },
        401: { $ref: "#/components/responses/Unauthorized" },
      },
    },
  },
};
