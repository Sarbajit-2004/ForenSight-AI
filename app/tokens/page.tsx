import styles from "./styles.module.css"

const CORE_TOKENS = [
  "--color-background",
  "--color-foreground",
  "--color-card",
  "--color-card-foreground",
  "--color-primary",
  "--color-primary-foreground",
  "--color-secondary",
  "--color-secondary-foreground",
  "--color-muted",
  "--color-muted-foreground",
  "--color-accent",
  "--color-accent-foreground",
  "--color-border",
  "--color-input",
  "--color-ring",
]

const FS_TOKENS = [
  "--fs-primary",
  "--fs-primary-500",
  "--fs-primary-300",
  "--fs-accent",
  "--fs-text",
  "--fs-subtext",
  "--fs-border",
  "--fs-surface",
  "--fs-surface-alt",
  "--fs-radius",
]

const TYPE_SCALE = [
  { label: "H1", css: "clamp(24px, 2vw + 14px, 32px)" },
  { label: "H2", css: "clamp(20px, 1.6vw + 10px, 24px)" },
  { label: "Body", css: "clamp(14px, 0.6vw + 10px, 16px)" },
]

const SPACING = ["4px", "6px", "8px", "12px", "16px", "20px", "24px", "32px"]

export default function TokensPage() {
  return (
    <main className={`container ${styles.wrap}`}>
      <h2>Design Tokens</h2>
      <p>Light/Dark variants via CSS variables. Toggle theme in the top bar to preview.</p>

      <section className={styles.section}>
        <h3>Core Semantic Tokens</h3>
        <div className={styles.grid}>
          {CORE_TOKENS.map((t) => (
            <div key={t} className={styles.card} title={t}>
              <div className={styles.swatch} style={{ background: `var(${t})` }} />
              <div className={styles.name}>{t}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h3>ForenSight AI Brand Tokens</h3>
        <div className={styles.grid}>
          {FS_TOKENS.map((t) => (
            <div key={t} className={styles.card} title={t}>
              <div className={styles.swatch} style={{ background: `var(${t})` }} />
              <div className={styles.name}>{t}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h3>Type Ramp (clamp)</h3>
        <div className={styles.typeGrid}>
          {TYPE_SCALE.map((t) => (
            <div key={t.label} className={styles.typeCard}>
              <div className={styles.typeLabel}>
                {t.label} — {t.css}
              </div>
              <div className={styles.typography} style={{ fontSize: t.css }}>
                ForenSight AI — Evidence Explorer
              </div>
            </div>
          ))}
        </div>
        <p className={styles.subtle}>Line length target: 60–88ch. Body line-height 1.4–1.6.</p>
      </section>

      <section className={styles.section}>
        <h3>Spacing Scale</h3>
        <div className={styles.spacingRow}>
          {SPACING.map((s) => (
            <div key={s} className={styles.spaceItem}>
              <div className={styles.spaceBar} style={{ width: s }} />
              <div className={styles.spaceLabel}>{s}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h3>Radius & Shadows</h3>
        <div className={styles.radiusGrid}>
          <div className={styles.radiusCard}>
            <div className={styles.radiusBox} style={{ borderRadius: "10px" }} />
            <div className={styles.name}>Radius 10px</div>
          </div>
          <div className={styles.radiusCard}>
            <div className={styles.radiusBox} style={{ borderRadius: "12px" }} />
            <div className={styles.name}>Radius 12px (fs-radius)</div>
          </div>
          <div className={styles.radiusCard}>
            <div className={styles.radiusBox} style={{ borderRadius: "14px" }} />
            <div className={styles.name}>Radius 14px</div>
          </div>
        </div>
        <div className={styles.shadowRow}>
          <div className={styles.shadowBox} style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}>
            Subtle
          </div>
          <div className={styles.shadowBox} style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            Card
          </div>
          <div className={styles.shadowBox} style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
            Overlay
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h3>Container & Grid Preview</h3>
        <div className={styles.containerDemo}>
          <div className={styles.containerBar}>.container max-width clamp(1440px, 90vw, 1600px)</div>
          <div className={styles.grid12Demo}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={styles.grid12Cell}>
                {i + 1}
              </div>
            ))}
          </div>
        </div>
        <p className={styles.subtle}>No horizontal scroll at 1280/1440/1920. Elements wrap and use minmax(0,1fr).</p>
      </section>
    </main>
  )
}
