"use client"

import { AppShell } from "@/components/app-shell"
import styles from "./styles.module.css"
import { useState } from "react"
import Link from "next/link"

type Msg = { role: "user" | "assistant"; content: string }

export default function AIPage() {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "assistant",
      content: "AI Assist hint: Ask things like ‘WhatsApp messages between +91xxxx and +91yyyy in June 2023’.",
    },
  ])
  const [input, setInput] = useState("")
  const [insights, setInsights] = useState<string>("")

  function send() {
    if (!input.trim()) return
    const next = [
      ...msgs,
      { role: "user", content: input },
      {
        role: "assistant",
        content:
          'Mock answer with references: Case=CASE-2025-0915-A; artifacts=42.\n```json\n{"top_contacts":[{"peer":"+91-22222","count":18}]}\n```',
      },
    ]
    setMsgs(next)
    setInsights("Top contacts in June 2023:\n- +91-22222 — 18 messages\n- +91-11111 — 14 messages")
    setInput("")
  }

  return (
    <AppShell breadcrumb={[{ label: "AI Assist" }]}>
      <div className={styles.wrap}>
        <aside className={styles.history} aria-label="Sessions">
          <h3>Sessions</h3>
          <ul>
            <li>
              <button className={styles.historyBtn}>2025-10-13 • CASE-2025-0915-A</button>
            </li>
            <li>
              <button className={styles.historyBtn}>2025-10-12 • CASE-2025-0915-B</button>
            </li>
          </ul>
        </aside>

        <section className={styles.chat} aria-label="Chat">
          <div className={styles.statusRow} aria-label="NLU/Actions/DB health">
            <span className={styles.statusOk}>NLU ok</span>
            <span className={styles.statusOk}>Actions ok</span>
            <span className={styles.statusOk}>DB ok</span>
          </div>
          <div className={styles.thread} role="log" aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} className={`${styles.msg} ${m.role === "user" ? styles.user : styles.assistant}`}>
                <div className={styles.msgRole}>{m.role}</div>
                <div className={styles.msgBody}>
                  {m.content.includes("```json") ? <pre className={styles.code}>{m.content}</pre> : <p>{m.content}</p>}
                </div>
              </div>
            ))}
          </div>
          <div className={styles.composeRow}>
            <textarea
              className={styles.input}
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
            />
            <div className={styles.composeActions}>
              <Link className={styles.linkBtn} href="/ingest">
                Attach Bundle
              </Link>
              <div className={styles.chips}>
                <button onClick={() => setInput("Top contacts in June 2023")}>Top contacts in June 2023</button>
                <button onClick={() => setInput("Messages between A & B")}>Messages between A & B</button>
              </div>
              <button className={styles.primary} onClick={send}>
                Send
              </button>
            </div>
          </div>
          <div className={styles.resultActions}>
            <button className={styles.btn} onClick={() => alert("Export Markdown")}>
              Export Markdown
            </button>
            <button className={styles.btn} onClick={() => alert("Export CSV")}>
              Export CSV
            </button>
            <Link className={styles.btn} href="/explore?tab=texts&case=CASE-2025-0915-A">
              Open in Explore
            </Link>
          </div>
        </section>

        <aside className={styles.side} aria-label="Insights">
          <h3>Insights</h3>
          <pre className={styles.insights}>{insights || "Ask a question to see insights."}</pre>
        </aside>
      </div>
    </AppShell>
  )
}
