const categoriesService = require("./categories.service");

function getCategoriesModuleStatus(req, res) {
  const message = categoriesService.getStatus();

  res.status(200).json({
    success: true,
    module: "categories",
    message,
  });
}

async function getAllCategories(req, res, next) {
  try {
    const categories = await categoriesService.getAllCategories();

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
}

async function createCategory(req, res, next) {
  try {
    const category = await categoriesService.createCategory(req.body);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCategoriesModuleStatus,
  getAllCategories,
  createCategory,
};
