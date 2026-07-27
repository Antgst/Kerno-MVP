const productsService = require("./products.service");

function getProductsModuleStatus(req, res) {
  const message = productsService.getStatus();

  res.status(200).json({
    success: true,
    module: "products",
    message,
  });
}

async function getAllProducts(req, res, next) {
  try {
    const products = await productsService.getAllProducts();

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
}

async function getCurrentSupplierProducts(req, res, next) {
  try {
    const products = await productsService.getCurrentSupplierProducts(req.user.id);

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
}

async function getCurrentSupplierProductById(req, res, next) {
  try {
    const product = await productsService.getCurrentSupplierProductById(
      req.user.id,
      req.params.id,
    );

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
}

async function getProductById(req, res, next) {
  try {
    const product = await productsService.getProductById(req.params.id);

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
}

async function createProduct(req, res, next) {
  try {
    const product = await productsService.createProduct(req.user.id, req.body);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const product = await productsService.updateProduct(
      req.user.id,
      req.params.id,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const product = await productsService.deleteProduct(
      req.user.id,
      req.params.id,
    );

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProductsModuleStatus,
  getAllProducts,
  getCurrentSupplierProducts,
  getCurrentSupplierProductById,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
