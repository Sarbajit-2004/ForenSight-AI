export function Skeleton({ lines = 1 }: { lines?: number }) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 14,
            borderRadius: 6,
            background: "color-mix(in oklch, var(--color-muted) 60%, transparent)",
          }}
        />
      ))}
    </div>
  )
}
