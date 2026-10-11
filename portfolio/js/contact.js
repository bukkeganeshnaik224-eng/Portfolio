/* Contact form.
   - Validates on the client (the receiving service must still validate server-side).
   - Spam protection: hidden honeypot field + minimum fill time + button lock while sending.
   - Real delivery only if profile.contactForm.endpoint is set (e.g. Formspree).
   - Otherwise it opens the visitor's email app and says exactly that. It never pretends a message was sent. */
(function () {
  function init() {
    var P = window.DATA.profile;
    var form = document.getElementById("contactForm"), note = document.getElementById("formNote"), btn = document.getElementById("cfSubmit");
    if (!form) return;
    var loadedAt = Date.now();
    var endpoint = safeUrl(P.contactForm && P.contactForm.endpoint);
    if (endpoint && !/^https:\/\//.test(endpoint)) endpoint = null;

    function setNote(msg, cls) { note.textContent = msg; note.className = "form-note " + (cls || ""); }
    function fieldErr(name, msg) {
      var f = form.elements[name].closest(".field"); if (!f) return;
      f.classList.toggle("invalid", !!msg);
      f.querySelector(".err").textContent = msg || "";
      form.elements[name].setAttribute("aria-invalid", msg ? "true" : "false");
    }
    function validate() {
      var v = {}, ok = true;
      ["name", "email", "subject", "message"].forEach(function (k) { v[k] = form.elements[k].value.trim(); });
      var rules = {
        name: [v.name.length >= 2, "Please enter your name."],
        email: [/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email), "Please enter a valid email address."],
        subject: [v.subject.length >= 3, "Please add a short subject."],
        message: [v.message.length >= 10, "Please write at least 10 characters."],
      };
      Object.keys(rules).forEach(function (k) { var bad = !rules[k][0]; if (bad) ok = false; fieldErr(k, bad ? rules[k][1] : ""); });
      return ok ? v : null;
    }

    ["name", "email", "subject", "message"].forEach(function (k) {
      form.elements[k].addEventListener("blur", validate);
    });

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      setNote("");
      var v = validate();
      if (!v) { setNote("Please fix the highlighted fields.", "bad"); var bad = form.querySelector(".invalid input, .invalid textarea"); if (bad) bad.focus(); return; }

      // Honeypot filled or submitted implausibly fast: pretend success, send nothing.
      if (form.elements.website.value || Date.now() - loadedAt < 3000) { setNote("Thanks! Your message was received.", "ok"); form.reset(); return; }

      btn.disabled = true;
      if (endpoint) {
        setNote("Sending…", "info");
        try {
          var r = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ name: v.name, email: v.email, subject: v.subject, message: v.message }) });
          if (!r.ok) throw new Error("status " + r.status);
          setNote("Message sent. Thank you, I will get back to you soon.", "ok");
          form.reset(); loadedAt = Date.now();
        } catch (err) {
          setNote("Sorry, the message could not be sent. Please email " + P.email + " directly.", "bad");
        } finally { btn.disabled = false; }
      } else {
        var body = v.message + "\n\n— " + v.name + " (" + v.email + ")";
        var href = "mailto:" + P.email + "?subject=" + encodeURIComponent(v.subject) + "&body=" + encodeURIComponent(body);
        setNote("Opening your email app with this message filled in. Press send there to deliver it.", "info");
        window.location.href = href;
        setTimeout(function () { btn.disabled = false; }, 1500);
      }
    });
  }
  window.initContact = init;
})();
