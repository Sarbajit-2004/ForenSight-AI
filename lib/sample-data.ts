export const CASES = [
  {
    id: "CASE-2025-0915-A",
    title: "Device A — WhatsApp Extraction",
    createdAt: "2025-09-15T10:00:00Z",
    updatedAt: "2025-09-20T12:20:00Z",
    custodians: ["Custodian A"],
    evidenceCount: 4,
    hashes: ["9a1b2c3d", "a1b2c3d4"],
    status: "Ingested",
    owner: "Analyst 1",
  },
  {
    id: "CASE-2025-0915-B",
    title: "Device B — SMS/Calls",
    createdAt: "2025-09-12T09:20:00Z",
    updatedAt: "2025-09-19T15:05:00Z",
    custodians: ["Custodian B"],
    evidenceCount: 2,
    hashes: ["3d2c1b9a"],
    status: "Analyzed",
    owner: "Analyst 2",
  },
]

export const TEXTS = Array.from({ length: 40 }).map((_, i) => ({
  id: `t-${i}`,
  ts: `2023-06-${String((i % 28) + 1).padStart(2, "0")}T12:0${i % 6}:00Z`,
  app: i % 2 === 0 ? "SMS" : "WhatsApp",
  from: i % 2 === 0 ? "+91-11111" : "+91-22222",
  to: i % 2 === 0 ? "+91-33333" : "+91-44444",
  snippet: `Sample message snippet ${i} about transfers and meetings.`,
  length: (i % 200) + 10,
  direction: i % 3 === 0 ? "in" : "out",
  case: "CASE-2025-0915-A",
}))

export const CALLS = Array.from({ length: 25 }).map((_, i) => ({
  id: `c-${i}`,
  ts: `2023-06-${String((i % 28) + 1).padStart(2, "0")}T0${i % 9}:30:00Z`,
  peer: i % 2 ? "+91-22222" : "+91-11111",
  direction: ["in", "out", "missed"][i % 3],
  duration: (i % 320) + 5,
  case: "CASE-2025-0915-A",
}))

export const EMAILS = Array.from({ length: 30 }).map((_, i) => ({
  id: `e-${i}`,
  ts: `2023-07-${String((i % 28) + 1).padStart(2, "0")}T08:00:00Z`,
  from: `sender${i}@example.com`,
  to: `receiver${i}@example.com`,
  cc: i % 4 === 0 ? `cc${i}@example.com` : "",
  subject: `Subject line ${i}`,
  attachments: i % 5 === 0 ? "Yes" : "No",
  case: "CASE-2025-0915-A",
  preview: `Headers: X-Test: 1\n\nBody: This is a mock preview body for message ${i}.`,
}))

export const IMAGES = Array.from({ length: 24 }).map((_, i) => ({
  id: `img-${i}`,
  filename: `IMG_${String(1000 + i)}.jpg`,
  ts: `2023-05-${String((i % 28) + 1).padStart(2, "0")}T10:00:00Z`,
  size: `${(i % 4) + 1}.2MB`,
  hash: `abcd${i}efgh`,
  ocr: `Extracted OCR snippet for image ${i}: "CONFIDENTIAL" found.`,
  entities: ["Name", "Place", i % 2 ? "Amount" : "Tag"].slice(0, 3),
  similar: [
    { id: `img-${(i + 1) % 24}`, score: 0.92 },
    { id: `img-${(i + 2) % 24}`, score: 0.88 },
  ],
}))

export const VIDEOS = Array.from({ length: 12 }).map((_, i) => ({
  id: `vid-${i}`,
  filename: `VID_${String(500 + i)}.mp4`,
  ts: `2023-04-${String((i % 28) + 1).padStart(2, "0")}T13:00:00Z`,
  duration: (i % 300) + 30,
  size: `${(i % 20) + 5}MB`,
  hash: `vhash${i}`,
  summary: `This video contains ${i % 2 ? "a meeting in an office" : "outdoor movement"}; key moments include entry/exit.`,
  markers: [
    { t: 10, label: "Entry" },
    { t: 45, label: "Interaction" },
    { t: 100, label: "Exit" },
  ],
  entities: ["Person", "Door", i % 2 ? "Car" : "Document"].slice(0, 3),
}))

export const OTHER = Array.from({ length: 10 }).map((_, i) => ({
  id: `o-${i}`,
  path: `/data/var/${i}.bin`,
  hash: `ohash${i}`,
  source: i % 2 ? "Cache" : "System",
}))
