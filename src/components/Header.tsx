"use client";

import { Logo } from "./Logo";
import styles from "./header.module.css";

const NAV = ["Технология", "Состав", "Исследование", "Купить", "Акция", "Контакты"];

export function Header() {
  return (
    <header className={styles.header}>
      <a href="#hero" className={styles.brand} aria-label="SIPME — на главную">
        <Logo height={20} />
      </a>

      <nav className={styles.nav}>
        {NAV.map((item) => (
          <a key={item} href="#" className={styles.link}>
            {item}
          </a>
        ))}
      </nav>

      <div className={styles.right}>
        <span className={styles.lang}>RU</span>
        <a href="#sport" className={styles.cta}>
          <span className={styles.dot} />
          Заказать
        </a>
      </div>
    </header>
  );
}
