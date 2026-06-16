(() => {
  const words = Array.from(document.querySelectorAll(".home-page .home-title em"));
  if (!words.length) return;

  let applied = false;
  const apply = () => {
    if (applied) return;
    applied = true;
    words.forEach((word) => word.classList.add("is-sphere-gradient"));
    document.body?.classList.add("title-gradient-ready");
  };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    apply();
    return;
  }

  words[0].addEventListener(
    "animationend",
    (event) => {
      if (event.animationName === "title-word-smooth-italicize") apply();
    },
    { once: true }
  );

  window.setTimeout(apply, 9800);
})();

(() => {
  const video = document.querySelector(".home-page .omnichannel-video");
  if (!video) return;

  video.loop = true;
  video.muted = true;
  video.playsInline = true;

  video.addEventListener("ended", () => {
    video.currentTime = 0;
    video.play().catch(() => {});
  });

  video.play().catch(() => {});
})();
