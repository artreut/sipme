"use client";

import styles from "./awareness.module.css";

const MINERALS = [
  ["Na", "Натрий"],
  ["K", "Калий"],
  ["Mg", "Магний"],
  ["Cl", "Хлорид"],
  ["Ca", "Кальций"],
  ["P", "Фосфор"],
];

type Panel = {
  index: string;
  tag: string;
  title: React.ReactNode;
  body: React.ReactNode;
  extra?: React.ReactNode;
};

const PANELS: Panel[] = [
  {
    index: "01",
    tag: "Что такое электролиты",
    title: (
      <>
        <span className="accent">SIPME</span> для ритма
        <br />
        современной жизни
      </>
    ),
    body: (
      <>
        SIPME — это напиток, который содержит электролиты, иначе говоря,
        заряженные частицы: минералы, оказывающие положительное влияние на ваш
        организм и общее самочувствие.
      </>
    ),
    extra: (
      <ul className={styles.minerals}>
        {MINERALS.map(([sym, name]) => (
          <li key={sym}>
            <span className={styles.sym}>{sym}</span>
            <span className={styles.symName}>{name}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    index: "02",
    tag: "Влияние минералов",
    title: (
      <>
        Как SIPME
        <br />
        улучшает <span className="accent">состояние</span>
      </>
    ),
    body: (
      <>
        <p>
          Минералы участвуют в процессах, которые ежедневно влияют на состояние
          организма — от поддержания водного баланса до работы мышц и нервной
          системы. Электролиты помогают сохранять внутренний баланс и
          поддерживать естественные процессы восстановления.
        </p>
        <p>
          Когда уровень жидкости и минералов поддерживается правильно, тело
          легче справляется с ежедневной нагрузкой — это влияет на самочувствие,
          энергию и концентрацию в течение дня.
        </p>
      </>
    ),
  },
  {
    index: "03",
    tag: "Стресс не победим",
    title: (
      <>
        Почему обычная <span className="accent">вода</span>
        <br />
        не всегда справляется
      </>
    ),
    body: (
      <>
        <p>
          Ежедневно организм сталкивается с нагрузкой — работа, стресс,
          тренировки, недостаток сна и высокий ритм жизни постепенно расходуют
          внутренние ресурсы. Вместе с жидкостью человек теряет важные минералы.
        </p>
        <p>
          Роль электролитов в поддержании гидратации изучается в спортивной
          медицине, нутрициологии и физиологии. Минералы в составе SIPME
          участвуют в восстановлении водного баланса.
        </p>
      </>
    ),
  },
  {
    index: "04",
    tag: "Исследования",
    title: (
      <>
        Что говорит <span className="accent">наука</span>
        <br />
        про электролиты
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
          <a href="#">
            → Исследование А. Ю. Шитова, заслуженного изобретателя РФ, ВМА им.
            С. М. Кирова
          </a>
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

        <div className={`shell ${styles.shell}`}>
          {PANELS.map((p, i) => (
            <article
              key={p.index}
              className={styles.panel}
              data-aw-panel
              data-active={i === 0 ? "true" : undefined}
            >
              <div className={styles.head} data-aw-side>
                <p className={`eyebrow ${styles.tag}`}>{p.tag}</p>
                <h2 className={`display ${styles.title}`}>{p.title}</h2>
              </div>
              <div className={styles.content} data-aw-side>
                <div className={styles.body}>{p.body}</div>
                {p.extra}
              </div>
            </article>
          ))}
        </div>

        <div className={styles.counter}>
          <span data-aw-counter>01</span>
          <span className={styles.counterTotal}>/ 04</span>
        </div>
      </div>
    </section>
  );
}
