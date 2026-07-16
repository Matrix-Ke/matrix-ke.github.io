(() => {
  let cleanups = [];

  const initPortfolioCarousels = () => {
    cleanups.forEach((cleanup) => cleanup());
    cleanups = [];

    document.querySelectorAll("[data-carousel]").forEach((carousel) => {
      const track = carousel.querySelector("[data-carousel-track]");
      const viewport = carousel.querySelector("[data-carousel-viewport]");
      const slides = [...carousel.querySelectorAll("[data-carousel-slide]")];
      const previous = carousel.querySelector("[data-carousel-prev]");
      const next = carousel.querySelector("[data-carousel-next]");
      const dotsContainer = carousel.querySelector("[data-carousel-dots]");
      const counter = carousel.querySelector("[data-carousel-counter]");
      const caption = carousel.querySelector("[data-carousel-caption]");

      if (!track || !viewport || slides.length < 2) return;

      let current = 0;
      let timer = null;
      let pointerStart = null;
      let paused = false;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

      const dots = slides.map((slide, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "portfolio-carousel__dot";
        dot.setAttribute("aria-label", `显示第 ${index + 1} 张作品：${slide.dataset.caption}`);
        dot.addEventListener("click", () => show(index, true));
        dotsContainer.appendChild(dot);
        return dot;
      });

      const update = () => {
        track.style.transform = `translate3d(${-current * 100}%, 0, 0)`;
        slides.forEach((slide, index) => {
          const active = index === current;
          slide.setAttribute("aria-hidden", String(!active));
          dots[index].setAttribute("aria-current", String(active));
          dots[index].tabIndex = active ? 0 : -1;
        });
        counter.textContent = `${String(current + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
        caption.textContent = slides[current].dataset.caption || "作品图片";
      };

      const stop = () => {
        if (timer) window.clearInterval(timer);
        timer = null;
      };

      const start = () => {
        stop();
        if (!paused && !reduceMotion.matches && document.visibilityState === "visible") {
          timer = window.setInterval(() => show(current + 1, false), 6000);
        }
      };

      function show(index, restart = true) {
        current = (index + slides.length) % slides.length;
        update();
        if (restart) start();
      }

      const pause = () => {
        paused = true;
        stop();
      };

      const resume = () => {
        paused = false;
        start();
      };

      const onKeydown = (event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          show(current - 1);
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          show(current + 1);
        } else if (event.key === "Home") {
          event.preventDefault();
          show(0);
        } else if (event.key === "End") {
          event.preventDefault();
          show(slides.length - 1);
        }
      };

      const onPointerDown = (event) => {
        pointerStart = { x: event.clientX, y: event.clientY };
      };

      const onPointerUp = (event) => {
        if (!pointerStart) return;
        const deltaX = event.clientX - pointerStart.x;
        const deltaY = event.clientY - pointerStart.y;
        pointerStart = null;
        if (Math.abs(deltaX) > 44 && Math.abs(deltaX) > Math.abs(deltaY)) {
          show(current + (deltaX < 0 ? 1 : -1));
        }
      };

      const onVisibility = () => {
        if (document.visibilityState === "visible") start();
        else stop();
      };

      const onMotionChange = () => start();
      const goPrevious = () => show(current - 1);
      const goNext = () => show(current + 1);

      previous.addEventListener("click", goPrevious);
      next.addEventListener("click", goNext);
      viewport.addEventListener("keydown", onKeydown);
      viewport.addEventListener("pointerdown", onPointerDown);
      viewport.addEventListener("pointerup", onPointerUp);
      viewport.addEventListener("pointercancel", () => { pointerStart = null; });
      carousel.addEventListener("mouseenter", pause);
      carousel.addEventListener("mouseleave", resume);
      carousel.addEventListener("focusin", pause);
      carousel.addEventListener("focusout", resume);
      document.addEventListener("visibilitychange", onVisibility);
      reduceMotion.addEventListener("change", onMotionChange);

      update();
      start();

      cleanups.push(() => {
        stop();
        previous.removeEventListener("click", goPrevious);
        next.removeEventListener("click", goNext);
        viewport.removeEventListener("keydown", onKeydown);
        viewport.removeEventListener("pointerdown", onPointerDown);
        viewport.removeEventListener("pointerup", onPointerUp);
        carousel.removeEventListener("mouseenter", pause);
        carousel.removeEventListener("mouseleave", resume);
        carousel.removeEventListener("focusin", pause);
        carousel.removeEventListener("focusout", resume);
        document.removeEventListener("visibilitychange", onVisibility);
        reduceMotion.removeEventListener("change", onMotionChange);
      });
    });
  };

  if (typeof document$ !== "undefined") {
    document$.subscribe(initPortfolioCarousels);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPortfolioCarousels, { once: true });
  } else {
    initPortfolioCarousels();
  }
})();
