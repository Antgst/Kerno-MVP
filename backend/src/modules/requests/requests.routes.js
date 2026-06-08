const express = require("express");
const requestsController = require("./requests.controller");
const {
  requireAuth,
  requireRole,
} = require("../../middlewares/auth.middleware");

const router = express.Router();

router.post(
  "/",
  requireAuth,
  requireRole("STORE"),
  requestsController.getRequestsModuleStatus,
);

router.get(
  "/sent",
  requireAuth,
  requireRole("STORE"),
  requestsController.getRequestsModuleStatus,
);

router.get(
  "/received",
  requireAuth,
  requireRole("SUPPLIER"),
  requestsController.getRequestsModuleStatus,
);

module.exports = router;
