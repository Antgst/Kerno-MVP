#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const http = require("http");

const root = path.resolve(__dirname, "../..");
const envPath = path.join(root, "backend/.env");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(envPath);

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "local_security_smoke_secret";
}

const app = require(path.join(root, "backend/src/app"));

const results = [];

function record(name, ok, detail = "") {
  results.push({ name, ok, detail });
  const mark = ok ? "PASS" : "FAIL";
  console.log(`${mark} ${name}${detail ? ` — ${detail}` : ""}`);
}

async function request(baseUrl, method, route, body, token) {
  const headers = {
    Accept: "application/json",
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${baseUrl}${route}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  return {
    status: response.status,
    data,
  };
}

function expectStatus(name, actual, expectedStatuses) {
  const expected = Array.isArray(expectedStatuses)
    ? expectedStatuses
    : [expectedStatuses];

  const ok = expected.includes(actual.status);
  record(name, ok, `status ${actual.status}, expected ${expected.join("/")}`);

  if (!ok) {
    console.log(JSON.stringify(actual.data, null, 2));
  }

  return ok;
}

async function register(baseUrl, suffix, role) {
  const response = await request(baseUrl, "POST", "/auth/register", {
    email: `security-smoke-${suffix}-${role.toLowerCase()}@kerno.local`,
    password: "SecuritySmoke123!",
    role,
    firstName: "Security",
    lastName: suffix,
  });

  expectStatus(`register ${role} ${suffix}`, response, 201);

  return {
    user: response.data.user,
    token: response.data.token,
  };
}

async function createSupplierProfile(baseUrl, auth, suffix) {
  const response = await request(
    baseUrl,
    "POST",
    "/suppliers/profile",
    {
      companyName: `Supplier Smoke ${suffix}`,
      description: "Security smoke supplier",
      location: "Rennes",
      businessType: "Producteur",
      contactEmail: `supplier-${suffix}@kerno.local`,
      phone: "+33600000001",
      website: "https://example.local",
    },
    auth.token,
  );

  expectStatus(`create supplier profile ${suffix}`, response, 201);

  const profile =
    response.data.profile ||
    response.data.supplierProfile ||
    response.data.supplier;

  if (!profile) {
    console.log("Supplier profile response payload:");
    console.log(JSON.stringify(response.data, null, 2));
    throw new Error("Unable to find supplier profile in response payload");
  }

  return profile;
}

async function createStoreProfile(baseUrl, auth, suffix) {
  const response = await request(
    baseUrl,
    "POST",
    "/stores/profile",
    {
      storeName: `Store Smoke ${suffix}`,
      brandName: "Security Smoke",
      location: "Rennes",
      storeType: "Epicerie",
      sourcingNeeds: "Produits locaux",
      contactEmail: `store-${suffix}@kerno.local`,
      phone: "+33600000002",
    },
    auth.token,
  );

  expectStatus(`create store profile ${suffix}`, response, 201);

  const profile =
    response.data.profile ||
    response.data.storeProfile ||
    response.data.store;

  if (!profile) {
    console.log("Store profile response payload:");
    console.log(JSON.stringify(response.data, null, 2));
    throw new Error("Unable to find store profile in response payload");
  }

  return profile;
}

async function main() {
  const server = http.createServer(app);

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}/api`;
  const suffix = `${Date.now()}`;

  console.log(`Security smoke API base: ${baseUrl}`);

  try {
    const supplierA = await register(baseUrl, `${suffix}-a`, "SUPPLIER");
    const supplierB = await register(baseUrl, `${suffix}-b`, "SUPPLIER");
    const storeA = await register(baseUrl, `${suffix}-a`, "STORE");
    const storeB = await register(baseUrl, `${suffix}-b`, "STORE");

    const supplierProfileA = await createSupplierProfile(baseUrl, supplierA, `${suffix}-a`);
    const supplierProfileB = await createSupplierProfile(baseUrl, supplierB, `${suffix}-b`);
    await createStoreProfile(baseUrl, storeA, `${suffix}-a`);
    await createStoreProfile(baseUrl, storeB, `${suffix}-b`);

    expectStatus(
      "A07 no token cannot access /users/me",
      await request(baseUrl, "GET", "/users/me"),
      401,
    );

    expectStatus(
      "A07 invalid token cannot access /users/me",
      await request(baseUrl, "GET", "/users/me", undefined, "invalid.token.value"),
      401,
    );

    expectStatus(
      "A01 STORE cannot create product",
      await request(baseUrl, "POST", "/products", { name: "Forbidden Product" }, storeA.token),
      403,
    );

    expectStatus(
      "A01 SUPPLIER cannot create contact request",
      await request(
        baseUrl,
        "POST",
        "/requests",
        {
          supplierId: supplierProfileA.id,
          subject: "Forbidden request",
          message: "Supplier must not create requests",
        },
        supplierA.token,
      ),
      403,
    );

    const productA = await request(
      baseUrl,
      "POST",
      "/products",
      {
        supplierId: supplierProfileB.id,
        name: `Smoke Product ${suffix}`,
        description: "Created by supplier A",
        priceCents: 1200,
        priceUnit: "UNIT",
        minimumOrderQuantity: 1,
        minimumOrderUnit: "UNIT",
        origin: "France",
      },
      supplierA.token,
    );

    expectStatus("A01 SUPPLIER can create own product", productA, 201);

    const product = productA.data.product;

    record(
      "A08 payload supplierId is ignored on product creation",
      product.supplierId === supplierProfileA.id,
      `product supplierId=${product.supplierId}, expected=${supplierProfileA.id}`,
    );

    expectStatus(
      "A01 supplier B cannot update supplier A product",
      await request(baseUrl, "PUT", `/products/${product.id}`, { name: "Hijacked product" }, supplierB.token),
      404,
    );

    expectStatus(
      "A01 supplier B cannot deactivate supplier A product",
      await request(baseUrl, "DELETE", `/products/${product.id}`, undefined, supplierB.token),
      404,
    );

    expectStatus(
      "A08 product/supplier mismatch is rejected",
      await request(
        baseUrl,
        "POST",
        "/requests",
        {
          supplierId: supplierProfileB.id,
          productId: product.id,
          subject: "Mismatched product",
          message: "Product does not belong to this supplier",
        },
        storeA.token,
      ),
      404,
    );

    const requestA = await request(
      baseUrl,
      "POST",
      "/requests",
      {
        supplierId: supplierProfileA.id,
        productId: product.id,
        subject: "Smoke contact request",
        message: "Security ownership test",
        requestedQuantity: "10 colis",
      },
      storeA.token,
    );

    expectStatus("A01 STORE can create valid contact request", requestA, 201);

    const contactRequest = requestA.data.request;

    expectStatus(
      "A01 store A can read own request",
      await request(baseUrl, "GET", `/requests/${contactRequest.id}`, undefined, storeA.token),
      200,
    );

    expectStatus(
      "A01 supplier A can read received request",
      await request(baseUrl, "GET", `/requests/${contactRequest.id}`, undefined, supplierA.token),
      200,
    );

    expectStatus(
      "A01 store B cannot read store A request",
      await request(baseUrl, "GET", `/requests/${contactRequest.id}`, undefined, storeB.token),
      403,
    );

    expectStatus(
      "A01 supplier B cannot read supplier A request",
      await request(baseUrl, "GET", `/requests/${contactRequest.id}`, undefined, supplierB.token),
      403,
    );

    expectStatus(
      "A01 STORE cannot update request status",
      await request(baseUrl, "PATCH", `/requests/${contactRequest.id}/status`, { status: "ANSWERED" }, storeA.token),
      403,
    );

    expectStatus(
      "A01 supplier B cannot update supplier A request status",
      await request(baseUrl, "PATCH", `/requests/${contactRequest.id}/status`, { status: "ANSWERED" }, supplierB.token),
      404,
    );

    expectStatus(
      "A01 supplier A can update own received request status",
      await request(baseUrl, "PATCH", `/requests/${contactRequest.id}/status`, { status: "ANSWERED" }, supplierA.token),
      200,
    );

    expectStatus(
      "Public catalog product detail remains accessible",
      await request(baseUrl, "GET", `/products/${product.id}`),
      200,
    );

    const failed = results.filter((result) => !result.ok);

    console.log("");
    console.log("===== SECURITY SMOKE SUMMARY =====");
    console.log(`Passed: ${results.length - failed.length}`);
    console.log(`Failed: ${failed.length}`);

    if (failed.length) {
      process.exitCode = 1;
    }
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
