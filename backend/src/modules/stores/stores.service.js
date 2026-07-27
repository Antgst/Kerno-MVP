const prisma = require("../../lib/prisma");
const { isValidPhone, normalizePhone } = require("../../utils/phone");

function getStatus() {
  return "Stores module is ready";
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

function getSafeStoreProfile(profile) {
  return {
    id: profile.id,
    userId: profile.userId,
    storeName: profile.storeName,
    brandName: profile.brandName,
    location: profile.location,
    storeType: profile.storeType,
    sourcingNeeds: profile.sourcingNeeds,
    contactEmail: profile.contactEmail,
    phone: profile.phone,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
}

async function createStoreProfile(userId, payload) {
  const {
    storeName,
    brandName,
    location,
    storeType,
    sourcingNeeds,
    contactEmail,
    phone,
  } = payload;

  validateRequiredString(storeName, "Store name");

  if (phone) {
    if (!isValidPhone(phone)) {
      throw createError("Invalid phone number", 400);
    }
  }

  const existingProfile = await prisma.storeProfile.findUnique({
    where: {
      userId,
    },
  });

  if (existingProfile) {
    throw createError("Store profile already exists", 409);
  }

  const profile = await prisma.storeProfile.create({
    data: {
      userId,
      storeName: storeName.trim(),
      brandName: brandName?.trim() || null,
      location: location?.trim() || null,
      storeType: storeType?.trim() || null,
      sourcingNeeds: sourcingNeeds?.trim() || null,
      contactEmail: contactEmail?.trim() || null,
      phone: phone ? normalizePhone(phone) : null,
    },
  });

  return getSafeStoreProfile(profile);
}

async function getCurrentStoreProfile(userId) {
  const profile = await prisma.storeProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!profile) {
    throw createError("Store profile not found", 404);
  }

  return getSafeStoreProfile(profile);
}

async function updateCurrentStoreProfile(userId, payload) {
  const existingProfile = await prisma.storeProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!existingProfile) {
    throw createError("Store profile not found", 404);
  }

  const {
    storeName,
    brandName,
    location,
    storeType,
    sourcingNeeds,
    contactEmail,
    phone,
  } = payload;

  if (storeName !== undefined) {
    validateRequiredString(storeName, "Store name");
  }

  if (phone !== undefined && phone) {
    if (!isValidPhone(phone)) {
      throw createError("Invalid phone number", 400);
    }
  }

  const updatedProfile = await prisma.storeProfile.update({
    where: {
      userId,
    },
    data: {
      storeName: storeName !== undefined ? storeName.trim() : undefined,
      brandName:
        brandName !== undefined ? brandName?.trim() || null : undefined,
      location:
        location !== undefined ? location?.trim() || null : undefined,
      storeType:
        storeType !== undefined ? storeType?.trim() || null : undefined,
      sourcingNeeds:
        sourcingNeeds !== undefined ? sourcingNeeds?.trim() || null : undefined,
      contactEmail:
        contactEmail !== undefined ? contactEmail?.trim() || null : undefined,
      phone:
        phone !== undefined ? phone ? normalizePhone(phone) : null : undefined,
    },
  });

  return getSafeStoreProfile(updatedProfile);
}

module.exports = {
  getStatus,
  createStoreProfile,
  getCurrentStoreProfile,
  updateCurrentStoreProfile,
};
