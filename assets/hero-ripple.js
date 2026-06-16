(() => {
  const hero = document.querySelector(".home-page .home-hero");
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!hero || !canHover.matches || reducedMotion.matches) {
    return;
  }

  const shouldSkip = (event) => event.target.closest("h1, p, a, button");
  const addRipple = (event) => {
    if (shouldSkip(event)) {
      return;
    }

    const bounds = hero.getBoundingClientRect();
    const ripple = document.createElement("span");

    ripple.className = "hero-ripple";
    ripple.style.left = `${event.clientX - bounds.left}px`;
    ripple.style.top = `${event.clientY - bounds.top}px`;
    ripple.setAttribute("aria-hidden", "true");
    hero.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
  };

  let lastRippleAt = 0;

  hero.addEventListener("pointerenter", (event) => {
    if (!shouldSkip(event)) {
      addRipple(event);
      lastRippleAt = performance.now();
    }
  });

  hero.addEventListener("pointermove", (event) => {
    const now = performance.now();
    if (now - lastRippleAt < 220) {
      return;
    }

    lastRippleAt = now;
    addRipple(event);
  });
})();
