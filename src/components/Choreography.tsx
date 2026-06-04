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
  rotZ: number;
  parallax: number;
  tint: [number, number, number];
  bg: string;
  glow: number;
  dark: boolean;
};

const POSES: Record<string, Pose> = {
  hero: { posX: 0.08, posY: 0.12, scale: 1.0, rotX: 0.08, rotZ: -0.38, parallax: 0.6, tint: [1, 1, 1], bg: "#f8f0e8", glow: 0.7, dark: false },
  awareness: { posX: 0, posY: -0.05, scale: 0.92, rotX: 0.05, rotZ: 0, parallax: 0.12, tint: [1, 1, 1], bg: "#f8f0e8", glow: 0.85, dark: false },
  vitamins: { posX: 0.92, posY: 0.05, scale: 1.04, rotX: 0.06, rotZ: -0.4, parallax: 0.12, tint: [1, 1, 1], bg: "#f8f0e8", glow: 0.62, dark: false },
  sport: { posX: -1.35, posY: 0, scale: 1.18, rotX: 0.03, rotZ: -0.18, parallax: 0.14, tint: [0.93, 0.42, 0.42], bg: "#1f0a0b", glow: 0.6, dark: true },
};

export default function Choreography() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const root = document.documentElement;
    const apply = (p: Pose, instant = false) => {
      const d = instant ? 0 : 1.3;
      gsap.to(canTarget, { posX: p.posX, posY: p.posY, scale: p.scale, rotX: p.rotX, rotZ: p.rotZ, parallax: p.parallax, duration: d, ease: "power3.out", overwrite: "auto" });
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

      // ——— Осведомленность: pinned, дискретная смена шагов ———
      // Создаём ПЕРВЫМ и с высоким refreshPriority, чтобы спейсер пина был
      // учтён до расчёта позиций остальных триггеров.
      const panels = gsap.utils.toArray<HTMLElement>("[data-aw-panel]");
      const ghosts = gsap.utils.toArray<HTMLElement>("[data-aw-ghost]");
      const tokens = gsap.utils.toArray<HTMLElement>("[data-aw-token]");
      const segs = gsap.utils.toArray<HTMLElement>("[data-aw-seg]");
      const orbitEl = document.querySelector<HTMLElement>("[data-aw-orbit]");
      const numEl = document.querySelector<HTMLElement>("[data-aw-num]");
      const N = panels.length;

      if (N) {
        const sidesOf = (i: number) => panels[i].querySelectorAll("[data-aw-side]");

        // начальное состояние: активен шаг 0
        gsap.set(panels, { autoAlpha: 1 });
        panels.forEach((p, i) =>
          gsap.set(p.querySelectorAll("[data-aw-side]"), i === 0 ? { yPercent: 0, autoAlpha: 1 } : { yPercent: 60, autoAlpha: 0 }),
        );
        ghosts.forEach((g, i) => gsap.set(g, { autoAlpha: i === 0 ? 0.05 : 0, scale: i === 0 ? 1 : 0.96 }));

        const paint = (i: number) => {
          if (numEl) numEl.textContent = String(i + 1).padStart(2, "0");
          segs.forEach((s, si) => s.setAttribute("data-done", String(si <= i)));
          tokens.forEach((t, ti) => t.setAttribute("data-active", String(ti === i % tokens.length)));
          if (orbitEl) gsap.to(orbitEl, { autoAlpha: i >= 1 ? 1 : 0, duration: 0.5, overwrite: "auto" });
        };
        paint(0);

        let current = 0;
        // дискретный переход. На каждой смене убиваем ВСЕ текущие твины текста и
        // разводим все панели заново — так при быстром скролле (с пропуском шагов)
        // не остаётся «висящих» твинов и старый текст не наезжает на новый.
        const showStep = (i: number, prev: number) => {
          const dir = i > prev ? 1 : -1;
          gsap.killTweensOf("[data-aw-panel] [data-aw-side]");
          gsap.killTweensOf(ghosts);

          // пропущенные панели (не активная и не предыдущая) — гасим мгновенно
          panels.forEach((pnl, pi) => {
            if (pi === i || pi === prev) return;
            gsap.set(pnl.querySelectorAll("[data-aw-side]"), { yPercent: pi < i ? -45 : 55, autoAlpha: 0 });
          });
          // предыдущая — уезжает
          if (prev !== i) {
            gsap.to(sidesOf(prev), { yPercent: -45 * dir, autoAlpha: 0, duration: 0.3, stagger: 0.04, ease: "power2.in" });
          }
          // активная — приезжает (с задержкой, чтобы старый успел уйти)
          gsap.fromTo(
            sidesOf(i),
            { yPercent: 55 * dir, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, duration: 0.5, stagger: 0.07, ease: "power3.out", delay: 0.18 },
          );

          // призрачное слово
          ghosts.forEach((g, gi) => {
            if (gi !== i && gi !== prev) gsap.set(g, { autoAlpha: 0, scale: 0.96 });
          });
          if (prev !== i) gsap.to(ghosts[prev], { autoAlpha: 0, scale: 0.96, duration: 0.4 });
          gsap.fromTo(ghosts[i], { autoAlpha: 0, scale: 0.96 }, { autoAlpha: 0.05, scale: 1, duration: 0.7, ease: "power2.out", delay: 0.1 });
          paint(i);
        };

        const st = ScrollTrigger.create({
          trigger: "#awareness",
          start: "top top",
          end: `+=${(N - 1) * 95}%`,
          pin: "[data-aw-pin]",
          refreshPriority: 1,
          snap: {
            snapTo: (v) => Math.round(v * (N - 1)) / (N - 1),
            duration: { min: 0.2, max: 0.5 },
            ease: "power2.inOut",
          },
          onUpdate: (self) => {
            const i = Math.round(self.progress * (N - 1));
            if (i !== current) {
              const prev = current;
              current = i;
              showStep(i, prev);
            }
          },
        });

        // клик по сегменту прогресса — переход к шагу
        segs.forEach((seg, i) => {
          seg.addEventListener("click", () => {
            const target = st.start + (i / (N - 1)) * (st.end - st.start);
            const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number) => void } }).__lenis;
            if (lenis) lenis.scrollTo(target);
            else window.scrollTo(0, target);
          });
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

        // карточки «Состав» — появляются по очереди 1·2·3 при входе в блок
        const vitCards = gsap.utils.toArray<HTMLElement>("[data-vit-card]");
        if (vitCards.length) {
          gsap.set(vitCards, { autoAlpha: 0, y: 26, scale: 0.96 });
          ScrollTrigger.create({
            trigger: "#vitamins",
            start: "top 60%",
            onEnter: () =>
              gsap.to(vitCards, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.2, ease: "power3.out", overwrite: true }),
            onLeaveBack: () =>
              gsap.to(vitCards, { autoAlpha: 0, y: 26, scale: 0.96, duration: 0.3, stagger: 0.05, overwrite: true }),
          });
        }

        // «Спорт»: счётчики статов «доезжают» при входе
        const stats = gsap.utils.toArray<HTMLElement>("[data-stat]");
        if (stats.length) {
          ScrollTrigger.create({
            trigger: "#sport",
            start: "top 55%",
            onEnter: () => {
              stats.forEach((s) => {
                const to = Number(s.dataset.to ?? 0);
                const pre = s.dataset.pre ?? "";
                const suf = s.dataset.suf ?? "";
                const o = { v: 0 };
                gsap.to(o, {
                  v: to,
                  duration: 1.1,
                  ease: "power2.out",
                  overwrite: true,
                  onUpdate: () => {
                    s.textContent = pre + Math.round(o.v) + suf;
                  },
                });
              });
            },
            onLeaveBack: () => {
              stats.forEach((s) => (s.textContent = (s.dataset.pre ?? "") + "0" + (s.dataset.suf ?? "")));
            },
          });
        }
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
