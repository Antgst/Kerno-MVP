const express = require("express");
const productsController = require("./products.controller");

const router = express.Router();

router.get("/", productsController.getProductsModuleStatus);

module.exports = router;
