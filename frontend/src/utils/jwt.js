function decodeBase64Url(value) {
  const normalizedValue = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (normalizedValue.length % 4)) % 4);

  return atob(`${normalizedValue}${padding}`);
}

function decodeJwtPayload(token) {
  try {
    const [, payload] = String(token || "").split(".");

    if (!payload) {
      return null;
    }

    return JSON.parse(decodeBase64Url(payload));
  } catch {
    return null;
  }
}

export function getRoleFromToken(token) {
  const payload = decodeJwtPayload(token);

  return payload?.role || payload?.user?.role || payload?.userRole || null;
}

export function getUserFromToken(token) {
  const payload = decodeJwtPayload(token);

  if (!payload) {
    return null;
  }

  return {
    id: payload.userId || payload.id || payload.sub || null,
    email: payload.email || payload.user?.email || null,
    role: payload.role || payload.user?.role || payload.userRole || null,
  };
}
