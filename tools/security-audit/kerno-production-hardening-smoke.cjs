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

process.env.NODE_ENV = "production";
process.env.JWT_SECRET = process.env.JWT_SECRET || "local_security_hardening_secret";
process.env.CORS_ORIGIN = "http://allowed.kerno.local";
delete process.env.ENABLE_API_DOCS;

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://placeholder:placeholder@127.0.0.1:5432/placeholder";
}

const app = require(path.join(root, "backend/src/app"));

const results = [];

function record(name, ok, detail = "") {
  results.push({ name, ok, detail });
  const mark = ok ? "PASS" : "FAIL";
  console.log(`${mark} ${name}${detail ? ` — ${detail}` : ""}`);
}

async function request(baseUrl, route, options = {}) {
  const headers = {
    Accept: "application/json",
  };

  if (options.origin) {
    headers.Origin = options.origin;
  }

  if (options.contentType) {
    headers["Content-Type"] = options.contentType;
  }

  const response = await fetch(`${baseUrl}${route}`, {
    method: options.method || "GET",
    headers,
    body: options.rawBody,
  });

  const text = await response.text();

  return {
    status: response.status,
    headers: response.headers,
    text,
  };
}

async function main() {
  const server = http.createServer(app);

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}/api`;

  try {
    const openapi = await request(baseUrl, "/openapi.json");
    record(
      "A02 OpenAPI JSON disabled in production by default",
      openapi.status === 404,
      `status ${openapi.status}, expected 404`,
    );

    const docs = await request(baseUrl, "/docs");
    record(
      "A02 Swagger UI disabled in production by default",
      docs.status === 404,
      `status ${docs.status}, expected 404`,
    );

    const allowedCors = await request(baseUrl, "/health", {
      origin: "http://allowed.kerno.local",
    });

    record(
      "A02 allowed CORS origin receives allow-origin header",
      allowedCors.headers.get("access-control-allow-origin") === "http://allowed.kerno.local",
      `header=${allowedCors.headers.get("access-control-allow-origin")}`,
    );

    const deniedCors = await request(baseUrl, "/health", {
      origin: "http://denied.kerno.local",
    });

    record(
      "A02 denied CORS origin receives no allow-origin header",
      !deniedCors.headers.get("access-control-allow-origin"),
      `header=${deniedCors.headers.get("access-control-allow-origin")}`,
    );

    const invalidJson = await request(baseUrl, "/auth/login", {
      method: "POST",
      origin: "http://allowed.kerno.local",
      contentType: "application/json",
      rawBody: "{",
    });

    record(
      "A10 invalid JSON returns controlled 400 response",
      invalidJson.status === 400 && invalidJson.text.includes("Invalid JSON payload"),
      `status ${invalidJson.status}, body=${invalidJson.text}`,
    );

    const failed = results.filter((result) => !result.ok);

    console.log("");
    console.log("===== PRODUCTION HARDENING SUMMARY =====");
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
