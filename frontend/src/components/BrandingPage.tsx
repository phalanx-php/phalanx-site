import { useEffect, useState, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { PhalanxMark } from './PhalanxMark'
import { PhalanxLockup, resolveColors, type Surface, type Ink } from './PhalanxLockup'

interface BrandAsset {
  id: string
  name: string
  note: string
  kind: 'mark' | 'lockup'
  width: number
  height: number
  surface: Surface
  ink: Ink
}

interface ToneDef {
  id: Ink
  label: string
}

const PALETTES: Record<Surface, { bg: string; border: string; label: string }> = {
  dark: { bg: '#0A0A0A', border: '#1E1E1E', label: 'Dark' },
  light: { bg: '#FFFFFF', border: '#D8D8D8', label: 'Light' },
  transparent: { bg: 'transparent', border: '#2A2A2A', label: 'Transparent' },
}

const TONES: ToneDef[] = [
  { id: 'brand', label: 'Brand' },
  { id: 'mono', label: 'Mono' },
  { id: 'reversed', label: 'Reversed' },
]

const SURFACE_TONES: Record<Surface, ToneDef[]> = {
  dark: TONES,
  light: TONES.filter(t => t.id !== 'reversed'),
  transparent: TONES,
}

const COLOR_SWATCHES = [
  { name: 'Crimson', value: '#C62840', token: '--phx-crimson' },
  { name: 'Crimson Deep', value: '#891428', token: '--phx-crimson-deep' },
  { name: 'Bronze', value: '#C9A55A', token: '--phx-bronze' },
  { name: 'Bronze Light', value: '#ECD48E', token: '--phx-bronze-light' },
  { name: 'Bronze Dark', value: '#A07828', token: '--phx-bronze-dark' },
  { name: 'Background', value: '#0A0A0A', token: '--phx-bg' },
  { name: 'Surface', value: '#141414', token: '--phx-surface' },
  { name: 'Border', value: '#1E1E1E', token: '--phx-border' },
  { name: 'Text', value: '#E8E8E8', token: '--phx-text' },
  { name: 'Text Muted', value: '#888888', token: '--phx-text-muted' },
]

const ICON_ASSETS: BrandAsset[] = [
  { id: 'favicon-16', name: 'Favicon 16', note: 'Browser tab minimum', kind: 'mark', width: 16, height: 16, surface: 'dark', ink: 'brand' },
  { id: 'favicon-32', name: 'Favicon 32', note: 'Standard favicon', kind: 'mark', width: 32, height: 32, surface: 'dark', ink: 'brand' },
  { id: 'icon-48', name: 'Icon 48', note: 'Windows/browser UI', kind: 'mark', width: 48, height: 48, surface: 'dark', ink: 'brand' },
  { id: 'icon-64', name: 'Icon 64', note: 'Small app icon', kind: 'mark', width: 64, height: 64, surface: 'dark', ink: 'brand' },
  { id: 'icon-96', name: 'Icon 96', note: 'Android density', kind: 'mark', width: 96, height: 96, surface: 'dark', ink: 'brand' },
  { id: 'icon-128', name: 'Icon 128', note: 'Desktop icon', kind: 'mark', width: 128, height: 128, surface: 'dark', ink: 'brand' },
  { id: 'apple-touch-180', name: 'Apple Touch', note: 'iOS home screen', kind: 'mark', width: 180, height: 180, surface: 'dark', ink: 'brand' },
  { id: 'pwa-192', name: 'PWA 192', note: 'Manifest icon', kind: 'mark', width: 192, height: 192, surface: 'dark', ink: 'brand' },
  { id: 'icon-256', name: 'Icon 256', note: 'Large desktop icon', kind: 'mark', width: 256, height: 256, surface: 'dark', ink: 'brand' },
  { id: 'pwa-512', name: 'PWA 512', note: 'Manifest icon', kind: 'mark', width: 512, height: 512, surface: 'dark', ink: 'brand' },
]

const LOCKUP_ASSETS: BrandAsset[] = [
  { id: 'nav-lockup', name: 'Navigation', note: 'Header lockup', kind: 'lockup', width: 240, height: 160, surface: 'transparent', ink: 'brand' },
  { id: 'footer-lockup', name: 'Footer', note: 'Footer/marketing', kind: 'lockup', width: 320, height: 200, surface: 'transparent', ink: 'brand' },
  { id: 'readme-lockup', name: 'README', note: 'Repository masthead', kind: 'lockup', width: 680, height: 260, surface: 'transparent', ink: 'brand' },
  { id: 'social-avatar', name: 'Profile Avatar', note: 'GitHub org / social profile', kind: 'mark', width: 400, height: 400, surface: 'dark', ink: 'brand' },
  { id: 'og-image', name: 'Open Graph', note: 'Social preview', kind: 'lockup', width: 1200, height: 630, surface: 'dark', ink: 'brand' },
  { id: 'x-header', name: 'X Header', note: 'Header/banner', kind: 'lockup', width: 1500, height: 500, surface: 'dark', ink: 'brand' },
  { id: 'linkedin-cover', name: 'LinkedIn Cover', note: 'Company page', kind: 'lockup', width: 1584, height: 396, surface: 'dark', ink: 'brand' },
  { id: 'square-post', name: 'Square Post', note: 'Instagram/LinkedIn', kind: 'lockup', width: 1080, height: 1080, surface: 'dark', ink: 'brand' },
]

function SocialComposition({ asset }: { asset: BrandAsset }) {
  const colors = resolveColors(asset.surface, asset.ink)
  const layout = {
    'og-image': { lockupHeight: 180, gap: 32, taglineSize: 22, tracking: '0.16em' },
    'x-header': { lockupHeight: 160, gap: 24, taglineSize: 18, tracking: '0.22em' },
    'linkedin-cover': { lockupHeight: 140, gap: 20, taglineSize: 16, tracking: '0.18em' },
    'square-post': { lockupHeight: 200, gap: 40, taglineSize: 22, tracking: '0.12em' },
  }[asset.id]

  if (!layout) return null

  return (
    <div className="flex h-full w-full flex-col items-center justify-center" style={{ gap: layout.gap }}>
      <PhalanxLockup height={layout.lockupHeight} surface={asset.surface} ink={asset.ink} />
      <p
        className="text-center font-mono uppercase"
        style={{
          color: colors.muted,
          fontSize: layout.taglineSize,
          letterSpacing: layout.tracking,
        }}
      >
        Async Coordination for PHP
      </p>
    </div>
  )
}

function AssetContent({ asset }: { asset: BrandAsset }) {
  const social = SocialComposition({ asset })
  if (social) return social

  if (asset.kind === 'mark') {
    const markSize = Math.min(asset.width, asset.height) * 0.65
    const colors = resolveColors(asset.surface, asset.ink)
    return (
      <PhalanxMark
        size={markSize / 1.5}
        primary={colors.primary}
        primaryDeep={colors.primaryDeep}
        accent={colors.accent}
        accentLight={colors.accentLight}
        accentDark={colors.accentDark}
      />
    )
  }

  const lockupHeight = Math.min(asset.height * 0.5, asset.width * 0.2)
  return <PhalanxLockup height={lockupHeight} surface={asset.surface} ink={asset.ink} />
}

function AssetPreview({ asset, maxWidth = 360, maxHeight = 210 }: { asset: BrandAsset; maxWidth?: number; maxHeight?: number }) {
  const palette = PALETTES[asset.surface]
  const scale = Math.min(maxWidth / asset.width, maxHeight / asset.height, 1)
  const previewWidth = Math.round(asset.width * scale)
  const previewHeight = Math.round(asset.height * scale)

  return (
    <div className="min-w-0">
      <div
        className="overflow-hidden rounded-md border"
        style={{
          width: previewWidth,
          height: previewHeight,
          borderColor: palette.border,
          backgroundColor: asset.surface === 'transparent' ? '#0A0A0A' : palette.bg,
        }}
      >
        <div
          data-brand-asset={asset.id}
          data-brand-width={asset.width}
          data-brand-height={asset.height}
          className="flex items-center justify-center"
          style={{
            width: asset.width,
            height: asset.height,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            backgroundColor: asset.surface === 'transparent' ? 'transparent' : palette.bg,
          }}
        >
          <AssetContent asset={asset} />
        </div>
      </div>
    </div>
  )
}

function AssetCard({ asset }: { asset: BrandAsset }) {
  return (
    <article className="rounded-lg border border-phx-border bg-phx-surface p-4">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <h4 className="text-sm text-phx-text">{asset.name}</h4>
          <p className="mt-1 text-xs text-phx-text-muted">{asset.note}</p>
        </div>
        <code className="shrink-0 rounded border border-phx-border bg-phx-bg px-2 py-1 font-mono text-[11px] text-phx-text-muted">
          {asset.width}x{asset.height}
        </code>
      </div>
      <AssetPreview asset={asset} />
    </article>
  )
}

function Section({ title, kicker, children }: { title: string; kicker: string; children: ReactNode }) {
  return (
    <section className="space-y-5">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-phx-crimson">
          {kicker}
        </p>
        <h3 className="mt-1 text-2xl text-phx-text">{title}</h3>
      </div>
      {children}
    </section>
  )
}

function ToneSpecimen({ surface, ink }: { surface: Surface; ink: Ink }) {
  const palette = PALETTES[surface]
  const tone = TONES.find(t => t.id === ink)

  return (
    <div className="rounded-lg border border-phx-border bg-phx-surface p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-xs text-phx-text-muted">
          {palette.label} / {tone?.label}
        </span>
      </div>
      <div
        className="flex h-40 items-center justify-center rounded-md border"
        style={{
          borderColor: palette.border,
          backgroundColor: surface === 'transparent' ? '#0A0A0A' : palette.bg,
        }}
      >
        <PhalanxLockup height={100} surface={surface} ink={ink} />
      </div>
    </div>
  )
}

function ExportStage() {
  const assets = [...ICON_ASSETS, ...LOCKUP_ASSETS]

  return (
    <div className="space-y-6 p-6" aria-hidden="true">
      {assets.map(asset => {
        const palette = PALETTES[asset.surface]
        return (
          <div
            key={asset.id}
            data-brand-export={asset.id}
            style={{
              width: asset.width,
              height: asset.height,
              backgroundColor: asset.surface === 'transparent' ? 'transparent' : palette.bg,
            }}
            className="flex items-center justify-center overflow-hidden"
          >
            <AssetContent asset={asset} />
          </div>
        )
      })}
    </div>
  )
}

export function BrandingPage() {
  const [exportMode, setExportMode] = useState(false)

  useEffect(() => {
    setExportMode(new URLSearchParams(window.location.search).get('export') === '1')
  }, [])

  if (exportMode) {
    return (
      <div className="min-h-screen bg-transparent text-phx-text">
        <ExportStage />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-phx-bg text-phx-text">
      <header className="sticky top-0 z-20 border-b border-phx-border bg-phx-bg/95 px-6 py-4 backdrop-blur md:px-8">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-phx-text-muted transition-colors hover:text-phx-text">
            &larr;
          </Link>
          <h2 className="text-lg">Branding</h2>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] space-y-14 px-6 py-10 md:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-xl border border-phx-border bg-phx-surface p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-phx-crimson">
              Branding
            </p>
            <h1 className="mt-3 text-5xl leading-tight tracking-tight text-phx-text md:text-7xl">
              Phalanx branding kit
            </h1>
          </div>

          <div className="rounded-xl border border-phx-border bg-phx-bg p-8">
            <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-phx-border bg-phx-surface">
              <PhalanxLockup height={160} surface="dark" ink="brand" showTagline />
            </div>
          </div>
        </section>

        <Section title="Logo Controls" kicker="Surface + Ink">
          <div className="grid gap-4 lg:grid-cols-3">
            {(['dark', 'light', 'transparent'] as const).flatMap(surface =>
              SURFACE_TONES[surface].map(tone => (
                <ToneSpecimen key={`${surface}-${tone.id}`} surface={surface} ink={tone.id} />
              ))
            )}
          </div>
        </Section>

        <Section title="Color Tokens" kicker="Brand Foundation">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {COLOR_SWATCHES.map(color => (
              <div key={color.token} className="rounded-lg border border-phx-border bg-phx-surface p-4">
                <div
                  className="mb-4 h-16 rounded-md border border-phx-border"
                  style={{ backgroundColor: color.value }}
                />
                <div className="text-sm text-phx-text">{color.name}</div>
                <div className="mt-1 font-mono text-[11px] text-phx-text-muted">{color.value}</div>
                <div className="mt-1 font-mono text-[10px] text-phx-text-muted/60">{color.token}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Icon Targets" kicker="Mark Only">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {ICON_ASSETS.map(asset => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        </Section>

        <Section title="Lockup & Social Targets" kicker="Text + Mark">
          <div className="grid gap-4 lg:grid-cols-2">
            {LOCKUP_ASSETS.map(asset => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        </Section>

        <section className="rounded-xl border border-phx-border bg-phx-surface p-6">
          <h3 className="text-lg text-phx-text">Export Notes</h3>
          <div className="mt-4 grid gap-3 text-sm leading-6 text-phx-text-muted md:grid-cols-3">
            <p>Every preview box has <code className="text-phx-bronze">data-brand-asset</code>, width, and height attributes for export script targeting.</p>
            <p>The shield geometry accepts <code className="text-phx-bronze">primary</code>, <code className="text-phx-bronze">accent</code>, and gradient stops as props, so new colorways require no SVG edits.</p>
            <p>Append <code className="text-phx-bronze">?export=1</code> to render the full-resolution export stage for Playwright screenshots.</p>
          </div>
        </section>
      </main>
    </div>
  )
}
