const storesService = require("./stores.service");

function getStoresModuleStatus(req, res) {
  const message = storesService.getStatus();

  res.status(200).json({
    success: true,
    module: "stores",
    message,
  });
}

module.exports = {
  getStoresModuleStatus,
};
