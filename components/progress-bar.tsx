import styles from "./progress-bar.module.css"

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className={styles.track} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className={styles.bar} style={{ width: `${value}%` }} />
    </div>
  )
}
