const storesService = require("./stores.service");

function getStoresModuleStatus(req, res) {
  const message = storesService.getStatus();

  res.status(200).json({
    success: true,
    module: "stores",
    message,
  });
}

async function createStoreProfile(req, res, next) {
  try {
    const store = await storesService.createStoreProfile(
      req.user.id,
      req.body,
    );

    res.status(201).json({
      success: true,
      message: "Store profile created successfully",
      store,
    });
  } catch (error) {
    next(error);
  }
}

async function getCurrentStoreProfile(req, res, next) {
  try {
    const store = await storesService.getCurrentStoreProfile(req.user.id);

    res.status(200).json({
      success: true,
      store,
    });
  } catch (error) {
    next(error);
  }
}

async function updateCurrentStoreProfile(req, res, next) {
  try {
    const store = await storesService.updateCurrentStoreProfile(
      req.user.id,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Store profile updated successfully",
      store,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getStoresModuleStatus,
  createStoreProfile,
  getCurrentStoreProfile,
  updateCurrentStoreProfile,
};
