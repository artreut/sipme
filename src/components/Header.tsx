"use client";

import { Logo } from "./Logo";
import styles from "./header.module.css";

const NAV: [string, string][] = [
  ["Технология", "#awareness"],
  ["Состав", "#vitamins"],
  ["Исследование", "#awareness"],
  ["Купить", "#sport"],
  ["Акция", "#sport"],
  ["Контакты", "#sport"],
];

export function Header() {
  return (
    <header className={styles.header}>
      <a href="#hero" className={styles.brand} aria-label="SIPME — на главную">
        <Logo height={20} />
      </a>

      <nav className={styles.nav}>
        {NAV.map(([label, href]) => (
          <a key={label} href={href} className={styles.link}>
            {label}
          </a>
        ))}
      </nav>

      <div className={styles.right}>
        <a href="#sport" className={styles.cta}>
          <span className={styles.dot} />
          Заказать
        </a>
      </div>
    </header>
  );
}
