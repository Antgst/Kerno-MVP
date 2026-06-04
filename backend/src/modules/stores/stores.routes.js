const express = require("express");
const storesController = require("./stores.controller");

const router = express.Router();

router.get("/", storesController.getStoresModuleStatus);

module.exports = router;
