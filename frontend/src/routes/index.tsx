import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <h1 className="font-mono text-3xl font-bold tracking-[0.15em] text-phx-text">
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

        <div className="mt-12 font-mono text-lg text-phx-text">
          Coming soon...
        </div>

        <div className="mt-12 flex items-center gap-4 text-xs text-phx-text-muted">
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

      <footer className="absolute bottom-8 flex items-center gap-6 text-xs text-phx-text-muted">
        <a
          href="https://github.com/phalanx-php"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-phx-text"
        >
          github.com/phalanx-php
        </a>
      </footer>
    </div>
  )
}
