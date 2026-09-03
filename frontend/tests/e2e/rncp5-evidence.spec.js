import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "@playwright/test";

const env = globalThis.process?.env || {};
const API_BASE_URL = env.VITE_API_BASE_URL || "http://localhost:5001/api";
const STORE_EMAIL = "store.001@kerno-demo.local";
const PASSWORD = "Password123!";
const EVIDENCE_DIR = resolve(
  env.RNCP5_EVIDENCE_DIR || "test-results/rncp5-evidence",
);

mkdirSync(EVIDENCE_DIR, { recursive: true });

async function loginViaUi(page, email = STORE_EMAIL, password = PASSWORD) {
  await page.goto("/login");
  await page.getByLabel("Email professionnel").fill(email);
  await page.getByLabel("Mot de passe").fill(password);
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL(/\/store\/dashboard$/);
}

async function apiRequest(request, path, options = {}) {
  const response = await request.fetch(`${API_BASE_URL}${path}`, {
    failOnStatusCode: false,
    ...options,
  });

  const body = await response.json().catch(() => null);
  return { response, body };
}

async function getSeededProduct(request) {
  const { response, body } = await apiRequest(request, "/products");

  expect(response.status(), "Seeded products are required for RNCP evidence").toBe(200);
  const products = Array.isArray(body?.products) ? body.products : [];
  const product = products.find(
    (item) => item?.id && (item?.supplierId || item?.supplier?.id),
  );

  expect(product, "No seeded product with a supplier was found").toBeTruthy();
  return product;
}

async function assertNoHorizontalOverflow(page, label) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(
    dimensions.scrollWidth,
    `${label}: horizontal overflow detected (${dimensions.scrollWidth}px > ${dimensions.clientWidth}px)`,
  ).toBeLessThanOrEqual(dimensions.clientWidth + 2);
}

async function capture(page, filename) {
  await page.screenshot({
    path: resolve(EVIDENCE_DIR, filename),
    fullPage: true,
  });
}

test.describe("RNCP5 runtime evidence", () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test("catalogue: desktop, 390 px and 320 px evidence without horizontal overflow", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await loginViaUi(page);
    await page.goto("/catalog");

    await expect(page.getByTestId("catalog-page")).toBeVisible();
    await expect(page.getByTestId("catalog-product-card").first()).toBeVisible();

    const viewports = [
      { width: 1440, height: 900, file: "catalog-desktop-1440.png" },
      { width: 390, height: 844, file: "catalog-mobile-390.png" },
      { width: 320, height: 800, file: "catalog-mobile-320.png" },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await expect(page.getByTestId("catalog-page")).toBeVisible();
      await assertNoHorizontalOverflow(page, `Catalogue ${viewport.width}px`);
      await capture(page, viewport.file);
    }
  });

  test("formulaire: responsive evidence and keyboard reachability", async ({
    page,
    request,
  }) => {
    const product = await getSeededProduct(request);
    const supplierId = product.supplierId || product.supplier?.id;

    await page.setViewportSize({ width: 1440, height: 900 });
    await loginViaUi(page);
    await page.goto(`/requests/new?supplierId=${supplierId}&productId=${product.id}`);

    await expect(page.getByTestId("request-form-page")).toBeVisible();
    await expect(page.getByLabel("Objet de la demande")).not.toHaveValue("");

    await page
      .getByLabel("Volume ou besoin professionnel")
      .fill("50 unités pour un premier référencement");
    await page
      .getByLabel("Message")
      .fill("Je souhaite connaître vos conditions professionnelles et vos délais de livraison.");

    const viewports = [
      { width: 1440, height: 900, file: "request-form-desktop-1440.png" },
      { width: 390, height: 844, file: "request-form-mobile-390.png" },
      { width: 320, height: 800, file: "request-form-mobile-320.png" },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await expect(page.getByTestId("request-form-page")).toBeVisible();
      await assertNoHorizontalOverflow(page, `Formulaire ${viewport.width}px`);
      await capture(page, viewport.file);
    }

    const subject = page.getByLabel("Objet de la demande");
    const quantity = page.getByLabel("Volume ou besoin professionnel");
    const message = page.getByLabel("Message");
    const cancel = page.getByRole("link", { name: "Annuler" });
    const submit = page.getByRole("button", { name: "Envoyer la demande" });

    await subject.focus();
    await expect(subject).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(quantity).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(message).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(cancel).toBeFocused();

    await page.setViewportSize({ width: 390, height: 844 });
    await capture(page, "request-form-mobile-390-focus-cancel.png");

    await page.keyboard.press("Tab");
    await expect(submit).toBeFocused();
  });

  test("formulaire: validation errors expose accessible semantics", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await loginViaUi(page);
    await page.goto("/requests/new");

    const form = page.getByTestId("request-form");
    await expect(form).toBeVisible();

    // Disable native browser validation only inside this test so React validation
    // can expose all field errors in a single deterministic evidence capture.
    await form.evaluate((element) => {
      element.noValidate = true;
    });

    await page.getByRole("button", { name: "Envoyer la demande" }).click();

    await expect(
      page.getByText(
        "Sélectionnez un fournisseur depuis le catalogue avant d’envoyer votre demande.",
      ),
    ).toBeVisible();
    await expect(page.getByText("L’objet est obligatoire.")).toBeVisible();
    await expect(page.getByText("Le message est obligatoire.")).toBeVisible();

    const subject = page.getByLabel("Objet de la demande");
    const message = page.getByLabel("Message");

    await expect(subject).toHaveAttribute("aria-invalid", "true");
    await expect(message).toHaveAttribute("aria-invalid", "true");
    await expect(message).toHaveAttribute("aria-describedby", "message-error");
    await expect(page.locator("#message-error")).toHaveAttribute("role", "alert");

    await assertNoHorizontalOverflow(page, "Formulaire erreurs 390px");
    await capture(page, "request-form-mobile-390-errors.png");
  });
});
