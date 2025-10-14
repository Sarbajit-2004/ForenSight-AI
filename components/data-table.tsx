"use client"

import type React from "react"

import styles from "./data-table.module.css"
import { useMemo, useState } from "react"

export type Column<T> = {
  key: keyof T
  header: string
  width?: string
  render?: (row: T) => React.ReactNode
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  pageSizeOptions = [25, 50, 100],
  onSelectRows,
  emptyHint = "No data available.",
  loading = false,
  error,
}: {
  columns: Column<T>[]
  rows: T[]
  pageSizeOptions?: number[]
  onSelectRows?: (ids: string[]) => void
  emptyHint?: string
  loading?: boolean
  error?: string
}) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(pageSizeOptions[0])
  const [selected, setSelected] = useState<Record<string, boolean>>({})

  const sorted = useMemo(() => {
    const out = [...rows]
    if (sortKey) {
      out.sort((a, b) => {
        const av = a[sortKey!]
        const bv = b[sortKey!]
        if (av === bv) return 0
        return (av as any) > (bv as any) ? (sortDir === "asc" ? 1 : -1) : sortDir === "asc" ? -1 : 1
      })
    }
    return out
  }, [rows, sortKey, sortDir])

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize
    return sorted.slice(start, start + pageSize)
  }, [sorted, page, pageSize])

  function toggleSort(key: keyof T) {
    if (sortKey !== key) {
      setSortKey(key)
      setSortDir("asc")
    } else {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    }
  }

  function toggleRow(id: string) {
    const next = { ...selected, [id]: !selected[id] }
    setSelected(next)
    onSelectRows?.(Object.keys(next).filter((k) => next[k]))
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.controlRow}>
        <div className={styles.left}>
          <button className={styles.btn} onClick={() => alert("Export CSV of visible rows")}>
            Export CSV
          </button>
          <button className={styles.btn} onClick={() => alert("Export JSON of visible rows")}>
            Export JSON
          </button>
          <button className={styles.btn} onClick={() => alert("Copy visible rows")}>
            Copy
          </button>
        </div>
        <div className={styles.right}>
          <label className={styles.pageLabel}>
            Page size
            <select value={pageSize} onChange={(e) => setPageSize(Number.parseInt(e.target.value))}>
              {pageSizeOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className={styles.table} role="table" aria-colcount={columns.length}>
        <div className={`${styles.row} ${styles.head}`} role="row">
          <div className={styles.cell} role="columnheader" />
          {columns.map((c) => (
            <button
              key={String(c.key)}
              className={`${styles.cell} ${styles.headerBtn}`}
              role="columnheader"
              style={{ width: c.width }}
              onClick={() => toggleSort(c.key)}
              aria-sort={sortKey === c.key ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
            >
              {c.header}
            </button>
          ))}
        </div>

        {loading && (
          <div role="row" className={styles.skeletonRow}>
            <div className={styles.skeleton} />
            <div className={styles.skeleton} />
            <div className={styles.skeleton} />
            <div className={styles.skeleton} />
          </div>
        )}
        {error && (
          <div role="row" className={styles.errorBanner}>
            Error loading data: {error}
          </div>
        )}
        {!loading && !error && paged.length === 0 && (
          <div role="row" className={styles.emptyRow}>
            {emptyHint}
          </div>
        )}

        {!loading &&
          !error &&
          paged.map((r) => (
            <div className={styles.row} role="row" key={r.id}>
              <div className={styles.cell} role="cell">
                <input
                  type="checkbox"
                  aria-label={`Select row ${r.id}`}
                  checked={!!selected[r.id]}
                  onChange={() => toggleRow(r.id)}
                />
              </div>
              {columns.map((c) => (
                <div
                  key={String(c.key)}
                  className={styles.cell}
                  role="cell"
                  style={{ width: c.width }}
                  data-label={c.header}
                  title={c.render ? undefined : String((r as any)[c.key] ?? "")}
                >
                  {c.render ? c.render(r) : String(r[c.key])}
                </div>
              ))}
            </div>
          ))}
      </div>

      <div className={styles.pagination}>
        <button
          className={styles.btn}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          aria-label="Previous page"
        >
          Prev
        </button>
        <span className={styles.pageInfo} aria-live="polite">
          Page {page}
        </span>
        <button
          className={styles.btn}
          onClick={() => setPage((p) => (paged.length < pageSize ? p : p + 1))}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  )
}
