const AUTH_COOKIE_NAME = "kerno_auth_token";
const AUTH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const SUPPORTED_SAME_SITE_VALUES = ["lax", "strict", "none"];

function getAuthCookieSameSite() {
  const sameSite = String(process.env.AUTH_COOKIE_SAMESITE || "lax")
    .trim()
    .toLowerCase();

  if (SUPPORTED_SAME_SITE_VALUES.includes(sameSite)) {
    return sameSite;
  }

  return "lax";
}

function getAuthCookieOptions() {
  const sameSite = getAuthCookieSameSite();
  const secure = process.env.NODE_ENV === "production" || sameSite === "none";

  return {
    httpOnly: true,
    secure,
    sameSite,
    maxAge: AUTH_COOKIE_MAX_AGE_MS,
    path: "/",
  };
}

function getClearAuthCookieOptions() {
  const { maxAge, ...cookieOptions } = getAuthCookieOptions();

  return cookieOptions;
}

module.exports = {
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_MAX_AGE_MS,
  getAuthCookieOptions,
  getClearAuthCookieOptions,
};
