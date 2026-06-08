const prisma = require("../../lib/prisma");

function getStatus() {
  return "Categories module is ready";
}

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function validateRequiredString(value, fieldName) {
  if (!value || typeof value !== "string" || value.trim() === "") {
    throw createError(`${fieldName} is required`, 400);
  }
}

function getSafeCategory(category) {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

async function getAllCategories() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return categories.map(getSafeCategory);
}

async function createCategory(payload) {
  const { name, description } = payload;

  validateRequiredString(name, "Category name");

  const normalizedName = name.trim();

  const existingCategory = await prisma.category.findUnique({
    where: {
      name: normalizedName,
    },
  });

  if (existingCategory) {
    throw createError("Category already exists", 409);
  }

  const category = await prisma.category.create({
    data: {
      name: normalizedName,
      description: description?.trim() || null,
    },
  });

  return getSafeCategory(category);
}

module.exports = {
  getStatus,
  getAllCategories,
  createCategory,
};
