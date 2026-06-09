const authService = require("./auth.service");

function getAuthModuleStatus(req, res) {
  const message = authService.getStatus();

  res.status(200).json({
    success: true,
    module: "auth",
    message,
  });
}

async function register(req, res, next) {
  try {
    const result = await authService.registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const result = await authService.loginUser(req.body);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAuthModuleStatus,
  register,
  login,
};
