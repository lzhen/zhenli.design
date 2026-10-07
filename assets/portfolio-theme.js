(function () {
  'use strict';
  var root = document.documentElement;
  var storageKey = 'zhenli-theme';
  var theme = 'light';

  try {
    var saved = localStorage.getItem(storageKey);
    if (saved === 'light' || saved === 'dark') theme = saved;
  } catch (error) { /* The switch also works when browser storage is unavailable. */ }

  function applyTheme(next) {
    theme = next;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    document.querySelectorAll('.theme-toggle').forEach(function (button) {
      var target = theme === 'dark' ? 'light' : 'dark';
      var label = 'Switch to ' + target + ' mode';
      button.setAttribute('aria-label', label);
      button.setAttribute('title', label);
      button.setAttribute('aria-pressed', String(theme === 'dark'));
      button.querySelector('.theme-toggle-label').textContent = target === 'dark' ? 'Dark' : 'Light';
    });
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#080808' : '#ffffff';
  }

  applyTheme(theme);

  function bindSwitches() {
    applyTheme(theme);
    document.querySelectorAll('.theme-toggle').forEach(function (button) {
      button.addEventListener('click', function () {
        applyTheme(theme === 'dark' ? 'light' : 'dark');
        try { localStorage.setItem(storageKey, theme); } catch (error) {}
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindSwitches, { once: true });
  } else {
    bindSwitches();
  }

  window.addEventListener('storage', function (event) {
    if (event.key === storageKey) applyTheme(event.newValue === 'dark' ? 'dark' : 'light');
  });
  window.addEventListener('pageshow', function () {
    try {
      var saved = localStorage.getItem(storageKey);
      if (saved === 'light' || saved === 'dark') applyTheme(saved);
    } catch (error) {}
  });
})();
