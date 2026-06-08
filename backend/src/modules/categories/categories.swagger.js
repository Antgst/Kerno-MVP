module.exports = {
  "/categories": {
    get: {
      tags: ["Categories"],
      summary: "List categories",
      description: "Returns all categories ordered by name.",
      responses: {
        200: {
          description: "Category list",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  categories: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Category" },
                  },
                },
              },
              example: {
                success: true,
                categories: [
                  {
                    id: "cat_123",
                    name: "Coffee",
                    description: "Coffee products",
                    createdAt: "2026-06-08T12:00:00.000Z",
                    updatedAt: "2026-06-08T12:00:00.000Z",
                  },
                ],
              },
            },
          },
        },
      },
    },
    post: {
      tags: ["Categories"],
      summary: "Create a category",
      description: "Creates a category. Requires an authenticated supplier.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name"],
              properties: {
                name: { type: "string", example: "Coffee" },
                description: { type: "string", nullable: true, example: "Coffee products" },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Category created",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "Category created successfully" },
                  category: { $ref: "#/components/schemas/Category" },
                },
              },
            },
          },
        },
        400: { $ref: "#/components/responses/BadRequest" },
        401: { $ref: "#/components/responses/Unauthorized" },
        403: { $ref: "#/components/responses/Forbidden" },
        409: { $ref: "#/components/responses/Conflict" },
      },
    },
  },
};
