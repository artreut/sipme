"use client";

import styles from "./heroBackdrop.module.css";

/**
 * Содержимое первого экрана живёт в слое ПОД канвасом (z-index 0),
 * поэтому 3D-банка визуально проходит ПОВЕРХ заголовка «ВОССТАНОВЛЕНИЕ».
 * Остальные элементы банку не перекрывают, так что читаются как обычно.
 */
export function HeroBackdrop() {
  return (
    <div className={styles.backdrop}>
      {/* плавная коралловая петля */}
      <svg className={styles.line} viewBox="0 0 1440 900" fill="none" aria-hidden preserveAspectRatio="xMidYMid slice">
        <path
          d="M1440 150 C 1080 230, 980 470, 720 520 C 380 585, 360 250, 470 470 C 560 650, 720 760, 600 880"
          stroke="var(--coral)"
          strokeWidth="1.6"
        />
      </svg>

      <div className={styles.inner}>
        <div className={styles.top}>
          <span className={styles.badge} data-reveal>
            <i className={styles.badgeDot} />в наличии · отгрузка за 24ч
          </span>
          <p className={`eyebrow ${styles.eyebrow}`} data-reveal>
            Безалкогольный электролитный напиток
          </p>
        </div>

        <h1 className={styles.headline}>
          <span className={`display outline ${styles.l1}`} data-reveal>
            Восстановление
          </span>
          <span className={styles.l2row}>
            <span className={`serif ${styles.l2}`} data-reveal>
              с&nbsp;каждым
            </span>
            <span className={`serif ${styles.l3}`} data-reveal>
              глотком
            </span>
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
    </div>
  );
}
