(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion) {
    document.documentElement.classList.add("mono-motion-reduced");
    return;
  }

  document.documentElement.classList.add("mono-motion");

  const startMotion = () => {
    document.documentElement.classList.add("mono-motion-started");
  };

  if (document.documentElement.dataset.pageReady === "true") {
    startMotion();
  } else {
    window.addEventListener("portfolio:page-ready", startMotion, { once: true });
    window.setTimeout(startMotion, 2600);
  }

  const revealSelectors = [
    ".section-heading",
    ".section-lede",
    ".metrics > div",
    ".selected-work-grid .work-tile",
    ".case-study",
    ".case-copy > *",
    ".case-details > div",
    ".public-context",
    ".resume-block",
    ".resume-entry",
    ".resume-sidebar > *",
    ".site-footer > *"
  ];

  const wipeSelectors = [
    ".work-tile-media",
    ".case-media",
    ".case-visual",
    ".media-panel",
    ".featured-image",
    ".maiba-demo-wrap"
  ];

  const revealItems = Array.from(document.querySelectorAll(revealSelectors.join(",")))
    .filter((element) => !element.closest(".logo-loader"));

  revealItems.forEach((element, index) => {
    element.classList.add("mono-reveal");
    element.style.setProperty("--mono-delay", `${Math.min(index % 6, 5) * 70}ms`);
  });

  const wipeItems = Array.from(document.querySelectorAll(wipeSelectors.join(",")));

  wipeItems.forEach((element, index) => {
    element.classList.add("mono-wipe");
    element.style.setProperty("--mono-delay", `${Math.min(index % 4, 3) * 85}ms`);
  });

  const markVisible = (element) => {
    element.classList.add("is-visible");
  };

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach(markVisible);
    wipeItems.forEach(markVisible);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        markVisible(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -12%", threshold: 0.08 }
  );

  revealItems.forEach((element) => observer.observe(element));
  wipeItems.forEach((element) => observer.observe(element));
})();
