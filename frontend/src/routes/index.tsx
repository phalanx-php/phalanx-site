import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { PhalanxMark } from '../components/PhalanxMark'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

type Package = {
  name: string
  desc: string
  category: string
}

const PACKAGES: Package[] = [
  { name: 'phalanx-aegis', desc: 'Core scope hierarchy, service container, cancellation tokens, and task primitives that power every Phalanx application.', category: 'Core' },
  { name: 'phalanx-stoa', desc: 'Async HTTP server with type-safe routing, middleware, request validation, SSE, and OpenAPI generation.', category: 'Server' },
  { name: 'phalanx-archon', desc: 'CLI application framework for building long-running console commands with argument parsing and output formatting.', category: 'Server' },
  { name: 'phalanx-hermes', desc: 'WebSocket server and client with connection management, message framing, and room-based broadcasting.', category: 'Server' },
  { name: 'phalanx-athena', desc: 'AI agent runtime with multi-provider support (Anthropic, OpenAI, Ollama), tool execution, and structured output streaming.', category: 'Intelligence' },
  { name: 'phalanx-styx', desc: 'Reactive stream primitives — Emitter, Channel, and ScopedStream with backpressure control and composable operators.', category: 'Concurrency' },
  { name: 'phalanx-hydra', desc: 'Worker process parallelism for CPU-bound work via child processes with mapParallel and inWorker.', category: 'Concurrency' },
  { name: 'phalanx-theatron', desc: 'Async terminal UI with buffer diffing, region layout, reactive widgets, and keyboard input handling.', category: 'Interface' },
  { name: 'phalanx-eidolon', desc: 'Frontend bridge with signal-based reactivity, envelope middleware, and server-client data flow.', category: 'Interface' },
  { name: 'phalanx-postgres', desc: 'Non-blocking PostgreSQL client with connection pooling, prepared statements, and transaction support.', category: 'Data' },
  { name: 'phalanx-redis', desc: 'Async Redis client with pub/sub, pipelining, and connection management for caching and message queues.', category: 'Data' },
  { name: 'phalanx-grammata', desc: 'Managed async file I/O with bounded concurrency, streaming reads/writes, and directory operations.', category: 'Data' },
  { name: 'phalanx-argos', desc: 'Network utilities for DNS resolution, TCP/UDP helpers, and connection diagnostics.', category: 'Infrastructure' },
  { name: 'phalanx-enigma', desc: 'Async SSH client for remote command execution, SFTP file transfers, and tunnel management.', category: 'Infrastructure' },
  { name: 'phalanx-cdp', desc: 'Chrome DevTools Protocol client for browser automation, page inspection, and runtime evaluation.', category: 'Infrastructure' },
  { name: 'phalanx-skopos', desc: 'PHP-native dev server and file watcher powered by Bun. Orchestrates process management, watches for changes, and coordinates hot-reload across your stack.', category: 'Tooling' },
]

const CATEGORY_ORDER = ['Core', 'Server', 'Concurrency', 'Intelligence', 'Data', 'Interface', 'Infrastructure', 'Tooling']

function fuzzyMatch(text: string, query: string): boolean {
  const lower = text.toLowerCase()
  let qi = 0
  for (let i = 0; i < lower.length && qi < query.length; i++) {
    if (lower[i] === query[qi]) qi++
  }
  return qi === query.length
}

function LandingPage() {
  const [search, setSearch] = useState('')
  const query = search.toLowerCase().trim()

  const filtered = useMemo(() => {
    if (!query) return PACKAGES
    return PACKAGES.filter(
      pkg => fuzzyMatch(pkg.name, query) || fuzzyMatch(pkg.desc, query) || fuzzyMatch(pkg.category, query)
    )
  }, [query])

  const grouped = useMemo(() => {
    const groups = new Map<string, Package[]>()
    for (const pkg of filtered) {
      const list = groups.get(pkg.category) ?? []
      list.push(pkg)
      groups.set(pkg.category, list)
    }
    return CATEGORY_ORDER
      .filter(cat => groups.has(cat))
      .map(cat => ({ category: cat, packages: groups.get(cat)! }))
  }, [filtered])

  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-16">
      <div className="flex flex-col items-center gap-4">
        <PhalanxMark size={80} />
        <h1 className="font-mono text-3xl font-bold tracking-[0.15em] text-phx-text">
          PHALANX
        </h1>
        <p className="max-w-lg text-center text-sm leading-relaxed text-phx-text-muted">
          Open-source async coordination framework for PHP 8.4+.
          Expression-based concurrency built on ReactPHP — these are the libraries.
        </p>

        <div className="mt-4 flex items-center gap-4 text-xs text-phx-text-muted">
          <a
            href="mailto:mail@phalanx-php.com"
            className="hover:text-phx-text"
          >
            mail@phalanx-php.com
          </a>
          <span className="text-phx-border">|</span>
          <a
            href="https://x.com/phalanxphp"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-phx-text"
          >
            @phalanxphp
          </a>
        </div>
      </div>

      <div className="mt-10 w-full max-w-4xl">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search packages..."
          className="w-full rounded-lg border border-phx-border bg-phx-surface px-4 py-3 font-mono text-sm text-phx-text placeholder-phx-text-muted/50 outline-none transition-colors focus:border-phx-crimson/40"
        />
      </div>

      <div className="mt-8 w-full max-w-4xl space-y-8">
        {!query && (
          <a
            href="https://github.com/phalanx-php/phalanx-skopos"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex gap-5 rounded-lg border border-phx-crimson/20 bg-gradient-to-r from-phx-surface to-phx-crimson/[0.04] px-6 py-5 transition-colors hover:border-phx-crimson/40"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="rounded bg-phx-crimson/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-phx-crimson">
                  Featured
                </span>
                <span className="font-mono text-sm font-medium text-phx-text group-hover:text-phx-crimson">
                  phalanx-skopos
                </span>
              </div>
              <span className="text-sm leading-relaxed text-phx-text-muted">
                PHP-native dev server and file watcher powered by Bun. Orchestrates process management, watches for changes, and coordinates hot-reload across your stack.
              </span>
            </div>
          </a>
        )}

        {grouped.map(({ category, packages }) => (
          <section key={category}>
            <h2 className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-phx-text-muted">
              {category}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {packages.map(pkg => (
                <a
                  key={pkg.name}
                  href={`https://github.com/phalanx-php/${pkg.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-2 rounded-lg border border-phx-border bg-phx-surface px-5 py-4 transition-colors hover:border-phx-crimson/40"
                >
                  <span className="font-mono text-sm font-medium text-phx-text group-hover:text-phx-crimson">
                    {pkg.name}
                  </span>
                  <span className="text-xs leading-relaxed text-phx-text-muted">
                    {pkg.desc}
                  </span>
                </a>
              ))}
            </div>
          </section>
        ))}

        {grouped.length === 0 && (
          <p className="py-12 text-center font-mono text-sm text-phx-text-muted">
            No packages match "{search}"
          </p>
        )}
      </div>

      <footer className="mt-16 flex items-center gap-6 text-xs text-phx-text-muted">
        <a
          href="https://github.com/phalanx-php"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-phx-text"
        >
          github.com/phalanx-php
        </a>
        {import.meta.env.DEV && (
          <Link to="/branding" className="hover:text-phx-text">
            /branding
          </Link>
        )}
      </footer>
    </div>
  )
}
