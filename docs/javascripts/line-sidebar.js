(function () {
  "use strict";

  const smooth = (p) => p * p * (3 - 2 * p);

  function directControls(item) {
    const controls = [];
    Array.from(item.children).forEach((child) => {
      if (child.matches("a.md-nav__link, label.md-nav__link")) controls.push(child);
      if (child.matches(".md-nav__container")) {
        const link = child.querySelector("a.md-nav__link");
        if (link) controls.push(link);
      }
    });
    return controls;
  }

  function initLineNavigation() {
    const list = document.querySelector("nav.md-nav--primary > ul.md-nav__list");
    if (!list || list.dataset.lineSidebarReady === "true") return;

    const items = Array.from(list.children).filter((item) => item.matches("li.md-nav__item"));
    if (!items.length) return;

    list.dataset.lineSidebarReady = "true";
    list.classList.add("line-sidebar__list");

    const entries = items.map((item, index) => {
      const controls = directControls(item);
      item.classList.add("line-sidebar__item");

      const marker = document.createElement("span");
      marker.className = "line-sidebar__marker";
      marker.setAttribute("aria-hidden", "true");
      item.insertBefore(marker, item.firstChild);

      controls.forEach((control) => {
        control.classList.add("line-sidebar__label");
        const ellipsis = control.querySelector(".md-ellipsis");
        if (ellipsis && !ellipsis.querySelector(".line-sidebar__index")) {
          const number = document.createElement("span");
          number.className = "line-sidebar__index";
          number.setAttribute("aria-hidden", "true");
          number.textContent = String(index + 1).padStart(2, "0");
          ellipsis.insertBefore(number, ellipsis.firstChild);
        }
      });

      return { item, controls };
    });

    const targets = entries.map(() => 0);
    const current = entries.map(() => 0);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const activeIndex = Math.max(0, entries.findIndex(({ item }) => item.classList.contains("md-nav__item--active")));
    let frame = null;
    let lastTime = 0;

    function visibleControl(entry) {
      return entry.controls.find((control) => control.getClientRects().length) || entry.controls[0];
    }

    function render(now) {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const easing = reduceMotion.matches ? 1 : 1 - Math.exp(-dt / 0.1);
      let moving = false;

      entries.forEach(({ item }, index) => {
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

    list.addEventListener("pointermove", (event) => {
      entries.forEach((entry, index) => {
        const control = visibleControl(entry);
        if (!control) return;
        const rect = control.getBoundingClientRect();
        const distance = Math.abs(event.clientY - (rect.top + rect.height / 2));
        targets[index] = smooth(Math.max(0, 1 - distance / 100));
      });
      start();
    });

    list.addEventListener("pointerleave", () => {
      targets.fill(0);
      start();
    });

    entries.forEach((entry, index) => {
      entry.controls.forEach((control) => {
        control.addEventListener("focus", () => {
          targets[index] = 1;
          start();
        });
        control.addEventListener("blur", () => {
          targets[index] = 0;
          start();
        });
      });
    });

    start();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initLineNavigation);
  else initLineNavigation();
})();
