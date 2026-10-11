/* Certificate gallery: search, category filters, preview modal, full screen. */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };

  var CAT_ICON = { "Cybersecurity": "shield", "Artificial Intelligence": "cpu", "Programming": "code", "Professional Development": "award", "Hackathons": "trophy", "Other": "star" };

  function thumb(c) {
    var t = safeUrl(c.thumb);
    if (t) return '<img src="' + esc(t) + '" alt="Thumbnail of ' + esc(c.title) + ' certificate" loading="lazy" decoding="async" />';
    return '<div class="cert-ph"><span class="cert-ico">' + icon(CAT_ICON[c.category] || "award") + "</span><small>" + (c.pdf ? "PDF available" : "File not added yet") + "</small></div>";
  }

  function init() {
    var D = window.DATA, certs = D.certificates, cats = D.certificateCategories;
    var grid = $("#certGrid"), filters = $("#certFilters"), search = $("#certSearch"), count = $("#certCount");
    var state = { cat: "All", q: "" };

    var present = ["All"].concat(cats.filter(function (c) { return certs.some(function (x) { return x.category === c; }); }));
    filters.innerHTML = present.map(function (c, i) { return '<button type="button" class="filter" data-k="' + esc(c) + '" aria-pressed="' + (i === 0) + '">' + esc(c) + "</button>"; }).join("");

    function render() {
      var q = state.q.trim().toLowerCase();
      var list = certs.filter(function (c) {
        return (state.cat === "All" || c.category === state.cat) &&
          (!q || (c.title + " " + c.issuer + " " + c.category).toLowerCase().indexOf(q) >= 0);
      });
      count.textContent = list.length + " of " + certs.length + " credentials";
      if (!list.length) { grid.innerHTML = '<p class="empty-note" style="grid-column:1/-1">No credentials match. Try a different search or category.</p>'; return; }
      grid.innerHTML = list.map(function (c) {
        var i = certs.indexOf(c);
        return '<article class="cert"><div class="cert-thumb">' + thumb(c) + '<span class="cert-tag mono">' + esc(c.category) + "</span></div>" +
          '<div class="cert-body"><h3>' + esc(c.title) + '</h3><p class="cert-issuer">' + esc(c.issuer) + "</p>" +
          (c.date ? '<p class="cert-date mono">' + esc(c.date) + "</p>" : "") +
          '<div class="cert-actions"><button type="button" class="btn btn-sm btn-ghost" data-open="' + i + '">View Certificate ' + icon("maximize") + "</button>" +
          (safeUrl(c.pdf) ? '<a class="btn btn-sm btn-link" href="' + esc(safeUrl(c.pdf)) + '" target="_blank" rel="noopener noreferrer">Open PDF</a>' : "") +
          "</div></div></article>";
      }).join("");
    }

    filters.addEventListener("click", function (e) {
      var b = e.target.closest(".filter"); if (!b) return;
      filters.querySelectorAll(".filter").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      state.cat = b.dataset.k; render();
    });
    var tm;
    search.addEventListener("input", function () { clearTimeout(tm); tm = setTimeout(function () { state.q = search.value; render(); }, 120); });
    render();

    /* ---------- modal ---------- */
    var modal = $("#certModal"), panel = $("#modalPanel"), body = $("#modalBody"), foot = $("#modalFoot");
    var opener = null;
    $("#modalFull").innerHTML = icon("maximize");
    modal.querySelector("[data-close].icon-btn").innerHTML = icon("x");

    function openModal(c, from) {
      opener = from;
      $("#modalCat").textContent = c.category;
      $("#modalTitle").textContent = c.title;
      var pdf = safeUrl(c.pdf), ver = safeUrl(c.verifyUrl);
      var meta = '<div class="meta-grid">' +
        '<div class="meta"><small>Issuer</small><span>' + esc(c.issuer) + "</span></div>" +
        '<div class="meta"><small>Category</small><span>' + esc(c.category) + "</span></div>" +
        '<div class="meta"><small>Date</small><span>' + (c.date ? esc(c.date) : "Not specified") + "</span></div>" +
        '<div class="meta"><small>Verification</small><span>' + (ver ? '<a href="' + esc(ver) + '" target="_blank" rel="noopener noreferrer" style="color:var(--cyan)">Verify online</a>' : "Not independently verified here") + "</span></div></div>";
      var view = pdf
        ? '<iframe src="' + esc(pdf) + '#view=FitH" title="' + esc(c.title) + ' certificate PDF"></iframe><p class="muted" style="font-size:13px;margin-top:10px">If the preview does not load on your device, use <b>Open in new tab</b> below.</p>'
        : '<div class="modal-note"><b>Certificate file not added yet</b><span>This credential is listed from my resume. The original PDF will appear here once it is added to the <code>certificates/</code> folder.</span></div>';
      body.innerHTML = meta + view;
      foot.innerHTML = pdf
        ? '<a class="btn btn-primary" href="' + esc(pdf) + '" target="_blank" rel="noopener noreferrer">Open in new tab ' + icon("external") + '</a><a class="btn btn-ghost" href="' + esc(pdf) + '" download>Download ' + icon("download") + "</a>"
        : "";
      panel.classList.remove("full");
      $("#modalFull").innerHTML = icon("maximize");
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      modal.querySelector("[data-close].icon-btn").focus();
    }
    function closeModal() {
      modal.hidden = true; body.innerHTML = ""; document.body.style.overflow = "";
      if (opener && opener.focus) opener.focus();
    }

    grid.addEventListener("click", function (e) {
      var b = e.target.closest("[data-open]"); if (!b) return;
      openModal(certs[+b.dataset.open], b);
    });
    modal.addEventListener("click", function (e) { if (e.target.closest("[data-close]")) closeModal(); });
    $("#modalFull").addEventListener("click", function () {
      var f = panel.classList.toggle("full");
      this.innerHTML = icon(f ? "minimize" : "maximize");
      this.setAttribute("aria-label", f ? "Exit full screen" : "Enter full screen");
    });
    document.addEventListener("keydown", function (e) {
      if (modal.hidden) return;
      if (e.key === "Escape") { e.preventDefault(); closeModal(); return; }
      if (e.key === "Tab") { // focus trap
        var f = modal.querySelectorAll('a[href],button:not([disabled]),iframe,input,[tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  window.initCertificates = init;
})();
