(() => {
  const title = document.querySelector(".home-title");
  const name = document.querySelector(".intro-name");

  if (!title || !name || !window.matchMedia("(hover: hover)").matches) {
    return;
  }

  title.addEventListener(
    "pointerenter",
    () => {
      name.classList.add("is-first-reveal");
    },
    { once: true }
  );
})();
