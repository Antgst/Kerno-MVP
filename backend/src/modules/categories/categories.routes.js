const express = require("express");
const categoriesController = require("./categories.controller");

const router = express.Router();

router.get("/", categoriesController.getCategoriesModuleStatus);

module.exports = router;
