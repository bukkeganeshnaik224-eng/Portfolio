/* GitHub section: public API only (no tokens), 1-hour localStorage cache, loading + fallback states.
   Nothing is invented: if the API is unavailable, a plain link card is shown instead. */
(function () {
  var TTL = 60 * 60 * 1000;
  var LANG = { JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572a5", Java: "#b07219", HTML: "#e34c26", CSS: "#563d7c", "C++": "#f34b7d", C: "#7a7a7a", Shell: "#89e051", Jupyter: "#da5b0b", "Jupyter Notebook": "#da5b0b" };

  function cacheGet(k) {
    try { var v = JSON.parse(localStorage.getItem(k)); if (v && Date.now() - v.t < TTL) return v.d; } catch (e) {}
    return null;
  }
  function cacheSet(k, d) { try { localStorage.setItem(k, JSON.stringify({ t: Date.now(), d: d })); } catch (e) {} }

  async function get(url, key) {
    var c = cacheGet(key); if (c) return c;
    var ctl = new AbortController(), t = setTimeout(function () { ctl.abort(); }, 8000);
    try {
      var r = await fetch(url, { headers: { Accept: "application/vnd.github+json" }, signal: ctl.signal });
      if (!r.ok) throw new Error("GitHub API " + r.status);
      var d = await r.json(); cacheSet(key, d); return d;
    } finally { clearTimeout(t); }
  }

  function fallback(root, P, msg) {
    var gh = safeUrl(P.github);
    root.innerHTML = '<div class="gh-fallback glass"><p>' + esc(msg) + "</p>" +
      (gh ? '<a class="btn btn-primary" href="' + esc(gh) + '" target="_blank" rel="noopener noreferrer">' + icon("github") + " Open GitHub profile</a>" : "") +
      '<button type="button" class="btn btn-ghost btn-sm" id="ghRetry">' + icon("refresh") + " Try again</button></div>";
    var b = document.getElementById("ghRetry");
    if (b) b.addEventListener("click", function () { init(true); });
  }

  async function init(force) {
    var P = window.DATA.profile, root = document.getElementById("ghRoot");
    if (!root || !P.githubUsername) return;
    var user = encodeURIComponent(P.githubUsername);
    if (force) { try { localStorage.removeItem("gh_user"); localStorage.removeItem("gh_repos"); } catch (e) {} }
    root.innerHTML = '<div class="gh-top"><div class="skeleton" style="min-height:260px"></div><div class="repo-grid"><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div></div></div>';

    try {
      var results = await Promise.all([
        get("https://api.github.com/users/" + user, "gh_user"),
        get("https://api.github.com/users/" + user + "/repos?per_page=100&sort=updated", "gh_repos"),
      ]);
      var u = results[0], repos = results[1].filter(function (r) { return !r.fork; });

      var langs = {};
      repos.forEach(function (r) { if (r.language) langs[r.language] = (langs[r.language] || 0) + 1; });
      var langKeys = Object.keys(langs).sort(function (a, b) { return langs[b] - langs[a]; });
      var total = langKeys.reduce(function (s, k) { return s + langs[k]; }, 0);

      var prof = '<aside class="gh-profile glass"><img class="gh-avatar" src="' + esc(u.avatar_url) + '&s=168" alt="GitHub avatar" width="84" height="84" loading="lazy" />' +
        "<div><h3>" + esc(u.name || u.login) + '</h3><p class="handle mono">@' + esc(u.login) + "</p></div>" +
        (u.bio ? '<p class="muted" style="font-size:14px">' + esc(u.bio) + "</p>" : "") +
        '<div class="gh-stats"><div><b>' + u.public_repos + "</b><small>REPOS</small></div><div><b>" + u.followers + "</b><small>FOLLOWERS</small></div><div><b>" + u.following + "</b><small>FOLLOWING</small></div></div>" +
        (total ? '<div class="lang-bar" role="img" aria-label="Languages across public repositories (by repository count)">' + langKeys.map(function (k) { return '<i style="width:' + (langs[k] / total * 100).toFixed(1) + "%;background:" + (LANG[k] || "var(--cyan)") + '" title="' + esc(k) + '"></i>'; }).join("") + "</div>" +
          '<div class="lang-legend">' + langKeys.map(function (k) { return "<span><i class=\"lang-dot\" style=\"background:" + (LANG[k] || "var(--cyan)") + "\"></i>" + esc(k) + " (" + langs[k] + ")</span>"; }).join("") + "</div>" : "") +
        '<a class="btn btn-ghost btn-sm" href="' + esc(u.html_url) + '" target="_blank" rel="noopener noreferrer">' + icon("github") + " View profile</a></aside>";

      var cards = repos.length ? repos.slice(0, 9).map(function (r) {
        return '<a class="repo" href="' + esc(r.html_url) + '" target="_blank" rel="noopener noreferrer"><b>' + icon("book") + esc(r.name) + "</b><p>" + esc(r.description || "No description provided.") + '</p><div class="meta-row mono">' +
          (r.language ? '<span><i class="lang-dot" style="background:' + (LANG[r.language] || "var(--cyan)") + '"></i>' + esc(r.language) + "</span>" : "") +
          "<span>" + r.stargazers_count + " stars</span><span>updated " + new Date(r.pushed_at).toLocaleDateString(undefined, { month: "short", year: "numeric" }) + "</span></div></a>";
      }).join("") : '<p class="empty-note" style="grid-column:1/-1">No public repositories yet. They will appear here automatically once published.</p>';

      root.innerHTML = '<div class="gh-top">' + prof + '<div><div class="repo-grid">' + cards + '</div></div></div><p class="gh-foot mono">Live data from the GitHub public API (cached up to 1 hour). Contribution graph is not shown because GitHub does not expose it through a token-free API.</p>';
    } catch (err) {
      fallback(root, P, "GitHub data could not be loaded right now (rate limit, network, or blocked request). You can still visit the profile directly.");
    }
  }

  window.initGitHub = function () {
    var root = document.getElementById("ghRoot");
    if (!root) return;
    if (!("IntersectionObserver" in window)) return init();
    var o = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { o.disconnect(); init(); } }, { rootMargin: "300px" });
    o.observe(root);
  };
})();
