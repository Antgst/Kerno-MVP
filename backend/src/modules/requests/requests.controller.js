const requestsService = require("./requests.service");

function getRequestsModuleStatus(req, res) {
  const message = requestsService.getStatus();

  res.status(200).json({
    success: true,
    module: "requests",
    message,
  });
}

module.exports = {
  getRequestsModuleStatus,
};
