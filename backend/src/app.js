const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./config/swagger");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "KERNO API is running",
  });
});

app.get("/api/openapi.json", (req, res) => {
  res.json(swaggerDocument);
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;