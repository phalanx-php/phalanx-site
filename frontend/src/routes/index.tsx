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

const MONOREPO_URL = 'https://github.com/phalanx-php/phalanx'

const PACKAGES: Package[] = [
  { name: 'phalanx-aegis', desc: 'Managed async runtime for PHP 8.4+ on OpenSwoole with scope, cancellation, service lifecycle, and concurrency primitives.', category: 'Core' },
  { name: 'phalanx-stoa', desc: 'OpenSwoole-native HTTP runtime handling request/response translation, routing, middleware, validation, and lifecycle management.', category: 'Server' },
  { name: 'phalanx-archon', desc: 'CLI application framework for supervised command workflows on the same managed runtime as your services.', category: 'Server' },
  { name: 'phalanx-hermes', desc: 'WebSocket server and client support including handshake, framing, pub/sub patterns, and HTTP upgrade integration.', category: 'Server' },
  { name: 'phalanx-athena', desc: 'AI agent runtime with provider adapters, tool execution, streaming output, structured responses, and multi-agent patterns.', category: 'Intelligence' },
  { name: 'phalanx-styx', desc: 'Reactive stream primitives that convert push events into composable, pull-friendly pipelines for scoped async execution.', category: 'Concurrency' },
  { name: 'phalanx-hydra', desc: 'Worker-process parallelism for CPU-heavy or isolated work while preserving parent-runtime task coordination.', category: 'Concurrency' },
  { name: 'phalanx-eidolon', desc: 'Frontend bridge focused on typed route contracts, OpenAPI generation, Kubb integration, and signal-driven UI reactivity.', category: 'Interface' },
  { name: 'phalanx-iris', desc: 'Coroutine-aware HTTP client with connection pooling, automatic retries, and middleware support for outbound requests.', category: 'Infrastructure' },
  { name: 'phalanx-redis', desc: 'OpenSwoole-native Redis integration with connection pooling, command pipelining, and pub/sub patterns.', category: 'Data' },
  { name: 'phalanx-surreal', desc: 'SurrealDB RPC and live-query client providing async data access through the Phalanx coordination runtime.', category: 'Data' },
  { name: 'phalanx-grammata', desc: 'Async-aware filesystem operations including streaming read/write workflows with resource governance under concurrency.', category: 'Data' },
  { name: 'phalanx-argos', desc: 'Network discovery and probing tasks including subnet scans, port checks, wake-on-LAN, and host/service inspection.', category: 'Infrastructure' },
  { name: 'phalanx-enigma', desc: 'Non-blocking SSH command execution, file transfer, and tunnel orchestration as composable runtime tasks.', category: 'Infrastructure' },
  { name: 'phalanx-cli', desc: 'The Phalanx CLI tool providing environment diagnostics, OpenSwoole installation, and project scaffolding.', category: 'Tooling' },
  { name: 'phalanx-skopos', desc: 'Development server orchestrator that coordinates process startup, output multiplexing, and file-watch driven workflows.', category: 'Tooling' },
  { name: 'phalanx-phpstan', desc: 'PHPStan safety rules enforcing concurrency and runtime invariants for static analysis across Phalanx code.', category: 'Tooling' },
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
        <div className="flex items-center gap-3">
          <h1 className="font-mono text-3xl font-bold tracking-[0.15em] text-phx-text pl-12">
            PHALANX
          </h1>
          <span className="rounded-full bg-phx-crimson/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-phx-crimson border border-phx-crimson/20">
            0.2.0-ALPHA.1
          </span>
        </div>
        <p className="max-w-lg text-center text-sm leading-relaxed text-phx-text-muted">
          Open-source async coordination framework for PHP 8.4+.
          Phalanx 0.2.0-alpha.1 is now available! Managed runtime primitives and libraries for servers, agents, streams, and infrastructure.
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
            href={`${MONOREPO_URL}/tree/main/packages/phalanx-skopos`}
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
                  href={`${MONOREPO_URL}/tree/main/packages/${pkg.name}`}
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
