(function () {
  "use strict";

  const curves = {
    linear: (p) => p,
    smooth: (p) => p * p * (3 - 2 * p),
    sharp: (p) => p * p * p,
  };

  function initLineSidebar(root) {
    if (root.dataset.lineSidebarReady === "true") return;

    const list = root.querySelector("[data-line-sidebar-list]");
    const items = Array.from(root.querySelectorAll("[data-line-sidebar-item]"));
    if (!list || !items.length) return;

    root.dataset.lineSidebarReady = "true";

    const proximityRadius = 100;
    const smoothing = 100;
    const falloff = curves.smooth;
    const targets = items.map(() => 0);
    const current = items.map(() => 0);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let activeIndex = 0;
    let frame = null;
    let lastTime = 0;

    function render(now) {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const tau = Math.max(smoothing, 1) / 1000;
      const easing = reduceMotion.matches ? 1 : 1 - Math.exp(-dt / tau);
      let moving = false;

      items.forEach((item, index) => {
        const target = Math.max(targets[index], activeIndex === index ? 1 : 0);
        const next = current[index] + (target - current[index]) * easing;
        const settled = Math.abs(target - next) < 0.0015;
        current[index] = settled ? target : next;
        item.style.setProperty("--effect", current[index].toFixed(4));
        if (!settled) moving = true;
      });

      frame = moving ? requestAnimationFrame(render) : null;
    }

    function start() {
      if (frame !== null) return;
      lastTime = performance.now();
      frame = requestAnimationFrame(render);
    }

    function setActive(index) {
      if (index < 0 || index >= items.length || index === activeIndex) return;
      activeIndex = index;
      items.forEach((item, itemIndex) => {
        if (itemIndex === activeIndex) item.setAttribute("aria-current", "true");
        else item.removeAttribute("aria-current");
      });
      start();
    }

    list.addEventListener("pointermove", (event) => {
      const bounds = list.getBoundingClientRect();
      const pointerY = event.clientY - bounds.top;

      items.forEach((item, index) => {
        const center = item.offsetTop + item.offsetHeight / 2;
        const distance = Math.abs(pointerY - center);
        targets[index] = falloff(Math.max(0, 1 - distance / proximityRadius));
      });
      start();
    });

    list.addEventListener("pointerleave", () => {
      targets.fill(0);
      start();
    });

    items.forEach((item, index) => {
      const link = item.querySelector("a");
      if (!link) return;
      link.addEventListener("click", () => setActive(index));
      link.addEventListener("focus", () => {
        targets[index] = 1;
        start();
      });
      link.addEventListener("blur", () => {
        targets[index] = 0;
        start();
      });
    });

    const observed = items
      .map((item, index) => ({ item, index, target: document.getElementById(item.dataset.target) }))
      .filter((entry) => entry.target);

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (!visible) return;
          const match = observed.find((entry) => entry.target === visible.target);
          if (match) setActive(match.index);
        },
        { rootMargin: "-18% 0px -58% 0px", threshold: [0, 0.15, 0.35, 0.6] }
      );
      observed.forEach((entry) => observer.observe(entry.target));
    }

    start();
  }

  function init() {
    document.querySelectorAll("[data-line-sidebar]").forEach(initLineSidebar);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
