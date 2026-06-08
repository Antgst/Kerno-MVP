const express = require("express");
const suppliersController = require("./suppliers.controller");
const {
  requireAuth,
  requireRole,
} = require("../../middlewares/auth.middleware");

const router = express.Router();

router.get(
  "/",
  requireAuth,
  requireRole("SUPPLIER"),
  suppliersController.getSuppliersModuleStatus,
);

module.exports = router;
