module.exports = {
  "/requests": {
    post: {
      tags: ["Requests"],
      summary: "Create contact request",
      description: "Creates a contact request from the current store to a supplier.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["supplierId", "subject", "message"],
              properties: {
                supplierId: { type: "string", example: "sup_123" },
                productId: { type: "string", nullable: true, example: "prd_123" },
                subject: { type: "string", example: "Wholesale inquiry" },
                message: { type: "string", example: "Can you share your current lead times?" },
                requestedQuantity: { type: "string", nullable: true, example: "50 kg" },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Contact request created",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "Contact request created successfully" },
                  request: { $ref: "#/components/schemas/ContactRequest" },
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
  "/requests/sent": {
    get: {
      tags: ["Requests"],
      summary: "List sent requests",
      description: "Returns contact requests sent by the current store.",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Sent contact requests",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  requests: {
                    type: "array",
                    items: { $ref: "#/components/schemas/ContactRequest" },
                  },
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
  "/requests/received": {
    get: {
      tags: ["Requests"],
      summary: "List received requests",
      description: "Returns contact requests received by the current supplier.",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Received contact requests",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  requests: {
                    type: "array",
                    items: { $ref: "#/components/schemas/ContactRequest" },
                  },
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
  "/requests/{id}/status": {
    patch: {
      tags: ["Requests"],
      summary: "Update request status",
      description: "Updates the status of a contact request received by the current supplier.",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/IdPath" }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["status"],
              properties: {
                status: {
                  type: "string",
                  enum: ["PENDING", "READ", "ANSWERED", "CLOSED"],
                  example: "READ",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Contact request status updated",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "Contact request status updated successfully" },
                  request: { $ref: "#/components/schemas/ContactRequest" },
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
  "/requests/{id}": {
    get: {
      tags: ["Requests"],
      summary: "Get request by id",
      description: "Returns one contact request visible to the current store or supplier.",
      security: [{ bearerAuth: [] }],
      parameters: [{ $ref: "#/components/parameters/IdPath" }],
      responses: {
        200: {
          description: "Contact request",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  request: { $ref: "#/components/schemas/ContactRequest" },
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
