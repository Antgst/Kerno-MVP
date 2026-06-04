const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../../lib/prisma");

const VALID_ROLES = ["SUPPLIER", "STORE"];
const PASSWORD_SALT_ROUNDS = 10;
const TOKEN_EXPIRES_IN = "7d";

function getStatus() {
  return "Auth module is ready";
}

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function normalizeRole(role) {
  return role.trim().toUpperCase();
}

function validateRequiredString(value, fieldName) {
  if (!value || typeof value !== "string" || value.trim() === "") {
    throw createError(`${fieldName} is required`, 400);
  }
}

function validatePassword(password) {
  validateRequiredString(password, "Password");

  if (password.length < 8) {
    throw createError("Password must contain at least 8 characters", 400);
  }
}

function validateRole(role) {
  validateRequiredString(role, "Role");

  const normalizedRole = normalizeRole(role);

  if (!VALID_ROLES.includes(normalizedRole)) {
    throw createError("Role must be SUPPLIER or STORE", 400);
  }

  return normalizedRole;
}

function getSafeUser(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function generateToken(user) {
  if (!process.env.JWT_SECRET) {
    throw createError("JWT_SECRET is not configured", 500);
  }

  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: TOKEN_EXPIRES_IN,
    },
  );
}

async function registerUser(payload) {
  const { email, password, role, firstName, lastName } = payload;

  validateRequiredString(email, "Email");
  validatePassword(password);

  const normalizedEmail = normalizeEmail(email);
  const normalizedRole = validateRole(role);

  const existingUser = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (existingUser) {
    throw createError("Email is already registered", 409);
  }

  const passwordHash = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      passwordHash,
      role: normalizedRole,
      firstName: firstName?.trim() || null,
      lastName: lastName?.trim() || null,
    },
  });

  return {
    user: getSafeUser(user),
    token: generateToken(user),
  };
}

async function loginUser(payload) {
  const { email, password } = payload;

  validateRequiredString(email, "Email");
  validateRequiredString(password, "Password");

  const normalizedEmail = normalizeEmail(email);

  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (!user) {
    throw createError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw createError("Invalid email or password", 401);
  }

  return {
    user: getSafeUser(user),
    token: generateToken(user),
  };
}

module.exports = {
  getStatus,
  registerUser,
  loginUser,
};
