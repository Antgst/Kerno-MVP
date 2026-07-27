import apiClient from "./apiClient";

export function getProducts(query) {
  return apiClient.get("/products", { query });
}

export function getCurrentSupplierProducts() {
  return apiClient.get("/products/mine");
}

export function getCurrentSupplierProductById(id) {
  return apiClient.get(`/products/mine/${id}`);
}

export function getProductById(id) {
  return apiClient.get(`/products/${id}`);
}

export function createProduct(payload) {
  return apiClient.post("/products", payload);
}

export function updateProduct(id, payload) {
  return apiClient.put(`/products/${id}`, payload);
}

export function deleteProduct(id) {
  return apiClient.delete(`/products/${id}`);
}
