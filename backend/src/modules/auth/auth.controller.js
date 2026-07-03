const authService = require("./auth.service");
const {
  AUTH_COOKIE_NAME,
  getAuthCookieOptions,
  getClearAuthCookieOptions,
} = require("../../config/authCookie");

function getAuthModuleStatus(req, res) {
  const message = authService.getStatus();

  res.status(200).json({
    success: true,
    module: "auth",
    message,
  });
}

function setAuthCookie(res, token) {
  res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
}

function clearAuthCookie(res) {
  res.clearCookie(AUTH_COOKIE_NAME, getClearAuthCookieOptions());
}

async function register(req, res, next) {
  try {
    const { token, ...result } = await authService.registerUser(req.body);

    setAuthCookie(res, token);

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
    const { token, ...result } = await authService.loginUser(req.body);

    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

function logout(req, res) {
  clearAuthCookie(res);

  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
}

module.exports = {
  getAuthModuleStatus,
  register,
  login,
  logout,
};
