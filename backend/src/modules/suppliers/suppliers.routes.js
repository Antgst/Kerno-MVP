const express = require("express");
const suppliersController = require("./suppliers.controller");
const {
  requireAuth,
  requireRole,
} = require("../../middlewares/auth.middleware");

const router = express.Router();

router.get("/", suppliersController.getAllSupplierProfiles);

router.get(
  "/profile/me",
  requireAuth,
  requireRole("SUPPLIER"),
  suppliersController.getCurrentSupplierProfile,
);

router.post(
  "/profile",
  requireAuth,
  requireRole("SUPPLIER"),
  suppliersController.createSupplierProfile,
);

router.put(
  "/profile/me",
  requireAuth,
  requireRole("SUPPLIER"),
  suppliersController.updateCurrentSupplierProfile,
);

router.get("/:id", suppliersController.getSupplierProfileById);

module.exports = router;
