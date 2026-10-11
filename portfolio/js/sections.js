/* Renders the content sections from the config files in js/data/. */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };

  var NAV = [
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "certificates", label: "Certificates" },
    { id: "journey", label: "Journey" },
    { id: "github", label: "GitHub" },
  ];
  var MOBILE_EXTRA = [
    { id: "home", label: "Home", first: true },
    { id: "terminal", label: "Terminal" },
    { id: "documents", label: "Documents" },
    { id: "education", label: "Education" },
    { id: "contact", label: "Contact" },
  ];

  var STATUS_LABEL = { live: "Live", prototype: "Prototype", "in-progress": "In progress" };

  function nav() {
    $("#navLinks").innerHTML = NAV.map(function (n) { return '<li><a href="#' + n.id + '" data-nav="' + n.id + '">' + n.label + "</a></li>"; }).join("");
    var m = MOBILE_EXTRA.filter(function (x) { return x.first; }).concat(NAV.slice(0, 3), [NAV[3]], MOBILE_EXTRA.filter(function (x) { return x.id === "documents" || x.id === "education"; }), [NAV[4], NAV[5]], MOBILE_EXTRA.filter(function (x) { return x.id === "terminal" || x.id === "contact"; }));
    $("#mobileLinks").innerHTML = m.map(function (n) { return '<li><a href="#' + n.id + '" data-nav="' + n.id + '">' + n.label + "</a></li>"; }).join("");
  }

  function hero(P) {
    $("#heroLead").textContent = P.heroText;
    var a = $("#availBadge");
    if (P.availability && P.availability.show) {
      a.className = "avail" + (P.availability.status === "busy" ? " busy" : "");
      a.innerHTML = "<i></i><span>" + esc(P.availability.text) + "</span>";
    } else a.remove();

    var soc = [];
    var gh = safeUrl(P.github), li = safeUrl(P.linkedin);
    if (gh) soc.push('<li><a href="' + esc(gh) + '" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">' + icon("github") + "GitHub</a></li>");
    if (li) soc.push('<li><a href="' + esc(li) + '" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">' + icon("linkedin") + "LinkedIn</a></li>");
    soc.push('<li><a href="mailto:' + esc(P.email) + '" aria-label="Send an email">' + icon("mail") + "Email</a></li>");
    $("#heroSocial").innerHTML = soc.join("");
  }

  function about(P) {
    $("#aboutCopy").innerHTML =
      P.about.map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("") +
      '<div class="about-facts">' +
      [
        ["book", "Degree", P.degree],
        ["award", "University", P.university],
        ["rocket", "Expected graduation", P.graduation],
      ].map(function (f) { return '<div class="fact">' + icon(f[0]) + "<div><b>" + f[1] + "</b><span>" + esc(f[2]) + "</span></div></div>"; }).join("") +
      "</div>";
    $("#aboutCards").innerHTML = P.aboutCards.map(function (c, i) {
      return '<article class="info-card reveal" style="--d:' + i * 90 + 'ms"><span class="n mono">' + esc(c.n) + "</span><h3>" + icon(c.icon) + esc(c.title) + "</h3><p>" + esc(c.text) + "</p></article>";
    }).join("");
  }

  function skills(S) {
    var tabs = $("#skillTabs"), grid = $("#skillGrid");
    tabs.setAttribute("role", "group");
    var all = [{ id: "all", title: "All" }].concat(S.map(function (g) { return { id: g.id, title: g.title }; }));
    tabs.innerHTML = all.map(function (t, i) { return '<button type="button" class="tab" data-id="' + t.id + '" aria-pressed="' + (i === 0) + '">' + esc(t.title) + "</button>"; }).join("");
    grid.innerHTML = S.map(function (g, i) {
      return '<article class="skill-card reveal" data-id="' + g.id + '" style="--d:' + (i % 3) * 80 + 'ms"><div class="ico">' + icon(g.icon) + "</div><h3>" + esc(g.title) + "</h3><p>" + esc(g.blurb) + '</p><div class="badges">' +
        g.items.map(function (it) { return '<span class="badge">' + esc(it) + "</span>"; }).join("") + "</div></article>";
    }).join("");
    tabs.addEventListener("click", function (e) {
      var b = e.target.closest(".tab"); if (!b) return;
      tabs.querySelectorAll(".tab").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      var id = b.dataset.id;
      grid.querySelectorAll(".skill-card").forEach(function (c) { c.classList.toggle("dim", id !== "all" && c.dataset.id !== id); });
    });
    bindSpotlight(grid);
  }

  /* ---------- project preview graphics (generated, clearly not screenshots) ---------- */
  function previewSvg(theme, seed) {
    var o = '<svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet" fill="none" aria-hidden="true">' +
      '';
    var i, x, y;
    if (theme === "ai") {
      var L = [[120, 3], [260, 5], [400, 4], [520, 2]];
      var pts = L.map(function (l) { var a = []; for (i = 0; i < l[1]; i++) a.push([l[0], 200 + (i - (l[1] - 1) / 2) * 62]); return a; });
      for (var l = 0; l < pts.length - 1; l++) pts[l].forEach(function (a) { pts[l + 1].forEach(function (b) { o += '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '" stroke="var(--cyan)" stroke-opacity=".25"/>'; }); });
      pts.forEach(function (c, ci) { c.forEach(function (p, pi) { o += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="9" fill="var(--bg)" stroke="' + ((ci + pi) % 3 === 0 ? "var(--green)" : "var(--cyan)") + '" stroke-width="2"/>'; }); });
    } else if (theme === "robot") {
      var R = [[300, 200], [170, 120], [430, 110], [470, 250], [330, 320], [160, 290], [90, 200], [250, 70], [540, 170]];
      for (i = 1; i < R.length; i++) o += '<line x1="300" y1="200" x2="' + R[i][0] + '" y2="' + R[i][1] + '" stroke="var(--cyan)" stroke-opacity=".3" stroke-dasharray="4 5"/>';
      [[1, 7], [2, 3], [3, 4], [4, 5], [5, 6], [6, 1], [7, 2], [2, 8], [3, 8]].forEach(function (e) { o += '<line x1="' + R[e[0]][0] + '" y1="' + R[e[0]][1] + '" x2="' + R[e[1]][0] + '" y2="' + R[e[1]][1] + '" stroke="var(--green)" stroke-opacity=".28"/>'; });
      R.forEach(function (p, k) {
        o += '<g transform="translate(' + p[0] + " " + p[1] + ')"><polygon points="0,-16 14,-8 14,8 0,16 -14,8 -14,-8" fill="var(--bg)" stroke="' + (k === 0 ? "var(--green)" : "var(--cyan)") + '" stroke-width="2"/><circle r="3" fill="' + (k === 0 ? "var(--green)" : "var(--cyan)") + '"/></g>';
      });
    } else if (theme === "health") {
      o += '<path d="M40 210h130l25-70 40 150 35-110 25 30h265" stroke="var(--green)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M300 90v50M275 115h50" stroke="var(--cyan)" stroke-width="6" stroke-linecap="round"/>';
    } else {
      for (i = 0; i < 6; i++) { y = 90 + i * 44; o += '<rect x="90" y="' + y + '" width="' + (140 + ((i * 97) % 260)) + '" height="14" rx="7" fill="var(--cyan)" fill-opacity="' + (0.15 + i * 0.1) + '"/>'; }
    }
    return o + '</svg>';
  }

  function btn(label, url, icn, kind) {
    var u = safeUrl(url);
    if (u) return '<a class="btn ' + kind + '" href="' + esc(u) + '" target="_blank" rel="noopener noreferrer">' + esc(label) + " " + icon(icn) + "</a>";
    return '<span class="btn btn-ghost na" aria-disabled="true" title="Add this link in js/data/projects.js">' + esc(label.indexOf("Live") >= 0 ? "Demo" : "Source") + " link not added</span>";
  }

  function projects(list) {
    var vis = list.filter(function (p) { return p.show; });
    var grid = $("#projectGrid"), f = $("#projectFilters");
    var statuses = [];
    vis.forEach(function (p) { if (statuses.indexOf(p.status) < 0) statuses.push(p.status); });
    var chips = [{ k: "all", t: "All" }].concat(statuses.map(function (s) { return { k: s, t: STATUS_LABEL[s] || s }; }));
    f.innerHTML = chips.length > 2 ? chips.map(function (c, i) { return '<button type="button" class="filter" data-k="' + c.k + '" aria-pressed="' + (i === 0) + '">' + esc(c.t) + "</button>"; }).join("") : "";
    if (chips.length <= 2) f.remove();

    grid.innerHTML = vis.length ? vis.map(function (p, i) {
      var shot = safeUrl(p.screenshot);
      var visual = shot ? '<img src="' + esc(shot) + '" alt="Screenshot of ' + esc(p.title) + '" loading="lazy" />' : previewSvg(p.theme, i);
      return '<article class="project reveal" data-status="' + esc(p.status) + '">' +
        '<div class="proj-visual' + (shot ? "" : " gen") + '">' + visual + "</div>" +
        '<div class="proj-body"><span class="status ' + esc(p.status) + '"><i></i>' + esc(STATUS_LABEL[p.status] || p.status) + "</span>" +
        "<h3>" + esc(p.title) + "</h3>" + (p.subtitle ? '<p class="proj-sub mono">' + esc(p.subtitle) + "</p>" : "") +
        "<p>" + esc(p.summary) + "</p>" +
        (p.highlights.length ? '<ul class="proj-list">' + p.highlights.map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("") + "</ul>" : "") +
        (p.tech.length ? '<div class="badges">' + p.tech.map(function (t) { return '<span class="badge">' + esc(t) + "</span>"; }).join("") + "</div>" : "") +
        '<div class="proj-actions">' + btn("View Live Demo", p.live, "external", "btn-primary") + btn("View Source Code", p.repo, "github", "btn-ghost") + "</div></div></article>";
    }).join("") : '<p class="empty-note">No projects to show yet. Add them in js/data/projects.js.</p>';

    f.addEventListener("click", function (e) {
      var b = e.target.closest(".filter"); if (!b) return;
      f.querySelectorAll(".filter").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      grid.querySelectorAll(".project").forEach(function (c) { c.classList.toggle("hide", b.dataset.k !== "all" && c.dataset.status !== b.dataset.k); });
    });
  }

  function education(E) {
    $("#eduTimeline").innerHTML = E.map(function (e) {
      return '<li class="t-item' + (e.current ? " current" : "") + '"><p class="t-period mono">' + esc(e.period) + "</p><h3>" + esc(e.title) + "</h3><p>" + esc(e.place) + "</p></li>";
    }).join("");
    $("#eduTimeline").classList.add("reveal");
  }

  function activities(D) {
    var A = D.activities, host = $("#activities");
    var feat = A.filter(function (a) { return a.featured; }), more = A.filter(function (a) { return !a.featured; });
    host.innerHTML = feat.map(function (a) {
      return '<article class="act-feature glass reveal"><div class="doc-icon">' + icon("trophy") + '</div><div><p class="role mono">' + esc(a.role) + " · " + esc(a.year) + "</p><h3>" + esc(a.title) + "</h3><p>" + esc(a.org) + "</p>" + (a.note ? '<p class="muted" style="font-size:13px">' + esc(a.note) + "</p>" : "") + "</div></article>";
    }).join("") + (more.length ? '<div class="act-more">' + more.map(function (a) {
      return '<article class="j-card reveal"><h4>' + esc(a.title) + '</h4><p class="muted">' + esc(a.role) + " · " + esc(a.org) + " · " + esc(a.year) + "</p></article>";
    }).join("") + "</div>" : "");

    var ex = D.experience, h = "";
    if (ex.length) {
      h += '<h3 class="sub-title reveal">Experience</h3>' + ex.map(function (e) {
        return '<article class="glass exp-item reveal"><p class="t-period mono">' + esc(e.period) + "</p><h4>" + esc(e.role) + " — " + esc(e.company) + '</h4><ul class="proj-list" style="margin-top:10px">' + (e.points || []).map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul></article>";
      }).join("");
    }
    h += '<h3 class="sub-title reveal">My Learning Journey</h3><div class="journey-grid">' + D.journey.map(function (j, i) {
      return '<article class="j-card reveal" style="--d:' + (i % 3) * 80 + 'ms"><div class="ico">' + icon(j.icon) + "</div><h4>" + esc(j.title) + "</h4><p>" + esc(j.text) + "</p></article>";
    }).join("") + "</div>";
    $("#experienceBlock").innerHTML = h;
  }

  function contactLinks(P) {
    var items = [];
    var gh = safeUrl(P.github), li = safeUrl(P.linkedin);
    if (gh) items.push(["github", "GitHub", gh, true]);
    if (li) items.push(["linkedin", "LinkedIn", li, true]);
    if (P.showPhone && P.phone) items.push(["send", P.phone, "tel:" + String(P.phone).replace(/[^\d+]/g, ""), false]);
    $("#contactLinks").innerHTML = items.map(function (i) {
      return "<li><a href=\"" + esc(i[2]) + "\"" + (i[3] ? ' target="_blank" rel="noopener noreferrer"' : "") + ">" + icon(i[0]) + "<span>" + esc(i[1]) + "</span></a></li>";
    }).join("");
    var m = $("#mailBtn");
    m.href = "mailto:" + P.email;
    m.innerHTML = icon("mail") + " " + esc(P.email);
  }

  /* ---------- resume (hero button + documents card) ---------- */
  function resume(P) {
    var R = P.resume, file = safeUrl(R.file), hero = $("#heroResume"), card = $("#resumeCard");
    function paint(ok) {
      if (ok) {
        hero.href = file; hero.setAttribute("download", R.downloadName || "");
        card.innerHTML = '<div class="doc-icon">' + icon("file") + "</div><h3>Resume</h3><p>My current resume as a PDF.</p>" +
          (R.showPreview ? '<iframe class="resume-frame" src="' + esc(file) + '#view=FitH" title="Resume preview" loading="lazy"></iframe>' : "") +
          '<div class="doc-actions"><a class="btn btn-primary" href="' + esc(file) + '" download="' + esc(R.downloadName || "") + '">Download Resume ' + icon("download") + '</a><a class="btn btn-ghost" href="' + esc(file) + '" target="_blank" rel="noopener noreferrer">Open in new tab ' + icon("external") + "</a></div>";
      } else {
        hero.removeAttribute("download"); hero.href = "#documents";
        hero.innerHTML = 'Resume <span class="mono" style="font-size:11px;opacity:.7">(coming soon)</span>';
        card.innerHTML = '<div class="doc-icon">' + icon("file") + "</div><h3>Resume</h3><p>The resume PDF has not been added yet. Place it at <code>" + esc(R.file) + "</code> and this card will show a preview and download button automatically.</p>";
      }
      hydrateIcons();
    }
    if (!file) return paint(false);
    if (location.protocol === "file:") return paint(true); // cannot probe on file://
    fetch(file, { method: "HEAD", cache: "no-cache" }).then(function (r) {
      var ct = r.headers.get("content-type") || "";
      paint(r.ok && ct.indexOf("text/html") < 0);
    }).catch(function () { paint(false); });
  }

  window.renderSections = function () {
    var D = window.DATA;
    nav(); hero(D.profile); about(D.profile); skills(D.skills); projects(D.projects);
    education(D.education); activities(D); contactLinks(D.profile); resume(D.profile);
    document.getElementById("year").textContent = new Date().getFullYear();
  };
})();
