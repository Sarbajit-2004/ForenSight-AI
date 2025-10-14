import { HealthPill } from "@/components/health-pill"
import { TagChip } from "@/components/tag-chip"
import { Dropzone } from "@/components/dropzone"
import { FiltersBar } from "@/components/filters-bar"
import { DataTable } from "@/components/data-table"

const rows = [{ id: "1", a: "Row A", b: "Row B", c: "Row C", d: "Row D" }]
const columns = [
  { key: "a", header: "A" },
  { key: "b", header: "B" },
  { key: "c", header: "C" },
  { key: "d", header: "D" },
] as any

export default function ComponentsGallery() {
  return (
    <main style={{ display: "grid", gap: 16, padding: 16 }}>
      <h2>Component Library</h2>
      <section style={{ display: "flex", gap: 8 }}>
        <HealthPill status="ok" label="OK" />
        <HealthPill status="degraded" label="Degraded" />
        <HealthPill status="down" label="Down" />
        <TagChip label="CASE-2025-0915-A" />
        <TagChip label="Entity: Person" tone="info" />
      </section>
      <FiltersBar />
      <Dropzone />
      <DataTable columns={columns} rows={rows as any} />
    </main>
  )
}
