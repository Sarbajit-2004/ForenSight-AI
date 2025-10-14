"use client"

import styles from "./filters-bar.module.css"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

export function FiltersBar() {
  const router = useRouter()
  const search = useSearchParams()
  const [dateFrom, setDateFrom] = useState(search.get("from") || "")
  const [dateTo, setDateTo] = useState(search.get("to") || "")
  const [source, setSource] = useState(search.get("source") || "")
  const [parties, setParties] = useState(search.get("parties") || "")
  const [kw, setKw] = useState(search.get("q") || "")
  const [caseId, setCaseId] = useState(search.get("case") || "CASE-2025-0915-A")

  useEffect(() => {
    setCaseId(search.get("case") || caseId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  function apply() {
    const tab = search.get("tab") || "texts"
    const params = new URLSearchParams()
    if (dateFrom) params.set("from", dateFrom)
    if (dateTo) params.set("to", dateTo)
    if (source) params.set("source", source)
    if (parties) params.set("parties", parties)
    if (kw) params.set("q", kw)
    if (caseId) params.set("case", caseId)
    params.set("tab", tab)
    router.push(`/explore?${params.toString()}`)
  }

  function reset() {
    const tab = search.get("tab") || "texts"
    router.push(`/explore?tab=${tab}${caseId ? `&case=${caseId}` : ""}`)
  }

  return (
    <section className={styles.bar} aria-label="Filters">
      <div className={styles.row}>
        <label className={styles.group}>
          <span className={styles.label}>Date From</span>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </label>
        <label className={styles.group}>
          <span className={styles.label}>Date To</span>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </label>
        <label className={styles.group}>
          <span className={styles.label}>Data Source</span>
          <select value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="">All</option>
            <option value="sms">SMS</option>
            <option value="wa">WhatsApp</option>
            <option value="email">Email</option>
            <option value="calls">Calls</option>
            <option value="images">Images</option>
            <option value="videos">Videos</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label className={styles.group}>
          <span className={styles.label}>Parties</span>
          <input placeholder="+91xxxx,+91yyyy" value={parties} onChange={(e) => setParties(e.target.value)} />
        </label>
        <label className={styles.group}>
          <span className={styles.label}>Keyword</span>
          <input placeholder="keyword" value={kw} onChange={(e) => setKw(e.target.value)} />
        </label>
        <label className={styles.group}>
          <span className={styles.label}>Case ID</span>
          <input placeholder="CASE-2025-0915-A" value={caseId} onChange={(e) => setCaseId(e.target.value)} />
        </label>
      </div>
      <div className={styles.actions}>
        <button className={styles.primary} onClick={apply} aria-label="Apply filters">
          Apply
        </button>
        <button className={styles.secondary} onClick={reset} aria-label="Reset filters">
          Reset
        </button>
      </div>
    </section>
  )
}
