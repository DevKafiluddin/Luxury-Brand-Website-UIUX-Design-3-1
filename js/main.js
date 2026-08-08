/* The Attraction Strategist — micro-interactions
   Elegant reveals, soft parallax, subtle header state. */

(function () {
  "use strict";

  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Current year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---- Fade-in on scroll ---- */
  var revealables = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var siblings = Array.prototype.slice.call(
            el.parentElement ? el.parentElement.children : [el]
          ).filter(function (n) {
            return n.classList && n.classList.contains("reveal");
          });
          var delay = Math.max(0, siblings.indexOf(el)) * 120;
          window.setTimeout(function () {
            el.classList.add("is-visible");
          }, delay);
          observer.unobserve(el);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );

    revealables.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---- Header state on scroll ---- */
  var header = document.getElementById("siteHeader");
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  var ticking = false;

  function onFrame() {
    ticking = false;
    var y = window.pageYOffset || document.documentElement.scrollTop;

    if (header) header.classList.toggle("is-stuck", y > 40);

    if (reduceMotion) return;

    var viewportH = window.innerHeight;
    parallaxEls.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > viewportH + 200) return;
      var factor = parseFloat(el.getAttribute("data-parallax")) || 0.04;
      var progress = (rect.top + rect.height / 2 - viewportH / 2) / viewportH;
      var shift = -progress * viewportH * factor;
      var img = el.querySelector("img") || el;
      img.style.transform = "translate3d(0," + shift.toFixed(2) + "px,0)";
    });
  }

  function requestFrame() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(onFrame);
  }

  window.addEventListener("scroll", requestFrame, { passive: true });
  window.addEventListener("resize", requestFrame);
  requestFrame();
})();
