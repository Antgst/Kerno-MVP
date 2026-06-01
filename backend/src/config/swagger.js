const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Kerno API",
    version: "1.0.0",
    description: "Documentation de l'API Kerno",
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
      description: "Vérification de l'état de l'API",
    },
  ],
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Vérifie que l'API fonctionne",
        description: "Retourne un message indiquant que l'API Kerno est en ligne.",
        responses: {
          200: {
            description: "API opérationnelle",
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
                      example: "Kerno API is running",
                    },
                  },
                },
                example: {
                  success: true,
                  message: "Kerno API is running",
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