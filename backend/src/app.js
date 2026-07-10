const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const swaggerDocument = require("./config/swagger");

const apiRoutes = require("./routes");
const notFoundMiddleware = require("./middlewares/notFound.middleware");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

const isProduction = process.env.NODE_ENV === "production";

const defaultDevelopmentOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
];

const configuredOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins =
  configuredOrigins.length > 0
    ? configuredOrigins
    : isProduction
      ? []
      : defaultDevelopmentOrigins;

const corsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
};

app.use(cors(corsOptions));
app.use(cookieParser());
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

if (isProduction) {
  const frontendBuildPath = path.resolve(__dirname, "../../frontend-dist");

  app.use(express.static(frontendBuildPath));
  app.get(/^(?!\/api(?:\/|$)).*/, (req, res) => {
    res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
}

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
