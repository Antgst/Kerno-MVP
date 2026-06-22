const prisma = require("../../lib/prisma");

const VALID_REQUEST_STATUSES = ["PENDING", "READ", "ANSWERED", "CLOSED"];

function getStatus() {
  return "Requests module is ready";
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

function normalizeStatus(status) {
  return status.trim().toUpperCase();
}

function getSafeContactRequest(request) {
  return {
    id: request.id,
    storeId: request.storeId,
    supplierId: request.supplierId,
    productId: request.productId,
    subject: request.subject,
    message: request.message,
    requestedQuantity: request.requestedQuantity,
    status: request.status,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
    store: request.store
      ? {
          id: request.store.id,
          storeName: request.store.storeName,
          brandName: request.store.brandName,
          location: request.store.location,
        }
      : undefined,
    supplier: request.supplier
      ? {
          id: request.supplier.id,
          companyName: request.supplier.companyName,
          location: request.supplier.location,
          businessType: request.supplier.businessType,
        }
      : undefined,
    product: request.product
      ? {
          id: request.product.id,
          name: request.product.name,
          priceCents: request.product.priceCents,
          priceUnit: request.product.priceUnit,
          minimumOrder: request.product.minimumOrder,
        }
      : null,
  };
}

async function getStoreProfileForUser(userId) {
  const storeProfile = await prisma.storeProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!storeProfile) {
    throw createError("Store profile is required before sending requests", 404);
  }

  return storeProfile;
}

async function getSupplierProfileForUser(userId) {
  const supplierProfile = await prisma.supplierProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!supplierProfile) {
    throw createError("Supplier profile is required before viewing requests", 404);
  }

  return supplierProfile;
}

async function createContactRequest(userId, payload) {
  const storeProfile = await getStoreProfileForUser(userId);

  const {
    supplierId,
    productId,
    subject,
    message,
    requestedQuantity,
  } = payload;

  validateRequiredString(supplierId, "Supplier id");
  validateRequiredString(subject, "Subject");
  validateRequiredString(message, "Message");

  const supplierProfile = await prisma.supplierProfile.findUnique({
    where: {
      id: supplierId,
    },
  });

  if (!supplierProfile) {
    throw createError("Supplier profile not found", 404);
  }

  if (productId) {
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        supplierId,
        isActive: true,
      },
    });

    if (!product) {
      throw createError("Product not found for this supplier", 404);
    }
  }

  const request = await prisma.contactRequest.create({
    data: {
      storeId: storeProfile.id,
      supplierId,
      productId: productId || null,
      subject: subject.trim(),
      message: message.trim(),
      requestedQuantity: requestedQuantity?.trim() || null,
      status: "PENDING",
    },
    include: {
      store: true,
      supplier: true,
      product: true,
    },
  });

  return getSafeContactRequest(request);
}

async function getSentRequests(userId) {
  const storeProfile = await getStoreProfileForUser(userId);

  const requests = await prisma.contactRequest.findMany({
    where: {
      storeId: storeProfile.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      store: true,
      supplier: true,
      product: true,
    },
  });

  return requests.map(getSafeContactRequest);
}

async function getReceivedRequests(userId) {
  const supplierProfile = await getSupplierProfileForUser(userId);

  const requests = await prisma.contactRequest.findMany({
    where: {
      supplierId: supplierProfile.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      store: true,
      supplier: true,
      product: true,
    },
  });

  return requests.map(getSafeContactRequest);
}

async function getRequestById(userId, role, requestId) {
  const request = await prisma.contactRequest.findUnique({
    where: {
      id: requestId,
    },
    include: {
      store: true,
      supplier: true,
      product: true,
    },
  });

  if (!request) {
    throw createError("Contact request not found", 404);
  }

  if (role === "STORE") {
    const storeProfile = await getStoreProfileForUser(userId);

    if (request.storeId !== storeProfile.id) {
      throw createError("Forbidden: this request does not belong to your store", 403);
    }
  }

  if (role === "SUPPLIER") {
    const supplierProfile = await getSupplierProfileForUser(userId);

    if (request.supplierId !== supplierProfile.id) {
      throw createError("Forbidden: this request was not sent to your supplier profile", 403);
    }
  }

  return getSafeContactRequest(request);
}

async function updateRequestStatus(userId, requestId, payload) {
  const supplierProfile = await getSupplierProfileForUser(userId);

  const { status } = payload;

  validateRequiredString(status, "Status");

  const normalizedStatus = normalizeStatus(status);

  if (!VALID_REQUEST_STATUSES.includes(normalizedStatus)) {
    throw createError("Status must be PENDING, READ, ANSWERED or CLOSED", 400);
  }

  const existingRequest = await prisma.contactRequest.findFirst({
    where: {
      id: requestId,
      supplierId: supplierProfile.id,
    },
  });

  if (!existingRequest) {
    throw createError("Contact request not found or not sent to current supplier", 404);
  }

  const updatedRequest = await prisma.contactRequest.update({
    where: {
      id: requestId,
    },
    data: {
      status: normalizedStatus,
    },
    include: {
      store: true,
      supplier: true,
      product: true,
    },
  });

  return getSafeContactRequest(updatedRequest);
}

module.exports = {
  getStatus,
  createContactRequest,
  getSentRequests,
  getReceivedRequests,
  getRequestById,
  updateRequestStatus,
};
