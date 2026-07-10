(function initKernoFeatureDemos(global) {
  const WIDTH = 503;
  const HEIGHT = 494;
  const DURATION_MS = 2400;

  function easeOutCubic(value) {
    return 1 - Math.pow(1 - value, 3);
  }

  function easeInOut(value) {
    return value < 0.5
      ? 2 * value * value
      : 1 - Math.pow(-2 * value + 2, 2) / 2;
  }

  function roundRect(ctx, x, y, width, height, radius) {
    const safeRadius = Math.min(radius, width / 2, height / 2);

    ctx.beginPath();
    ctx.moveTo(x + safeRadius, y);
    ctx.arcTo(x + width, y, x + width, y + height, safeRadius);
    ctx.arcTo(x + width, y + height, x, y + height, safeRadius);
    ctx.arcTo(x, y + height, x, y, safeRadius);
    ctx.arcTo(x, y, x + width, y, safeRadius);
    ctx.closePath();
  }

  function fillRoundRect(ctx, x, y, width, height, radius, fillStyle) {
    ctx.fillStyle = fillStyle;
    roundRect(ctx, x, y, width, height, radius);
    ctx.fill();
  }

  function strokeRoundRect(ctx, x, y, width, height, radius, strokeStyle, lineWidth = 1) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    roundRect(ctx, x, y, width, height, radius);
    ctx.stroke();
  }

  function drawText(ctx, text, x, y, options = {}) {
    ctx.fillStyle = options.color || "#ffffff";
    ctx.font = `${options.weight || 700} ${options.size || 16}px Inter, Arial, sans-serif`;
    ctx.textAlign = options.align || "left";
    ctx.textBaseline = options.baseline || "alphabetic";
    ctx.fillText(text, x, y);
  }

  function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, options = {}) {
    const words = text.split(" ");
    let line = "";
    let currentY = y;

    words.forEach((word) => {
      const testLine = line ? `${line} ${word}` : word;

      if (ctx.measureText(testLine).width > maxWidth && line) {
        drawText(ctx, line, x, currentY, options);
        line = word;
        currentY += lineHeight;
        return;
      }

      line = testLine;
    });

    if (line) {
      drawText(ctx, line, x, currentY, options);
    }
  }

  function drawBackground(ctx) {
    const background = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
    background.addColorStop(0, "#f8f3e8");
    background.addColorStop(0.48, "#eee7d8");
    background.addColorStop(1, "#d6ebe2");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    const warmGlow = ctx.createRadialGradient(80, 44, 8, 80, 44, 330);
    warmGlow.addColorStop(0, "rgba(255, 252, 244, 0.78)");
    warmGlow.addColorStop(1, "rgba(255, 252, 244, 0)");
    ctx.fillStyle = warmGlow;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    const greenGlow = ctx.createRadialGradient(420, 430, 12, 420, 430, 300);
    greenGlow.addColorStop(0, "rgba(214, 235, 226, 0.7)");
    greenGlow.addColorStop(1, "rgba(214, 235, 226, 0)");
    ctx.fillStyle = greenGlow;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }

  function drawProfileFeature(ctx, progress) {
    const valueProgress = easeOutCubic(Math.min(progress / 0.78, 1));
    const percent = Math.round(76 + valueProgress * 24);
    const pulse = Math.sin(progress * Math.PI * 2) * 0.5 + 0.5;
    const cardY = 103;
    const cardHeight = 288;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawBackground(ctx);

    const cardGradient = ctx.createLinearGradient(5, cardY, 498, cardY + cardHeight);
    cardGradient.addColorStop(0, "#124b3d");
    cardGradient.addColorStop(1, "#0b3b33");
    fillRoundRect(ctx, 5, cardY, 493, cardHeight, 12, cardGradient);

    const centerX = WIDTH / 2;
    const centerY = cardY + 160;
    const cardGlow = ctx.createRadialGradient(centerX, centerY, 18, centerX, centerY, 170);
    cardGlow.addColorStop(0, "rgba(214, 235, 226, 0.18)");
    cardGlow.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.save();
    roundRect(ctx, 5, cardY, 493, cardHeight, 12);
    ctx.clip();
    ctx.fillStyle = cardGlow;
    ctx.fillRect(5, cardY, 493, cardHeight);
    ctx.restore();
    strokeRoundRect(ctx, 5.5, cardY + 0.5, 492, cardHeight - 1, 12, "rgba(214, 235, 226, 0.58)", 1);

    drawText(ctx, "Complete supplier profile", 20, cardY + 35, {
      size: 20,
      weight: 800,
    });
    drawWrappedText(
      ctx,
      "Your information is visible to stores browsing your business or your products.",
      20,
      cardY + 58,
      452,
      19,
      {
        size: 16,
        weight: 700,
      },
    );

    const radius = 44 + pulse * 1.3;
    const ringProgress = percent / 100;

    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.28)";
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 8;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 10, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(17, 63, 52, 0.76)";
    ctx.fill();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(248, 245, 239, 0.25)";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ringProgress);
    ctx.strokeStyle = "#d6ebe2";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.stroke();

    drawText(ctx, `${percent}%`, centerX, centerY + 7, {
      align: "center",
      color: "#ffffff",
      size: 22,
      weight: 900,
    });

    fillRoundRect(ctx, 32, cardY + 232, 438, 36, 7, "#f4f5f4");
    strokeRoundRect(ctx, 32.5, cardY + 232.5, 437, 35, 7, "rgba(255, 255, 255, 0.7)", 1);

    ctx.strokeStyle = "#164e3f";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(197, cardY + 249, 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(190, cardY + 259);
    ctx.quadraticCurveTo(197, cardY + 252, 204, cardY + 259);
    ctx.stroke();

    drawText(ctx, "Edit profile", 215, cardY + 257, {
      color: "#064236",
      size: 17,
      weight: 850,
    });
  }

  function drawCatalogCard(ctx, product, x, y, width, height, progress, delay) {
    const local = Math.max(0, Math.min((progress - delay) / 0.42, 1));
    const lift = easeOutCubic(local) * 9;
    const alpha = 0.35 + easeOutCubic(local) * 0.65;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(0, 9 - lift);
    fillRoundRect(ctx, x, y, width, height, 13, "#ffffff");
    strokeRoundRect(ctx, x + 0.5, y + 0.5, width - 1, height - 1, 13, "#d7ded9", 1);

    const visualGradient = ctx.createLinearGradient(x, y, x + width, y + 80);
    visualGradient.addColorStop(0, product.colorA);
    visualGradient.addColorStop(1, product.colorB);
    fillRoundRect(ctx, x + 10, y + 10, width - 20, 104, 10, visualGradient);

    ctx.fillStyle = "rgba(255, 255, 255, 0.56)";
    ctx.beginPath();
    ctx.arc(x + width * 0.55, y + 64, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + width * 0.72, y + 72, 13, 0, Math.PI * 2);
    ctx.fill();

    fillRoundRect(ctx, x + 16, y + 18, 72, 21, 10, "#e1f3ed");
    drawText(ctx, "Available", x + 24, y + 32, {
      color: "#164e3f",
      size: 9,
      weight: 800,
    });

    drawText(ctx, product.price, x + 12, y + 141, {
      color: "#f97316",
      size: 12,
      weight: 850,
    });
    drawText(ctx, product.name, x + 12, y + 164, {
      color: "#183a34",
      size: 13,
      weight: 850,
    });
    drawText(ctx, product.supplier, x + 12, y + 189, {
      color: "#68716e",
      size: 10,
      weight: 650,
    });
    ctx.restore();
  }

  function drawCatalogFeature(ctx, progress) {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawBackground(ctx);

    fillRoundRect(ctx, 11, 12, 481, 468, 14, "rgba(255, 255, 255, 0.96)");
    strokeRoundRect(ctx, 11.5, 12.5, 480, 467, 14, "#d8d6ce", 1);

    drawText(ctx, "Product catalog", 27, 43, {
      color: "#173b34",
      size: 21,
      weight: 850,
    });
    drawText(ctx, "Active products", 328, 42, {
      color: "#68716e",
      size: 11,
      weight: 700,
    });
    drawText(ctx, "128", 455, 43, {
      align: "right",
      color: "#164e3f",
      size: 21,
      weight: 900,
    });

    fillRoundRect(ctx, 27, 57, 246, 34, 10, "#f8f7f3");
    strokeRoundRect(ctx, 27.5, 57.5, 245, 33, 10, "#dedbd3", 1);
    ctx.strokeStyle = "#77766e";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(45, 74, 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(50, 79);
    ctx.lineTo(56, 84);
    ctx.stroke();
    drawText(ctx, "honey, juice, biscuits...", 67, 79, {
      color: "#7d8581",
      size: 12,
      weight: 650,
    });

    fillRoundRect(ctx, 287, 57, 78, 34, 10, "#e1f3ed");
    drawText(ctx, "Local", 326, 79, {
      align: "center",
      color: "#164e3f",
      size: 12,
      weight: 800,
    });
    fillRoundRect(ctx, 374, 57, 91, 34, 10, "#fff4e7");
    drawText(ctx, "In stock", 419, 79, {
      align: "center",
      color: "#c2410c",
      size: 12,
      weight: 800,
    });

    const products = [
      {
        name: "Wildflower honey",
        supplier: "Rucher du Golfe",
        price: "€8.90 / kg",
        colorA: "#f8c875",
        colorB: "#f97316",
      },
      {
        name: "Apple juice",
        supplier: "Verger Kervran",
        price: "€3.40 / L",
        colorA: "#d6ebe2",
        colorB: "#7fac65",
      },
      {
        name: "Strawberry jam",
        supplier: "Atelier Breizh",
        price: "€4.20 / pack",
        colorA: "#f4e0bf",
        colorB: "#9d6b3f",
      },
      {
        name: "Farmhouse cider",
        supplier: "Vergers Keravel",
        price: "€2.90 / L",
        colorA: "#f8e1a2",
        colorB: "#c58637",
      },
      {
        name: "Farmhouse tomme",
        supplier: "Ferme du Menez",
        price: "€12.80 / kg",
        colorA: "#f4e7c2",
        colorB: "#d9a441",
      },
      {
        name: "Strawberry jam",
        supplier: "Maison Liorzh",
        price: "€5.10 / jar",
        colorA: "#f4b3b3",
        colorB: "#c94c4c",
      },
    ];

    ctx.save();
    roundRect(ctx, 12, 12, 479, 468, 14);
    ctx.clip();

    products.slice(0, 3).forEach((product, index) => {
      drawCatalogCard(ctx, product, 27 + index * 153, 102, 135, 206, progress, index * 0.09);
    });

    products.slice(3).forEach((product, index) => {
      drawCatalogCard(ctx, product, 27 + index * 153, 326, 135, 206, progress, 0.24 + index * 0.09);
    });

    ctx.restore();
  }

  function drawRequestRow(ctx, request, x, y, width, height, progress, delay) {
    const local = Math.max(0, Math.min((progress - delay) / 0.36, 1));
    const offset = (1 - easeOutCubic(local)) * 34;

    ctx.save();
    ctx.globalAlpha = 0.25 + local * 0.75;
    ctx.translate(offset, 0);
    fillRoundRect(ctx, x, y, width, height, 12, request.background);
    strokeRoundRect(ctx, x + 0.5, y + 0.5, width - 1, height - 1, 12, request.border, 1);

    fillRoundRect(ctx, x, y, 7, height, 4, request.accent);
    fillRoundRect(ctx, x + 20, y + 26, 38, 38, 10, request.iconBg);

    ctx.strokeStyle = request.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(x + 31, y + 39, 16, 12);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 31, y + 39);
    ctx.lineTo(x + 39, y + 46);
    ctx.lineTo(x + 47, y + 39);
    ctx.stroke();

    drawText(ctx, request.title, x + 76, y + 36, {
      color: "#1b302e",
      size: 15,
      weight: 850,
    });
    drawText(ctx, request.detail, x + 76, y + 59, {
      color: "#68716e",
      size: 12,
      weight: 650,
    });

    fillRoundRect(ctx, x + width - 113, y + 31, 88, 27, 13, request.statusBg);
    drawText(ctx, request.status, x + width - 69, y + 49, {
      align: "center",
      color: request.accent,
      size: 10,
      weight: 850,
    });
    ctx.restore();
  }

  function drawRequestsFeature(ctx, progress) {
    const counterProgress = easeOutCubic(Math.min(progress / 0.72, 1));
    const counter = Math.round(2 + counterProgress * 5);

    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawBackground(ctx);

    fillRoundRect(ctx, 12, 12, 479, 468, 14, "#fdfcf9");
    strokeRoundRect(ctx, 12.5, 12.5, 478, 467, 14, "#d8d6ce", 1);

    drawText(ctx, "Requests received", 28, 43, {
      color: "#173b34",
      size: 21,
      weight: 850,
    });

    fillRoundRect(ctx, 360, 23, 106, 35, 12, "#fff4e7");

    const counterText = `${counter}`;
    const counterGap = 8;
    ctx.font = "900 22px Inter, Arial, sans-serif";
    const counterWidth = ctx.measureText(counterText).width;
    ctx.font = "750 11px Inter, Arial, sans-serif";
    const counterLabelWidth = ctx.measureText("pending").width;
    const counterGroupX = 413 - (counterWidth + counterGap + counterLabelWidth) / 2;

    drawText(ctx, counterText, counterGroupX, 46, {
      color: "#c2410c",
      size: 22,
      weight: 900,
    });
    drawText(ctx, "pending", counterGroupX + counterWidth + counterGap, 44, {
      color: "#7c6859",
      size: 11,
      weight: 750,
    });

    const requests = [
      {
        title: "Fresh cheese restock",
        detail: "Maison Rivage — 24 units for Friday",
        status: "Pending",
        accent: "#f97316",
        border: "rgba(249, 115, 22, 0.28)",
        background: "#fffaf5",
        iconBg: "#fff1df",
        statusBg: "#fff1df",
      },
      {
        title: "Wildflower honey order",
        detail: "Epicerie du Port — 18 kg confirmed",
        status: "Accepted",
        accent: "#164e3f",
        border: "rgba(22, 78, 63, 0.24)",
        background: "#f6fbf8",
        iconBg: "#e1f3ed",
        statusBg: "#e1f3ed",
      },
      {
        title: "Buckwheat biscuits quote",
        detail: "Comptoir Local — trade price requested",
        status: "Processed",
        accent: "#0b2d4d",
        border: "rgba(11, 45, 77, 0.22)",
        background: "#f6fafc",
        iconBg: "#e6f1f6",
        statusBg: "#e6f1f6",
      },
      {
        title: "Apple juice restock",
        detail: "Halles Carnot — 36 bottles requested",
        status: "Pending",
        accent: "#f97316",
        border: "rgba(249, 115, 22, 0.28)",
        background: "#fffaf5",
        iconBg: "#fff1df",
        statusBg: "#fff1df",
      },
    ];

    ctx.save();
    roundRect(ctx, 12, 12, 479, 468, 14);
    ctx.clip();

    requests.forEach((request, index) => {
      drawRequestRow(ctx, request, 28, 78 + index * 104, 447, 86, progress, index * 0.1);
    });

    ctx.restore();
  }

  function drawScene(ctx, featureId, progress) {
    if (featureId === "catalog") {
      drawCatalogFeature(ctx, progress);
      return;
    }

    if (featureId === "requests") {
      drawRequestsFeature(ctx, progress);
      return;
    }

    drawProfileFeature(ctx, progress);
  }

  function prepareCanvas(canvas, options = {}) {
    const pixelRatio = options.pixelRatio || Math.min(global.devicePixelRatio || 1, 2);
    canvas.width = WIDTH * pixelRatio;
    canvas.height = HEIGHT * pixelRatio;

    if (!canvas.style.width) {
      canvas.style.width = "100%";
    }

    if (!canvas.style.maxWidth) {
      canvas.style.maxWidth = `${WIDTH}px`;
    }

    if (!canvas.style.height) {
      canvas.style.height = "auto";
    }

    if (!canvas.style.aspectRatio) {
      canvas.style.aspectRatio = `${WIDTH} / ${HEIGHT}`;
    }

    const ctx = canvas.getContext("2d");
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    return ctx;
  }

  function init(canvas, featureId, options = {}) {
    const ctx = prepareCanvas(canvas, options);
    const selectedFeature = featureId || canvas.dataset.kernoFeature || canvas.dataset.feature || "profile";
    const shouldAnimate =
      options.animate !== false &&
      canvas.dataset.kernoAnimate !== "false" &&
      !(
        options.respectReducedMotion !== false &&
        global.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches
      );
    let frameId = 0;
    let startedAt = 0;

    // Runs the animation from 0 to 1 exactly once, then holds the final
    // frame instead of looping — no `% DURATION_MS` wraparound.
    function render(now) {
      const progress = Math.min((now - startedAt) / DURATION_MS, 1);
      drawScene(ctx, selectedFeature, progress);

      if (progress < 1) {
        frameId = global.requestAnimationFrame(render);
      } else {
        frameId = 0;
      }
    }

    function stop() {
      if (frameId) {
        global.cancelAnimationFrame(frameId);
        frameId = 0;
      }
    }

    function start() {
      if (!shouldAnimate) return;
      stop();
      startedAt = performance.now();
      frameId = global.requestAnimationFrame(render);
    }

    // Puts the demo back to its pre-animation frame, used when the panel
    // it belongs to is hidden again (e.g. switching feature tabs).
    function reset() {
      if (!shouldAnimate) return;
      stop();
      drawScene(ctx, selectedFeature, 0);
    }

    if (shouldAnimate) {
      drawScene(ctx, selectedFeature, 0);
    } else {
      drawScene(ctx, selectedFeature, Number(canvas.dataset.kernoProgress || options.progress || 0.72));
    }

    return {
      canvas,
      featureId: selectedFeature,
      draw(progress) {
        drawScene(ctx, selectedFeature, progress);
      },
      start,
      stop,
      reset,
    };
  }

  const registry = new Map();

  function play(featureId) {
    registry.get(featureId)?.start();
  }

  function resetFeature(featureId) {
    registry.get(featureId)?.reset();
  }

  function initAll(root = document) {
    const controls = Array.from(root.querySelectorAll("canvas[data-kerno-feature], canvas[data-feature]"))
      .filter((canvas) => canvas.dataset.kernoMounted !== "true")
      .map((canvas) => {
        canvas.dataset.kernoMounted = "true";
        const control = init(canvas);
        registry.set(control.featureId, control);
        return control;
      });

    // Panels stack on top of each other and only the active one is
    // visible (see .feature-panel CSS), so only that one should animate
    // once the showcase scrolls into view. Tab clicks drive replays after
    // that — see KernoFeatureDemos.play/reset, wired up in script.js.
    const panels = Array.from(root.querySelectorAll(".feature-panel[data-feature]"));
    const activePanel = panels.find((panel) => panel.classList.contains("is-active")) || panels[0];
    const activeControl = activePanel && registry.get(activePanel.getAttribute("data-feature"));

    if (activeControl && "IntersectionObserver" in global) {
      const target = activeControl.canvas.closest(".feature-display") || activeControl.canvas;
      const observer = new global.IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);
            activeControl.start();
          });
        },
        { threshold: 0.3 },
      );
      observer.observe(target);
    } else if (activeControl) {
      activeControl.start();
    }

    return controls;
  }

  global.KernoFeatureDemos = {
    duration: DURATION_MS,
    drawScene,
    height: HEIGHT,
    init,
    initAll,
    play,
    reset: resetFeature,
    width: WIDTH,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initAll(), { once: true });
  } else {
    initAll();
  }
})(window);
