function errorMiddleware(error, req, res, next) {
  const statusCode = error.statusCode || error.status || 500;
  const isProduction = process.env.NODE_ENV === "production";
  const isJsonParseError = error.type === "entity.parse.failed";

  if (statusCode >= 500) {
    console.error("[KERNO_API_ERROR]", {
      message: error.message,
      path: req.originalUrl,
      method: req.method,
      stack: isProduction ? undefined : error.stack,
    });
  }

  const message = isJsonParseError
    ? "Invalid JSON payload"
    : isProduction && statusCode >= 500
      ? "Internal server error"
      : error.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = errorMiddleware;
