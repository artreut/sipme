"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { canTarget } from "@/lib/canStore";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Pose = {
  posX: number;
  posY: number;
  scale: number;
  rotX: number;
  tint: [number, number, number];
  bg: string;
  glow: number;
  dark: boolean;
};

const POSES: Record<string, Pose> = {
  hero: { posX: 1.45, posY: -0.05, scale: 1.28, rotX: 0.05, tint: [1, 1, 1], bg: "#f8f0e8", glow: 0.7, dark: false },
  awareness: { posX: 0, posY: -0.05, scale: 0.92, rotX: 0.05, tint: [1, 1, 1], bg: "#f3eade", glow: 0.85, dark: false },
  vitamins: { posX: 1.32, posY: 0, scale: 0.72, rotX: 0.05, tint: [1, 1, 1], bg: "#faf4ec", glow: 0.7, dark: false },
  sport: { posX: -1.35, posY: 0, scale: 1.18, rotX: 0.03, tint: [0.93, 0.42, 0.42], bg: "#1f0a0b", glow: 0.6, dark: true },
};

export default function Choreography() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const root = document.documentElement;
    const apply = (p: Pose, instant = false) => {
      const d = instant ? 0 : 1.3;
      gsap.to(canTarget, { posX: p.posX, posY: p.posY, scale: p.scale, rotX: p.rotX, duration: d, ease: "power3.out", overwrite: "auto" });
      gsap.to(canTarget.tint, { r: p.tint[0], g: p.tint[1], b: p.tint[2], duration: d, ease: "power2.out", overwrite: "auto" });
      gsap.to(".scene-bg", { backgroundColor: p.bg, duration: instant ? 0 : 0.9, ease: "power2.out", overwrite: "auto" });
      gsap.to(".can-glow", { opacity: p.glow, duration: instant ? 0 : 0.9, ease: "power2.out", overwrite: "auto" });
      // адаптивный цвет хедера/лого
      root.style.setProperty("--header-ink", p.dark ? "#f8f0e8" : "#2d0304");
      root.style.setProperty("--logo-notch", p.bg);
    };

    (window as unknown as { __can?: unknown; __ST?: unknown }).__can = canTarget;
    (window as unknown as { __ST?: unknown }).__ST = ScrollTrigger;

    const ctx = gsap.context(() => {
      // стартовая поза
      apply(POSES.hero, true);

      // ——— Осведомленность: pinned, 4 состояния ———
      // Создаём ПЕРВЫМ и с высоким refreshPriority, чтобы спейсер пина был
      // учтён до расчёта позиций остальных триггеров.
      const panels = gsap.utils.toArray<HTMLElement>("[data-aw-panel]");
      const counter = document.querySelector<HTMLElement>("[data-aw-counter]");
      if (panels.length) {
        // все панели видимы; «приезжают» именно текстовые стороны
        gsap.set(panels, { autoAlpha: 1 });
        panels.forEach((panel, i) => {
          const sides = panel.querySelectorAll("[data-aw-side]");
          gsap.set(sides, i === 0 ? { yPercent: 0, autoAlpha: 1 } : { yPercent: 90, autoAlpha: 0 });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: "#awareness",
            start: "top top",
            end: `+=${(panels.length - 1) * 90}%`,
            pin: "[data-aw-pin]",
            scrub: 1,
            refreshPriority: 1,
            snap: {
              snapTo: (v) => Math.round(v * (panels.length - 1)) / (panels.length - 1),
              duration: { min: 0.15, max: 0.4 },
              ease: "power2.inOut",
            },
            onUpdate: (self) => {
              if (!counter) return;
              const idx = Math.round(self.progress * (panels.length - 1));
              counter.textContent = String(idx + 1).padStart(2, "0");
            },
          },
        });

        // каждый шаг: удержание, затем текст уезжает вверх, новый приезжает снизу
        panels.forEach((panel, i) => {
          if (i === 0) return;
          const prev = panels[i - 1].querySelectorAll("[data-aw-side]");
          const cur = panel.querySelectorAll("[data-aw-side]");
          tl.to(prev, { yPercent: -60, autoAlpha: 0, duration: 0.4, stagger: 0.06, ease: "power2.in" }, ">+0.55")
            .fromTo(
              cur,
              { yPercent: 90, autoAlpha: 0 },
              { yPercent: 0, autoAlpha: 1, duration: 0.55, stagger: 0.1, ease: "power3.out" },
              "<0.12",
            );
        });
      }

      // глобальное вращение — банка крутится на протяжении всего скролла
      if (!reduce) {
        gsap.to(canTarget, {
          rotY: Math.PI * 4,
          ease: "none",
          scrollTrigger: { trigger: "#page", start: "top top", end: "bottom bottom", scrub: 1 },
        });
      }

      // позы по секциям
      (Object.keys(POSES) as Array<keyof typeof POSES>).forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 45%",
          onEnter: () => {
            apply(POSES[id]);
            (window as unknown as { __pose?: string }).__pose = id;
          },
          onEnterBack: () => {
            apply(POSES[id]);
            (window as unknown as { __pose?: string }).__pose = id;
          },
        });
      });

      // ——— reveal-анимации ———
      if (!reduce) {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            y: 30,
            autoAlpha: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%" },
          });
        });
      }
    });

    // refresh после монтирования/раскладки — пин уже на месте
    const t = setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => {
      clearTimeout(t);
      ctx.revert();
    };
  }, []);

  return null;
}
