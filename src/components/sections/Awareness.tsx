"use client";

import styles from "./awareness.module.css";

const MINERALS: [string, number, number][] = [
  ["Na", -90, 44],
  ["K", -30, 28],
  ["Mg", 30, 46],
  ["Cl", 90, 29],
  ["Ca", 150, 44],
  ["P", 210, 27],
];

type Panel = {
  index: string;
  ghost: string;
  tag: string;
  title: React.ReactNode;
  body: React.ReactNode;
};

const PANELS: Panel[] = [
  {
    index: "01",
    ghost: "Электролиты",
    tag: "Что такое электролиты",
    title: (
      <>
        <span className="accent">SIPME</span> для ритма
        <br />
        <span className="outline">современной</span> жизни
      </>
    ),
    body: (
      <>
        SIPME — это напиток, который содержит электролиты, иначе говоря,
        заряженные частицы: минералы, оказывающие положительное влияние на ваш
        организм и общее самочувствие.
      </>
    ),
  },
  {
    index: "02",
    ghost: "Баланс",
    tag: "Влияние минералов",
    title: (
      <>
        <span className="outline">Как</span> SIPME
        <br />
        улучшает <span className="accent">состояние</span>
      </>
    ),
    body: (
      <>
        <p>
          Минералы участвуют в процессах, которые ежедневно влияют на состояние
          организма — от поддержания водного баланса до работы мышц и нервной
          системы. Электролиты помогают сохранять внутренний баланс.
        </p>
        <p>
          Когда уровень жидкости и минералов поддерживается правильно, тело
          легче справляется с ежедневной нагрузкой — это влияет на энергию и
          концентрацию.
        </p>
      </>
    ),
  },
  {
    index: "03",
    ghost: "Гидратация",
    tag: "Стресс не победим",
    title: (
      <>
        Почему обычная <span className="accent">вода</span>
        <br />
        <span className="outline">не всегда</span> справляется
      </>
    ),
    body: (
      <>
        <p>
          Ежедневно организм сталкивается с нагрузкой — работа, стресс,
          тренировки, недостаток сна. Вместе с жидкостью человек теряет важные
          минералы.
        </p>
        <p>
          Роль электролитов в поддержании гидратации изучается в спортивной
          медицине, нутрициологии и физиологии.
        </p>
      </>
    ),
  },
  {
    index: "04",
    ghost: "Наука",
    tag: "Исследования",
    title: (
      <>
        Что говорит <span className="accent">наука</span>
        <br />
        про <span className="outline">электролиты</span>
      </>
    ),
    body: (
      <>
        <p>
          Факт положительного влияния электролитов давно доказан наукой — мы
          подобрали пару интересных материалов для вас.
        </p>
        <p className={styles.refs}>
          <a href="#">→ Статья доктора биологических наук, профессора Н. К. Артемьева</a>
          <a href="#">→ Исследование А. Ю. Шитова, ВМА им. С. М. Кирова</a>
        </p>
      </>
    ),
  },
];

export function Awareness() {
  return (
    <section id="awareness" className={styles.awareness} data-bg="light">
      <div className={styles.pin} data-aw-pin>
        <p className="eyebrow" data-aw-tag>
          Осведомленность
        </p>

        {/* слой 1: призрачное слово-гигант */}
        <div className={styles.ghost} aria-hidden>
          {PANELS.map((p, i) => (
            <span key={p.index} className={styles.ghostWord} data-aw-ghost data-i={i}>
              {p.ghost}
            </span>
          ))}
        </div>

        {/* слой 2: орбита минералов вокруг банки (со 2-го шага) */}
        <div className={styles.orbit} data-aw-orbit aria-hidden>
          <span className={styles.ring} style={{ inset: "0%" }} />
          <span className={styles.ring} style={{ inset: "16%" }} />
          <span className={styles.spin}>
            {MINERALS.map(([sym, a, r], i) => {
              const rad = (a * Math.PI) / 180;
              const left = 50 + r * Math.cos(rad);
              const top = 50 + r * Math.sin(rad);
              return (
                <span
                  key={sym}
                  className={styles.token}
                  data-aw-token
                  data-i={i}
                  style={{ left: `${left}%`, top: `${top}%` }}
                >
                  <span className={styles.tokenInner}>{sym}</span>
                </span>
              );
            })}
          </span>
        </div>

        {/* текст по сторонам */}
        <div className={`shell ${styles.shell}`}>
          {PANELS.map((p) => (
            <article key={p.index} className={styles.panel} data-aw-panel>
              <div className={styles.head} data-aw-side>
                <p className={`eyebrow ${styles.tag}`}>{p.tag}</p>
                <h2 className={`display ${styles.title}`}>{p.title}</h2>
              </div>
              <div className={styles.content} data-aw-side>
                <div className={styles.body}>{p.body}</div>
              </div>
            </article>
          ))}
        </div>

        {/* слой 3: прогресс по шагам */}
        <div className={styles.progress}>
          <span className={styles.num}>
            <span data-aw-num>01</span>
            <span className={styles.numTotal}>/ 0{PANELS.length}</span>
          </span>
          <div className={styles.bar}>
            {PANELS.map((p, i) => (
              <button
                key={p.index}
                className={styles.seg}
                data-aw-seg
                data-i={i}
                aria-label={`Шаг ${i + 1}`}
              >
                <span className={styles.segFill} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
