"use client";

import styles from "./vitamins.module.css";

const CARDS = [
  {
    n: "01",
    cls: "c1",
    title: "Чистый состав",
    body: "Только то, что нужно организму для современного ритма жизни и тренировок.",
  },
  {
    n: "02",
    cls: "c2",
    title: "Электролиты",
    body: "Натрий, калий, магний, хлорид, кальций, фосфор — минералы на каждый день.",
  },
  {
    n: "03",
    cls: "c3",
    title: "Витамин С",
    body: "Поддерживает естественные процессы и дополняет формулу SIPME.",
  },
] as const;

export function Vitamins() {
  return (
    <section id="vitamins" className={`section ${styles.vitamins}`} data-bg="light">
      {/* левая градиентная карточка */}
      <div className={styles.intro} data-reveal>
        <p className={`mono ${styles.label}`}>03 — Состав</p>
        <h2 className={`display ${styles.heading}`}>
          Формула, <span className="outline">созданная</span>
          <br />
          для <span className="accent">баланса</span>
        </h2>
        <p className={styles.lead}>
          <b>Чистый состав без компромиссов</b> — каждый компонент работает на
          гидратацию и восстановление, без лишних добавок и сахара.
        </p>
      </div>

      {/* сцена с банкой и плавающими карточками */}
      <div className={styles.stage}>
        <span className={styles.ring} aria-hidden />
        <svg className={styles.links} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          <line x1="65" y1="33" x2="58" y2="30" />
          <line x1="77" y1="50" x2="84" y2="54" />
          <line x1="63" y1="69" x2="55" y2="72" />
        </svg>
        <span className={`${styles.point} ${styles.p3}`} aria-hidden />
        <span className={`${styles.point} ${styles.p2}`} aria-hidden />
        <span className={`${styles.point} ${styles.p1}`} aria-hidden />

        {CARDS.map((c) => (
          <article key={c.n} className={`${styles.card} ${styles[c.cls]}`} data-vit-card>
            <span className={`mono ${styles.cardNum}`}>{c.n}</span>
            <h3 className={styles.cardTitle}>{c.title}</h3>
            <p className={styles.cardBody}>{c.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
