const express = require("express");
const authController = require("./auth.controller");

const router = express.Router();

router.get("/", authController.getAuthModuleStatus);
router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
