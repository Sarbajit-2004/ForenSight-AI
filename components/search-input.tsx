"use client"

import { useState } from "react"
import styles from "./search-input.module.css"

export function SearchInput({
  placeholder,
  onSearch,
  ariaLabel,
}: {
  placeholder?: string
  onSearch: (q: string) => void
  ariaLabel?: string
}) {
  const [q, setQ] = useState("")
  return (
    <form
      className={styles.wrap}
      role="search"
      aria-label={ariaLabel}
      onSubmit={(e) => {
        e.preventDefault()
        onSearch(q)
      }}
    >
      <input
        className={styles.input}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
      />
      <button className={styles.btn} aria-label="Submit search">
        Search
      </button>
    </form>
  )
}
