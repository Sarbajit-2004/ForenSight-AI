"use client"

import type React from "react"

import styles from "./styles.module.css"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const [useOtp, setUseOtp] = useState(false)
  const [ack, setAck] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget as HTMLFormElement
    const badge = (form.elements.namedItem("badge") as HTMLInputElement)?.value
    const password = (form.elements.namedItem("password") as HTMLInputElement)?.value
    const otp = (form.elements.namedItem("otp") as HTMLInputElement)?.value

    if (!ack) {
      setError("You must acknowledge the chain-of-custody terms to proceed.")
      return
    }
    if (!badge || !password || (useOtp && !otp)) {
      setError("Please complete all required fields.")
      return
    }

    // Placeholder: simulate local validation
    setError(null)
    router.push("/ingest")
  }

  return (
    <main className={styles.screen} role="main" aria-labelledby="auth-title">
      <div className={styles.grid}>
        {/* Left: Branding / Security panel */}
        <section className={styles.brandPanel} aria-label="Branding and security information">
          <div className={styles.brandInner}>
            <header>
              <div className={styles.brandTitleRow}>
                <span className={styles.brandIcon} aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M12 3l7 4v5c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V7l7-4Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </span>
                <h1 className={`${styles.appTitle} text-pretty`}>ForenSight AI</h1>
              </div>
              <p className={styles.appSubtext}>Forensic Intelligence Platform</p>
            </header>

            <div className={styles.dividerDecor} aria-hidden="true" />

            <h2 className={styles.secureTitle}>Secure On-Premise Access</h2>
            <ul className={styles.bullets} role="list">
              <li className={styles.bulletItem}>
                <span className={styles.icon} aria-hidden="true">
                  {/* Lock icon */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M7 10V7a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="12" cy="15" r="1.5" fill="currentColor" />
                  </svg>
                </span>
                <div>
                  <div className={styles.bulletTitle}>End‑to‑End Encryption</div>
                  <div className={styles.bulletDesc}>All data processed on‑premise with AES‑256.</div>
                </div>
              </li>
              <li className={styles.bulletItem}>
                <span className={styles.icon} aria-hidden="true">
                  {/* Hash/Shield icon */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M12 3l7 4v5c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V7l7-4Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path d="M9 12h6M12 9v6" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </span>
                <div>
                  <div className={styles.bulletTitle}>Audit Trail Compliance</div>
                  <div className={styles.bulletDesc}>Every action logged with SHA‑256 verification.</div>
                </div>
              </li>
              <li className={styles.bulletItem}>
                <span className={styles.icon} aria-hidden="true">
                  {/* Badge/Users icon */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M5 20a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </span>
                <div>
                  <div className={styles.bulletTitle}>Role‑Based Access</div>
                  <div className={styles.bulletDesc}>Granular permissions for investigators and admins.</div>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Right: Authentication form */}
        <section className={styles.authPanel} aria-describedby="custody-notice">
          <header className={styles.formHeader}>
            <h2 id="auth-title" className={styles.formTitle}>
              Investigator Sign In
            </h2>
            <p className={styles.formSubtitle}>Enter your credentials to access the evidence platform.</p>
          </header>

          <form className={styles.form} onSubmit={onSubmit} noValidate>
            <label className={styles.label}>
              <span className={styles.labelText}>Badge ID / Username</span>
              <input
                name="badge"
                type="text"
                autoComplete="username"
                required
                aria-required="true"
                placeholder="INV-1042 or j.doe"
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
              <span className={styles.labelText}>Password</span>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                aria-required="true"
                placeholder="••••••••"
                className={styles.input}
              />
            </label>

            <label className={styles.toggleRow}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={useOtp}
                onChange={(e) => setUseOtp(e.target.checked)}
                aria-controls="otp-field"
                aria-expanded={useOtp}
              />
              <span>Use OTP authentication</span>
            </label>

            {useOtp && (
              <label className={styles.label} id="otp-field">
                <span className={styles.labelText}>One-time passcode</span>
                <input
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="123456"
                  className={styles.input}
                  aria-label="One-time passcode"
                />
              </label>
            )}

            <div className={styles.ackRow}>
              <input
                id="ack"
                type="checkbox"
                className={styles.checkbox}
                checked={ack}
                onChange={(e) => setAck(e.target.checked)}
                aria-describedby="custody-notice"
              />
              <label htmlFor="ack" className={styles.ackLabel}>
                I acknowledge and agree to these terms and understand my legal obligations regarding evidence handling.
              </label>
            </div>

            {error && (
              <div role="alert" className={styles.error}>
                {error}
              </div>
            )}

            <div className={styles.actions}>
              <button
                type="submit"
                className={styles.primary}
                aria-label="Sign in"
                disabled={!ack}
                aria-disabled={!ack}
              >
                Sign In
              </button>
            </div>

            <hr className={styles.divider} aria-hidden="true" />

            <aside id="custody-notice" className={styles.notice} role="note" aria-live="polite">
              By signing in, you acknowledge that all evidence accessed through this system must maintain proper
              chain-of-custody documentation. Every action is logged with cryptographic verification (SHA-256) and may
              be subject to legal review. Unauthorized access or misuse will be prosecuted.
            </aside>
          </form>

          <footer className={styles.footer}>
            <a href="#" className={styles.link}>
              Need help? Contact System Administrator.
            </a>
            <span className={styles.subtle}>Session timeout: 60 minutes of inactivity.</span>
          </footer>
        </section>
      </div>
    </main>
  )
}
