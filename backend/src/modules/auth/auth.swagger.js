module.exports = {
  "/auth": {
    get: {
      tags: ["Auth"],
      summary: "Get auth module status",
      description: "Returns the readiness status of the auth module.",
      responses: {
        200: {
          description: "Auth module status",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  module: { type: "string", example: "auth" },
                  message: { type: "string", example: "Auth module is ready" },
                },
              },
              example: {
                success: true,
                module: "auth",
                message: "Auth module is ready",
              },
            },
          },
        },
      },
    },
  },
  "/auth/register": {
    post: {
      tags: ["Auth"],
      summary: "Register a user",
      description: "Creates a supplier or store user and sets an HttpOnly authentication cookie.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password", "role"],
              properties: {
                email: {
                  type: "string",
                  format: "email",
                  maxLength: 254,
                  example: "supplier@example.com",
                },
                password: {
                  type: "string",
                  minLength: 8,
                  maxLength: 128,
                  pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9\\s])\\S+$",
                  example: "Password123!",
                },
                role: { type: "string", enum: ["SUPPLIER", "STORE"], example: "SUPPLIER" },
                firstName: { type: "string", nullable: true, example: "Ada" },
                lastName: { type: "string", nullable: true, example: "Lovelace" },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "User registered",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthResponse" },
              example: {
                success: true,
                message: "User registered successfully",
                user: {
                  id: "usr_123",
                  email: "supplier@example.com",
                  role: "SUPPLIER",
                  firstName: "Ada",
                  lastName: "Lovelace",
                  createdAt: "2026-06-08T12:00:00.000Z",
                  updatedAt: "2026-06-08T12:00:00.000Z",
                },
              },
            },
          },
        },
        400: { $ref: "#/components/responses/BadRequest" },
        409: { $ref: "#/components/responses/Conflict" },
      },
    },
  },
  "/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Log in a user",
      description: "Authenticates a user and sets an HttpOnly authentication cookie.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: { type: "string", format: "email", example: "supplier@example.com" },
                password: { type: "string", example: "password123" },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "User logged in",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthResponse" },
              example: {
                success: true,
                message: "User logged in successfully",
                user: {
                  id: "usr_123",
                  email: "supplier@example.com",
                  role: "SUPPLIER",
                  firstName: "Ada",
                  lastName: "Lovelace",
                  createdAt: "2026-06-08T12:00:00.000Z",
                  updatedAt: "2026-06-08T12:00:00.000Z",
                },
              },
            },
          },
        },
        400: { $ref: "#/components/responses/BadRequest" },
        401: { $ref: "#/components/responses/Unauthorized" },
      },
    },
  },
  "/auth/logout": {
    post: {
      tags: ["Auth"],
      summary: "Log out current user",
      description: "Clears the HttpOnly authentication cookie.",
      responses: {
        200: {
          description: "User logged out",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "User logged out successfully" },
                },
              },
              example: {
                success: true,
                message: "User logged out successfully",
              },
            },
          },
        },
      },
    },
  },
};
