#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = process.cwd();

const now = new Date();
const pad = (n) => String(n).padStart(2, "0");
const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

const outputDir = path.join(root, "security-audit-reports", `KERNO-SECURITY-AUDIT-${stamp}`);
fs.mkdirSync(outputDir, { recursive: true });

function run(command, cwd = root) {
  const result = spawnSync(command, {
    cwd,
    shell: true,
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 20,
  });

  return {
    command,
    cwd: path.relative(root, cwd) || ".",
    status: result.status,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
  };
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function read(file) {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return "";
  }
}

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;

  const ignoredDirs = new Set([
    ".git",
    "node_modules",
    "dist",
    "build",
    "coverage",
    "generated",
    "security-audit-reports",
  ]);

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) {
        walk(full, files);
      }
      continue;
    }

    const ext = path.extname(entry.name);
    if ([".js", ".jsx", ".cjs", ".mjs", ".ts", ".tsx", ".prisma", ".example"].includes(ext) || entry.name.includes(".env")) {
      files.push(full);
    }
  }

  return files;
}

function rel(file) {
  return path.relative(root, file).replaceAll("\\", "/");
}

const scanTargets = [
  path.join(root, "backend/src"),
  path.join(root, "backend/prisma"),
  path.join(root, "frontend/src"),
];

const extraFiles = [
  "backend/.env.example",
  "frontend/.env.example",
  ".env.example",
  "package.json",
  "backend/package.json",
  "frontend/package.json",
]
  .map((file) => path.join(root, file))
  .filter(fs.existsSync);

const files = [
  ...scanTargets.flatMap((target) => walk(target)),
  ...extraFiles,
];

const rules = [
  {
    id: "SECRET_PRIVATE_KEY",
    owasp: "A04",
    severity: "CRITICAL",
    pattern: /-----BEGIN (RSA |EC |OPENSSH |)PRIVATE KEY-----/i,
    message: "Cl? priv?e d?tect?e.",
  },
  {
    id: "JWT_SECRET_HARDCODED",
    owasp: "A04",
    severity: "HIGH",
    pattern: /JWT_SECRET\s*[:=]\s*["'][^"']{8,}["']/i,
    message: "JWT_SECRET potentiellement hardcod?.",
  },
  {
    id: "DATABASE_URL_EXPOSED",
    owasp: "A04",
    severity: "HIGH",
    pattern: /DATABASE_URL\s*[:=]\s*["']?postgres(ql)?:\/\//i,
    message: "DATABASE_URL potentiellement expos?e.",
  },
  {
    id: "GENERIC_SECRET",
    owasp: "A04",
    severity: "MEDIUM",
    pattern: /(api[_-]?key|secret|token|password)\s*[:=]\s*["'][A-Za-z0-9_\-./+=]{16,}["']/i,
    message: "Secret/token/password potentiel. ? v?rifier manuellement.",
  },
  {
    id: "DANGEROUS_HTML",
    owasp: "A05",
    severity: "HIGH",
    pattern: /dangerouslySetInnerHTML/i,
    message: "Rendu HTML dangereux potentiel.",
  },
  {
    id: "RAW_SQL",
    owasp: "A05",
    severity: "HIGH",
    pattern: /\$queryRaw|\$executeRaw|queryRawUnsafe|executeRawUnsafe/i,
    message: "SQL brut Prisma d?tect?. V?rifier param?trage et validation.",
  },
  {
    id: "CORS_WILDCARD",
    owasp: "A02",
    severity: "HIGH",
    pattern: /origin\s*:\s*["']\*["']|Access-Control-Allow-Origin['"]?\s*,\s*['"]\*['"]/i,
    message: "CORS wildcard potentiel.",
  },
  {
    id: "SWAGGER_EXPOSED",
    owasp: "A02",
    severity: "LOW",
    pattern: /swaggerUi|swagger-ui-express|\/api-docs|\/docs/i,
    message: "Swagger/API docs d?tect?. V?rifier exposition en production.",
  },
  {
    id: "LOCAL_STORAGE_AUTH",
    owasp: "A07",
    severity: "MEDIUM",
    pattern: /localStorage\.(setItem|getItem|removeItem)|window\.localStorage/i,
    message: "localStorage d?tect?. V?rifier stockage token/session.",
  },
  {
    id: "FRONTEND_ROLE_LOGIC",
    owasp: "A01/A08",
    severity: "MEDIUM",
    pattern: /role\s*===|role\s*!==|user\.role|currentUser\.role/i,
    message: "Logique de r?le d?tect?e. V?rifier que le backend reste source de v?rit?.",
  },
  {
    id: "CONSOLE_LOG",
    owasp: "A09",
    severity: "LOW",
    pattern: /console\.(log|debug|trace|warn|error)\(/i,
    message: "Log console d?tect?. V?rifier absence de donn?es sensibles.",
  },
  {
    id: "STACK_TRACE",
    owasp: "A02/A10",
    severity: "MEDIUM",
    pattern: /err\.stack|error\.stack|stack:/i,
    message: "Stack trace potentiellement expos?e. V?rifier comportement production.",
  },
  {
    id: "TODO_SECURITY",
    owasp: "GENERAL",
    severity: "LOW",
    pattern: /TODO|FIXME|HACK|SECURITY|TEMP/i,
    message: "Marqueur TODO/FIXME/HACK/SECURITY/TEMP ? v?rifier.",
  },
];

const findings = [];

for (const file of files) {
  const content = read(file);
  const lines = content.split(/\r?\n/);

  lines.forEach((line, index) => {
    for (const rule of rules) {
      if (rule.pattern.test(line)) {
        const relativeFile = rel(file);

        if (
          rule.id === "RAW_SQL" &&
          relativeFile === "backend/prisma/seed.js"
        ) {
          continue;
        }

        if (
          ["JWT_SECRET_HARDCODED", "DATABASE_URL_EXPOSED", "GENERIC_SECRET"].includes(rule.id) &&
          relativeFile.endsWith(".env.example")
        ) {
          continue;
        }

        findings.push({
          owasp: rule.owasp,
          severity: rule.severity,
          rule: rule.id,
          file: rel(file),
          line: index + 1,
          message: rule.message,
          sample: line.trim().slice(0, 220),
        });
      }
    }
  });
}

function npmAudit(name, dir) {
  if (!fs.existsSync(path.join(dir, "package.json"))) {
    return {
      target: name,
      skipped: true,
      reason: "package.json absent",
    };
  }

  const result = run("npm audit --json", dir);
  let parsed = {};

  try {
    parsed = JSON.parse(result.stdout || "{}");
  } catch {
    parsed = {
      parseError: true,
      stdout: result.stdout,
      stderr: result.stderr,
    };
  }

  fs.writeFileSync(path.join(outputDir, `npm-audit-${name}.json`), JSON.stringify(parsed, null, 2));

  const vulns = parsed.metadata?.vulnerabilities || {};

  return {
    target: name,
    status: result.status,
    critical: vulns.critical || 0,
    high: vulns.high || 0,
    moderate: vulns.moderate || 0,
    low: vulns.low || 0,
    info: vulns.info || 0,
    total: vulns.total || 0,
  };
}

const npmAudits = [
  npmAudit("root", root),
  npmAudit("backend", path.join(root, "backend")),
  npmAudit("frontend", path.join(root, "frontend")),
];

const structure = [
  "backend/src/app.js",
  "backend/src/server.js",
  "backend/src/middlewares/auth.middleware.js",
  "backend/src/middlewares/error.middleware.js",
  "backend/src/middlewares/notFound.middleware.js",
  "frontend/src/components/layout/ProtectedRoute.jsx",
  "frontend/src/components/layout/RoleRoute.jsx",
  "frontend/src/services/tokenStorage.js",
  "backend/.env.example",
  "frontend/.env.example",
].map((file) => ({
  file,
  exists: exists(file),
}));

const git = {
  branch: run("git branch --show-current").stdout.trim(),
  status: run("git status --short").stdout.trim(),
  lastCommit: run("git log -1 --oneline").stdout.trim(),
};

const reportJson = {
  generatedAt: now.toISOString(),
  git,
  npmAudits,
  structure,
  findings,
};

fs.writeFileSync(path.join(outputDir, "findings.json"), JSON.stringify(reportJson, null, 2));

function table(headers, rows) {
  const head = `| ${headers.join(" | ")} |`;
  const sep = `| ${headers.map(() => "---").join(" | ")} |`;
  const body = rows.map((row) => `| ${headers.map((h) => String(row[h] ?? "").replace(/\n/g, " ")).join(" | ")} |`);
  return [head, sep, ...body].join("\n");
}

const severityCount = findings.reduce((acc, finding) => {
  acc[finding.severity] = (acc[finding.severity] || 0) + 1;
  return acc;
}, {});

let md = "";

md += "# KERNO Security Audit Report\n\n";
md += `Generated: ${now.toISOString()}\n\n`;

md += "## Git context\n\n";
md += `- Branch: \`${git.branch || "unknown"}\`\n`;
md += `- Last commit: \`${git.lastCommit || "unknown"}\`\n`;
md += `- Working tree: ${git.status ? "not clean" : "clean"}\n\n`;

if (git.status) {
  md += "```txt\n" + git.status + "\n```\n\n";
}

md += "## NPM audit summary\n\n";
md += table(
  ["target", "status", "critical", "high", "moderate", "low", "total"],
  npmAudits.map((audit) => ({
    target: audit.target,
    status: audit.skipped ? "skipped" : audit.status,
    critical: audit.critical ?? "-",
    high: audit.high ?? "-",
    moderate: audit.moderate ?? "-",
    low: audit.low ?? "-",
    total: audit.total ?? "-",
  }))
);
md += "\n\n";

md += "## Structure checks\n\n";
md += table(
  ["file", "exists"],
  structure.map((item) => ({
    file: item.file,
    exists: item.exists ? "yes" : "no",
  }))
);
md += "\n\n";

md += "## Static findings summary\n\n";
md += `- Critical: ${severityCount.CRITICAL || 0}\n`;
md += `- High: ${severityCount.HIGH || 0}\n`;
md += `- Medium: ${severityCount.MEDIUM || 0}\n`;
md += `- Low: ${severityCount.LOW || 0}\n\n`;

md += "## OWASP static findings count\n\n";
for (const key of ["A01", "A02", "A03", "A04", "A05", "A06", "A07", "A08", "A09", "A10"]) {
  const count = findings.filter((finding) => String(finding.owasp).includes(key)).length;
  md += `- ${key}: ${count}\n`;
}
md += "\n";

md += "## Findings\n\n";

if (!findings.length) {
  md += "No static finding detected by this V1 script.\n\n";
} else {
  const grouped = findings.reduce((acc, finding) => {
    acc[finding.owasp] ||= [];
    acc[finding.owasp].push(finding);
    return acc;
  }, {});

  for (const [owasp, items] of Object.entries(grouped)) {
    md += `### ${owasp}\n\n`;

    for (const item of items) {
      md += `#### ${item.severity} ? ${item.rule}\n\n`;
      md += `- File: \`${item.file}:${item.line}\`\n`;
      md += `- Message: ${item.message}\n`;
      md += "- Sample:\n\n";
      md += "```txt\n" + item.sample + "\n```\n\n";
    }
  }
}

md += "## Manual follow-up priorities\n\n";
md += "1. A01 / A07 / A08 ? tester r?les supplier/store, IDs et payloads manipul?s.\n";
md += "2. A02 / A04 / A10 ? v?rifier CORS, secrets, erreurs et stack traces.\n";
md += "3. A03 ? traiter npm audit sans `--force` automatique.\n";
md += "4. A05 ? tester formulaires, recherche, profils, produits et demandes avec payloads simples.\n";
md += "5. A09 ? nettoyer logs sensibles ?ventuels.\n\n";

md += "## Notes\n\n";
md += "Ce rapport est un audit blanc automatis? read-only. Il ne remplace pas un pentest manuel.\n";

fs.writeFileSync(path.join(outputDir, "report.md"), md);

console.log("");
console.log("===== KERNO SECURITY AUDIT DONE =====");
console.log(`Report folder: ${rel(outputDir)}`);
console.log(`Markdown report: ${rel(path.join(outputDir, "report.md"))}`);
console.log(`JSON findings: ${rel(path.join(outputDir, "findings.json"))}`);
console.log("");
console.log("Static findings:");
console.log(`- Critical: ${severityCount.CRITICAL || 0}`);
console.log(`- High: ${severityCount.HIGH || 0}`);
console.log(`- Medium: ${severityCount.MEDIUM || 0}`);
console.log(`- Low: ${severityCount.LOW || 0}`);
console.log("");
