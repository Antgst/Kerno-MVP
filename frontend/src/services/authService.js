import apiClient from "./apiClient";
import {
  clearAuthToken,
  getAuthRole,
  getAuthToken,
  setAuthRole,
  setAuthToken,
} from "./tokenStorage";
import { getRoleFromToken, getUserFromToken } from "../utils/jwt";

function getTokenFromResponse(response) {
  return (
    response?.token ||
    response?.accessToken ||
    response?.jwt ||
    response?.data?.token ||
    response?.data?.accessToken ||
    response?.data?.jwt ||
    null
  );
}

function getRoleFromResponse(response, token) {
  return (
    response?.user?.role ||
    response?.role ||
    response?.account?.role ||
    response?.data?.user?.role ||
    response?.data?.role ||
    response?.data?.account?.role ||
    getRoleFromToken(token)
  );
}

function persistAuthResponse(response) {
  const token = getTokenFromResponse(response);
  const role = getRoleFromResponse(response, token);

  if (token) {
    setAuthToken(token);
  }

  if (role) {
    setAuthRole(role);
  }

  return {
    ...response,
    user: response?.user || response?.data?.user || getUserFromToken(token),
    role,
  };
}

export async function registerUser(payload) {
  const response = await apiClient.post("/auth/register", payload);

  return persistAuthResponse(response);
}

export async function loginUser(payload) {
  const response = await apiClient.post("/auth/login", payload);

  return persistAuthResponse(response);
}

export function logoutUser() {
  clearAuthToken();
}

export function getCurrentAuthRole() {
  return getAuthRole();
}

export function isAuthenticated() {
  return Boolean(getAuthToken());
}

const authService = {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentAuthRole,
  isAuthenticated,
};

export default authService;
