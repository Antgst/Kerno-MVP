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
    {
      name: "Health",
      description: "API health status check",
    },
  ],
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Checks that the API is running",
        description:
          "Returns a message confirming that the Kerno API is online.",
        responses: {
          200: {
            description: "API is running",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["success", "message"],
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    message: {
                      type: "string",
                      example: "KERNO API is running",
                    },
                  },
                },
                example: {
                  success: true,
                  message: "KERNO API is running",
                },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = swaggerDocument;
