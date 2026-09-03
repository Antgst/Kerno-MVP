const { afterEach, test } = require("node:test");
const assert = require("node:assert/strict");

const prismaModulePath = require.resolve("../src/lib/prisma");
const serviceModulePath = require.resolve(
  "../src/modules/requests/requests.service",
);

function loadRequestsService(prismaMock) {
  delete require.cache[serviceModulePath];
  require.cache[prismaModulePath] = {
    id: prismaModulePath,
    filename: prismaModulePath,
    loaded: true,
    exports: prismaMock,
  };

  return require(serviceModulePath);
}

function unloadRequestsService() {
  delete require.cache[serviceModulePath];
  delete require.cache[prismaModulePath];
}

afterEach(unloadRequestsService);

test("createContactRequest validates the target then persists a PENDING request", async () => {
  let createdData;

  const prismaMock = {
    storeProfile: {
      findUnique: async () => ({ id: "store-1" }),
    },
    supplierProfile: {
      findUnique: async () => ({ id: "supplier-1" }),
    },
    product: {
      findFirst: async () => ({ id: "product-1" }),
    },
    contactRequest: {
      create: async ({ data }) => {
        createdData = data;
        return {
          id: "request-1",
          ...data,
          createdAt: new Date("2026-09-03T12:00:00Z"),
          updatedAt: new Date("2026-09-03T12:00:00Z"),
          store: { id: "store-1", storeName: "Store" },
          supplier: { id: "supplier-1", companyName: "Supplier" },
          product: { id: "product-1", name: "Product" },
        };
      },
    },
  };

  const service = loadRequestsService(prismaMock);
  const result = await service.createContactRequest("user-store", {
    supplierId: "supplier-1",
    productId: "product-1",
    subject: "  Besoin produit  ",
    message: "  Bonjour fournisseur  ",
    requestedQuantity: " 10 palettes ",
  });

  assert.deepEqual(createdData, {
    storeId: "store-1",
    supplierId: "supplier-1",
    productId: "product-1",
    subject: "Besoin produit",
    message: "Bonjour fournisseur",
    requestedQuantity: "10 palettes",
    status: "PENDING",
  });
  assert.equal(result.id, "request-1");
  assert.equal(result.status, "PENDING");
});

test("createContactRequest rejects a product that does not belong to the supplier", async () => {
  const prismaMock = {
    storeProfile: {
      findUnique: async () => ({ id: "store-1" }),
    },
    supplierProfile: {
      findUnique: async () => ({ id: "supplier-1" }),
    },
    product: {
      findFirst: async () => null,
    },
    contactRequest: {
      create: async () => assert.fail("request must not be created"),
    },
  };

  const service = loadRequestsService(prismaMock);

  await assert.rejects(
    service.createContactRequest("user-store", {
      supplierId: "supplier-1",
      productId: "product-other",
      subject: "Besoin produit",
      message: "Bonjour",
    }),
    (error) => {
      assert.equal(error.statusCode, 404);
      assert.match(error.message, /Product not found for this supplier/);
      return true;
    },
  );
});

test("getRequestById blocks a store that does not own the request", async () => {
  const prismaMock = {
    contactRequest: {
      findUnique: async () => ({
        id: "request-1",
        storeId: "store-other",
        supplierId: "supplier-1",
        productId: null,
        subject: "Sujet",
        message: "Message",
        requestedQuantity: null,
        status: "PENDING",
        createdAt: new Date("2026-09-03T12:00:00Z"),
        updatedAt: new Date("2026-09-03T12:00:00Z"),
      }),
    },
    storeProfile: {
      findUnique: async () => ({ id: "store-current" }),
    },
  };

  const service = loadRequestsService(prismaMock);

  await assert.rejects(
    service.getRequestById("user-store", "STORE", "request-1"),
    (error) => {
      assert.equal(error.statusCode, 403);
      assert.match(error.message, /does not belong to your store/);
      return true;
    },
  );
});

test("updateRequestStatus normalizes an allowed status for the destination supplier", async () => {
  let updatedStatus;

  const prismaMock = {
    supplierProfile: {
      findUnique: async () => ({ id: "supplier-1" }),
    },
    contactRequest: {
      findFirst: async () => ({ id: "request-1", supplierId: "supplier-1" }),
      update: async ({ data }) => {
        updatedStatus = data.status;
        return {
          id: "request-1",
          storeId: "store-1",
          supplierId: "supplier-1",
          productId: null,
          subject: "Sujet",
          message: "Message",
          requestedQuantity: null,
          status: data.status,
          createdAt: new Date("2026-09-03T12:00:00Z"),
          updatedAt: new Date("2026-09-03T12:05:00Z"),
        };
      },
    },
  };

  const service = loadRequestsService(prismaMock);
  const result = await service.updateRequestStatus(
    "user-supplier",
    "request-1",
    { status: " answered " },
  );

  assert.equal(updatedStatus, "ANSWERED");
  assert.equal(result.status, "ANSWERED");
});
