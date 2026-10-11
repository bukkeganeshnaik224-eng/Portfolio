/* Visual effects: particles, network graphic, card tilt, custom cursor, scroll reveal.
   Everything respects prefers-reduced-motion and pauses when the tab is hidden. */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Particles ---------- */
  function particles() {
    var c = document.getElementById("particles");
    if (!c || reduce) return;
    var ctx = c.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W, H, pts = [], raf = null;
    var small = window.innerWidth < 700;

    function color() {
      return document.documentElement.getAttribute("data-theme") === "light" ? "0,120,168" : "0,229,255";
    }
    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      c.width = W * dpr; c.height = H * dpr;
      c.style.width = W + "px"; c.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round((W * H) / (small ? 26000 : 17000));
      n = Math.min(n, 70);
      pts = [];
      for (var i = 0; i < n; i++) {
        pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, r: Math.random() * 1.4 + 0.5 });
      }
    }
    function frame() {
      ctx.clearRect(0, 0, W, H);
      var col = color();
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.283);
        ctx.fillStyle = "rgba(" + col + ",0.55)";
        ctx.fill();
        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = dx * dx + dy * dy;
          if (d < 12000) {
            ctx.strokeStyle = "rgba(" + col + "," + (0.12 * (1 - d / 12000)).toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(frame);
    }
    resize();
    var t;
    window.addEventListener("resize", function () { clearTimeout(t); t = setTimeout(resize, 200); });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
      else if (!raf) raf = requestAnimationFrame(frame);
    });
    raf = requestAnimationFrame(frame);
  }

  /* ---------- Network graphic in hero ---------- */
  function network() {
    var svg = document.getElementById("netSvg");
    if (!svg) return;
    var nodes = [[60, 90], [180, 40], [330, 70], [470, 130], [420, 260], [490, 400], [360, 480], [200, 500], [70, 420], [40, 260], [150, 180], [300, 190], [260, 330], [120, 330], [400, 380]];
    var edges = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 0], [0, 10], [10, 1], [10, 11], [11, 2], [11, 4], [11, 12], [12, 13], [13, 9], [13, 8], [12, 14], [14, 5], [14, 4], [12, 7], [10, 13]];
    var h = "";
    edges.forEach(function (e) { h += '<line x1="' + nodes[e[0]][0] + '" y1="' + nodes[e[0]][1] + '" x2="' + nodes[e[1]][0] + '" y2="' + nodes[e[1]][1] + '"/>'; });
    nodes.forEach(function (n, i) {
      h += '<circle cx="' + n[0] + '" cy="' + n[1] + '" r="3" class="pulse-c" style="animation-delay:' + ((i * 0.37) % 3.2).toFixed(2) + 's"/>';
    });
    svg.innerHTML = h;
  }

  /* ---------- Card tilt (pointer devices only) ---------- */
  function tilt() {
    var card = document.getElementById("idCard");
    if (!card || reduce || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    var vis = document.getElementById("heroVisual");
    vis.addEventListener("pointermove", function (e) {
      var r = vis.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = "rotateY(" + (x * 10).toFixed(2) + "deg) rotateX(" + (-y * 8).toFixed(2) + "deg)";
    });
    vis.addEventListener("pointerleave", function () { card.style.transform = ""; });
  }

  /* ---------- Custom cursor (desktop only, can be turned off with the C key... or just ignored) ---------- */
  function cursor() {
    if (reduce || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    var dot = document.getElementById("cursorDot"), ring = document.getElementById("cursorRing");
    if (!dot || !ring) return;
    var x = -100, y = -100, rx = -100, ry = -100, on = false;
    window.addEventListener("pointermove", function (e) {
      x = e.clientX; y = e.clientY;
      if (!on) { on = true; document.body.classList.add("cursor-on"); }
      dot.style.transform = "translate(" + x + "px," + y + "px)";
      var t = e.target;
      ring.classList.toggle("hover", !!(t.closest && t.closest("a,button,input,textarea,[role=tab],label")));
    }, { passive: true });
    document.addEventListener("pointerleave", function () { document.body.classList.remove("cursor-on"); on = false; });
    (function loop() {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      ring.style.transform = "translate(" + rx.toFixed(1) + "px," + ry.toFixed(1) + "px)";
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Scroll reveal ---------- */
  var io = null;
  window.observeReveals = function (root) {
    var els = (root || document).querySelectorAll(".reveal:not(.in), .timeline:not(.in)");
    if (!("IntersectionObserver" in window) || reduce) {
      els.forEach(function (e) { e.classList.add("in"); });
      return;
    }
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    }
    els.forEach(function (e, i) {
      if (!e.style.getPropertyValue("--d")) e.style.setProperty("--d", (i % 4) * 70 + "ms");
      io.observe(e);
    });
  };

  /* ---------- Spotlight hover on skill cards ---------- */
  window.bindSpotlight = function (root) {
    (root || document).querySelectorAll(".skill-card").forEach(function (c) {
      c.addEventListener("pointermove", function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty("--mx", e.clientX - r.left + "px");
        c.style.setProperty("--my", e.clientY - r.top + "px");
      });
    });
  };

  window.Effects = { init: function () { particles(); network(); tilt(); cursor(); } };
})();
