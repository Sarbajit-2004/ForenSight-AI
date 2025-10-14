import styles from "./tag-chip.module.css"

export function TagChip({
  label,
  tone = "neutral",
  title,
}: {
  label: string
  tone?: "neutral" | "info" | "warn" | "danger"
  title?: string
}) {
  return (
    <span className={`${styles.chip} ${styles[tone]}`} role="note" aria-label={label} title={title || label}>
      {label}
    </span>
  )
}
