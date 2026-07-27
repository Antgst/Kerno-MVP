const express = require("express");
const productsController = require("./products.controller");
const {
  requireAuth,
  requireRole,
} = require("../../middlewares/auth.middleware");

const router = express.Router();

router.get("/", productsController.getAllProducts);

router.get(
  "/mine",
  requireAuth,
  requireRole("SUPPLIER"),
  productsController.getCurrentSupplierProducts,
);

router.get(
  "/mine/:id",
  requireAuth,
  requireRole("SUPPLIER"),
  productsController.getCurrentSupplierProductById,
);

router.get("/:id", productsController.getProductById);

router.post(
  "/",
  requireAuth,
  requireRole("SUPPLIER"),
  productsController.createProduct,
);

router.put(
  "/:id",
  requireAuth,
  requireRole("SUPPLIER"),
  productsController.updateProduct,
);

router.delete(
  "/:id",
  requireAuth,
  requireRole("SUPPLIER"),
  productsController.deleteProduct,
);

module.exports = router;
