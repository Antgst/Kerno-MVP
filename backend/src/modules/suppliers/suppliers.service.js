const prisma = require("../../lib/prisma");

function getStatus() {
  return "Suppliers module is ready";
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

function getSafeSupplierProfile(profile) {
  return {
    id: profile.id,
    userId: profile.userId,
    companyName: profile.companyName,
    description: profile.description,
    location: profile.location,
    businessType: profile.businessType,
    contactEmail: profile.contactEmail,
    phone: profile.phone,
    website: profile.website,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
}

async function getAllSupplierProfiles() {
  const profiles = await prisma.supplierProfile.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return profiles.map(getSafeSupplierProfile);
}

async function getSupplierProfileById(id) {
  const profile = await prisma.supplierProfile.findUnique({
    where: {
      id,
    },
  });

  if (!profile) {
    throw createError("Supplier profile not found", 404);
  }

  return getSafeSupplierProfile(profile);
}

async function createSupplierProfile(userId, payload) {
  const {
    companyName,
    description,
    location,
    businessType,
    contactEmail,
    phone,
    website,
  } = payload;

  validateRequiredString(companyName, "Company name");

  const existingProfile = await prisma.supplierProfile.findUnique({
    where: {
      userId,
    },
  });

  if (existingProfile) {
    throw createError("Supplier profile already exists", 409);
  }

  const profile = await prisma.supplierProfile.create({
    data: {
      userId,
      companyName: companyName.trim(),
      description: description?.trim() || null,
      location: location?.trim() || null,
      businessType: businessType?.trim() || null,
      contactEmail: contactEmail?.trim() || null,
      phone: phone?.trim() || null,
      website: website?.trim() || null,
    },
  });

  return getSafeSupplierProfile(profile);
}

async function getCurrentSupplierProfile(userId) {
  const profile = await prisma.supplierProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!profile) {
    throw createError("Supplier profile not found", 404);
  }

  return getSafeSupplierProfile(profile);
}

async function updateCurrentSupplierProfile(userId, payload) {
  const existingProfile = await prisma.supplierProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!existingProfile) {
    throw createError("Supplier profile not found", 404);
  }

  const {
    companyName,
    description,
    location,
    businessType,
    contactEmail,
    phone,
    website,
  } = payload;

  if (companyName !== undefined) {
    validateRequiredString(companyName, "Company name");
  }

  const updatedProfile = await prisma.supplierProfile.update({
    where: {
      userId,
    },
    data: {
      companyName:
        companyName !== undefined ? companyName.trim() : undefined,
      description:
        description !== undefined ? description?.trim() || null : undefined,
      location:
        location !== undefined ? location?.trim() || null : undefined,
      businessType:
        businessType !== undefined ? businessType?.trim() || null : undefined,
      contactEmail:
        contactEmail !== undefined ? contactEmail?.trim() || null : undefined,
      phone:
        phone !== undefined ? phone?.trim() || null : undefined,
      website:
        website !== undefined ? website?.trim() || null : undefined,
    },
  });

  return getSafeSupplierProfile(updatedProfile);
}

module.exports = {
  getStatus,
  getAllSupplierProfiles,
  getSupplierProfileById,
  createSupplierProfile,
  getCurrentSupplierProfile,
  updateCurrentSupplierProfile,
};
