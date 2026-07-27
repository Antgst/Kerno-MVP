const supplierProfileBody = {
  type: "object",
  properties: {
    companyName: { type: "string", example: "Kerno Roasters" },
    description: { type: "string", nullable: true, example: "Specialty coffee supplier" },
    location: { type: "string", nullable: true, example: "Lyon" },
    businessType: { type: "string", nullable: true, example: "Manufacturer" },
    contactEmail: { type: "string", nullable: true, example: "sales@example.com" },
    phone: { type: "string", nullable: true, example: "+33412345678" },
    website: { type: "string", nullable: true, example: "https://example.com" },
  },
};

module.exports = {
  "/suppliers": {
    get: {
      tags: ["Suppliers"],
      summary: "List supplier profiles",
      description: "Returns all supplier profiles ordered by creation date.",
      responses: {
        200: {
          description: "Supplier profile list",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  suppliers: {
                    type: "array",
                    items: { $ref: "#/components/schemas/SupplierProfile" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/suppliers/profile/me": {
    get: {
      tags: ["Suppliers"],
      summary: "Get current supplier profile",
      description: "Returns the authenticated supplier user's profile.",
      security: [{ cookieAuth: [] }],
      responses: {
        200: {
          description: "Current supplier profile",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  supplier: { $ref: "#/components/schemas/SupplierProfile" },
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
      tags: ["Suppliers"],
      summary: "Update current supplier profile",
      description: "Updates the authenticated supplier user's profile.",
      security: [{ cookieAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: supplierProfileBody,
          },
        },
      },
      responses: {
        200: {
          description: "Supplier profile updated",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "Supplier profile updated successfully" },
                  supplier: { $ref: "#/components/schemas/SupplierProfile" },
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
  "/suppliers/profile": {
    post: {
      tags: ["Suppliers"],
      summary: "Create supplier profile",
      description: "Creates the current supplier user's profile.",
      security: [{ cookieAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              ...supplierProfileBody,
              required: ["companyName"],
            },
          },
        },
      },
      responses: {
        201: {
          description: "Supplier profile created",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "Supplier profile created successfully" },
                  supplier: { $ref: "#/components/schemas/SupplierProfile" },
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
  "/suppliers/{id}": {
    get: {
      tags: ["Suppliers"],
      summary: "Get supplier profile by id",
      description: "Returns one supplier profile by id.",
      parameters: [{ $ref: "#/components/parameters/IdPath" }],
      responses: {
        200: {
          description: "Supplier profile",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  supplier: { $ref: "#/components/schemas/SupplierProfile" },
                },
              },
            },
          },
        },
        404: { $ref: "#/components/responses/NotFound" },
      },
    },
  },
};
