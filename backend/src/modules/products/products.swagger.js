const productBody = {
  type: "object",
  properties: {
    categoryId: { type: "string", nullable: true, example: "cat_123" },
    name: { type: "string", example: "Single-origin beans" },
    description: { type: "string", nullable: true, example: "Washed arabica beans" },
    priceCents: { type: "integer", nullable: true, example: 1200 },
    priceUnit: { 
      type: "string",
      nullable: true, 
      enum: ["UNIT", "KG", "LOT", "COLIS", "PALETTE", "OTHER"], 
      example: "KG",
    },
    minimumOrder: { type: "string", nullable: true, example: "10 kg" },
    origin: { type: "string", nullable: true, example: "Colombia" },
    imageUrl: { type: "string", nullable: true, example: "https://example.com/product.jpg" },
  },
};

module.exports = {
  "/products": {
    get: {
      tags: ["Products"],
      summary: "List active products",
      description: "Returns active products with supplier and category details.",
      responses: {
        200: {
          description: "Product list",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  products: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Product" },
                  },
                },
              },
            },
          },
        },
      },
    },
    post: {
      tags: ["Products"],
      summary: "Create a product",
      description: "Creates a product for the current supplier profile.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              ...productBody,
              required: ["name"],
            },
          },
        },
      },
      responses: {
        201: {
          description: "Product created",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "Product created successfully" },
                  product: { $ref: "#/components/schemas/Product" },
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
  "/products/{id}": {
    get: {
      tags: ["Products"],
      summary: "Get product by id",
      description: "Returns one active product by id.",
      parameters: [{ $ref: "#/components/parameters/IdPath" }],
      responses: {
        200: {
          description: "Product details",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  product: { $ref: "#/components/schemas/Product" },
                },
              },
            },
          },
        },
        404: { $ref: "#/components/responses/NotFound" },
      },
    },
    put: {
      tags: ["Products"],
      summary: "Update product",
      description: "Updates a product owned by the current supplier.",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/IdPath" }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: productBody,
          },
        },
      },
      responses: {
        200: {
          description: "Product updated",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "Product updated successfully" },
                  product: { $ref: "#/components/schemas/Product" },
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
    delete: {
      tags: ["Products"],
      summary: "Deactivate product",
      description: "Marks a product owned by the current supplier as inactive.",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/IdPath" }],
      responses: {
        200: {
          description: "Product deactivated",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "Product deactivated successfully" },
                  product: { $ref: "#/components/schemas/Product" },
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
  },
};
