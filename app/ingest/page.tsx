"use client"

import { AppShell } from "@/components/app-shell"
import { Dropzone } from "@/components/dropzone"
import { HealthPill } from "@/components/health-pill"
import { ProgressBar } from "@/components/progress-bar"
import styles from "./styles.module.css"
import { useState } from "react"
import Link from "next/link"

type Item = {
  name: string
  progress: number
  status: "idle" | "validating" | "ingesting" | "success" | "error"
  error?: string
}

export default function IngestPage() {
  const [items, setItems] = useState<Item[]>([])
  const [validated, setValidated] = useState(false)

  function onFilesChange(rows: any[]) {
    setItems(rows.map((r) => ({ name: r.name, progress: 0, status: "idle" as const })))
  }

  function validate() {
    setItems((it) => it.map((i) => ({ ...i, status: "validating" })))
    setTimeout(() => {
      setValidated(true)
      setItems((it) => it.map((i) => ({ ...i, status: "idle" })))
    }, 800)
  }

  function startIngest() {
    setItems((it) => it.map((i, idx) => ({ ...i, status: "ingesting", progress: 5 + idx * 5 })))
    const timer = setInterval(() => {
      setItems((it) =>
        it.map((i) => {
          if (i.status === "ingesting") {
            const next = Math.min(100, i.progress + 12)
            return { ...i, progress: next, status: next === 100 ? "success" : "ingesting" }
          }
          return i
        }),
      )
    }, 400)
    setTimeout(() => clearInterval(timer), 6000)
  }

  return (
    <AppShell breadcrumb={[{ label: "Ingest" }]}>
      <div className={styles.grid}>
        <section className={styles.main}>
          <h2>Ingest Evidence Bundles</h2>
          <Dropzone onFilesChange={onFilesChange} />

          <div className={styles.actions}>
            <button className={styles.secondary} onClick={validate}>
              Validate Bundle
            </button>
            <button className={styles.primary} disabled={!validated} onClick={startIngest}>
              Start Ingest
            </button>
          </div>

          <div className={styles.stateBlock}>
            {items.length === 0 ? (
              <div className={styles.empty}>
                Drop a .ufdr or .zip here. We’ll compute a local SHA-256 and prepare it for analysis.
              </div>
            ) : (
              <div className={styles.progressList}>
                {items.map((i) => (
                  <div key={i.name} className={styles.progressItem}>
                    <div className={styles.progressHead}>
                      <span>{i.name}</span>
                      <span className={styles.status}>{i.status === "success" ? "Success" : i.status}</span>
                    </div>
                    <ProgressBar value={i.progress} />
                    {i.status === "success" && (
                      <div className={styles.successRow}>
                        ✅ Validated and ingested.{" "}
                        <Link href="/explore?tab=texts&case=CASE-2025-0915-A">View in Explore</Link>
                      </div>
                    )}
                    {i.status === "error" && (
                      <div role="alert" className={styles.error}>
                        Failed to ingest.{" "}
                        <button className={styles.linkBtn} onClick={startIngest}>
                          Retry
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <aside className={styles.side} aria-label="Side Panel">
          <h3>Actions Server Health</h3>
          <div className={styles.healthCol}>
            <HealthPill status="ok" label="Ingest API" />
            <HealthPill status="ok" label="Hasher" />
            <HealthPill status="degraded" label="OCR" />
          </div>
          <h4>Last ingest attempts</h4>
          <ul className={styles.list}>
            <li>2025-10-12 14:02 • CASE-2025-0915-A • ok</li>
            <li>2025-10-11 09:40 • CASE-2025-0915-B • ok</li>
          </ul>
          <h4>Audit log</h4>
          <pre className={styles.audit} aria-label="Audit log snippet">
            {`[14:02] hash=sha256:abcd... case=CASE-2025-0915-A ok
[14:03] validate bundle meta ok`}
          </pre>
        </aside>
      </div>
    </AppShell>
  )
}
