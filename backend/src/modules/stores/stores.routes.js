const express = require("express");
const storesController = require("./stores.controller");
const {
  requireAuth,
  requireRole,
} = require("../../middlewares/auth.middleware");

const router = express.Router();

router.get(
  "/",
  requireAuth,
  requireRole("STORE"),
  storesController.getStoresModuleStatus,
);

module.exports = router;
