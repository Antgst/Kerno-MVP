const suppliersService = require("./suppliers.service");

function getSuppliersModuleStatus(req, res) {
  const message = suppliersService.getStatus();

  res.status(200).json({
    success: true,
    module: "suppliers",
    message,
  });
}

module.exports = {
  getSuppliersModuleStatus,
};
