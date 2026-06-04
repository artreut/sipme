"use client";

import styles from "./sport.module.css";

export function Sport() {
  return (
    <section id="sport" className={`section ${styles.sport}`} data-bg="dark">
      <div className={`shell ${styles.shell}`}>
        <div className={styles.copy}>
          <p className="eyebrow" data-reveal>
            Для активного образа жизни
          </p>
          <h2 className={`display ${styles.heading}`} data-reveal>
            <span className="outline">Восста</span>&shy;<span className="accent">новление</span>
          </h2>

          <p className={styles.lead} data-reveal>
            Восстанавливает после интенсивных, силовых и кардио нагрузок.
            Электролитная вода усваивается быстрее, отлично подходит для высоких
            нагрузок и снижает ощущение усталости.
          </p>

          <div className={styles.stats}>
            <div className={styles.stat} data-reveal>
              <span className={`mono ${styles.statVal}`} data-stat data-to="2" data-pre="×" data-suf="">
                ×2
              </span>
              <span className={styles.statLabel}>
                быстрее усвоение, чем у обычной воды
              </span>
            </div>
            <div className={styles.stat} data-reveal>
              <span className={`mono ${styles.statVal}`} data-stat data-to="6" data-pre="" data-suf="+">
                6+
              </span>
              <span className={styles.statLabel}>
                ключевых минералов в каждой банке
              </span>
            </div>
          </div>

          <p className={`mono ${styles.foot}`} data-reveal>
            Поддерживает гидратацию во время физических нагрузок
          </p>
        </div>
      </div>
    </section>
  );
}
