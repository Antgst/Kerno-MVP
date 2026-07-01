#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

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

async function main() {
  loadEnvFile(envPath);

  const prisma = require(path.join(root, "backend/src/lib/prisma"));

  const users = await prisma.user.findMany({
    where: {
      email: {
        startsWith: "security-smoke-",
      },
    },
    select: {
      id: true,
      email: true,
    },
  });

  const userIds = users.map((user) => user.id);

  if (!userIds.length) {
    console.log("No security smoke data found.");
    await prisma.$disconnect();
    return;
  }

  const supplierProfiles = await prisma.supplierProfile.findMany({
    where: {
      userId: {
        in: userIds,
      },
    },
    select: {
      id: true,
    },
  });

  const storeProfiles = await prisma.storeProfile.findMany({
    where: {
      userId: {
        in: userIds,
      },
    },
    select: {
      id: true,
    },
  });

  const supplierProfileIds = supplierProfiles.map((profile) => profile.id);
  const storeProfileIds = storeProfiles.map((profile) => profile.id);

  const products = await prisma.product.findMany({
    where: {
      supplierId: {
        in: supplierProfileIds,
      },
    },
    select: {
      id: true,
    },
  });

  const productIds = products.map((product) => product.id);

  const deletedRequests = await prisma.contactRequest.deleteMany({
    where: {
      OR: [
        {
          supplierId: {
            in: supplierProfileIds,
          },
        },
        {
          storeId: {
            in: storeProfileIds,
          },
        },
        {
          productId: {
            in: productIds,
          },
        },
      ],
    },
  });

  const deletedProducts = await prisma.product.deleteMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  const deletedSupplierProfiles = await prisma.supplierProfile.deleteMany({
    where: {
      id: {
        in: supplierProfileIds,
      },
    },
  });

  const deletedStoreProfiles = await prisma.storeProfile.deleteMany({
    where: {
      id: {
        in: storeProfileIds,
      },
    },
  });

  const deletedUsers = await prisma.user.deleteMany({
    where: {
      id: {
        in: userIds,
      },
    },
  });

  console.log("===== SECURITY SMOKE CLEANUP DONE =====");
  console.log(`Users deleted: ${deletedUsers.count}`);
  console.log(`Supplier profiles deleted: ${deletedSupplierProfiles.count}`);
  console.log(`Store profiles deleted: ${deletedStoreProfiles.count}`);
  console.log(`Products deleted: ${deletedProducts.count}`);
  console.log(`Contact requests deleted: ${deletedRequests.count}`);

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
