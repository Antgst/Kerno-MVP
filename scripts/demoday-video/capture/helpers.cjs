const fs = require("node:fs");
const path = require("node:path");

const FRONTEND_URL = process.env.KERNO_FRONTEND_URL || "http://127.0.0.1:5173";
const OUTPUT_DIR = path.resolve(__dirname, "../output");
const TEMP_VIDEO_DIR = path.resolve(__dirname, "../.tmp/videos");

const pageMousePositions = new WeakMap();

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function easeInOutCubic(value) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function pointOnBezier(start, controlOne, controlTwo, end, progress) {
  const inverse = 1 - progress;
  const x =
    inverse ** 3 * start.x +
    3 * inverse ** 2 * progress * controlOne.x +
    3 * inverse * progress ** 2 * controlTwo.x +
    progress ** 3 * end.x;
  const y =
    inverse ** 3 * start.y +
    3 * inverse ** 2 * progress * controlOne.y +
    3 * inverse * progress ** 2 * controlTwo.y +
    progress ** 3 * end.y;

  return { x, y };
}

function cursorBootstrap() {
  const createCursor = () => {
    if (document.querySelector("[data-kerno-demo-cursor]")) {
      return;
    }

    const style = document.createElement("style");
    style.textContent = [
      "[data-kerno-demo-cursor] {",
      "position: fixed; left: 0; top: 0; width: 24px; height: 24px;",
      "z-index: 2147483647; pointer-events: none; transform: translate(-3px, -2px);",
      "filter: drop-shadow(0 3px 5px rgba(22, 78, 63, 0.3)); transition: opacity 120ms ease;",
      "}",
      "[data-kerno-demo-cursor]::before {",
      "content: ''; display: block; width: 18px; height: 24px; background: #F97316;",
      "clip-path: polygon(0 0, 0 100%, 27% 73%, 44% 100%, 58% 92%, 42% 66%, 78% 66%);",
      "border: 1.5px solid #F8F5EF; box-sizing: border-box;",
      "}",
      "[data-kerno-demo-click-ring] {",
      "position: fixed; width: 42px; height: 42px; border: 3px solid rgba(249, 115, 22, 0.9);",
      "border-radius: 999px; pointer-events: none; z-index: 2147483646;",
      "transform: translate(-50%, -50%) scale(0.35); animation: kerno-demo-click 520ms ease-out forwards;",
      "}",
      "@keyframes kerno-demo-click {",
      "0% { opacity: 1; transform: translate(-50%, -50%) scale(0.35); }",
      "100% { opacity: 0; transform: translate(-50%, -50%) scale(1.25); }",
      "}",
    ].join("\n");
    document.documentElement.appendChild(style);

    const cursor = document.createElement("div");
    cursor.setAttribute("data-kerno-demo-cursor", "true");
    cursor.style.opacity = "0";
    document.documentElement.appendChild(cursor);

    document.addEventListener(
      "mousemove",
      (event) => {
        cursor.style.opacity = "1";
        cursor.style.transform =
          "translate(" + (event.clientX - 3) + "px, " + (event.clientY - 2) + "px)";
      },
      true,
    );

    document.addEventListener(
      "click",
      (event) => {
        const ring = document.createElement("div");
        ring.setAttribute("data-kerno-demo-click-ring", "true");
        ring.style.left = event.clientX + "px";
        ring.style.top = event.clientY + "px";
        document.documentElement.appendChild(ring);
        window.setTimeout(() => ring.remove(), 560);
      },
      true,
    );
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createCursor, { once: true });
  } else {
    createCursor();
  }
}

async function installDemoCursor(context) {
  await context.addInitScript(cursorBootstrap);
}

async function humanMove(page, locator, options = {}) {
  const { duration = 620, targetOffsetX = 0, targetOffsetY = 0 } = options;

  await locator.waitFor({ state: "visible" });
  const box = await locator.boundingBox();

  if (!box) {
    throw new Error("Unable to determine target position for mouse movement.");
  }

  const viewport = page.viewportSize() || { width: 1920, height: 1080 };
  const current =
    pageMousePositions.get(page) || {
      x: Math.round(viewport.width * 0.72),
      y: Math.round(viewport.height * 0.72),
    };
  const end = {
    x: clamp(box.x + box.width / 2 + targetOffsetX, 8, viewport.width - 8),
    y: clamp(box.y + box.height / 2 + targetOffsetY, 8, viewport.height - 8),
  };
  const horizontalDistance = end.x - current.x;
  const verticalDistance = end.y - current.y;
  const controlOne = {
    x: current.x + horizontalDistance * 0.34,
    y: current.y + verticalDistance * 0.08 - 24,
  };
  const controlTwo = {
    x: current.x + horizontalDistance * 0.72,
    y: current.y + verticalDistance * 0.88 + 18,
  };
  const steps = Math.max(20, Math.round(duration / 22));

  for (let index = 1; index <= steps; index += 1) {
    const progress = easeInOutCubic(index / steps);
    const point = pointOnBezier(current, controlOne, controlTwo, end, progress);
    await page.mouse.move(point.x, point.y);
    await sleep(Math.max(8, Math.round(duration / steps)));
  }

  pageMousePositions.set(page, end);
}

async function smoothScrollTo(page, locator, options = {}) {
  const { offset = 170, duration = 920 } = options;
  await locator.waitFor({ state: "attached" });

  await locator.evaluate(
    (element, values) => {
      const start = window.scrollY;
      const target = Math.max(
        0,
        element.getBoundingClientRect().top + window.scrollY - values.offset,
      );
      const distance = target - start;
      const startTime = performance.now();

      const ease = (progress) =>
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      return new Promise((resolve) => {
        const tick = (time) => {
          const progress = Math.min((time - startTime) / values.duration, 1);
          window.scrollTo(0, start + distance * ease(progress));

          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            resolve();
          }
        };

        requestAnimationFrame(tick);
      });
    },
    { offset, duration },
  );

  await sleep(260);
}

async function humanClick(page, locator, options = {}) {
  const { preDelay = 260, postDelay = 520 } = options;

  await smoothScrollTo(page, locator, { offset: 210, duration: 680 }).catch(() => {});
  await humanMove(page, locator, options);
  await sleep(preDelay);
  await locator.click({ delay: 90 });
  await sleep(postDelay);
}

async function humanType(page, locator, text, options = {}) {
  const {
    clear = true,
    minimumDelay = 42,
    maximumDelay = 88,
    pauseAfter = 360,
  } = options;

  await humanClick(page, locator, { duration: 520, postDelay: 180 });

  if (clear) {
    await locator.press("Control+A");
    await locator.press("Backspace");
  }

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const variance = (character.charCodeAt(0) + index * 17) % 31;
    const delay =
      minimumDelay +
      Math.round((variance / 30) * (maximumDelay - minimumDelay));

    await page.keyboard.type(character, { delay });

    if (character === " " && index % 4 === 0) {
      await sleep(90);
    }
  }

  await sleep(pauseAfter);
}

async function pauseOn(page, locator, duration = 1200) {
  await smoothScrollTo(page, locator, { offset: 190, duration: 760 }).catch(() => {});
  await humanMove(page, locator, { duration: 560 }).catch(() => {});
  await sleep(duration);
}

async function createAuthState(browser, email, password) {
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    locale: "fr-FR",
  });
  const page = await context.newPage();

  await page.goto(`${FRONTEND_URL}/login`, { waitUntil: "domcontentloaded" });
  await page.getByLabel("Email professionnel").fill(email);
  await page.getByLabel("Mot de passe").fill(password);
  await page.getByRole("button", { name: "Se connecter" }).click();
  await page.waitForURL(/\/(supplier|store)\/dashboard$/);

  const storageState = await context.storageState();
  await context.close();
  return storageState;
}

async function recordScene(browser, sceneName, callback, options = {}) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.mkdirSync(TEMP_VIDEO_DIR, { recursive: true });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    screen: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    locale: "fr-FR",
    colorScheme: "light",
    reducedMotion: "no-preference",
    storageState: options.storageState,
    recordVideo: {
      dir: TEMP_VIDEO_DIR,
      size: { width: 1920, height: 1080 },
    },
  });

  await installDemoCursor(context);
  const page = await context.newPage();
  const video = page.video();

  try {
    const startUrl = options.startUrl || FRONTEND_URL;
    await page.goto(startUrl, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(options.initialDelay || 1100);
    await callback(page);
    await page.waitForTimeout(options.endDelay || 1200);
  } finally {
    await page.close();
    await context.close();
  }

  if (!video) {
    throw new Error(`No video was produced for scene ${sceneName}.`);
  }

  await video.saveAs(path.join(OUTPUT_DIR, `${sceneName}.webm`));
}

module.exports = {
  FRONTEND_URL,
  createAuthState,
  humanClick,
  humanMove,
  humanType,
  pauseOn,
  recordScene,
  sleep,
  smoothScrollTo,
};
