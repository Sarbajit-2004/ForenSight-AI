"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import styles from "./app-shell.module.css"
import { HealthPill } from "./health-pill"
import { SearchInput } from "./search-input"
import { TagChip } from "./tag-chip"
import { useEffect, useState } from "react"

type Props = {
  children: React.ReactNode
  breadcrumb?: Array<{ label: string; href?: string }>
}

const navItems = [
  { href: "/auth", label: "Auth" },
  { href: "/ingest", label: "Ingest" },
  { href: "/explore", label: "Explore" },
  { href: "/ai", label: "AI Assist" },
  { href: "/cases", label: "Cases" },
  { href: "/reports", label: "Reports" },
  { href: "/settings", label: "Settings" },
]

export function AppShell({ children, breadcrumb = [] }: Props) {
  const pathname = usePathname()
  const search = useSearchParams()
  const router = useRouter()
  const caseId = search.get("case") || ""

  // simple theme toggle: toggles html.dark
  const [dark, setDark] = useState<boolean>(false)
  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [dark])

  return (
    <div className={styles.shell}>
      <header className={styles.topbar} role="banner" aria-label="Top App Bar">
        <div className={styles.topbarLeft}>
          <span className={styles.product}>ForenSight AI</span>
          <span className={styles.envBadge} aria-label="Environment badge">
            LOCAL / ON-PREM
          </span>
          <div className={styles.healthGroup} aria-label="System health">
            <HealthPill status="ok" label="Rasa" />
            <HealthPill status="ok" label="Actions" />
          </div>
        </div>
        <div className={styles.topbarRight}>
          <SearchInput
            placeholder="Search (cases, parties, keywords)"
            ariaLabel="Global search"
            onSearch={(q) =>
              router.push(`/explore?tab=texts&q=${encodeURIComponent(q)}${caseId ? `&case=${caseId}` : ""}`)
            }
          />
          <button
            className={styles.iconBtn}
            aria-label="Help"
            onClick={() => alert("Help: Refer to on-prem handbook.")}
          >
            ?
          </button>
          <button
            className={styles.toggleBtn}
            onClick={() => setDark((d) => !d)}
            aria-pressed={dark}
            aria-label="Toggle theme"
          >
            {dark ? "Light" : "Dark"}
          </button>
          <div className={styles.userBadge} aria-label="Session badge">
            Analyst • On-Prem
          </div>
        </div>
      </header>

      <div className={styles.mainRow}>
        <nav className={styles.sidebar} aria-label="Primary">
          <ul>
            {navItems.map((n) => {
              const active = pathname.startsWith(n.href)
              return (
                <li key={n.href}>
                  <Link
                    href={n.href + (caseId ? `?case=${encodeURIComponent(caseId)}` : "")}
                    className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
                    aria-current={active ? "page" : undefined}
                  >
                    {n.label}
                  </Link>
                </li>
              )
            })}
          </ul>
          <div className={styles.sidebarFooter}>
            <div className={styles.buildMeta}>v0.9.2 • build 2025.10.13</div>
          </div>
        </nav>

        <main className={styles.content} role="main">
          <div className={styles.breadcrumbs} aria-label="Breadcrumbs">
            <ol>
              <li>
                <Link href={caseId ? `/explore?case=${caseId}` : "/explore"}>Home</Link>
              </li>
              {breadcrumb.map((b, i) => (
                <li key={i}>{b.href ? <Link href={b.href}>{b.label}</Link> : <span>{b.label}</span>}</li>
              ))}
            </ol>
            {caseId ? (
              <div className={styles.casePillWrap}>
                <TagChip tone="neutral" label={`Case: ${caseId}`} title="Current case context" />
              </div>
            ) : null}
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}
