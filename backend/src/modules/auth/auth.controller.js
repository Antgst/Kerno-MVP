const authService = require("./auth.service");

function getAuthModuleStatus(req, res) {
  const message = authService.getStatus();

  res.status(200).json({
    success: true,
    module: "auth",
    message,
  });
}

module.exports = {
  getAuthModuleStatus,
};
