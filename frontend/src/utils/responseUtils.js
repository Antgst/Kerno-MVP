export function unwrapData(response) {
  return response?.data ?? response;
}

export function getResource(response, keys = []) {
  const data = unwrapData(response);

  for (const key of keys) {
    if (response?.[key] !== undefined) {
      return response[key];
    }

    if (data?.[key] !== undefined) {
      return data[key];
    }
  }

  return data ?? null;
}

export function getListResource(response, keys = []) {
  const resource = getResource(response, keys);

  if (Array.isArray(resource)) {
    return resource;
  }

  return [];
}
