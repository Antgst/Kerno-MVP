const usersService = require("./users.service");

function getUsersModuleStatus(req, res) {
  const message = usersService.getStatus();

  res.status(200).json({
    success: true,
    module: "users",
    message,
  });
}

module.exports = {
  getUsersModuleStatus,
};
