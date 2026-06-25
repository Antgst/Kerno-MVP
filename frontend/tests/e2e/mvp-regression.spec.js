import { expect, test } from "@playwright/test";

const env = globalThis.process?.env || {};
const API_BASE_URL = env.VITE_API_BASE_URL || "http://localhost:5001/api";
const SUPPLIER_EMAIL = "supplier.001@kerno-demo.local";
const STORE_EMAIL = "store.001@kerno-demo.local";
const PASSWORD = "Password123!";

async function loginViaUi(page, email, password = PASSWORD) {
  await page.goto("/login");
  await page.getByLabel("Email professionnel").fill(email);
  await page.getByLabel("Mot de passe").fill(password);
  await page.getByRole("button", { name: "Se connecter" }).click();
}

async function apiRequest(request, path, options = {}) {
  const response = await request.fetch(`${API_BASE_URL}${path}`, {
    failOnStatusCode: false,
    ...options,
  });

  const body = await response.json().catch(() => null);
  return { response, body };
}

async function apiLogin(request, email) {
  const { response, body } = await apiRequest(request, "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: { email, password: PASSWORD },
  });

  expect(response.status(), `API login failed for ${email}`).toBe(200);
  expect(body?.token, `API login did not return a token for ${email}`).toBeTruthy();
  return body.token;
}

async function getSeededProduct(request) {
  const { response, body } = await apiRequest(request, "/products");

  expect(response.status(), "Seeded products are required for E2E regression").toBe(200);
  const products = Array.isArray(body?.products) ? body.products : [];
  const product = products.find((item) => item?.id && (item?.supplierId || item?.supplier?.id));

  expect(product, "No seeded product with a supplier was found").toBeTruthy();
  return product;
}

async function getCurrentSupplierProfile(request, token) {
  const { response, body } = await apiRequest(request, "/suppliers/profile/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  expect(response.status(), "Seeded supplier profile is required for E2E regression").toBe(200);
  expect(body?.supplier?.id, "Seeded supplier profile did not include an id").toBeTruthy();
  return body.supplier;
}

async function getSeededProductForSupplier(request, supplierId) {
  const { response, body } = await apiRequest(request, "/products");

  expect(response.status(), "Seeded products are required for E2E regression").toBe(200);
  const products = Array.isArray(body?.products) ? body.products : [];
  const product = products.find((item) => {
    const productSupplierId = item?.supplierId || item?.supplier?.id;
    return item?.id && productSupplierId === supplierId;
  });

  expect(product, `No seeded product was found for supplier ${supplierId}`).toBeTruthy();
  return product;
}

test.describe("KERNO MVP automated regression", () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test("public landing and login pages load", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /KERNO/i })).toBeVisible();

    await page.goto("/login");
    await expect(page.getByTestId("login-page")).toBeVisible();
    await expect(page.getByRole("button", { name: "Se connecter" })).toBeVisible();
  });

  test("protected route redirects unauthenticated users to login", async ({ page }) => {
    await page.goto("/catalog");

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByTestId("login-page")).toBeVisible();
  });

  test("supplier login reaches supplier dashboard", async ({ page }) => {
    await loginViaUi(page, SUPPLIER_EMAIL);

    await expect(page).toHaveURL(/\/supplier\/dashboard$/);
    await expect(page.getByTestId("supplier-dashboard")).toBeVisible();
  });

  test("store login reaches store dashboard and wrong-role route redirects", async ({ page }) => {
    await loginViaUi(page, STORE_EMAIL);

    await expect(page).toHaveURL(/\/store\/dashboard$/);
    await expect(page.getByTestId("store-dashboard")).toBeVisible();

    await page.goto("/supplier/dashboard");
    await expect(page).toHaveURL(/\/store\/dashboard$/);
    await expect(page.getByTestId("store-dashboard")).toBeVisible();
  });

  test("catalog and a seeded product detail page are accessible after login", async ({ page, request }) => {
    const product = await getSeededProduct(request);

    await loginViaUi(page, STORE_EMAIL);
    await expect(page).toHaveURL(/\/store\/dashboard$/);
    await page.goto("/catalog");

    await expect(page.getByTestId("catalog-page")).toBeVisible();
    await expect(page.getByTestId("catalog-product-card").first()).toBeVisible();

    await page.goto(`/products/${product.id}`);
    await expect(page.getByTestId("product-detail-page")).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 1, name: product.name }),
    ).toBeVisible();
  });

  test("seeded MVP flow: supplier products, store request, supplier received request", async ({
    page,
    request,
  }) => {
    const supplierToken = await apiLogin(request, SUPPLIER_EMAIL);
    const supplier = await getCurrentSupplierProfile(request, supplierToken);
    const product = await getSeededProductForSupplier(request, supplier.id);
    const supplierId = supplier.id;
    const subject = `Playwright MVP request ${Date.now()}`;

    await loginViaUi(page, SUPPLIER_EMAIL);
    await expect(page.getByTestId("supplier-dashboard")).toBeVisible();
    await page.goto("/supplier/products");
    await expect(page.getByRole("heading", { name: /Produits/i })).toBeVisible();

    await page.evaluate(() => localStorage.clear());
    await loginViaUi(page, STORE_EMAIL);
    await expect(page.getByTestId("store-dashboard")).toBeVisible();

    await page.goto("/catalog");
    await expect(page.getByTestId("catalog-page")).toBeVisible();
    await page.goto(`/requests/new?supplierId=${supplierId}&productId=${product.id}`);

    await expect(page.getByTestId("request-form-page")).toBeVisible();
    await page.getByLabel("Objet de la demande").fill(subject);
    await page
      .getByLabel("Volume ou besoin professionnel")
      .fill("Automated regression quantity");
    await page
      .getByLabel("Message")
      .fill("Automated MVP smoke test request from store to supplier.");
    await page.getByRole("button", { name: "Envoyer la demande" }).click();

    await expect(page).toHaveURL(/\/store\/requests\/[0-9a-f-]+$/i);
    await expect(page.getByText(subject)).toBeVisible();

    const { response, body } = await apiRequest(request, "/requests/received", {
      headers: { Authorization: `Bearer ${supplierToken}` },
    });

    expect(response.status()).toBe(200);
    const receivedRequests = Array.isArray(body?.requests) ? body.requests : [];
    expect(receivedRequests.some((item) => item.subject === subject)).toBe(true);
  });
});
