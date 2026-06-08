const express = require("express");
const productsController = require("./products.controller");
const {
  requireAuth,
  requireRole,
} = require("../../middlewares/auth.middleware");

const router = express.Router();

router.get("/", requireAuth, productsController.getProductsModuleStatus);

router.post(
  "/",
  requireAuth,
  requireRole("SUPPLIER"),
  productsController.getProductsModuleStatus,
);

module.exports = router;
