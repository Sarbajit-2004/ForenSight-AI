import Link from "next/link"

export default function Home() {
  // Redirect users to Auth to start the clickable prototype
  return (
    <main className="p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold">UFDR Evidence Explorer</h1>
        <p className="mt-2 text-sm opacity-80">
          Start the prototype: Auth → Ingest → Explore → AI Assist → Cases → Reports
        </p>
        <Link
          href="/auth"
          className="inline-block mt-4 px-4 py-2 rounded-md bg-[var(--color-primary)] text-[var(--color-primary-foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
          aria-label="Go to Auth page"
        >
          Go to Auth
        </Link>
      </div>
    </main>
  )
}
