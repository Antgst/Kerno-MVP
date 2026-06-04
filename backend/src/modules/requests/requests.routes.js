const express = require("express");
const requestsController = require("./requests.controller");

const router = express.Router();

router.get("/", requestsController.getRequestsModuleStatus);

module.exports = router;
