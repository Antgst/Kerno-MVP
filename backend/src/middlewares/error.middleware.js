function errorMiddleware(error, req, res, next) {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error",
  });
}

module.exports = errorMiddleware;
