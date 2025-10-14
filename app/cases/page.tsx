import { AppShell } from "@/components/app-shell"
import styles from "./styles.module.css"
import { CASES } from "@/lib/sample-data"
import Link from "next/link"

export default function CasesPage() {
  return (
    <AppShell breadcrumb={[{ label: "Cases" }]}>
      <div className={styles.wrap}>
        <div className={styles.header}>
          <input
            className={styles.search}
            placeholder="Search by Case ID, custodian, device IMEI, date"
            aria-label="Search cases"
          />
          <div className={styles.filters}>
            <select>
              <option>Status</option>
              <option>Ingested</option>
              <option>Analyzed</option>
              <option>Flagged</option>
            </select>
            <select>
              <option>Owner</option>
              <option>Analyst 1</option>
              <option>Analyst 2</option>
            </select>
            <select>
              <option>Sort by</option>
              <option>Last activity</option>
            </select>
          </div>
        </div>

        <div className={styles.list}>
          {CASES.map((c) => (
            <div key={c.id} className={styles.card}>
              <div className={styles.cardHead}>
                <div className={styles.caseId}>{c.id}</div>
                <div className={styles.status}>{c.status}</div>
              </div>
              <div className={styles.title}>{c.title}</div>
              <div className={styles.meta}>
                Created {new Date(c.createdAt).toLocaleString()} • Updated {new Date(c.updatedAt).toLocaleString()}
              </div>
              <div className={styles.meta}>
                Custodians: {c.custodians.join(", ")} • Evidence: {c.evidenceCount}
              </div>
              <div className={styles.hashes}>
                Hashes:{" "}
                {c.hashes.map((h) => (
                  <code key={h}>{h}</code>
                ))}
              </div>
              <div className={styles.rowActions}>
                <Link href={`/explore?tab=texts&case=${c.id}`} className={styles.btn}>
                  Open
                </Link>
                <Link href="/reports" className={styles.btn}>
                  View Report
                </Link>
                <button className={styles.btn}>Pin</button>
                <button className={styles.btn}>Archive</button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.emptyCta}>
          New here? <Link href="/ingest">Ingest an evidence bundle</Link>
        </div>
      </div>
    </AppShell>
  )
}
