"use client";

import styles from "./vitamins.module.css";

const CARDS = [
  {
    n: "01",
    title: "Чистый состав",
    body: "Только то, что нужно организму для современного ритма жизни и тренировок.",
  },
  {
    n: "02",
    title: "Электролиты",
    body: "Натрий, калий, магний, хлорид, кальций, фосфор — минералы на каждый день.",
  },
  {
    n: "03",
    title: "Витамин C",
    body: "Поддерживает естественные процессы и дополняет формулу SIPME.",
  },
];

// минералы по орбите: угол (deg) и радиус (% от центра)
const NODES: [string, number, number][] = [
  ["Na", -82, 44],
  ["K", -18, 27],
  ["Mg", 38, 46],
  ["Cl", 104, 29],
  ["Ca", 158, 43],
  ["P", 214, 26],
];

export function Vitamins() {
  return (
    <section id="vitamins" className={`section ${styles.vitamins}`} data-bg="light">
      <div className={`shell ${styles.shell}`}>
        {/* левая колонка — текст и асимметричные карточки */}
        <div className={styles.left}>
          <p className={`mono ${styles.label}`} data-reveal>
            03 — Состав
          </p>
          <h2 className={`display ${styles.heading}`} data-reveal>
            Формула, созданная
            <br />
            для <i className={`serif ${styles.balance}`}>баланса</i>
          </h2>

          <p className={styles.lead} data-reveal>
            <b>Чистый состав без компромиссов</b> — каждый компонент работает на
            гидратацию и восстановление, без лишних добавок и сахара.
          </p>

          <div className={styles.cards}>
            {CARDS.map((c) => (
              <article key={c.n} className={styles.card} data-reveal>
                <span className={`mono ${styles.cardNum}`}>{c.n}</span>
                <h3 className={styles.cardTitle}>{c.title}</h3>
                <p className={styles.cardBody}>{c.body}</p>
              </article>
            ))}
          </div>
        </div>

        {/* правая колонка — орбита минералов вокруг банки */}
        <div className={styles.right} data-reveal>
          <div className={styles.orbit}>
            <span className={styles.ring} style={{ inset: "4%" }} />
            <span className={styles.ring} style={{ inset: "20%" }} />
            <span className={styles.ring} style={{ inset: "36%" }} />
            <span className={styles.spin}>
              {NODES.map(([sym, a, r]) => {
                const rad = (a * Math.PI) / 180;
                const left = 50 + r * Math.cos(rad);
                const top = 50 + r * Math.sin(rad);
                return (
                  <span
                    key={sym}
                    className={styles.node}
                    style={{ left: `${left}%`, top: `${top}%` }}
                  >
                    <span className={styles.nodeInner}>
                      <i className={styles.nodeDot} />
                      <span className={`mono ${styles.nodeLabel}`}>{sym}</span>
                    </span>
                  </span>
                );
              })}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
