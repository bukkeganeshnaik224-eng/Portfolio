/* App bootstrap: theme, navigation, scroll behaviour, role typing, loader. */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function theme() {
    var btn = $("#themeToggle"), root = document.documentElement;
    function paint() {
      var light = root.getAttribute("data-theme") === "light";
      btn.innerHTML = icon(light ? "moon" : "sun");
      btn.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
      var m = $('meta[name="theme-color"]'); if (m) m.setAttribute("content", light ? "#f5f7fa" : "#07090d");
    }
    btn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      paint();
    });
    paint();
  }

  function mobileNav() {
    var b = $("#burger"), m = $("#mobileMenu");
    b.innerHTML = icon("menu");
    function set(open) {
      m.hidden = !open;
      b.setAttribute("aria-expanded", String(open));
      b.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      b.innerHTML = icon(open ? "x" : "menu");
      $("#nav").classList.toggle("scrolled", open || window.scrollY > 24);
    }
    b.addEventListener("click", function () { set(m.hidden); });
    m.addEventListener("click", function (e) { if (e.target.closest("a")) set(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !m.hidden) { set(false); b.focus(); } });
    window.addEventListener("resize", function () { if (window.innerWidth > 1024 && !m.hidden) set(false); });
  }

  function scrollBehaviour() {
    var nav = $("#nav"), bar = $("#scrollProgress"), top = $("#toTop"), ticking = false;
    top.innerHTML = icon("up");
    function update() {
      var y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
      nav.classList.toggle("scrolled", y > 24 || !$("#mobileMenu").hidden);
      bar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
      top.hidden = y < 700;
      ticking = false;
    }
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });
    update();

    // Active nav link via IntersectionObserver
    var links = document.querySelectorAll("[data-nav]");
    var ids = ["home", "terminal", "about", "skills", "projects", "certificates", "documents", "education", "journey", "github", "contact"];
    var secs = ids.map(function (i) { return document.getElementById(i); }).filter(Boolean);
    function mark(id) {
      links.forEach(function (a) {
        var on = a.getAttribute("data-nav") === id;
        a.classList.toggle("active", on);
        if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      });
    }
    if ("IntersectionObserver" in window) {
      var o = new IntersectionObserver(function (en) {
        en.forEach(function (x) { if (x.isIntersecting) mark(x.target.id); });
      }, { rootMargin: "-45% 0px -50% 0px" });
      secs.forEach(function (s) { o.observe(s); });
    }
  }

  function roles(list) {
    var el = $("#roleText"); if (!el || !list.length) return;
    if (reduce) {
      var k = 0; el.textContent = list[0];
      setInterval(function () { k = (k + 1) % list.length; el.textContent = list[k]; }, 3200);
      return;
    }
    var ri = 0, ci = 0, del = false;
    (function tick() {
      var word = list[ri];
      if (!del) { ci++; el.textContent = word.slice(0, ci); if (ci === word.length) { del = true; return setTimeout(tick, 1900); } return setTimeout(tick, 60); }
      ci--; el.textContent = word.slice(0, ci);
      if (ci === 0) { del = false; ri = (ri + 1) % list.length; return setTimeout(tick, 350); }
      setTimeout(tick, 28);
    })();
  }

  function boot() {
    var D = window.DATA;
    document.title = D.profile.siteTitle;
    renderSections();
    hydrateIcons();
    theme(); mobileNav(); scrollBehaviour();
    Effects.init();
    initTerminal(); initCertificates(); initGitHub(); initContact();
    roles(D.profile.roles);
    observeReveals();

    // Absolute URLs for social previews once the site URL is configured.
    var base = (D.profile.seo.siteUrl || "").replace(/\/$/, "");
    if (base) {
      document.querySelectorAll('meta[property="og:image"],meta[name="twitter:image"]').forEach(function (m) { m.setAttribute("content", base + "/assets/images/og-image.png"); });
    }

    var L = $("#loader");
    var hide = function () { L.classList.add("done"); setTimeout(function () { L.remove(); }, 600); };
    if (document.readyState === "complete") setTimeout(hide, 250);
    else window.addEventListener("load", function () { setTimeout(hide, 250); });
    setTimeout(hide, 2500); // never trap the visitor behind the loader
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
