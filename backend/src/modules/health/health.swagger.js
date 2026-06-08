module.exports = {
  "/health": {
    get: {
      tags: ["Health"],
      summary: "Check API health",
      description: "Returns a confirmation that the Kerno API is running.",
      responses: {
        200: {
          description: "API is running",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/HealthResponse",
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
};
