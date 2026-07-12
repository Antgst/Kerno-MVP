const prisma = require("../../lib/prisma");

const VALID_PRICE_UNITS = [
  "UNIT",
  "KG",
  "LITER",
  "LOT",
  "COLIS",
  "PALETTE",
  "OTHER",
];

function getStatus() {
  return "Products module is ready";
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

function getSafeProduct(product) {
  return {
    id: product.id,
    supplierId: product.supplierId,
    categoryId: product.categoryId,
    name: product.name,
    description: product.description,
    priceCents: product.priceCents,
    priceUnit: product.priceUnit,
    minimumOrderQuantity: product.minimumOrderQuantity,
    minimumOrderUnit: product.minimumOrderUnit,
    origin: product.origin,
    imageUrl: product.imageUrl,
    isActive: product.isActive,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    supplier: product.supplier
      ? {
          id: product.supplier.id,
          companyName: product.supplier.companyName,
          location: product.supplier.location,
          businessType: product.supplier.businessType,
        }
      : undefined,
    category: product.category
      ? {
          id: product.category.id,
          name: product.category.name,
          description: product.category.description,
        }
      : null,
  };
}

function normalizeOptionalPriceCents(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const numberValue = Number(value);

  if (!Number.isInteger(numberValue) || numberValue < 0) {
    throw createError("Product price must be a positive integer in cents", 400);
  }

  return numberValue;
}

function normalizeOptionalPriceUnit(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const normalized = String(value).trim().toUpperCase();

  if (!VALID_PRICE_UNITS.includes(normalized)) {
    throw createError("Product price unit is invalid", 400);
  }

  return normalized;
}

function normalizeOptionalMinimumOrderQuantity(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const numberValue = Number(value);

  if (!Number.isInteger(numberValue) || numberValue <= 0) {
    throw createError("Product minimum order quantity must be a positive integer", 400);
  }

  return numberValue;
}

function normalizeOptionalBoolean(value) {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  throw createError("Product visibility must be a boolean", 400);
}

async function getSupplierProfileForUser(userId) {
  const supplierProfile = await prisma.supplierProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!supplierProfile) {
    throw createError("Supplier profile is required before managing products", 404);
  }

  return supplierProfile;
}

async function getAllProducts() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      supplier: true,
      category: true,
    },
  });

  return products.map(getSafeProduct);
}

async function getCurrentSupplierProducts(userId) {
  const supplierProfile = await getSupplierProfileForUser(userId);

  const products = await prisma.product.findMany({
    where: {
      supplierId: supplierProfile.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      supplier: true,
      category: true,
    },
  });

  return products.map(getSafeProduct);
}

async function getCurrentSupplierProductById(userId, productId) {
  const supplierProfile = await getSupplierProfileForUser(userId);

  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      supplierId: supplierProfile.id,
    },
    include: {
      supplier: true,
      category: true,
    },
  });

  if (!product) {
    throw createError("Product not found", 404);
  }

  return getSafeProduct(product);
}

async function getProductById(id) {
  const product = await prisma.product.findFirst({
    where: {
      id,
      isActive: true,
    },
    include: {
      supplier: true,
      category: true,
    },
  });

  if (!product) {
    throw createError("Product not found", 404);
  }

  return getSafeProduct(product);
}

async function createProduct(userId, payload) {
  const supplierProfile = await getSupplierProfileForUser(userId);

  const {
    categoryId,
    name,
    description,
    priceCents,
    priceUnit,
    minimumOrderQuantity,
    minimumOrderUnit,
    origin,
    imageUrl,
  } = payload;

  validateRequiredString(name, "Product name");

  if (categoryId) {
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      throw createError("Category not found", 404);
    }
  }

  const product = await prisma.product.create({
    data: {
      supplierId: supplierProfile.id,
      categoryId: categoryId || null,
      name: name.trim(),
      description: description?.trim() || null,
      priceCents: normalizeOptionalPriceCents(priceCents),
      priceUnit: normalizeOptionalPriceUnit(priceUnit),
      minimumOrderQuantity: normalizeOptionalMinimumOrderQuantity(minimumOrderQuantity),
      minimumOrderUnit: normalizeOptionalPriceUnit(minimumOrderUnit),
      origin: origin?.trim() || null,
      imageUrl: imageUrl?.trim() || null,
    },
    include: {
      supplier: true,
      category: true,
    },
  });

  return getSafeProduct(product);
}

async function updateProduct(userId, productId, payload) {
  const supplierProfile = await getSupplierProfileForUser(userId);

  const existingProduct = await prisma.product.findFirst({
    where: {
      id: productId,
      supplierId: supplierProfile.id,
    },
  });

  if (!existingProduct) {
    throw createError("Product not found or not owned by current supplier", 404);
  }

  const {
    categoryId,
    name,
    description,
    priceCents,
    priceUnit,
    minimumOrderQuantity,
    minimumOrderUnit,
    origin,
    imageUrl,
    isActive,
  } = payload;

  if (name !== undefined) {
    validateRequiredString(name, "Product name");
  }

  if (categoryId !== undefined && categoryId !== null && categoryId !== "") {
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      throw createError("Category not found", 404);
    }
  }

  const updatedProduct = await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      categoryId:
        categoryId !== undefined ? categoryId || null : undefined,
      name:
        name !== undefined ? name.trim() : undefined,
      description:
        description !== undefined ? description?.trim() || null : undefined,
      priceCents:
        priceCents !== undefined ? normalizeOptionalPriceCents(priceCents) : undefined,
      priceUnit:
        priceUnit !== undefined ? normalizeOptionalPriceUnit(priceUnit) : undefined,
      minimumOrderQuantity:
        minimumOrderQuantity !== undefined
          ? normalizeOptionalMinimumOrderQuantity(minimumOrderQuantity)
          : undefined,
      minimumOrderUnit:
        minimumOrderUnit !== undefined
          ? normalizeOptionalPriceUnit(minimumOrderUnit)
          : undefined,
      origin:
        origin !== undefined ? origin?.trim() || null : undefined,
      imageUrl:
        imageUrl !== undefined ? imageUrl?.trim() || null : undefined,
      isActive:
        isActive !== undefined ? normalizeOptionalBoolean(isActive) : undefined,
    },
    include: {
      supplier: true,
      category: true,
    },
  });

  return getSafeProduct(updatedProduct);
}

async function deleteProduct(userId, productId) {
  const supplierProfile = await getSupplierProfileForUser(userId);

  const existingProduct = await prisma.product.findFirst({
    where: {
      id: productId,
      supplierId: supplierProfile.id,
      isActive: true,
    },
  });

  if (!existingProduct) {
    throw createError("Product not found or not owned by current supplier", 404);
  }

  const deactivatedProduct = await prisma.product.update({
    where: {
      id: existingProduct.id,
    },
    data: {
      isActive: false,
    },
    include: {
      supplier: true,
      category: true,
    },
  });

  return getSafeProduct(deactivatedProduct);
}

module.exports = {
  getStatus,
  getAllProducts,
  getCurrentSupplierProducts,
  getCurrentSupplierProductById,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
