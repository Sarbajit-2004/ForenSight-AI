"use client"

import { AppShell } from "@/components/app-shell"
import styles from "./styles.module.css"
import { useMemo, useState } from "react"
import { Drawer } from "@/components/drawer"
import Link from "next/link"
import Image from "next/image"
import { TEXTS, EMAILS, IMAGES, VIDEOS, CALLS } from "@/lib/sample-data"

const REPORTS = Array.from({ length: 12 }).map((_, i) => ({
  id: `RPT-${202500 + i}`,
  caseId: i % 2 ? "CASE-2025-0915-A" : "CASE-2025-0915-B",
  type: ["Summary", "Timeline", "Entity Graph", "Communications Heatmap"][i % 4],
  generatedAt: `2025-10-${String((i % 28) + 1).padStart(2, "0")}T10:00:00Z`,
  size: `${(i % 30) + 2} MB`,
  version: `v${1 + (i % 3)}`,
  summary: `Executive summary: Key findings indicate communication spikes and detected entities.`,
  flags: ["Risk: Financial", "Entity: Person A"],
}))

export default function ReportsPage() {
  const [tab, setTab] = useState<"overview" | "images" | "videos" | "comms" | "meta" | "audio" | "corr" | "susp">(
    "overview",
  )
  const [open, setOpen] = useState(false)
  const [imgSel, setImgSel] = useState<(typeof IMAGES)[number] | null>(null)
  const [vidSel, setVidSel] = useState<(typeof VIDEOS)[number] | null>(null)

  const totals = useMemo(() => {
    return {
      artifacts: TEXTS.length + EMAILS.length + IMAGES.length + VIDEOS.length + CALLS.length,
      devices: 2,
      uniqueEntities: 18,
    }
  }, [])

  return (
    <AppShell breadcrumb={[{ label: "Reports" }]}>
      <div className={styles.wrap}>
        <div className={styles.header}>
          <h2>Reports & Analysis</h2>
        </div>

        <nav className={styles.tabs} aria-label="Report categories">
          {[
            { k: "overview", l: "Overview" },
            { k: "images", l: "Image Reports" },
            { k: "videos", l: "Video Reports" },
            { k: "comms", l: "Communication Reports" },
            { k: "audio", l: "Audio & Calls" },
            { k: "meta", l: "Metadata Reports" },
            { k: "corr", l: "Correlations" },
            { k: "susp", l: "Suspicious" },
          ].map((t) => (
            <button
              key={t.k}
              className={`${styles.tab} ${tab === t.k ? styles.active : ""}`}
              aria-current={tab === t.k ? "page" : undefined}
              onClick={() => setTab(t.k as any)}
            >
              {t.l}
            </button>
          ))}
        </nav>

        {tab === "overview" && (
          <section className={styles.overviewGrid}>
            <div className={styles.card}>
              <div className={styles.cardTitle}>Executive Summary</div>
              <p>Key findings indicate communication spikes, detected entities, and timeline clusters of activity.</p>
              <ul className={styles.bullets}>
                <li>Total artifacts analyzed: {totals.artifacts}</li>
                <li>Devices processed: {totals.devices}</li>
                <li>Unique entities detected: {totals.uniqueEntities}</li>
              </ul>
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitle}>Timeline Distribution</div>
              <div className={styles.lineChart} aria-label="Artifact distribution by time">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div key={i} className={styles.linePoint} style={{ height: `${20 + ((i * 7) % 70)}%` }} />
                ))}
              </div>
              <div className={styles.gridNote}>Purple line with light lavender grid</div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitle}>Risk Tags</div>
              <div className={styles.tags}>
                {["Anomalous Communication", "Keyword Flag", "Deleted File Recovered"].map((t) => (
                  <span key={t} className={styles.tag}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitle}>Latest Generated Reports</div>
              <div className={styles.table} role="table" aria-label="Latest reports">
                <div className={`${styles.row} ${styles.head}`} role="row">
                  <div className={styles.cell}>Report ID</div>
                  <div className={styles.cell}>Case ID</div>
                  <div className={styles.cell}>Type</div>
                  <div className={styles.cell}>Generated at</div>
                  <div className={styles.cell}>Size</div>
                  <div className={styles.cell}>Version</div>
                  <div className={styles.cell}></div>
                </div>
                {REPORTS.slice(0, 6).map((r) => (
                  <div className={styles.row} key={r.id} role="row">
                    <div className={styles.cell}>{r.id}</div>
                    <div className={styles.cell}>{r.caseId}</div>
                    <div className={styles.cell}>{r.type}</div>
                    <div className={styles.cell}>{new Date(r.generatedAt).toLocaleString()}</div>
                    <div className={styles.cell}>{r.size}</div>
                    <div className={styles.cell}>{r.version}</div>
                    <div className={styles.cell}>
                      <Link className={styles.btn} href={`/explore?tab=texts&case=${r.caseId}`}>
                        Open in Explore
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {tab === "images" && (
          <section className={styles.imageGrid} role="list" aria-label="Image analysis reports">
            {IMAGES.map((img) => (
              <button
                key={img.id}
                role="listitem"
                className={styles.thumb}
                onClick={() => {
                  setImgSel(img)
                  setOpen(true)
                }}
                aria-label={`Open image analysis for ${img.filename}`}
              >
                <Image
                  src={`/placeholder.svg?height=140&width=200&query=image analysis thumbnail`}
                  alt={img.filename}
                  width={200}
                  height={140}
                />
                <div className={styles.thumbMeta}>
                  <div className={styles.thumbName}>{img.filename}</div>
                  <div className={styles.thumbSub}>
                    {img.ts} • {img.size}
                  </div>
                </div>
              </button>
            ))}
          </section>
        )}

        {tab === "videos" && (
          <section className={styles.videoCards} aria-label="Video analysis reports">
            {VIDEOS.map((v, idx) => {
              const baseline = idx > 0 ? VIDEOS[idx - 1] : null
              const added = baseline ? v.entities.filter((e) => !baseline.entities.includes(e)) : []
              const removed = baseline ? baseline.entities.filter((e) => !v.entities.includes(e)) : []
              const durDelta = baseline ? v.duration - baseline.duration : 0
              const suspicionIndex = Math.min(
                100,
                Math.max(0, added.length * 12 + removed.length * 8 + (durDelta !== 0 ? 10 : 0)),
              )
              return (
                <div key={v.id} className={styles.videoCard}>
                  <Image
                    src={`/placeholder.svg?height=120&width=200&query=video keyframes`}
                    alt={v.filename}
                    width={200}
                    height={120}
                  />
                  <div className={styles.videoBody}>
                    <div className={styles.videoName}>{v.filename}</div>
                    <div className={styles.videoSub}>
                      {v.ts} • {v.duration}s • {v.size}
                    </div>
                    <div className={styles.videoSummary}>
                      <strong>Summary:</strong> {v.summary}
                    </div>
                    <div className={styles.entityChips}>
                      {v.entities.map((e, i) => (
                        <span key={i} className={styles.entityChip}>
                          {e}
                        </span>
                      ))}
                    </div>
                    <div className={styles.timelineMini}>
                      {v.markers.map((m, i) => (
                        <span key={i} title={`${m.label} @ ${m.t}s`} style={{ left: `${(m.t / v.duration) * 100}%` }} />
                      ))}
                    </div>
                    <div className={styles.diffBox} aria-label="Video diff summary">
                      <div className={styles.diffHeading}>Diff Summary</div>
                      {baseline ? (
                        <div className={styles.diffText}>
                          vs <code>{baseline.filename}</code> — duration Δ {durDelta >= 0 ? "+" : ""}
                          {durDelta}s; added{" "}
                          {added.length
                            ? added.map((e, i) => (
                                <span key={i} className={styles.entityChip}>
                                  {e}
                                </span>
                              ))
                            : "none"}
                          ; removed{" "}
                          {removed.length
                            ? removed.map((e, i) => (
                                <span key={i} className={styles.entityChip}>
                                  {e}
                                </span>
                              ))
                            : "none"}
                        </div>
                      ) : (
                        <div className={styles.diffText}>No baseline (first item)</div>
                      )}
                    </div>
                    <div className={styles.suspicion} aria-label="Suspicion index">
                      <span>Suspicion Index</span>
                      <div className={styles.sIndexBar}>
                        <span style={{ width: `${suspicionIndex}%` }} />
                      </div>
                      <div className={styles.riskChips}>
                        {Math.abs(durDelta) > 0 && (
                          <span className={`${styles.riskChip} ${styles.amber}`}>Duration change</span>
                        )}
                        {added.includes("Weapon") && (
                          <span className={`${styles.riskChip} ${styles.red}`}>Weapon detected</span>
                        )}
                        {removed.includes("Document") && (
                          <span className={`${styles.riskChip} ${styles.red}`}>Document removed</span>
                        )}
                      </div>
                    </div>
                    <div className={styles.cardActions}>
                      <button
                        className={styles.btn}
                        onClick={() => {
                          setVidSel(v)
                          setOpen(true)
                        }}
                      >
                        Open Insights
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </section>
        )}

        {tab === "comms" && (
          <section className={styles.commsWrap}>
            <div className={styles.card}>
              <div className={styles.cardTitle}>Message Volume by Participant</div>
              <div className={styles.barChart}>
                {["+91-11111", "+91-22222", "+91-33333", "+91-44444"].map((p, i) => (
                  <div key={p} className={styles.barRow}>
                    <span className={styles.barLabel}>{p}</span>
                    <span className={styles.bar} style={{ width: `${30 + (i + 1) * 15}%` }} />
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitle}>Active Hours</div>
              <div className={styles.heat} role="grid" aria-label="Active hours heatmap">
                {Array.from({ length: 7 }).map((_, d) => (
                  <div key={d} className={styles.heatRow}>
                    {Array.from({ length: 24 }).map((_, h) => (
                      <span key={h} className={styles.heatCell} style={{ opacity: (h % 6) / 5 }} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {tab === "meta" && (
          <section className={styles.metaWrap}>
            <div className={styles.card}>
              <div className={styles.cardTitle}>Device & Extraction</div>
              <div className={styles.table} role="table">
                <div className={`${styles.row} ${styles.head}`} role="row">
                  <div className={styles.cell}>Device</div>
                  <div className={styles.cell}>OS</div>
                  <div className={styles.cell}>UFDR Version</div>
                  <div className={styles.cell}>Timezone</div>
                </div>
                <div className={styles.row} role="row">
                  <div className={styles.cell}>Device A</div>
                  <div className={styles.cell}>Android 13</div>
                  <div className={styles.cell}>7.42</div>
                  <div className={styles.cell}>UTC+05:30</div>
                </div>
                <div className={styles.row} role="row">
                  <div className={styles.cell}>Device B</div>
                  <div className={styles.cell}>iOS 17</div>
                  <div className={styles.cell}>7.42</div>
                  <div className={styles.cell}>UTC+05:30</div>
                </div>
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitle}>Chain-of-Custody Log</div>
              <div className={styles.cocLog}>
                {["Ingest", "Validation", "Analysis", "Export"].map((step, i) => (
                  <span key={i} className={styles.cocChip}>
                    2025-10-1{i} {step}
                  </span>
                ))}
              </div>
              <div className={styles.consistency}>
                <span>Evidence Consistency</span>
                <div className={styles.consistencyBar}>
                  <span style={{ width: "82%" }} />
                </div>
              </div>
            </div>
          </section>
        )}

        {tab === "audio" && (
          <section className={styles.audioWrap} aria-label="Audio & Call reports">
            <div className={styles.table} role="table" aria-label="Audio & Call summaries">
              <div className={`${styles.row} ${styles.head}`} role="row">
                <div className={styles.cell}>File/Call</div>
                <div className={styles.cell}>Duration</div>
                <div className={styles.cell}>Caller/Peer</div>
                <div className={styles.cell}>Sentiment</div>
                <div className={styles.cell}>Keywords</div>
                <div className={styles.cell}>Case</div>
              </div>
              {CALLS.slice(0, 10).map((c, i) => (
                <div key={i} className={styles.row} role="row">
                  <div className={styles.cell}>CALL_{String(i).padStart(3, "0")}</div>
                  <div className={styles.cell}>{c.duration}s</div>
                  <div className={styles.cell}>{c.peer}</div>
                  <div className={styles.cell}>{i % 3 === 0 ? "Neutral" : i % 3 === 1 ? "Negative" : "Positive"}</div>
                  <div className={styles.cell}>{10 + (i % 5)}</div>
                  <div className={styles.cell}>{c.case}</div>
                </div>
              ))}
            </div>
            <div className={styles.waveBox} aria-label="Emotion waveform visualization">
              {Array.from({ length: 60 }).map((_, i) => (
                <span key={i} className={styles.wave} style={{ height: `${20 + ((i * 13) % 60)}%` }} />
              ))}
            </div>
          </section>
        )}

        {tab === "corr" && (
          <section className={styles.corrWrap} aria-label="Cross-Artifact Correlations">
            <div className={styles.matrix} role="grid" aria-label="Correlation matrix">
              {["", "Images", "Videos", "Messages", "Calls"].map((h, i) => (
                <span key={i} className={styles.mCellHead}>
                  {h}
                </span>
              ))}
              {["Images", "Videos", "Messages", "Calls"].flatMap((row, ri) =>
                ["Images", "Videos", "Messages", "Calls"].map((col, ci) => (
                  <span
                    key={`${ri}-${ci}`}
                    className={`${styles.mCell} ${ri === ci ? styles.diag : ""} ${ri !== ci && (ri + ci) % 2 === 0 ? styles.hit : ""}`}
                    title={`${row} ↔ ${col}`}
                  />
                )),
              )}
            </div>
            <div className={styles.linkedList}>
              <div className={styles.cardTitle}>Linked Evidence Graph</div>
              <ul>
                <li>VID_509.mp4 ↔ SMS with +9198… at 13:02 (timestamp overlap)</li>
                <li>IMG_221.jpg ↔ Email Subject “Delivery” (entity overlap)</li>
              </ul>
            </div>
          </section>
        )}

        {tab === "susp" && (
          <section className={styles.suspWrap} aria-label="Suspicious Activity Dashboard">
            <div className={styles.heatLegend}>Timeline vs Evidence Type</div>
            <div className={styles.heatGrid} role="grid">
              {Array.from({ length: 5 * 24 }).map((_, i) => (
                <span key={i} className={styles.heatDot} style={{ opacity: (i % 9) / 8 }} />
              ))}
            </div>
            <div className={styles.suspCards}>
              <div className={styles.card}>
                <div className={styles.cardTitle}>VID_501.mp4 — Possible Tampering</div>
                <div className={styles.gridNote}>Duration mismatch, metadata drift +1s</div>
                <div className={styles.sIndexBar}>
                  <span style={{ width: "78%" }} />
                </div>
                <div className={styles.riskChips}>
                  <span className={`${styles.riskChip} ${styles.red}`}>Tampering potential</span>
                  <span className={`${styles.riskChip} ${styles.amber}`}>Metadata drift</span>
                </div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardTitle}>Chats — Keyword “erase” spikes</div>
                <div className={styles.gridNote}>Linked to video VID_510.mp4 timeline</div>
                <div className={styles.sIndexBar}>
                  <span style={{ width: "62%" }} />
                </div>
                <div className={styles.riskChips}>
                  <span className={`${styles.riskChip} ${styles.amber}`}>Keyword cluster</span>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Shared Drawer for Image/Video insights */}
      <Drawer open={open} onClose={() => setOpen(false)} title={imgSel ? "Image Insights" : "Video Insights"}>
        {imgSel && (
          <div className={styles.preview}>
            <div className={styles.previewGrid}>
              <div>
                <strong>OCR Text</strong>
                <div className={styles.scrollBox}>{imgSel.ocr}</div>
              </div>
              <div>
                <strong>Entities</strong>
                <div className={styles.entityChips}>
                  {imgSel.entities.map((e, i) => (
                    <span key={i} className={styles.entityChip}>
                      {e}
                    </span>
                  ))}
                </div>
                <strong style={{ display: "block", marginTop: 8 }}>Perceptual Similarity</strong>
                <ul className={styles.simList}>
                  {imgSel.similar.map((s) => (
                    <li key={s.id}>
                      {s.id} • {Math.round(s.score * 100)}%
                    </li>
                  ))}
                </ul>
                <div className={styles.aiSummary}>
                  <strong>AI Summary</strong>
                  <p>Likely depicts a document with “CONFIDENTIAL” text. Entities suggest people and locations.</p>
                </div>
                <div className={styles.anomalyBox} role="note" aria-label="Anomaly insights">
                  <strong>Anomaly Insights</strong>
                  <ul className={styles.bullets}>
                    <li>EXIF claims 2022-01; visual context indicates 2023-03.</li>
                    <li>New face entity not present elsewhere in case.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        {vidSel && (
          <div className={styles.preview}>
            <div className={styles.previewGrid}>
              <div>
                <strong>Transcript</strong>
                <input className={styles.search} placeholder="Search transcript…" aria-label="Search transcript" />
                <div className={styles.scrollBox}>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <p key={i}>
                      [00:{String(i).padStart(2, "0")}] Sample transcript line {i} …
                    </p>
                  ))}
                </div>
              </div>
              <div>
                <strong>Scene Segmentation</strong>
                <div className={styles.sceneBars}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <span key={i} style={{ width: `${10 + (i % 5) * 8}%` }} />
                  ))}
                </div>
                <div className={styles.previewActions}>
                  <button className={styles.btn}>Export Transcript (.txt)</button>
                  <button className={styles.btn}>Export Keyframes (.pdf)</button>
                  <button className={styles.btn}>Export Entities (.csv)</button>
                </div>
              </div>
            </div>
            <div className={styles.suspicion} aria-label="Suspicion index">
              <span>Suspicion Index</span>
              <div className={styles.sIndexBar}>
                <span style={{ width: "64%" }} />
              </div>
              <div className={styles.riskChips}>
                <span className={`${styles.riskChip} ${styles.red}`}>Looped frames suspected</span>
                <span className={`${styles.riskChip} ${styles.amber}`}>Lighting inconsistency</span>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </AppShell>
  )
}
