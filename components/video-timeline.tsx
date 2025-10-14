import styles from "./video-timeline.module.css"

export function VideoTimeline({
  durationSec,
  markers = [],
}: {
  durationSec: number
  markers: Array<{ t: number; label?: string }>
}) {
  return (
    <div className={styles.wrap} aria-label="Key moments timeline">
      {markers.map((m, i) => (
        <div
          key={i}
          className={styles.marker}
          title={`${m.label || "Moment"} @ ${m.t}s`}
          style={{ left: `${(m.t / durationSec) * 100}%` }}
          aria-label={m.label || `Marker at ${m.t} seconds`}
        />
      ))}
    </div>
  )
}
