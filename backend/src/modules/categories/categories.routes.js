const express = require("express");
const categoriesController = require("./categories.controller");
const {
  requireAuth,
  requireRole,
} = require("../../middlewares/auth.middleware");

const router = express.Router();

router.get("/", categoriesController.getAllCategories);

router.post(
  "/",
  requireAuth,
  requireRole("SUPPLIER"),
  categoriesController.createCategory,
);

module.exports = router;
