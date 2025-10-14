"use client"

import { useRef, useState } from "react"
import styles from "./dropzone.module.css"

type FileRow = {
  name: string
  size: number
  lastModified: number
  sha256?: string
  progress?: number
  status?: "idle" | "computing" | "ready"
  error?: string
}

export function Dropzone({
  onFilesChange,
}: {
  onFilesChange?: (rows: FileRow[]) => void
}) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [rows, setRows] = useState<FileRow[]>([])
  const [isOver, setOver] = useState(false)

  function addFiles(files: FileList | null) {
    if (!files) return
    const list: FileRow[] = Array.from(files).map((f) => ({
      name: f.name,
      size: f.size,
      lastModified: f.lastModified,
      status: "computing",
      progress: 0,
    }))
    setRows(list)
    onFilesChange?.(list)
    // simulate SHA-256 compute with counting progress
    list.forEach((r, idx) => {
      const start = Date.now()
      const id = setInterval(() => {
        setRows((prev) =>
          prev.map((p) => {
            if (p.name !== r.name) return p
            const elapsed = Date.now() - start
            const next = Math.min(100, Math.floor(elapsed / 10) + 10 * (idx + 1))
            const done = next >= 100
            return {
              ...p,
              progress: next,
              status: done ? "ready" : "computing",
              sha256: done ? computeHashPlaceholder(p.name) : p.sha256,
            }
          }),
        )
      }, 80)
      // clear when complete
      setTimeout(() => clearInterval(id), 1600 + idx * 200)
    })
  }

  function computeHashPlaceholder(name: string) {
    let hash = 0
    for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0
    return `sha256:${hash.toString(16).padStart(8, "0")}${"abcd1234".repeat(7)}`
  }

  return (
    <div>
      <div
        className={`${styles.zone} ${isOver ? styles.over : ""}`}
        onDragOver={(e) => {
          e.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setOver(false)
          addFiles(e.dataTransfer.files)
        }}
        role="region"
        aria-label="Drag and drop zone"
        aria-live="polite"
      >
        <div className={styles.zoneInner}>
          <span className={styles.icon} aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" focusable="false">
              <path d="M19 18a3 3 0 0 0-.31-1.33A3.996 3.996 0 0 0 16 9c-.47 0-.91.08-1.33.22A5.002 5.002 0 0 0 6 12.9V13a3 3 0 0 0-3 3 3 3 0 0 0 3 3h13a3 3 0 0 0 3-3 3 3 0 0 0-3-3zM12 7l3 3h-2v4h-2v-4H9l3-3z" />
            </svg>
          </span>
          <p className={styles.zoneTitle}>Drop a .ufdr or .zip here</p>
          <p className={styles.zoneHint}>
            {isOver ? "Drop to compute SHA-256" : "We’ll compute a local SHA-256 and prepare it for analysis."}
          </p>
          <button className={styles.pickBtn} onClick={() => inputRef.current?.click()} aria-label="Open file picker">
            Choose files
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".ufdr,.zip"
            multiple
            hidden
            onChange={(e) => addFiles(e.target.files)}
          />
        </div>
      </div>

      {rows.length > 0 && (
        <div className={styles.listWrap} role="table" aria-label="Selected files">
          <div className={styles.header} role="row">
            <div className={styles.cell} role="columnheader">
              Name
            </div>
            <div className={styles.cell} role="columnheader">
              Size
            </div>
            <div className={styles.cell} role="columnheader">
              Last Modified
            </div>
            <div className={styles.cell} role="columnheader">
              SHA-256
            </div>
            <div className={styles.cell} role="columnheader">
              Status
            </div>
          </div>
          {rows.map((r) => (
            <div className={styles.row} key={r.name} role="row">
              <div className={styles.cell} role="cell">
                {r.name}
              </div>
              <div className={styles.cell} role="cell">
                {(r.size / 1024).toFixed(1)} KB
              </div>
              <div className={styles.cell} role="cell">
                {new Date(r.lastModified).toLocaleString()}
              </div>
              <div className={styles.cell} role="cell">
                {r.sha256 ? <code className={styles.hashReveal}>{r.sha256}</code> : <span>Computing…</span>}
              </div>
              <div className={styles.cell} role="cell" aria-live="polite">
                {r.status === "computing" ? (
                  <div className={styles.progressWrap} aria-label="Computing hash">
                    <div className={styles.progressBar} style={{ width: `${r.progress ?? 0}%` }} />
                  </div>
                ) : (
                  <span className={styles.badge}>Ready</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
