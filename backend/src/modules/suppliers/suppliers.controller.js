const suppliersService = require("./suppliers.service");

function getSuppliersModuleStatus(req, res) {
  const message = suppliersService.getStatus();

  res.status(200).json({
    success: true,
    module: "suppliers",
    message,
  });
}

async function getAllSupplierProfiles(req, res, next) {
  try {
    const suppliers = await suppliersService.getAllSupplierProfiles();

    res.status(200).json({
      success: true,
      suppliers,
    });
  } catch (error) {
    next(error);
  }
}

async function getSupplierProfileById(req, res, next) {
  try {
    const supplier = await suppliersService.getSupplierProfileById(
      req.params.id,
    );

    res.status(200).json({
      success: true,
      supplier,
    });
  } catch (error) {
    next(error);
  }
}

async function createSupplierProfile(req, res, next) {
  try {
    const supplier = await suppliersService.createSupplierProfile(
      req.user.id,
      req.body,
    );

    res.status(201).json({
      success: true,
      message: "Supplier profile created successfully",
      supplier,
    });
  } catch (error) {
    next(error);
  }
}

async function getCurrentSupplierProfile(req, res, next) {
  try {
    const supplier = await suppliersService.getCurrentSupplierProfile(
      req.user.id,
    );

    res.status(200).json({
      success: true,
      supplier,
    });
  } catch (error) {
    next(error);
  }
}

async function updateCurrentSupplierProfile(req, res, next) {
  try {
    const supplier = await suppliersService.updateCurrentSupplierProfile(
      req.user.id,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Supplier profile updated successfully",
      supplier,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSuppliersModuleStatus,
  getAllSupplierProfiles,
  getSupplierProfileById,
  createSupplierProfile,
  getCurrentSupplierProfile,
  updateCurrentSupplierProfile,
};
