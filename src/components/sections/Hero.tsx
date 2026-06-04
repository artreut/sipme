"use client";

import styles from "./hero.module.css";

export function Hero() {
  return (
    <section id="hero" className={`section ${styles.hero}`} data-bg="light">
      {/* декоративная лента */}
      <svg className={styles.ribbon} viewBox="0 0 800 600" fill="none" aria-hidden>
        <path
          d="M-20 380 C 180 300, 240 120, 430 150 C 640 184, 600 420, 760 360"
          stroke="var(--coral)"
          strokeWidth="1.5"
        />
      </svg>
      <span className={styles.orb} aria-hidden />

      <div className={`shell ${styles.shell}`}>
        <div className={styles.top}>
          <p className="eyebrow" data-reveal>
            Безалкогольный электролитный напиток
          </p>
          <span className={styles.badge} data-reveal>
            <i className={styles.badgeDot} />в наличии · отгрузка за 24ч
          </span>
        </div>

        <h1 className={styles.title}>
          <span className={styles.l1} data-reveal>Восстановление</span>
          <span className={styles.l2} data-reveal>
            <span className="outline">с&nbsp;каждым</span>
            <span className={styles.drop} aria-hidden>
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3c3.5 4.5 6 7.8 6 11a6 6 0 1 1-12 0c0-3.2 2.5-6.5 6-11Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
            </span>
          </span>
          <span className={styles.l3} data-reveal>
            <i className={`serif ${styles.glotok}`}>глотком</i>
          </span>
        </h1>

        <div className={styles.bottom}>
          <a href="#sport" className={styles.cta} data-reveal>
            Заказать <span aria-hidden>→</span>
          </a>
          <ul className={styles.chips}>
            <li data-reveal>330&nbsp;мл</li>
            <li data-reveal>юдзу · личи · ананас</li>
            <li data-reveal>6 минералов + Vitamin&nbsp;C</li>
          </ul>
        </div>
      </div>

      <div className={styles.scroll} data-reveal>
        <span className="mono">scroll</span>
        <span className={styles.scrollLine} />
      </div>
    </section>
  );
}
