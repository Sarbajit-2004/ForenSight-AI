import { AppShell } from "@/components/app-shell"
import styles from "./styles.module.css"

export default function SettingsPage() {
  return (
    <AppShell breadcrumb={[{ label: "Settings" }]}>
      <div className={styles.wrap}>
        <section className={styles.section}>
          <h3>Environment</h3>
          <div className={styles.kv}>
            Backend endpoints: <code>http://localhost</code> (read-only)
          </div>
          <div className={styles.kv}>Environment: LOCAL / ON-PREM</div>
          <div className={styles.kv}>Build/Version: v0.9.2 • 2025.10.13</div>
        </section>

        <section className={styles.section}>
          <h3>Preferences</h3>
          <div className={styles.controls}>
            <label>
              <input type="checkbox" /> Dark theme
            </label>
            <label>
              <input type="checkbox" /> Compact density
            </label>
            <label>
              Timestamp format
              <select>
                <option>ISO</option>
                <option>Locale</option>
              </select>
            </label>
            <label>
              Timezone
              <select>
                <option>Local</option>
                <option>UTC</option>
              </select>
            </label>
          </div>
        </section>

        <section className={styles.section}>
          <h3>Data retention</h3>
          <p>Data retained locally up to 30 days. You can clear local cache below.</p>
          <button className={styles.btn}>Clear local cache</button>
        </section>

        <section className={styles.section}>
          <h3>Legal & audit</h3>
          <ul className={styles.links}>
            <li>
              <a href="#" aria-label="Audit policy link">
                Audit policy
              </a>
            </li>
            <li>
              <a href="#" aria-label="Legal policy link">
                Legal policy
              </a>
            </li>
          </ul>
        </section>
      </div>
    </AppShell>
  )
}
