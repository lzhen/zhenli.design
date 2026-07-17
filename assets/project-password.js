(function () {
  var STORAGE_KEY = "zhenli-project-access";
  var PASSWORD_HASH = "b54cd02f18b74dfa0377c248668cfe986cef899af07f2d1cafeaae75c78ff4f6";

  document.documentElement.classList.add("project-password-pending");

  var style = document.createElement("style");
  style.textContent = [
    "html.project-password-pending body > :not(.project-password-gate) { visibility: hidden !important; }",
    "html.project-password-pending body { overflow: hidden !important; }",
    ".project-password-gate { position: fixed; inset: 0; z-index: 999999; display: grid; place-items: center; min-height: 100vh; padding: 24px; background: #f7f4ee; color: #111; font-family: 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Arial, sans-serif; }",
    ".project-password-panel { width: min(100%, 380px); display: grid; gap: 18px; text-align: center; }",
    ".project-password-mark { width: 58px; height: 58px; margin: 0 auto 8px; }",
    ".project-password-panel h1 { margin: 0; font-size: 24px; line-height: 1.15; letter-spacing: 6px; font-weight: 800; }",
    ".project-password-panel p { margin: 0; font-size: 14px; line-height: 1.6; }",
    ".project-password-form { display: grid; gap: 10px; }",
    ".project-password-form input { width: 100%; min-height: 44px; padding: 10px 12px; border: 1px solid #111; border-radius: 0; background: transparent; color: #111; font: inherit; font-size: 16px; text-align: center; }",
    ".project-password-form button { min-height: 44px; border: 1px solid #111; border-radius: 0; background: #111; color: #f7f4ee; font: inherit; font-size: 12px; font-weight: 800; letter-spacing: 1.8px; text-transform: uppercase; cursor: pointer; }",
    ".project-password-error { min-height: 18px; color: #9b1c1c; font-size: 12px; line-height: 1.5; }"
  ].join("\\n");
  document.head.appendChild(style);

  function unlock() {
    var gate = document.querySelector(".project-password-gate");
    if (gate) gate.remove();
    document.documentElement.classList.remove("project-password-pending");
  }

  function bytesToHex(buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), function (byte) {
      return byte.toString(16).padStart(2, "0");
    }).join("");
  }

  function hashPassword(value) {
    if (!window.crypto || !window.crypto.subtle) {
      return Promise.resolve(value === "lzDesign" ? PASSWORD_HASH : "");
    }

    return window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)).then(bytesToHex);
  }

  function buildGate() {
    if (localStorage.getItem(STORAGE_KEY) === PASSWORD_HASH) {
      unlock();
      return;
    }

    var gate = document.createElement("section");
    gate.className = "project-password-gate";
    gate.setAttribute("aria-label", "Project password");
    gate.innerHTML = [
      '<div class="project-password-panel">',
      '<img class="project-password-mark" src="assets/zhen-li-logo.svg?v=20260717-project-password" alt="" aria-hidden="true" />',
      "<h1>ZHEN LI</h1>",
      "<p>Protected project</p>",
      '<form class="project-password-form">',
      '<label class="sr-only" for="project-password-input">Password</label>',
      '<input id="project-password-input" type="password" name="password" autocomplete="current-password" placeholder="Password" required />',
      "<button type=\"submit\">Enter</button>",
      '<p class="project-password-error" role="status" aria-live="polite"></p>',
      "</form>",
      "</div>"
    ].join("");

    document.body.appendChild(gate);

    var form = gate.querySelector("form");
    var input = gate.querySelector("input");
    var error = gate.querySelector(".project-password-error");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      hashPassword(input.value).then(function (hash) {
        if (hash === PASSWORD_HASH) {
          localStorage.setItem(STORAGE_KEY, PASSWORD_HASH);
          unlock();
          return;
        }

        error.textContent = "Incorrect password";
        input.value = "";
        input.focus();
      });
    });

    input.focus();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildGate, { once: true });
  } else {
    buildGate();
  }
})();
