const healthSwagger = require("../modules/health/health.swagger");
const authSwagger = require("../modules/auth/auth.swagger");
const usersSwagger = require("../modules/users/users.swagger");
const categoriesSwagger = require("../modules/categories/categories.swagger");
const productsSwagger = require("../modules/products/products.swagger");
const storesSwagger = require("../modules/stores/stores.swagger");
const suppliersSwagger = require("../modules/suppliers/suppliers.swagger");
const requestsSwagger = require("../modules/requests/requests.swagger");

const timestamp = {
  type: "string",
  format: "date-time",
  example: "2026-06-08T12:00:00.000Z",
};

const nullableString = {
  type: "string",
  nullable: true,
};

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Kerno API",
    version: "1.0.0",
    description: "Kerno API documentation",
  },
  servers: [
    {
      url: "/api",
      description: "API base path",
    },
  ],
  tags: [
    { name: "Health", description: "API health status check" },
    { name: "Auth", description: "Authentication and session endpoints" },
    { name: "Users", description: "User profile endpoints" },
    { name: "Categories", description: "Product category endpoints" },
    { name: "Products", description: "Supplier product endpoints" },
    { name: "Stores", description: "Store profile endpoints" },
    { name: "Suppliers", description: "Supplier profile endpoints" },
    { name: "Requests", description: "Store to supplier contact requests" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    parameters: {
      IdPath: {
        name: "id",
        in: "path",
        required: true,
        description: "Resource identifier",
        schema: {
          type: "string",
        },
        example: "resource_123",
      },
    },
    responses: {
      BadRequest: {
        description: "Invalid request payload",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            example: { success: false, message: "Name is required" },
          },
        },
      },
      Unauthorized: {
        description: "Authentication is missing or invalid",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            example: { success: false, message: "Authentication required" },
          },
        },
      },
      Forbidden: {
        description: "Authenticated user does not have the required role",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            example: { success: false, message: "Forbidden: insufficient role" },
          },
        },
      },
      NotFound: {
        description: "Resource was not found",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            example: { success: false, message: "Resource not found" },
          },
        },
      },
      Conflict: {
        description: "Resource already exists",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            example: { success: false, message: "Resource already exists" },
          },
        },
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        required: ["success", "message"],
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Route not found" },
        },
      },
      HealthResponse: {
        type: "object",
        required: ["success", "message"],
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "KERNO API is running" },
        },
      },
      AuthResponse: {
        type: "object",
        required: ["success", "message", "user", "token"],
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "User logged in successfully" },
          user: { $ref: "#/components/schemas/User" },
          token: { type: "string", example: "jwt.token.value" },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string", example: "usr_123" },
          email: { type: "string", format: "email", example: "user@example.com" },
          role: { type: "string", enum: ["SUPPLIER", "STORE"], example: "SUPPLIER" },
          firstName: { ...nullableString, example: "Ada" },
          lastName: { ...nullableString, example: "Lovelace" },
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      },
      Category: {
        type: "object",
        properties: {
          id: { type: "string", example: "cat_123" },
          name: { type: "string", example: "Coffee" },
          description: { ...nullableString, example: "Coffee products" },
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      },
      Product: {
        type: "object",
        properties: {
          id: { type: "string", example: "prd_123" },
          supplierId: { type: "string", example: "sup_123" },
          categoryId: { ...nullableString, example: "cat_123" },
          name: { type: "string", example: "Single-origin beans" },
          description: { ...nullableString, example: "Washed arabica beans" },
          priceCents: { type: "integer", nullable: true, example: 1200 },
          priceUnit: {
            type: "string",
            nullable: true,
            enum: ["UNIT", "KG", "LOT", "COLIS", "PALETTE", "OTHER"],
            example: "KG",
          },
          minimumOrderQuantity: { type: "integer", nullable: true, example: 10 },
          minimumOrderUnit: {
            type: "string",
            nullable: true,
            enum: ["UNIT", "KG", "LOT", "COLIS", "PALETTE", "OTHER"],
            example: "KG",
          },
          origin: { ...nullableString, example: "Colombia" },
          imageUrl: { ...nullableString, example: "https://example.com/product.jpg" },
          isActive: { type: "boolean", example: true },
          createdAt: timestamp,
          updatedAt: timestamp,
          supplier: {
            type: "object",
            properties: {
              id: { type: "string", example: "sup_123" },
              companyName: { type: "string", example: "Kerno Roasters" },
              location: { ...nullableString, example: "Lyon" },
              businessType: { ...nullableString, example: "Manufacturer" },
            },
          },
          category: {
            nullable: true,
            allOf: [{ $ref: "#/components/schemas/Category" }],
          },
        },
      },
      SupplierProfile: {
        type: "object",
        properties: {
          id: { type: "string", example: "sup_123" },
          userId: { type: "string", example: "usr_123" },
          companyName: { type: "string", example: "Kerno Roasters" },
          description: { ...nullableString, example: "Specialty coffee supplier" },
          location: { ...nullableString, example: "Lyon" },
          businessType: { ...nullableString, example: "Manufacturer" },
          contactEmail: { ...nullableString, example: "sales@example.com" },
          phone: { ...nullableString, example: "+33412345678" },
          website: { ...nullableString, example: "https://example.com" },
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      },
      StoreProfile: {
        type: "object",
        properties: {
          id: { type: "string", example: "sto_123" },
          userId: { type: "string", example: "usr_123" },
          storeName: { type: "string", example: "Kerno Market" },
          brandName: { ...nullableString, example: "Kerno" },
          location: { ...nullableString, example: "Paris" },
          storeType: { ...nullableString, example: "Concept store" },
          sourcingNeeds: { ...nullableString, example: "Premium coffee and tea" },
          contactEmail: { ...nullableString, example: "buyer@example.com" },
          phone: { ...nullableString, example: "+33123456789" },
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      },
      ContactRequest: {
        type: "object",
        properties: {
          id: { type: "string", example: "req_123" },
          storeId: { type: "string", example: "sto_123" },
          supplierId: { type: "string", example: "sup_123" },
          productId: { ...nullableString, example: "prd_123" },
          subject: { type: "string", example: "Wholesale inquiry" },
          message: { type: "string", example: "Can you share your current lead times?" },
          requestedQuantity: { ...nullableString, example: "50 kg" },
          status: {
            type: "string",
            enum: ["PENDING", "READ", "ANSWERED", "CLOSED"],
            example: "PENDING",
          },
          createdAt: timestamp,
          updatedAt: timestamp,
          store: {
            type: "object",
            properties: {
              id: { type: "string", example: "sto_123" },
              storeName: { type: "string", example: "Kerno Market" },
              brandName: { ...nullableString, example: "Kerno" },
              location: { ...nullableString, example: "Paris" },
            },
          },
          supplier: {
            type: "object",
            properties: {
              id: { type: "string", example: "sup_123" },
              companyName: { type: "string", example: "Kerno Roasters" },
              location: { ...nullableString, example: "Lyon" },
              businessType: { ...nullableString, example: "Manufacturer" },
            },
          },
          product: {
            type: "object",
            nullable: true,
            properties: {
              id: { type: "string", example: "prd_123" },
              name: { type: "string", example: "Single-origin beans" },
              priceCents: { type: "integer", nullable: true, example: 1200 },
              priceUnit: {
                type: "string",
                nullable: true,
                enum: ["UNIT", "KG", "LOT", "COLIS", "PALETTE", "OTHER"],
                example: "KG",
              },
              minimumOrderQuantity: { type: "integer", nullable: true, example: 10 },
              minimumOrderUnit: {
                type: "string",
                nullable: true,
                enum: ["UNIT", "KG", "LOT", "COLIS", "PALETTE", "OTHER"],
                example: "KG",
              },
            },
          },
        },
      },
    },
  },
  paths: {
    ...healthSwagger,
    ...authSwagger,
    ...usersSwagger,
    ...categoriesSwagger,
    ...productsSwagger,
    ...storesSwagger,
    ...suppliersSwagger,
    ...requestsSwagger,
  },
};

module.exports = swaggerDocument;
