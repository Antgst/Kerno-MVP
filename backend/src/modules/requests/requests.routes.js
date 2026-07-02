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
  requestsController.createContactRequest,
);

router.get(
  "/sent",
  requireAuth,
  requireRole("STORE"),
  requestsController.getSentRequests,
);

router.get(
  "/received",
  requireAuth,
  requireRole("SUPPLIER"),
  requestsController.getReceivedRequests,
);

router.patch(
  "/:id/status",
  requireAuth,
  requireRole("SUPPLIER"),
  requestsController.updateRequestStatus,
);

router.get(
  "/:id",
  requireAuth,
  requireRole("STORE", "SUPPLIER"),
  requestsController.getRequestById,
);

module.exports = router;
