const express = require("express");
const storesController = require("./stores.controller");
const {
  requireAuth,
  requireRole,
} = require("../../middlewares/auth.middleware");

const router = express.Router();

router.get("/", storesController.getStoresModuleStatus);

router.post(
  "/profile",
  requireAuth,
  requireRole("STORE"),
  storesController.createStoreProfile,
);

router.get(
  "/profile/me",
  requireAuth,
  requireRole("STORE"),
  storesController.getCurrentStoreProfile,
);

router.put(
  "/profile/me",
  requireAuth,
  requireRole("STORE"),
  storesController.updateCurrentStoreProfile,
);

module.exports = router;
