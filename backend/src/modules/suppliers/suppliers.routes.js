const express = require("express");
const suppliersController = require("./suppliers.controller");

const router = express.Router();

router.get("/", suppliersController.getSuppliersModuleStatus);

module.exports = router;
