const {
  test,
  expect,
} = require("../../../frontend/node_modules/@playwright/test");
const {
  FRONTEND_URL,
  createAuthState,
  humanClick,
  humanMove,
  humanType,
  pauseOn,
  recordScene,
  sleep,
  smoothScrollTo,
} = require("./helpers.cjs");

const API_BASE_URL =
  process.env.KERNO_API_BASE_URL || "http://127.0.0.1:5000/api";
const LANDING_URL =
  process.env.KERNO_LANDING_URL || "https://kerno-landing.netlify.app/";

const SUPPLIER_EMAIL = "supplier1@kerno-demo.local";
const STORE_EMAIL = "store1@kerno-demo.local";
const PASSWORD = "Password123!";

const PRODUCT_NAME = "Jus pétillant de pomme";
const PRODUCT_DESCRIPTION =
  "Boisson artisanale élaborée à partir de pommes bretonnes, légèrement pétillante et sans sucres ajoutés.";
const REQUEST_SUBJECT = "Référencement du jus pétillant de pomme";
const REQUEST_VOLUME = "Première commande de 48 bouteilles";
const REQUEST_MESSAGE =
  "Bonjour, nous souhaitons référencer ce produit dans notre magasin. Pouvez-vous nous transmettre vos tarifs professionnels et vos conditions de livraison ?";

let supplierStorageState;
let storeStorageState;
let createdProductId;

test.describe.configure({ mode: "serial" });

async function getProductByName(productName) {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const response = await fetch(`${API_BASE_URL}/products`);

    if (response.ok) {
      const body = await response.json();
      const products = Array.isArray(body?.products) ? body.products : [];
      const product = products.find((item) => item?.name === productName);

      if (product?.id) {
        return product;
      }
    }

    await sleep(500);
  }

  throw new Error(`Unable to find created product: ${productName}`);
}

test.beforeAll(async ({ browser }) => {
  supplierStorageState = await createAuthState(
    browser,
    SUPPLIER_EMAIL,
    PASSWORD,
  );
  storeStorageState = await createAuthState(browser, STORE_EMAIL, PASSWORD);
});

test("01 - landing page", async ({ browser }) => {
  await recordScene(
    browser,
    "01-landing-page",
    async (page) => {
      const hero = page.locator("main").first();
      await pauseOn(page, hero, 900).catch(() => sleep(900));

      await page.evaluate(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
      });
      await sleep(400);

      await page.evaluate(() =>
        new Promise((resolve) => {
          const start = window.scrollY;
          const target = Math.min(760, document.body.scrollHeight - window.innerHeight);
          const duration = 1300;
          const startedAt = performance.now();
          const ease = (progress) =>
            progress < 0.5
              ? 4 * progress * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 3) / 2;

          const tick = (time) => {
            const progress = Math.min((time - startedAt) / duration, 1);
            window.scrollTo(0, start + (target - start) * ease(progress));
            if (progress < 1) requestAnimationFrame(tick);
            else resolve();
          };

          requestAnimationFrame(tick);
        }),
      );
      await sleep(1100);

      await page.evaluate(() =>
        new Promise((resolve) => {
          const start = window.scrollY;
          const target = Math.min(
            start + 900,
            document.body.scrollHeight - window.innerHeight,
          );
          const duration = 1150;
          const startedAt = performance.now();
          const tick = (time) => {
            const progress = Math.min((time - startedAt) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            window.scrollTo(0, start + (target - start) * eased);
            if (progress < 1) requestAnimationFrame(tick);
            else resolve();
          };
          requestAnimationFrame(tick);
        }),
      );
    },
    { startUrl: LANDING_URL, initialDelay: 1600, endDelay: 1000 },
  );
});

test("02 - supplier login", async ({ browser }) => {
  await recordScene(
    browser,
    "02-supplier-login",
    async (page) => {
      await expect(page.getByTestId("login-page")).toBeVisible();
      await humanType(
        page,
        page.getByLabel("Email professionnel"),
        SUPPLIER_EMAIL,
      );
      await humanType(page, page.getByLabel("Mot de passe"), PASSWORD, {
        minimumDelay: 55,
        maximumDelay: 95,
      });
      await humanClick(
        page,
        page.getByRole("button", { name: "Se connecter" }),
      );
      await expect(page).toHaveURL(/\/supplier\/dashboard$/);
      await expect(page.getByTestId("supplier-dashboard")).toBeVisible();
      await pauseOn(
        page,
        page.getByRole("heading", { name: /Brasserie du Littoral/i }),
        1000,
      ).catch(() => sleep(1000));
    },
    { startUrl: `${FRONTEND_URL}/login`, endDelay: 900 },
  );
});

test("03 - supplier dashboard", async ({ browser }) => {
  await recordScene(
    browser,
    "03-supplier-dashboard",
    async (page) => {
      await expect(page.getByTestId("supplier-dashboard")).toBeVisible();
      await pauseOn(
        page,
        page.getByRole("heading", { name: /Brasserie du Littoral/i }),
        800,
      ).catch(() => sleep(800));

      const supplierIndicators = page.getByLabel("Indicateurs fournisseur");
      const productsMetric = supplierIndicators.getByText("Produits publiés", {
        exact: true,
      });
      await humanMove(page, productsMetric, { duration: 650 });
      await sleep(850);

      const requestsMetric = supplierIndicators.getByText("Demandes reçues", {
        exact: true,
      });
      await humanMove(page, requestsMetric, { duration: 620 });
      await sleep(850);

      await humanClick(
        page,
        page.getByRole("link", { name: "Ajouter un produit" }).first(),
      );
      await expect(page).toHaveURL(/\/supplier\/products\/new$/);
      await expect(
        page.getByRole("heading", { name: "Ajouter un produit" }),
      ).toBeVisible();
    },
    {
      storageState: supplierStorageState,
      startUrl: `${FRONTEND_URL}/supplier/dashboard`,
      initialDelay: 1500,
    },
  );
});

test("04 - create product", async ({ browser }) => {
  await recordScene(
    browser,
    "04-create-product",
    async (page) => {
      await expect(
        page.getByRole("heading", { name: "Ajouter un produit" }),
      ).toBeVisible();

      await humanType(page, page.getByLabel("Nom du produit"), PRODUCT_NAME);

      const category = page.getByLabel("Catégorie");
      await humanClick(page, category, { postDelay: 220 });
      await category.selectOption({ label: "Boissons artisanales" });
      await sleep(550);

      await humanType(page, page.getByLabel("Description"), PRODUCT_DESCRIPTION, {
        minimumDelay: 30,
        maximumDelay: 58,
      });

      await humanType(
        page,
        page.getByLabel("Origine ou localisation"),
        "Bretagne, France",
      );
      await humanType(page, page.getByLabel("Prix indicatif (€)"), "3,90");

      const priceUnit = page.getByLabel("Unité").first();
      await humanClick(page, priceUnit, { postDelay: 180 });
      await priceUnit.selectOption("LITER").catch(async () => {
        await priceUnit.selectOption("UNIT");
      });

      await humanType(page, page.getByLabel("Volume minimum"), "24");
      await humanType(
        page,
        page.getByLabel("Lien vers l’image du produit"),
        "/assets/products/jus-de-pomme-artisanal.webp",
        { minimumDelay: 22, maximumDelay: 42 },
      );

      await pauseOn(
        page,
        page.getByRole("heading", { name: "Aperçu catalogue" }),
        1200,
      );

      await humanClick(
        page,
        page.getByRole("button", { name: "Créer le produit" }),
      );
      await expect(page).toHaveURL(/\/supplier\/products$/);
      await expect(page.getByText(PRODUCT_NAME, { exact: true }).first()).toBeVisible();
    },
    {
      storageState: supplierStorageState,
      startUrl: `${FRONTEND_URL}/supplier/products/new`,
      initialDelay: 1300,
      endDelay: 1300,
    },
  );

  const product = await getProductByName(PRODUCT_NAME);
  createdProductId = product.id;
});

test("05 - product published", async ({ browser }) => {
  await recordScene(
    browser,
    "05-product-published",
    async (page) => {
      await expect(page.getByText(PRODUCT_NAME, { exact: true }).first()).toBeVisible();
      const productTitle = page.getByText(PRODUCT_NAME, { exact: true }).first();
      await smoothScrollTo(page, productTitle, { offset: 240, duration: 850 });
      await humanMove(page, productTitle, { duration: 700 });
      await sleep(1500);
    },
    {
      storageState: supplierStorageState,
      startUrl: `${FRONTEND_URL}/supplier/products`,
      initialDelay: 1500,
      endDelay: 900,
    },
  );
});

test("06 - store login", async ({ browser }) => {
  await recordScene(
    browser,
    "06-store-login",
    async (page) => {
      await expect(page.getByTestId("login-page")).toBeVisible();
      await humanType(page, page.getByLabel("Email professionnel"), STORE_EMAIL);
      await humanType(page, page.getByLabel("Mot de passe"), PASSWORD, {
        minimumDelay: 55,
        maximumDelay: 95,
      });
      await humanClick(
        page,
        page.getByRole("button", { name: "Se connecter" }),
      );
      await expect(page).toHaveURL(/\/store\/dashboard$/);
      await expect(page.getByTestId("store-dashboard")).toBeVisible();
      await sleep(1400);
    },
    { startUrl: `${FRONTEND_URL}/login`, endDelay: 900 },
  );
});

test("07 - catalog search", async ({ browser }) => {
  await recordScene(
    browser,
    "07-catalog-search",
    async (page) => {
      await expect(page.getByTestId("catalog-page")).toBeVisible();
      const search = page.getByPlaceholder(
        "Rechercher un produit, fournisseur, lieu...",
      );
      await humanType(page, search, "jus pétillant");

      const productLink = page.getByRole("link", {
        name: `Voir le produit ${PRODUCT_NAME}`,
      });
      await expect(productLink).toBeVisible();
      await pauseOn(page, productLink, 1200);
      await humanClick(page, productLink);
      await expect(page).toHaveURL(/\/products\//);
      await expect(
        page.getByRole("heading", { level: 1, name: PRODUCT_NAME }),
      ).toBeVisible();
    },
    {
      storageState: storeStorageState,
      startUrl: `${FRONTEND_URL}/catalog`,
      initialDelay: 1600,
      endDelay: 1000,
    },
  );
});

test("08 - product detail", async ({ browser }) => {
  if (!createdProductId) {
    createdProductId = (await getProductByName(PRODUCT_NAME)).id;
  }

  await recordScene(
    browser,
    "08-product-detail",
    async (page) => {
      await expect(page.getByTestId("product-detail-page")).toBeVisible();
      const heading = page.getByRole("heading", { level: 1, name: PRODUCT_NAME });
      await pauseOn(page, heading, 900);

      const price = page.getByText(/3,90|3\.90/).first();
      await humanMove(page, price, { duration: 650 }).catch(() => {});
      await sleep(900);

      const supplierSection = page.getByRole("heading", {
        name: "Qui propose ce produit ?",
      });
      await smoothScrollTo(page, supplierSection, { offset: 160, duration: 950 });
      await humanMove(page, supplierSection, { duration: 620 });
      await sleep(1200);
    },
    {
      storageState: storeStorageState,
      startUrl: `${FRONTEND_URL}/products/${createdProductId}`,
      initialDelay: 1500,
      endDelay: 900,
    },
  );
});

test("09 - send request", async ({ browser }) => {
  if (!createdProductId) {
    createdProductId = (await getProductByName(PRODUCT_NAME)).id;
  }

  await recordScene(
    browser,
    "09-send-request",
    async (page) => {
      await humanClick(
        page,
        page.getByRole("link", { name: "Créer une demande" }),
      );
      await expect(page.getByTestId("request-form-page")).toBeVisible();

      await humanType(
        page,
        page.getByLabel("Objet de la demande"),
        REQUEST_SUBJECT,
      );
      await humanType(
        page,
        page.getByLabel("Volume ou besoin professionnel"),
        REQUEST_VOLUME,
      );
      await humanType(page, page.getByLabel("Message"), REQUEST_MESSAGE, {
        minimumDelay: 28,
        maximumDelay: 56,
      });

      await humanClick(
        page,
        page.getByRole("button", { name: "Envoyer la demande" }),
      );
      await expect(page).toHaveURL(/\/store\/requests\/[0-9a-f-]+$/i);
      await expect(page.getByText(REQUEST_SUBJECT)).toBeVisible();
    },
    {
      storageState: storeStorageState,
      startUrl: `${FRONTEND_URL}/products/${createdProductId}`,
      initialDelay: 1400,
      endDelay: 1500,
    },
  );
});

test("10 - request received", async ({ browser }) => {
  await recordScene(
    browser,
    "10-request-received",
    async (page) => {
      await expect(page.getByTestId("supplier-requests-page")).toBeVisible();

      const search = page.getByPlaceholder(
        "Rechercher un sujet, magasin, produit...",
      );
      await humanType(page, search, "jus pétillant");

      const requestCard = page
        .getByTestId("supplier-request-card")
        .filter({ hasText: REQUEST_SUBJECT });
      await expect(requestCard).toBeVisible();
      await pauseOn(page, requestCard, 1300);

      await humanClick(
        page,
        requestCard.getByRole("link", { name: "Consulter" }),
      );
      await expect(page).toHaveURL(/\/supplier\/requests\/[0-9a-f-]+$/i);
      await expect(page.getByText(REQUEST_SUBJECT)).toBeVisible();
    },
    {
      storageState: supplierStorageState,
      startUrl: `${FRONTEND_URL}/supplier/requests`,
      initialDelay: 1700,
      endDelay: 1500,
    },
  );
});
