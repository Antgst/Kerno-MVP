const express = require("express");
const usersController = require("./users.controller");
const { requireAuth } = require("../../middlewares/auth.middleware");

const router = express.Router();

router.get("/", usersController.getUsersModuleStatus);
router.get("/me", requireAuth, usersController.getCurrentUser);

module.exports = router;
