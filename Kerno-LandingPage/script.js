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

  /* ---------- Active nav link (scroll spy) ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navLinks.forEach(function (link) {
          link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
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
