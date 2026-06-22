import apiClient from "./apiClient";

export function getCategories() {
  return apiClient.get("/categories");
}

export function createCategory(payload) {
  return apiClient.post("/categories", payload);
}

const categoryService = {
  getCategories,
  createCategory,
};

export default categoryService;
