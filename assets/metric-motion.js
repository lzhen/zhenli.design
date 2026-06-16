(() => {
  const metrics = Array.from(document.querySelectorAll(".metric-value[data-value]"));

  if (!metrics.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const formatMetric = (element, value) => {
    const decimals = Number(element.dataset.decimals || 0);
    const prefix = element.dataset.prefix || "";
    const suffix = element.dataset.suffix || "";
    return `${prefix}${value.toFixed(decimals)}${suffix}`;
  };

  metrics.forEach((metric) => {
    metric.classList.add("metric-ready");
  });

  const animateMetric = (metric, delay) => {
    const target = Number(metric.dataset.value);
    const duration = 1050;

    window.setTimeout(() => {
      metric.classList.add("metric-running");
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        metric.textContent = formatMetric(metric, target * eased);

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          metric.textContent = formatMetric(metric, target);
        }
      };

      requestAnimationFrame(tick);
    }, delay);
  };

  let hasStarted = false;

  const startMetrics = () => {
    if (hasStarted) {
      return;
    }

    hasStarted = true;
    window.setTimeout(() => {
      metrics.forEach((metric, index) => animateMetric(metric, index * 110));
    }, 180);
  };

  if (document.documentElement.dataset.pageReady === "true") {
    startMetrics();
  } else {
    window.addEventListener("portfolio:page-ready", startMetrics, { once: true });
  }
})();
