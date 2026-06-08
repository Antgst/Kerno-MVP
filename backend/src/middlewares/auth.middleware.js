const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return null;
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return null;
  }

  return token;
}

async function requireAuth(req, res, next) {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      throw createError("Authentication required", 401);
    }

    if (!process.env.JWT_SECRET) {
      throw createError("JWT_SECRET is not configured", 500);
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken.userId) {
      throw createError("Invalid authentication token", 401);
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.userId,
      },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw createError("Authenticated user not found", 401);
    }

    req.user = user;

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return next(createError("Invalid or expired authentication token", 401));
    }

    next(error);
  }
}

function requireRole(...allowedRoles) {
  return function roleMiddleware(req, res, next) {
    if (!req.user) {
      return next(createError("Authentication required", 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(createError("Forbidden: insufficient role", 403));
    }

    next();
  };
}

module.exports = {
  requireAuth,
  requireRole,
};
