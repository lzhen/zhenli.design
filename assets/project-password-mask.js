(function () {
  var STORAGE_KEY_PREFIX = "zhenli-project-access";
  var PASSWORD_HASH = "b54cd02f18b74dfa0377c248668cfe986cef899af07f2d1cafeaae75c78ff4f6";

  document.documentElement.classList.add("project-password-pending");

  var style = document.createElement("style");
  style.textContent = [
    "html.project-password-pending body > .project-password-gate { visibility: visible !important; }",
    "html.project-password-pending body { overflow: hidden !important; }",
    ".project-password-gate { position: fixed; inset: 0; z-index: 999999; display: grid; place-items: center; min-height: 100vh; padding: 24px; background: #fff; color: #111; font-family: var(--font-body, 'Courier New', Courier, ui-monospace, SFMono-Regular, Menlo, monospace); }",
    ".project-password-panel { width: min(100%, 470px); display: grid; justify-items: center; gap: 16px; text-align: center; }",
    ".project-password-icon { width: 34px; height: 34px; opacity: 0.58; }",
    ".project-password-panel h1 { margin: 0; color: #111; font-family: var(--font-label, Arial, Helvetica, ui-sans-serif, system-ui, sans-serif); font-size: clamp(14px, 2.1vw, 18px); line-height: 1.4; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }",
    ".project-password-note { margin: -4px 0 48px; color: rgba(17, 17, 17, 0.58); font-size: 15px; line-height: 1.5; font-weight: 300; }",
    ".project-password-form { width: min(100%, 560px); display: grid; gap: 12px; }",
    ".project-password-form .sr-only { position: absolute !important; width: 1px !important; height: 1px !important; padding: 0 !important; margin: -1px !important; overflow: hidden !important; clip: rect(0, 0, 0, 0) !important; white-space: nowrap !important; border: 0 !important; }",
    ".project-password-input-row { display: grid; grid-template-columns: 1fr 42px; align-items: center; min-height: 48px; padding: 4px 6px 4px 20px; gap: 8px; background: #fff; border: 1px solid #e4e4e4; border-radius: 999px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.10); }",
    ".project-password-form input { width: 100%; min-width: 0; height: 40px; border: 0; border-radius: 0; padding: 0; background: transparent; color: #1d1d1f; font-family: var(--font-display, 'Helvetica Neue', Helvetica, Arial, ui-sans-serif, system-ui, sans-serif); font-size: 16px; line-height: 1.2; }",
    ".project-password-form input::placeholder { color: rgba(29, 29, 31, 0.48); }",
    ".project-password-form input:focus-visible { outline: 0; }",
    ".project-password-form button { display: grid; place-items: center; width: 38px; height: 38px; border: 0; border-radius: 50%; background: #000; color: #fff; cursor: pointer; transition: transform 160ms ease, background-color 160ms ease; }",
    ".project-password-form button:hover, .project-password-form button:focus-visible { transform: scale(1.03); background: #1d1d1f; outline: 0; }",
    ".project-password-form button svg { width: 18px; height: 18px; }",
    ".project-password-error { min-height: 18px; margin: 0; color: rgba(17, 17, 17, 0.62); font-size: 12px; line-height: 1.5; }",
    "html.project-password-pending .project-password-gate { position: fixed !important; inset: 0 !important; z-index: 999999 !important; display: grid !important; place-items: center !important; min-height: 100vh !important; padding: 24px !important; background: #fff !important; color: #111 !important; font-family: var(--font-body, 'Courier New', Courier, ui-monospace, SFMono-Regular, Menlo, monospace) !important; visibility: visible !important; }",
    "html.project-password-pending .project-password-gate * { box-sizing: border-box !important; visibility: visible !important; }",
    "html.project-password-pending .project-password-panel { width: min(100%, 470px) !important; display: grid !important; justify-items: center !important; gap: 16px !important; text-align: center !important; }",
    "html.project-password-pending .project-password-panel h1 { margin: 0 !important; color: #111 !important; font-family: var(--font-label, Arial, Helvetica, ui-sans-serif, system-ui, sans-serif) !important; font-size: clamp(14px, 2.1vw, 18px) !important; line-height: 1.4 !important; font-weight: 700 !important; letter-spacing: 2px !important; text-transform: uppercase !important; }",
    "html.project-password-pending .project-password-form { width: min(100%, 560px) !important; display: grid !important; gap: 12px !important; }",
    "html.project-password-pending .project-password-input-row { display: grid !important; grid-template-columns: 1fr 42px !important; align-items: center !important; min-height: 48px !important; padding: 4px 6px 4px 20px !important; gap: 8px !important; background: #fff !important; border: 1px solid #e4e4e4 !important; border-radius: 999px !important; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.10) !important; }",
    "html.project-password-pending .project-password-form input { width: 100% !important; min-width: 0 !important; height: 40px !important; border: 0 !important; padding: 0 !important; background: transparent !important; color: #1d1d1f !important; font-family: var(--font-display, 'Helvetica Neue', Helvetica, Arial, ui-sans-serif, system-ui, sans-serif) !important; font-size: 16px !important; }",
    "html.project-password-pending .project-password-form button { display: grid !important; place-items: center !important; width: 38px !important; height: 38px !important; border: 0 !important; border-radius: 50% !important; background: #000 !important; color: #fff !important; cursor: pointer !important; }",
    "@media (max-width: 560px) { .project-password-gate { padding: 22px; } .project-password-panel h1, html.project-password-pending .project-password-panel h1 { font-size: 14px !important; } .project-password-note { margin-bottom: 38px; font-size: 14px; } .project-password-form, html.project-password-pending .project-password-form { width: min(100%, 420px) !important; } .project-password-input-row, html.project-password-pending .project-password-input-row { grid-template-columns: 1fr 38px !important; padding-left: 18px !important; } }"
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
      '<svg viewBox="0 0 20 20" aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg">',
      '<path d="M3 10h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
      '<path d="M11.5 4.5 17 10l-5.5 5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
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
