/* Simulated terminal. Pure client-side text: it never executes anything, never reads files,
   and only prints content that already exists in the public config files. */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function init() {
    var D = window.DATA, P = D.profile;
    var screen = document.getElementById("termScreen");
    var form = document.getElementById("termForm");
    var input = document.getElementById("termCmd");
    var chips = document.getElementById("termChips");
    var promptLbl = document.getElementById("termPrompt");
    if (!screen) return;

    var prompt = P.terminal.prompt;
    promptLbl.textContent = prompt;
    var token = 0, busy = false, history = [], hIdx = -1;

    var commands = {
      help: function () { return ["Available commands:", "  whoami      who I am", "  interests   what I am into", "  status      what I am up to", "  skills      my skill groups", "  projects    things I am building", "  education   where I study", "  contact     how to reach me", "  clear       clear the screen", "  reset       restart the demo"]; },
      whoami: function () { return [P.name]; },
      interests: function () { return P.terminal.interests.slice(); },
      status: function () { return [P.terminal.status]; },
      skills: function () { return D.skills.map(function (g) { return g.title + ": " + g.items.join(", "); }); },
      projects: function () { return D.projects.filter(function (p) { return p.show; }).map(function (p) { return "• " + p.title + " [" + p.status + "]"; }); },
      education: function () { return D.education.map(function (e) { return e.period + "  " + e.title + ", " + e.place; }); },
      contact: function () { var o = [P.email, P.github]; if (P.linkedin) o.push(P.linkedin); return o; },
    };

    function scroll() { screen.scrollTop = screen.scrollHeight; }
    function line(html, cls) {
      var d = document.createElement("div");
      if (cls) d.className = cls;
      d.innerHTML = html;
      screen.appendChild(d);
      scroll();
      return d;
    }
    function sleep(ms) { return new Promise(function (r) { setTimeout(r, reduce ? 0 : ms); }); }

    async function typeCmd(cmd, my) {
      var row = line('<span class="p">' + esc(prompt) + '</span> <span class="cmd"></span><span class="cur"></span>');
      var span = row.querySelector(".cmd"), cur = row.querySelector(".cur");
      for (var i = 0; i < cmd.length; i++) {
        if (my !== token) return false;
        span.textContent += cmd[i];
        await sleep(55 + Math.random() * 45);
      }
      cur.remove();
      return true;
    }
    async function printOut(lines, my, animate) {
      for (var i = 0; i < lines.length; i++) {
        if (my !== token) return;
        var d = line('<span class="out">' + esc(lines[i]) + "</span>");
        if (animate) await sleep(120);
      }
    }

    async function runTyped(cmd) {
      var my = token;
      if (!(await typeCmd(cmd, my))) return;
      await sleep(180);
      await printOut((commands[cmd] || commands.help)(), my, true);
      line("&nbsp;");
    }

    async function intro() {
      var my = ++token;
      busy = true; input.disabled = false;
      screen.innerHTML = "";
      line('<span class="out hl">Welcome. This is a simulated terminal (no real commands run). Type <b>help</b>.</span>');
      line("&nbsp;");
      for (var c of ["whoami", "interests", "status"]) {
        if (my !== token) return;
        await runTyped(c);
        await sleep(350);
      }
      if (my === token) busy = false;
    }

    function runUser(raw) {
      var cmd = raw.trim().toLowerCase();
      if (!cmd) return;
      token++; busy = false; // interrupt any running animation
      history.unshift(raw); hIdx = -1;
      line('<span class="p">' + esc(prompt) + '</span> <span class="cmd">' + esc(raw) + "</span>");
      if (cmd === "clear") { screen.innerHTML = ""; return; }
      if (cmd === "reset") { intro(); return; }
      if (commands[cmd]) {
        commands[cmd]().forEach(function (l) { line('<span class="out">' + esc(l) + "</span>"); });
      } else {
        line('<span class="out">command not found: ' + esc(raw.slice(0, 40)) + ". Try <b>help</b>.</span>");
      }
      line("&nbsp;");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = input.value;
      input.value = "";
      runUser(v);
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowUp" && history.length) { e.preventDefault(); hIdx = Math.min(hIdx + 1, history.length - 1); input.value = history[hIdx]; }
      else if (e.key === "ArrowDown") { e.preventDefault(); hIdx = Math.max(hIdx - 1, -1); input.value = hIdx === -1 ? "" : history[hIdx]; }
      else if (e.key === "l" && e.ctrlKey) { e.preventDefault(); screen.innerHTML = ""; }
    });
    screen.addEventListener("click", function () { input.focus({ preventScroll: true }); });

    ["help", "skills", "projects", "education", "contact"].forEach(function (c) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "chip"; b.textContent = c;
      b.addEventListener("click", function () { runUser(c); input.focus({ preventScroll: true }); });
      chips.appendChild(b);
    });
    document.getElementById("termReset").addEventListener("click", function () { screen.innerHTML = ""; token++; line('<span class="out hl">Cleared. Type <b>help</b> to begin.</span>'); line("&nbsp;"); });
    document.getElementById("termReplay").addEventListener("click", intro);

    // Start the typing demo the first time the terminal scrolls into view.
    var started = false;
    function start() { if (!started) { started = true; intro(); } }
    if ("IntersectionObserver" in window) {
      var o = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { start(); o.disconnect(); } }, { threshold: 0.35 });
      o.observe(document.getElementById("termBox"));
    } else start();
  }

  window.initTerminal = init;
})();
