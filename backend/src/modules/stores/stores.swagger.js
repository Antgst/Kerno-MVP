const storeProfileBody = {
  type: "object",
  properties: {
    storeName: { type: "string", example: "Kerno Market" },
    brandName: { type: "string", nullable: true, example: "Kerno" },
    location: { type: "string", nullable: true, example: "Paris" },
    storeType: { type: "string", nullable: true, example: "Concept store" },
    sourcingNeeds: { type: "string", nullable: true, example: "Premium coffee and tea" },
    contactEmail: { type: "string", nullable: true, example: "buyer@example.com" },
    phone: { type: "string", nullable: true, example: "+33123456789" },
  },
};

module.exports = {
  "/stores": {
    get: {
      tags: ["Stores"],
      summary: "Get stores module status",
      description: "Returns the readiness status of the stores module.",
      responses: {
        200: {
          description: "Stores module status",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  module: { type: "string", example: "stores" },
                  message: { type: "string", example: "Stores module is ready" },
                },
              },
            },
          },
        },
      },
    },
  },
  "/stores/profile": {
    post: {
      tags: ["Stores"],
      summary: "Create store profile",
      description: "Creates the current store user's profile.",
      security: [{ cookieAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              ...storeProfileBody,
              required: ["storeName"],
            },
          },
        },
      },
      responses: {
        201: {
          description: "Store profile created",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "Store profile created successfully" },
                  store: { $ref: "#/components/schemas/StoreProfile" },
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
  "/stores/profile/me": {
    get: {
      tags: ["Stores"],
      summary: "Get current store profile",
      description: "Returns the authenticated store user's profile.",
      security: [{ cookieAuth: [] }],
      responses: {
        200: {
          description: "Current store profile",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  store: { $ref: "#/components/schemas/StoreProfile" },
                },
              },
            },
          },
        },
        401: { $ref: "#/components/responses/Unauthorized" },
        403: { $ref: "#/components/responses/Forbidden" },
        404: { $ref: "#/components/responses/NotFound" },
      },
    },
    put: {
      tags: ["Stores"],
      summary: "Update current store profile",
      description: "Updates the authenticated store user's profile.",
      security: [{ cookieAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: storeProfileBody,
          },
        },
      },
      responses: {
        200: {
          description: "Store profile updated",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "Store profile updated successfully" },
                  store: { $ref: "#/components/schemas/StoreProfile" },
                },
              },
            },
          },
        },
        400: { $ref: "#/components/responses/BadRequest" },
        401: { $ref: "#/components/responses/Unauthorized" },
        403: { $ref: "#/components/responses/Forbidden" },
        404: { $ref: "#/components/responses/NotFound" },
      },
    },
  },
};
