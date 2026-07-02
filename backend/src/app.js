const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./config/swagger");

const apiRoutes = require("./routes");
const notFoundMiddleware = require("./middlewares/notFound.middleware");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

const isProduction = process.env.NODE_ENV === "production";

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (!isProduction || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));

const apiDocsEnabled =
  !isProduction || process.env.ENABLE_API_DOCS === "true";

if (apiDocsEnabled) {
  app.get("/api/openapi.json", (req, res) => {
    res.json(swaggerDocument);
  });

  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.use("/api", apiRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
