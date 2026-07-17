(function () {
  var STORAGE_KEY = "zhenli-project-access";
  var PASSWORD_HASH = "b54cd02f18b74dfa0377c248668cfe986cef899af07f2d1cafeaae75c78ff4f6";

  document.documentElement.classList.add("project-password-pending");

  var style = document.createElement("style");
  style.textContent = [
    "html.project-password-pending body > :not(.project-password-gate) { visibility: hidden !important; }",
    "html.project-password-pending body { overflow: hidden !important; }",
    ".project-password-gate { position: fixed; inset: 0; z-index: 999999; display: grid; place-items: center; min-height: 100vh; padding: clamp(20px, 4vw, 56px); background: #f6f2ea; color: #080808; font-family: Arial, Helvetica, ui-sans-serif, system-ui, sans-serif; }",
    ".project-password-gate::before { content: ''; position: absolute; inset: clamp(14px, 2vw, 28px); border: 1px solid rgba(8, 8, 8, 0.16); pointer-events: none; }",
    ".project-password-gate::after { content: ''; position: absolute; left: clamp(14px, 2vw, 28px); right: clamp(14px, 2vw, 28px); top: 50%; border-top: 1px solid rgba(8, 8, 8, 0.08); pointer-events: none; }",
    ".project-password-panel { position: relative; z-index: 1; width: min(100%, 860px); min-height: min(520px, calc(100vh - 96px)); display: grid; grid-template-columns: minmax(0, 1fr) minmax(280px, 360px); background: #f6f2ea; border: 1px solid #080808; box-shadow: 18px 18px 0 #080808; }",
    ".project-password-intro { display: flex; flex-direction: column; justify-content: space-between; gap: 48px; padding: clamp(30px, 5vw, 58px); border-right: 1px solid #080808; }",
    ".project-password-kicker { margin: 0; font-size: 11px; line-height: 1.2; font-weight: 800; letter-spacing: 2.8px; text-transform: uppercase; }",
    ".project-password-brand { display: grid; gap: 22px; }",
    ".project-password-mark { width: 74px; height: 74px; }",
    ".project-password-panel h1 { margin: 0; max-width: 360px; font-size: clamp(42px, 7vw, 76px); line-height: 0.92; letter-spacing: 0; font-weight: 800; }",
    ".project-password-note { max-width: 360px; margin: 0; font-family: 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Arial, sans-serif; font-size: 15px; line-height: 1.65; }",
    ".project-password-access { display: flex; flex-direction: column; justify-content: center; gap: 26px; padding: clamp(28px, 4vw, 44px); }",
    ".project-password-number { display: inline-grid; place-items: center; width: 34px; height: 34px; border: 1px solid #080808; border-radius: 50%; font-size: 11px; font-weight: 800; }",
    ".project-password-access h2 { margin: 0; font-size: 18px; line-height: 1.25; font-weight: 800; letter-spacing: 0; }",
    ".project-password-access p { margin: 0; font-family: 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Arial, sans-serif; font-size: 13px; line-height: 1.6; }",
    ".project-password-form { display: grid; gap: 12px; }",
    ".project-password-form .sr-only { position: absolute !important; width: 1px !important; height: 1px !important; padding: 0 !important; margin: -1px !important; overflow: hidden !important; clip: rect(0, 0, 0, 0) !important; white-space: nowrap !important; border: 0 !important; }",
    ".project-password-field { display: grid; gap: 8px; }",
    ".project-password-field-label { font-size: 10px; line-height: 1.2; font-weight: 800; letter-spacing: 1.8px; text-transform: uppercase; }",
    ".project-password-form input { width: 100%; min-height: 48px; padding: 12px 0; border: 0; border-bottom: 1px solid #080808; border-radius: 0; background: transparent; color: #080808; font: inherit; font-size: 18px; line-height: 1.2; }",
    ".project-password-form input::placeholder { color: rgba(8, 8, 8, 0.38); }",
    ".project-password-form input:focus-visible { outline: 0; border-bottom-width: 2px; }",
    ".project-password-form button { min-height: 48px; margin-top: 4px; border: 1px solid #080808; border-radius: 0; background: #080808; color: #f6f2ea; font: inherit; font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: transform 160ms ease, background-color 160ms ease, color 160ms ease; }",
    ".project-password-form button:hover, .project-password-form button:focus-visible { transform: translateY(-1px); background: transparent; color: #080808; outline: 0; }",
    ".project-password-error { min-height: 18px; color: #9b1c1c; font-family: 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Arial, sans-serif; font-size: 12px; line-height: 1.5; }",
    ".project-password-meta { color: rgba(8, 8, 8, 0.62); }",
    "html.project-password-pending .project-password-gate { position: fixed !important; inset: 0 !important; z-index: 999999 !important; display: grid !important; place-items: center !important; min-height: 100vh !important; padding: clamp(20px, 4vw, 56px) !important; background: #f6f2ea !important; color: #080808 !important; visibility: visible !important; }",
    "html.project-password-pending .project-password-gate * { box-sizing: border-box !important; color: inherit; visibility: visible !important; }",
    "html.project-password-pending .project-password-panel { position: relative !important; z-index: 1 !important; width: min(100%, 860px) !important; min-height: min(520px, calc(100vh - 96px)) !important; display: grid !important; grid-template-columns: minmax(0, 1fr) minmax(280px, 360px) !important; background: #f6f2ea !important; border: 1px solid #080808 !important; box-shadow: 18px 18px 0 #080808 !important; }",
    "html.project-password-pending .project-password-intro { display: flex !important; flex-direction: column !important; justify-content: space-between !important; gap: 48px !important; padding: clamp(30px, 5vw, 58px) !important; border-right: 1px solid #080808 !important; }",
    "html.project-password-pending .project-password-access { display: flex !important; flex-direction: column !important; justify-content: center !important; gap: 26px !important; padding: clamp(28px, 4vw, 44px) !important; }",
    "html.project-password-pending .project-password-form { display: grid !important; gap: 12px !important; }",
    "html.project-password-pending .project-password-form input { width: 100% !important; min-height: 48px !important; padding: 12px 0 !important; border: 0 !important; border-bottom: 1px solid #080808 !important; background: transparent !important; color: #080808 !important; font-size: 18px !important; }",
    "html.project-password-pending .project-password-form button { min-height: 48px !important; margin-top: 4px !important; border: 1px solid #080808 !important; background: #080808 !important; color: #f6f2ea !important; cursor: pointer !important; }",
    "@media (max-width: 720px) { .project-password-gate { place-items: stretch; padding: 18px; } .project-password-gate::before, .project-password-gate::after { display: none; } .project-password-panel { min-height: calc(100vh - 36px); grid-template-columns: 1fr; box-shadow: 8px 8px 0 #080808; } .project-password-intro { gap: 34px; padding: 28px; border-right: 0; border-bottom: 1px solid #080808; } .project-password-mark { width: 58px; height: 58px; } .project-password-access { padding: 28px; justify-content: start; } }",
    "@media (max-width: 720px) { html.project-password-pending .project-password-gate { display: grid !important; place-items: stretch !important; padding: 18px !important; } html.project-password-pending .project-password-gate::before, html.project-password-pending .project-password-gate::after { display: none !important; } html.project-password-pending .project-password-panel { width: 100% !important; min-height: calc(100vh - 36px) !important; display: grid !important; grid-template-columns: 1fr !important; box-shadow: 8px 8px 0 #080808 !important; } html.project-password-pending .project-password-intro { gap: 26px !important; padding: 28px !important; border-right: 0 !important; border-bottom: 1px solid #080808 !important; } html.project-password-pending .project-password-panel h1 { max-width: 270px !important; font-size: clamp(40px, 16vw, 58px) !important; line-height: 0.95 !important; } html.project-password-pending .project-password-note { max-width: 270px !important; font-size: 13px !important; line-height: 1.55 !important; } html.project-password-pending .project-password-mark { width: 58px !important; height: 58px !important; } html.project-password-pending .project-password-access { padding: 28px !important; justify-content: start !important; } }"
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
    if (localStorage.getItem(STORAGE_KEY) === PASSWORD_HASH) {
      unlock();
      return;
    }

    var gate = document.createElement("section");
    gate.className = "project-password-gate";
    gate.setAttribute("aria-label", "Project password");
    gate.innerHTML = [
      '<div class="project-password-panel">',
      '<div class="project-password-intro">',
      '<p class="project-password-kicker">Selected work</p>',
      '<div class="project-password-brand">',
      '<img class="project-password-mark" src="assets/zhen-li-logo.svg?v=20260717-project-password" alt="" aria-hidden="true" />',
      "<h1>Protected project</h1>",
      "</div>",
      '<p class="project-password-note">A few project details are shared privately. Enter the access password to continue.</p>',
      "</div>",
      '<div class="project-password-access">',
      '<span class="project-password-number" aria-hidden="true">01</span>',
      "<div>",
      "<h2>Enter password</h2>",
      '<p class="project-password-meta">Access stays unlocked in this browser.</p>',
      "</div>",
      '<form class="project-password-form">',
      '<label class="sr-only" for="project-password-input">Password</label>',
      '<div class="project-password-field">',
      '<span class="project-password-field-label">Password</span>',
      '<input id="project-password-input" type="password" name="password" autocomplete="current-password" placeholder="Enter access password" required />',
      "</div>",
      "<button type=\"submit\">Unlock project</button>",
      '<p class="project-password-error" role="status" aria-live="polite"></p>',
      "</form>",
      "</div>",
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
