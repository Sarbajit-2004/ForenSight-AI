import styles from "./health-pill.module.css"

export function HealthPill({ status, label }: { status: "ok" | "degraded" | "down"; label: string }) {
  return (
    <span
      className={`${styles.pill} ${styles[status]}`}
      role="status"
      aria-label={`${label} status ${status}`}
      title={`${label}: ${status}`}
    >
      <span className={styles.dot} aria-hidden="true" /> {label}
    </span>
  )
}
