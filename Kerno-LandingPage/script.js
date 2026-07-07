/* =====================================================================
   KERNO — Landing page interactions
   Snappy, intentional, and unobtrusive.
   ===================================================================== */
(function () {
  "use strict";

  var header = document.getElementById("site-header");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sticky-header shadow state ---------- */
  function onScroll() {
    header.classList.toggle("is-stuck", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Parallax backdrop (Features / About / Deliverables) ----------
     Desktop/tablet only, and only without prefers-reduced-motion. The
     background drifts at a fraction of scroll speed (rect.top * -0.08),
     so it lags gently behind the content instead of scrolling 1:1. */
  var parallaxEl = document.querySelector(".page-parallax");
  var parallaxBg = document.querySelector(".page-parallax__bg");
  if (parallaxEl && parallaxBg) {
    var parallaxMQ = window.matchMedia("(min-width: 900px)");
    var parallaxRunning = false;

    function onParallaxScroll() {
      var y = parallaxEl.getBoundingClientRect().top * -0.08;
      parallaxBg.style.setProperty("--parallax-y", y.toFixed(2) + "px");
    }

    function syncParallaxState() {
      var shouldRun = parallaxMQ.matches && !reduceMotion;
      if (shouldRun && !parallaxRunning) {
        parallaxRunning = true;
        window.addEventListener("scroll", onParallaxScroll, { passive: true });
        onParallaxScroll();
      } else if (!shouldRun && parallaxRunning) {
        parallaxRunning = false;
        window.removeEventListener("scroll", onParallaxScroll);
        parallaxBg.style.setProperty("--parallax-y", "0px");
      }
    }

    syncParallaxState();
    parallaxMQ.addEventListener("change", syncParallaxState);
  }

  /* ---------- Mobile navigation ---------- */
  var toggle = document.getElementById("nav-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileNav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  revealEls.forEach(function (el) {
    var d = el.getAttribute("data-reveal-delay");
    if (d) el.style.setProperty("--reveal-delay", d + "ms");
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Active nav link (scroll spy) ----------
     Anchor ids live on the section wrappers, so the same stable element is
     used for both navigation and active-section tracking. */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
  var spyTargets = navLinks
    .map(function (link) {
      var target = document.querySelector(link.getAttribute("href"));
      var section = target && (target.closest(".section") || target);
      return section ? { link: link, section: section } : null;
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && spyTargets.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var match = spyTargets.filter(function (t) { return t.section === entry.target; })[0];
        if (!match) return;
        navLinks.forEach(function (link) {
          link.classList.toggle("is-active", link === match.link);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    spyTargets.forEach(function (t) { spy.observe(t.section); });
  }

  /* ---------- Feature showcase tabs ----------
     All three feature panels stay in the DOM, stacked on top of each other
     (see .feature-panel CSS), with only the first marked `is-active` so it
     works with no JS. Clicking a tab just toggles which panel carries
     `is-active` — the CSS transition crossfades between them without
     resizing the card, since all panels share the same grid cell. */
  var featureTabs = Array.prototype.slice.call(document.querySelectorAll(".feature-tab"));
  var featurePanels = Array.prototype.slice.call(document.querySelectorAll(".feature-panel"));
  if (featureTabs.length && featurePanels.length) {
    featureTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var target = tab.getAttribute("data-feature");
        featureTabs.forEach(function (t) {
          var active = t === tab;
          t.classList.toggle("is-active", active);
          t.setAttribute("aria-pressed", String(active));
        });
        featurePanels.forEach(function (panel) {
          panel.classList.toggle("is-active", panel.getAttribute("data-feature") === target);
        });
      });
    });
  }

  /* ---------- Placeholder-link guard ----------
     Team socials, the live app URL, and the YouTube demo are not wired
     up yet. Rather than sending visitors to a dead "#", we intercept the
     click, keep them in place, and surface exactly what to add.          */
  document.querySelectorAll('a[href="#"][data-placeholder], a[href="#"]').forEach(function (a) {
    if (a.getAttribute("href") !== "#") return;
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var what = a.getAttribute("data-placeholder") || "This link";
      // eslint-disable-next-line no-console
      console.info("[Kerno] Placeholder link — add the real URL for: " + what);
      a.classList.add("is-pinged");
      setTimeout(function () { a.classList.remove("is-pinged"); }, 600);
    });
  });
})();
