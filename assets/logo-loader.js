(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let heroAnimationPreload;
  let heroAnimationReady = Promise.resolve();

  const announcePageReady = () => {
    document.documentElement.dataset.pageReady = "true";
    window.dispatchEvent(new CustomEvent("portfolio:page-ready"));
  };

  const startHeroAnimation = () => {
    const animation = document.querySelector(".astronaut-gif[data-animated-src]");

    if (!animation || animation.classList.contains("is-playing")) {
      return;
    }

    animation.src = animation.dataset.animatedSrc;
    animation.classList.add("is-playing");
  };

  const preloadHeroAnimation = () => {
    const animation = document.querySelector(".astronaut-gif[data-animated-src]");

    if (!animation) {
      return;
    }

    heroAnimationReady = new Promise((resolve) => {
      heroAnimationPreload = new Image();
      heroAnimationPreload.addEventListener("load", resolve, { once: true });
      heroAnimationPreload.addEventListener("error", resolve, { once: true });
      heroAnimationPreload.src = animation.dataset.animatedSrc;

      if (heroAnimationPreload.complete) {
        resolve();
      }
    });
  };

  const showLoader = () => {
    preloadHeroAnimation();

    if (reducedMotion) {
      startHeroAnimation();
      announcePageReady();
      return;
    }

    if (document.querySelector(".logo-loader")) {
      return;
    }

    const loader = document.createElement("div");
    loader.className = "logo-loader";
    loader.setAttribute("aria-hidden", "true");
    loader.innerHTML = `
      <svg viewBox="0 0 88 88" focusable="false">
        <g class="loader-logo-drawing">
          <rect class="loader-logo loader-logo-frame" x="13" y="13" width="62" height="62" pathLength="1" />
          <path class="loader-logo loader-logo-divider" d="M18 35H60" pathLength="1" />
          <path class="loader-logo loader-logo-slash" d="M20.5 73.5L73.5 20.5" pathLength="1" />
        </g>
        <g class="loader-logo-mark">
          <rect x="8" y="8" width="72" height="72" fill="#000" />
          <rect x="18" y="18" width="52" height="52" fill="#fff" />
          <rect x="18" y="30" width="42" height="10" fill="#000" />
          <polygon points="17 70 70 17 77 24 24 77" fill="#000" />
        </g>
      </svg>
    `;

    document.body.prepend(loader);

    const minimumLoaderTime = new Promise((resolve) => {
      window.setTimeout(resolve, 1990);
    });

    Promise.all([heroAnimationReady, minimumLoaderTime]).then(() => {
      startHeroAnimation();
      window.setTimeout(() => {
        loader.classList.add("is-done");
        window.setTimeout(() => {
          loader.remove();
          announcePageReady();
        }, 180);
      }, 160);
    });
  };

  if (document.body) {
    showLoader();
  } else {
    document.addEventListener("DOMContentLoaded", showLoader, { once: true });
  }
})();
