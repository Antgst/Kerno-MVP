const productsService = require("./products.service");

function getProductsModuleStatus(req, res) {
  const message = productsService.getStatus();

  res.status(200).json({
    success: true,
    module: "products",
    message,
  });
}

module.exports = {
  getProductsModuleStatus,
};
