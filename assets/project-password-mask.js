(function () {
  var STORAGE_KEY_PREFIX = "zhenli-project-access";
  var PASSWORD_HASH = "b54cd02f18b74dfa0377c248668cfe986cef899af07f2d1cafeaae75c78ff4f6";

  document.documentElement.classList.add("project-password-pending");

  var style = document.createElement("style");
  style.textContent = [
    "html.project-password-pending body > .project-password-gate { visibility: visible !important; }",
    "html.project-password-pending body { overflow: hidden !important; }",
    ".project-password-gate { position: fixed; inset: 0; z-index: 999999; display: grid; place-items: center; min-height: 100vh; padding: 24px; background: #fff; color: #111; font-family: Arial, Helvetica, ui-sans-serif, system-ui, sans-serif; }",
    ".project-password-panel { width: min(100%, 470px); display: grid; justify-items: center; gap: 16px; text-align: center; }",
    ".project-password-icon { width: 34px; height: 34px; opacity: 0.58; }",
    ".project-password-panel h1 { margin: 0; color: #111; font-size: clamp(28px, 4vw, 40px); line-height: 1.12; font-weight: 300; letter-spacing: 0; }",
    ".project-password-note { margin: -4px 0 48px; color: rgba(17, 17, 17, 0.58); font-size: 15px; line-height: 1.5; font-weight: 300; }",
    ".project-password-form { width: min(100%, 420px); display: grid; gap: 12px; }",
    ".project-password-form .sr-only { position: absolute !important; width: 1px !important; height: 1px !important; padding: 0 !important; margin: -1px !important; overflow: hidden !important; clip: rect(0, 0, 0, 0) !important; white-space: nowrap !important; border: 0 !important; }",
    ".project-password-input-row { display: grid; grid-template-columns: 1fr 58px; min-height: 48px; background: #fff; border: 1px solid rgba(17, 17, 17, 0.18); box-shadow: 0 12px 36px rgba(17, 17, 17, 0.08); }",
    ".project-password-form input { width: 100%; min-width: 0; border: 0; border-radius: 0; padding: 0 16px; background: transparent; color: #1d1d1f; font: inherit; font-size: 13px; line-height: 1.2; }",
    ".project-password-form input::placeholder { color: rgba(29, 29, 31, 0.28); }",
    ".project-password-form input:focus-visible { outline: 0; }",
    ".project-password-form button { display: grid; place-items: center; border: 0; border-left: 1px solid rgba(0, 0, 0, 0.04); border-radius: 0; background: transparent; color: rgba(29, 29, 31, 0.45); cursor: pointer; transition: color 160ms ease, transform 160ms ease; }",
    ".project-password-form button:hover, .project-password-form button:focus-visible { color: #1d1d1f; outline: 0; }",
    ".project-password-form button svg { width: 32px; height: 16px; }",
    ".project-password-error { min-height: 18px; margin: 0; color: rgba(17, 17, 17, 0.62); font-size: 12px; line-height: 1.5; }",
    "html.project-password-pending .project-password-gate { position: fixed !important; inset: 0 !important; z-index: 999999 !important; display: grid !important; place-items: center !important; min-height: 100vh !important; padding: 24px !important; background: #fff !important; color: #111 !important; visibility: visible !important; }",
    "html.project-password-pending .project-password-gate * { box-sizing: border-box !important; visibility: visible !important; }",
    "html.project-password-pending .project-password-panel { width: min(100%, 470px) !important; display: grid !important; justify-items: center !important; gap: 16px !important; text-align: center !important; }",
    "html.project-password-pending .project-password-form { width: min(100%, 420px) !important; display: grid !important; gap: 12px !important; }",
    "html.project-password-pending .project-password-input-row { display: grid !important; grid-template-columns: 1fr 58px !important; min-height: 48px !important; background: #fff !important; }",
    "html.project-password-pending .project-password-form input { width: 100% !important; min-width: 0 !important; border: 0 !important; padding: 0 16px !important; background: transparent !important; color: #1d1d1f !important; font-size: 13px !important; }",
    "html.project-password-pending .project-password-form button { display: grid !important; place-items: center !important; border: 0 !important; border-left: 1px solid rgba(0, 0, 0, 0.04) !important; background: transparent !important; color: rgba(29, 29, 31, 0.45) !important; cursor: pointer !important; }",
    "@media (max-width: 560px) { .project-password-gate { padding: 22px; } .project-password-panel h1 { font-size: 30px; } .project-password-note { margin-bottom: 38px; font-size: 14px; } .project-password-form { width: 100%; } }"
  ].join("\n");
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
    var storageKey = STORAGE_KEY_PREFIX + ":" + window.location.pathname.replace(/\/$/, "");

    if (localStorage.getItem(storageKey) === PASSWORD_HASH) {
      unlock();
      return;
    }

    var gate = document.createElement("section");
    gate.className = "project-password-gate";
    gate.setAttribute("aria-label", "Project password");
    gate.innerHTML = [
      '<div class="project-password-panel">',
      '<svg class="project-password-icon" viewBox="0 0 32 32" aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg">',
      '<path d="M9 14V10.8C9 6.9 12.1 4 16 4s7 2.9 7 6.8V14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
      '<rect x="7.5" y="14" width="17" height="14" stroke="currentColor" stroke-width="1.4"/>',
      '<path d="M16 20v3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
      '<circle cx="16" cy="19" r="1.3" fill="currentColor"/>',
      "</svg>",
      "<h1>This content is protected.</h1>",
      '<p class="project-password-note">To view, please enter the password.</p>',
      '<form class="project-password-form">',
      '<label class="sr-only" for="project-password-input">Password</label>',
      '<div class="project-password-input-row">',
      '<input id="project-password-input" type="password" name="password" autocomplete="current-password" placeholder="Enter password" required />',
      '<button type="submit" aria-label="Unlock project">',
      '<svg viewBox="0 0 40 18" aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg">',
      '<path d="M1 9h35" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
      '<path d="M29 2l7 7-7 7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>',
      "</svg>",
      "</button>",
      "</div>",
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
          localStorage.setItem(storageKey, PASSWORD_HASH);
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
