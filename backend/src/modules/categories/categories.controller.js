const categoriesService = require("./categories.service");

function getCategoriesModuleStatus(req, res) {
  const message = categoriesService.getStatus();

  res.status(200).json({
    success: true,
    module: "categories",
    message,
  });
}

module.exports = {
  getCategoriesModuleStatus,
};
