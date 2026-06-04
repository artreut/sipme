"use client";

import styles from "./hero.module.css";

/**
 * Распорка первого экрана: задаёт высоту прокрутки и служит триггером
 * хореографии. Сам контент героя — в слое HeroBackdrop (под канвасом),
 * чтобы банка проходила поверх заголовка.
 */
export function Hero() {
  return <section id="hero" className={styles.hero} data-bg="light" aria-hidden />;
}
