const express = require("express");
const productsController = require("./products.controller");
const {
  requireAuth,
  requireRole,
} = require("../../middlewares/auth.middleware");

const router = express.Router();

router.get("/", productsController.getAllProducts);

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
  productsController.deactivateProduct,
);

module.exports = router;
