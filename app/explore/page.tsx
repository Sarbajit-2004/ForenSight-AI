"use client"

import { AppShell } from "@/components/app-shell"
import { FiltersBar } from "@/components/filters-bar"
import { DataTable, type Column } from "@/components/data-table"
import styles from "./styles.module.css"
import { useSearchParams } from "next/navigation"
import { useState, useMemo } from "react"
import { TEXTS, CALLS, EMAILS, IMAGES, VIDEOS, OTHER } from "@/lib/sample-data"
import { Drawer } from "@/components/drawer"
import Image from "next/image"
import { VideoTimeline } from "@/components/video-timeline"

export default function ExplorePage() {
  const search = useSearchParams()
  const tab = search.get("tab") || "texts"

  return (
    <AppShell breadcrumb={[{ label: "Explore" }]}>
      <section className={styles.wrap}>
        <FiltersBar />
        <nav className={styles.tabs} aria-label="Artifact categories">
          {[
            { key: "texts", label: "Texts" },
            { key: "calls", label: "Call Logs" },
            { key: "emails", label: "Emails" },
            { key: "images", label: "Images" },
            { key: "videos", label: "Videos" },
            { key: "other", label: "Other" },
          ].map((t) => (
            <a
              key={t.key}
              href={`/explore?tab=${t.key}${search.get("case") ? `&case=${search.get("case")}` : ""}`}
              className={`${styles.tab} ${tab === t.key ? styles.active : ""}`}
              aria-current={tab === t.key ? "page" : undefined}
            >
              {t.label}
            </a>
          ))}
        </nav>

        {tab === "texts" && <TextsTab />}
        {tab === "calls" && <CallsTab />}
        {tab === "emails" && <EmailsTab />}
        {tab === "images" && <ImagesTab />}
        {tab === "videos" && <VideosTab />}
        {tab === "other" && <OtherTab />}
      </section>
    </AppShell>
  )
}

function TextsTab() {
  const [open, setOpen] = useState(false)
  const [thread, setThread] = useState<any>(null)
  const cols: Column<(typeof TEXTS)[number]>[] = [
    { key: "ts", header: "Timestamp" },
    { key: "app", header: "App" },
    { key: "from", header: "From" },
    { key: "to", header: "To" },
    { key: "snippet", header: "Snippet" },
    { key: "length", header: "Length" },
    { key: "direction", header: "Direction" },
    { key: "case", header: "Case" },
  ]
  return (
    <div className={styles.tabWrap}>
      <DataTable
        columns={cols}
        rows={TEXTS}
        emptyHint="No artifacts match your filters. Try widening the date range or removing a party filter."
        onSelectRows={() => {}}
      />
      <div className={styles.tabActions}>
        <button
          className={styles.btn}
          onClick={() => {
            setThread(TEXTS[0])
            setOpen(true)
          }}
        >
          Open thread example
        </button>
        <button className={styles.btn} onClick={() => alert("Export visible rows as CSV/JSON")}>
          Export visible
        </button>
      </div>
      <Drawer open={open} onClose={() => setOpen(false)} title="Message Thread">
        <div>
          <p>
            <strong>From:</strong> {thread?.from}
          </p>
          <p>
            <strong>To:</strong> {thread?.to}
          </p>
          <hr />
          <div style={{ display: "grid", gap: 6 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ padding: 6, border: "1px solid var(--color-border)", borderRadius: 8 }}>
                <div style={{ fontSize: 12, opacity: 0.8 }}>{thread?.ts}</div>
                <div>
                  {thread?.snippet} (#{i})
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button className={styles.btn} onClick={() => navigator.clipboard.writeText("Copied thread")}>
              Copy
            </button>
            <button className={styles.btn} onClick={() => alert("Export CSV")}>
              Export CSV
            </button>
            <button className={styles.btn} onClick={() => alert("Export JSON")}>
              Export JSON
            </button>
          </div>
        </div>
      </Drawer>
    </div>
  )
}

function CallsTab() {
  const cols: Column<(typeof CALLS)[number]>[] = [
    { key: "ts", header: "Timestamp" },
    { key: "peer", header: "Peer" },
    { key: "direction", header: "Direction" },
    { key: "duration", header: "Duration (s)" },
    { key: "case", header: "Case" },
  ]
  return (
    <div className={styles.tabWrap}>
      <DataTable columns={cols} rows={CALLS} emptyHint="No call logs for the selected filters." />
      <div className={styles.inlineChart}>
        <div className={styles.sparkTitle}>Call density by day</div>
        <div className={styles.sparkLine} aria-label="Call density sparkline">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className={styles.sparkBar} style={{ height: `${(i % 10) * 10 + 20}%` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

function EmailsTab() {
  const [preview, setPreview] = useState<any>(null)
  const [open, setOpen] = useState(false)
  const cols: Column<(typeof EMAILS)[number]>[] = [
    { key: "ts", header: "Timestamp" },
    { key: "from", header: "From" },
    { key: "to", header: "To" },
    { key: "cc", header: "CC" },
    { key: "subject", header: "Subject" },
    { key: "attachments", header: "Attachments" },
    { key: "case", header: "Case" },
  ]
  return (
    <div className={styles.tabWrap}>
      <DataTable columns={cols} rows={EMAILS} emptyHint="No emails for the selected filters." />
      <div className={styles.tabActions}>
        <button
          className={styles.btn}
          onClick={() => {
            setPreview(EMAILS[0])
            setOpen(true)
          }}
        >
          Preview email
        </button>
      </div>
      <Drawer open={open} onClose={() => setOpen(false)} title="Email Preview">
        <pre style={{ whiteSpace: "pre-wrap" }}>{preview?.preview}</pre>
      </Drawer>
    </div>
  )
}

function ImagesTab() {
  const [sel, setSel] = useState<(typeof IMAGES)[number] | null>(null)
  const diff = useMemo(() => {
    if (!sel || sel.similar.length === 0) return null
    const top = IMAGES.find((x) => x.id === sel.similar[0].id)
    if (!top) return null
    const added = sel.entities.filter((e) => !top.entities.includes(e))
    const removed = top.entities.filter((e) => !sel.entities.includes(e))
    const ocrDelta = Math.abs((sel.ocr?.length || 0) - (top.ocr?.length || 0))
    return { top, added, removed, ocrDelta, score: sel.similar[0].score }
  }, [sel])

  return (
    <div className={styles.imagesWrap}>
      <div className={styles.gallery} role="list" aria-label="Images gallery">
        {IMAGES.map((img) => (
          <button
            key={img.id}
            role="listitem"
            className={styles.thumb}
            onClick={() => setSel(img)}
            aria-label={`Open details for ${img.filename}`}
          >
            <Image
              src={`/placeholder.svg?height=120&width=160&query=forensic image thumbnail`}
              alt={img.filename}
              width={160}
              height={120}
            />
            <div className={styles.thumbMeta}>
              <div className={styles.thumbName}>{img.filename}</div>
              <div className={styles.thumbSub}>
                {img.ts} • {img.size}
              </div>
              <div className={styles.thumbHash}>
                <code>{img.hash}</code>
              </div>
            </div>
          </button>
        ))}
      </div>

      <aside className={styles.embedPanel} aria-label="Embeddings and detections">
        <h3>Embeddings / Detections</h3>
        {sel ? (
          <div className={styles.embedContent}>
            <h4>Extracted Text (OCR)</h4>
            <p>{sel.ocr}</p>
            <h4>Entities</h4>
            <div className={styles.entityChips}>
              {sel.entities.map((e, i) => (
                <span key={i} className={styles.entityChip}>
                  {e}
                </span>
              ))}
            </div>
            <h4>Top-k Similar</h4>
            <div className={styles.similarRow}>
              {sel.similar.map((s) => (
                <div key={s.id} className={styles.similarItem} title={`Score ${s.score}`}>
                  <Image
                    src={`/placeholder.svg?height=80&width=120&query=similar image thumbnail`}
                    alt={`Similar ${s.id}`}
                    width={120}
                    height={80}
                  />
                  <div className={styles.simScore}>score {s.score.toFixed(2)}</div>
                </div>
              ))}
            </div>
            <h4>Diff Summary</h4>
            {diff ? (
              <div className={styles.diffSummary}>
                <div className={styles.diffLine}>
                  Baseline: <code>{diff.top.filename}</code> (score {Math.round(diff.score * 100)}%)
                </div>
                <ul className={styles.diffList}>
                  <li>
                    OCR length delta: <span className={styles.diffBadge}>{diff.ocrDelta}</span> chars
                  </li>
                  <li>
                    Entities added:
                    {diff.added.length ? (
                      diff.added.map((e, i) => (
                        <span key={i} className={styles.entityChip}>
                          {e}
                        </span>
                      ))
                    ) : (
                      <span className={styles.diffNone}> none</span>
                    )}
                  </li>
                  <li>
                    Entities removed:
                    {diff.removed.length ? (
                      diff.removed.map((e, i) => (
                        <span key={i} className={styles.entityChip}>
                          {e}
                        </span>
                      ))
                    ) : (
                      <span className={styles.diffNone}> none</span>
                    )}
                  </li>
                </ul>
              </div>
            ) : (
              <div className={styles.emptyEmbed}>No baseline available to compute diffs.</div>
            )}
          </div>
        ) : (
          <div className={styles.emptyEmbed}>
            Select an image to view extracted text, entities, similar images, and diffs.
          </div>
        )}
      </aside>
    </div>
  )
}

function VideosTab() {
  return (
    <div className={styles.videosWrap}>
      <div className={styles.videoList}>
        {VIDEOS.map((v, idx) => {
          const baseline = idx > 0 ? VIDEOS[idx - 1] : null
          const added = baseline ? v.entities.filter((e) => !baseline.entities.includes(e)) : []
          const removed = baseline ? baseline.entities.filter((e) => !v.entities.includes(e)) : []
          const durDelta = baseline ? v.duration - baseline.duration : 0
          return (
            <div key={v.id} className={styles.videoRow}>
              <Image
                src={`/placeholder.svg?height=90&width=160&query=video thumbnail`}
                alt={v.filename}
                width={160}
                height={90}
              />
              <div className={styles.videoMeta}>
                <div className={styles.videoName}>{v.filename}</div>
                <div className={styles.videoSub}>
                  {v.ts} • {v.duration}s • {v.size}
                </div>
                <div className={styles.videoHash}>
                  <code>{v.hash}</code>
                </div>
                <div className={styles.videoSummary}>
                  <strong>Summary:</strong> {v.summary}
                </div>
                <div className={styles.timelineWrap}>
                  <VideoTimeline durationSec={v.duration} markers={v.markers} />
                </div>
                <div className={styles.entityChips}>
                  {v.entities.map((e, i) => (
                    <span key={i} className={styles.entityChip}>
                      {e}
                    </span>
                  ))}
                </div>
                <div className={styles.videoDiff}>
                  <strong>Diff Summary:</strong>{" "}
                  {baseline ? (
                    <span>
                      vs <code>{baseline.filename}</code> — duration Δ {durDelta >= 0 ? "+" : ""}
                      {durDelta}s; entities added{" "}
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
                    </span>
                  ) : (
                    <span>No baseline (first item)</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function OtherTab() {
  const cols: Column<(typeof OTHER)[number]>[] = [
    { key: "path", header: "Path" },
    { key: "hash", header: "Hash" },
    { key: "source", header: "Source" },
  ]
  return (
    <div className={styles.tabWrap}>
      <DataTable columns={cols} rows={OTHER} emptyHint="No other artifacts found." />
    </div>
  )
}
