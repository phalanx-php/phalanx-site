import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { setTimeout as delay } from 'node:timers/promises'
import { chromium } from 'playwright'
import sharp from 'sharp'
import { Resvg } from '@resvg/resvg-js'
import { applyRoundedMask, encodeOutput, findAvailablePort, resolveOutputPath } from './brand-generator'

const rootDir = path.resolve(import.meta.dir, '..', 'frontend')
const monorepoDir = path.resolve(import.meta.dir, '..', '..', '..', 'phalanx')
const designKitDir = path.resolve(import.meta.dir, '..', 'design-kit')
const publicDir = path.resolve(import.meta.dir, '..', 'public')
const logosDir = path.join(publicDir, 'assets', 'logos')
const runtimeBase = 'assets/brand'
const brandingRoute = '/branding?export=1'
const monorepoAssetsDir = path.join(monorepoDir, 'assets')

const checkMode = process.argv.includes('--check')

interface AssetTarget {
  id: string
  width: number
  height: number
  outputs: Array<{
    target: 'design-kit' | 'public'
    path: string
    format?: 'png' | 'jpg' | 'ico'
    quality?: number
  }>
}

const ASSETS: AssetTarget[] = [
  { id: 'favicon-16', width: 16, height: 16, outputs: [
    { target: 'design-kit', path: 'favicon/favicon-16.png' },
    { target: 'public', path: 'favicon/favicon.ico', format: 'ico' },
  ]},
  { id: 'favicon-32', width: 32, height: 32, outputs: [
    { target: 'design-kit', path: 'favicon/favicon-32.png' },
  ]},
  { id: 'icon-48', width: 48, height: 48, outputs: [
    { target: 'design-kit', path: 'mark/icon-48.png' },
  ]},
  { id: 'icon-64', width: 64, height: 64, outputs: [
    { target: 'design-kit', path: 'mark/icon-64.png' },
  ]},
  { id: 'icon-96', width: 96, height: 96, outputs: [
    { target: 'design-kit', path: 'mark/icon-96.png' },
  ]},
  { id: 'icon-128', width: 128, height: 128, outputs: [
    { target: 'design-kit', path: 'mark/icon-128.png' },
  ]},
  { id: 'apple-touch-180', width: 180, height: 180, outputs: [
    { target: 'design-kit', path: 'mark/apple-touch-icon.png' },
    { target: 'public', path: 'mark/apple-touch-icon.png' },
  ]},
  { id: 'pwa-192', width: 192, height: 192, outputs: [
    { target: 'design-kit', path: 'mark/icon-192.png' },
    { target: 'public', path: 'mark/icon-192.png' },
  ]},
  { id: 'icon-256', width: 256, height: 256, outputs: [
    { target: 'design-kit', path: 'mark/icon-256.png' },
  ]},
  { id: 'pwa-512', width: 512, height: 512, outputs: [
    { target: 'design-kit', path: 'mark/icon-512.png' },
    { target: 'public', path: 'mark/icon-512.png' },
  ]},
  { id: 'social-avatar', width: 400, height: 400, outputs: [
    { target: 'design-kit', path: 'social/profile-avatar.png' },
    { target: 'public', path: 'social/profile-avatar.png' },
  ]},
  { id: 'nav-lockup', width: 240, height: 160, outputs: [
    { target: 'design-kit', path: 'lockup/nav.png' },
  ]},
  { id: 'footer-lockup', width: 320, height: 200, outputs: [
    { target: 'design-kit', path: 'lockup/footer.png' },
  ]},
  { id: 'readme-lockup', width: 680, height: 260, outputs: [
    { target: 'design-kit', path: 'lockup/readme.png' },
  ]},
  { id: 'og-image', width: 1200, height: 630, outputs: [
    { target: 'design-kit', path: 'social/og-image.png' },
    { target: 'public', path: 'social/og-image.png' },
    { target: 'public', path: 'social/og-image.jpg', format: 'jpg', quality: 92 },
  ]},
  { id: 'x-header', width: 1500, height: 500, outputs: [
    { target: 'design-kit', path: 'social/x-header.png' },
    { target: 'public', path: 'social/x-header.png' },
    { target: 'public', path: 'social/x-header.jpg', format: 'jpg', quality: 92 },
  ]},
  { id: 'linkedin-cover', width: 1584, height: 396, outputs: [
    { target: 'design-kit', path: 'social/linkedin-cover.png' },
    { target: 'public', path: 'social/linkedin-cover.png' },
    { target: 'public', path: 'social/linkedin-cover.jpg', format: 'jpg', quality: 92 },
  ]},
  { id: 'square-post', width: 1080, height: 1080, outputs: [
    { target: 'design-kit', path: 'social/square-post.png' },
    { target: 'public', path: 'social/square-post.png' },
    { target: 'public', path: 'social/square-post.jpg', format: 'jpg', quality: 92 },
  ]},
]

async function main() {
  const writes = new Map<string, Buffer>()
  const server = await startViteServer()

  try {
    const captures = await captureAssets(server.baseUrl)

    for (const asset of ASSETS) {
      const png = captures.get(asset.id)
      if (!png) throw new Error(`Missing capture for ${asset.id}`)

      for (const output of asset.outputs) {
        const filePath = resolveOutputPath(designKitDir, publicDir, runtimeBase, output.target, output.path)
        const encoded = await encodeOutput(png, output)
        writes.set(filePath, encoded)
      }
    }

    await generateRoundedFavicons(captures, writes)
    await generateMarkFromSvg(writes)
    await buildLogosDirectory(captures, writes)

    await syncOutputs(writes)
    await distributeToMonorepo(writes)

    if (checkMode) {
      console.log(`brand:check OK (${writes.size} files)`)
    } else {
      console.log(`brand:build wrote ${writes.size} files`)
    }
  } finally {
    server.process.kill('SIGTERM')
    await onceClosed(server.process)
  }
}

const ROUNDED_TARGETS = [
  { sourceId: 'favicon-16', size: 16, paths: ['favicon/favicon-rounded-16.png'] },
  { sourceId: 'favicon-32', size: 32, paths: ['favicon/favicon-rounded-32.png'] },
  { sourceId: 'apple-touch-180', size: 180, paths: ['mark/apple-touch-rounded.png'] },
  { sourceId: 'pwa-192', size: 192, paths: ['mark/icon-rounded-192.png'] },
  { sourceId: 'pwa-512', size: 512, paths: ['mark/icon-rounded-512.png'] },
]

async function generateRoundedFavicons(captures: Map<string, Buffer>, writes: Map<string, Buffer>) {
  for (const target of ROUNDED_TARGETS) {
    const source = captures.get(target.sourceId)
    if (!source) throw new Error(`Missing source for rounded: ${target.sourceId}`)

    const rounded = await applyRoundedMask(source, target.size)
    for (const p of target.paths) {
      writes.set(path.join(designKitDir, p), rounded)
      writes.set(path.join(publicDir, runtimeBase, p), rounded)
    }
  }
}

async function generateMarkFromSvg(writes: Map<string, Buffer>) {
  const markSvgPath = await resolveAssetPath('mark.svg')
  const svgText = await readFile(markSvgPath, 'utf8')

  const resvg = new Resvg(svgText, {
    fitTo: { mode: 'width', value: 500 },
    background: 'rgba(0,0,0,0)',
  })
  const rendered = resvg.render()
  const png500 = await sharp(rendered.asPng()).resize(500, 500, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer()

  if (await exists(monorepoAssetsDir)) {
    writes.set(path.join(monorepoAssetsDir, 'mark.png'), png500)
  }

  writes.set(path.join(designKitDir, 'mark', 'mark-500.png'), png500)
}

async function buildLogosDirectory(captures: Map<string, Buffer>, writes: Map<string, Buffer>) {
  const markSvgPath = await resolveAssetPath('mark.svg')
  const bannerSvgPath = await resolveAssetPath('banner.svg')

  const markSvg = await readFile(markSvgPath)
  const bannerSvg = await readFile(bannerSvgPath)
  const mark500 = writes.get(path.join(designKitDir, 'mark', 'mark-500.png'))
  if (!mark500) throw new Error('mark-500 not generated yet')

  writes.set(path.join(logosDir, 'mark.svg'), markSvg)
  writes.set(path.join(logosDir, 'banner.svg'), bannerSvg)
  writes.set(path.join(logosDir, 'mark-500.png'), mark500)

  const faviconSvg = await readFile(markSvgPath)
  writes.set(path.join(logosDir, 'favicon', 'favicon.svg'), faviconSvg)

  const copyFromDesignKit = [
    ['favicon/favicon-16.png', 'favicon/favicon-16.png'],
    ['favicon/favicon-32.png', 'favicon/favicon-32.png'],
    ['favicon/favicon-rounded-16.png', 'favicon/favicon-rounded-16.png'],
    ['favicon/favicon-rounded-32.png', 'favicon/favicon-rounded-32.png'],
    ['mark/icon-48.png', 'mark/icon-48.png'],
    ['mark/icon-64.png', 'mark/icon-64.png'],
    ['mark/icon-96.png', 'mark/icon-96.png'],
    ['mark/icon-128.png', 'mark/icon-128.png'],
    ['mark/icon-256.png', 'mark/icon-256.png'],
    ['mark/icon-512.png', 'mark/icon-512.png'],
    ['mark/apple-touch-icon.png', 'mark/apple-touch-icon.png'],
    ['mark/apple-touch-rounded.png', 'mark/apple-touch-rounded.png'],
    ['mark/icon-192.png', 'mark/icon-192.png'],
    ['mark/icon-rounded-192.png', 'mark/icon-rounded-192.png'],
    ['mark/icon-rounded-512.png', 'mark/icon-rounded-512.png'],
    ['social/profile-avatar.png', 'social/profile-avatar.png'],
    ['social/og-image.png', 'social/og-image.png'],
    ['social/x-header.png', 'social/x-header.png'],
    ['social/linkedin-cover.png', 'social/linkedin-cover.png'],
    ['social/square-post.png', 'social/square-post.png'],
    ['lockup/nav.png', 'lockup/nav.png'],
    ['lockup/footer.png', 'lockup/footer.png'],
    ['lockup/readme.png', 'lockup/readme.png'],
  ] as const

  for (const [dkPath, logoPath] of copyFromDesignKit) {
    const buf = writes.get(path.join(designKitDir, dkPath))
    if (buf) {
      writes.set(path.join(logosDir, logoPath), buf)
    }
  }

  const jpgSources = [
    ['social/og-image.png', 'social/og-image.jpg'],
    ['social/x-header.png', 'social/x-header.jpg'],
    ['social/linkedin-cover.png', 'social/linkedin-cover.jpg'],
    ['social/square-post.png', 'social/square-post.jpg'],
  ] as const

  for (const [srcPath, jpgPath] of jpgSources) {
    const png = writes.get(path.join(designKitDir, srcPath))
    if (png) {
      const jpg = await sharp(png).jpeg({ quality: 92 }).toBuffer()
      writes.set(path.join(logosDir, jpgPath), jpg)
    }
  }

  const ico16 = writes.get(path.join(designKitDir, 'favicon/favicon-16.png'))
  if (ico16) {
    const ico = await import('png-to-ico').then(m => m.default([ico16]))
    writes.set(path.join(logosDir, 'favicon', 'favicon.ico'), ico)
  }
}

async function distributeToMonorepo(writes: Map<string, Buffer>) {
  const mark500 = writes.get(path.join(designKitDir, 'mark', 'mark-500.png'))
  if (!mark500) return

  const packagesDir = path.join(monorepoDir, 'packages')
  const bannerSvgPath = path.join(monorepoAssetsDir, 'banner.svg')
  if (!await exists(bannerSvgPath)) return

  const bannerSvg = await readFile(bannerSvgPath)

  try {
    await stat(packagesDir)
  } catch {
    return
  }

  const packages = await import('node:fs/promises').then(fs => fs.readdir(packagesDir))
  for (const pkg of packages) {
    const brandDir = path.join(packagesDir, pkg, 'brand')
    try {
      await stat(brandDir)
    } catch {
      continue
    }

    await mkdir(brandDir, { recursive: true })
    if (!checkMode) {
      await writeFile(path.join(brandDir, 'banner.svg'), bannerSvg)
      await writeFile(path.join(brandDir, 'mark.png'), mark500)
    }
  }
}

async function resolveAssetPath(fileName: 'banner.svg' | 'mark.svg') {
  const candidates = [
    path.join(monorepoAssetsDir, fileName),
    path.join(logosDir, fileName),
  ]

  for (const candidate of candidates) {
    if (await exists(candidate)) return candidate
  }

  throw new Error(`Missing brand source asset: ${fileName}`)
}

async function exists(filePath: string) {
  try {
    await stat(filePath)
    return true
  } catch {
    return false
  }
}

async function captureAssets(baseUrl: string) {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1920, height: 1200 } })
  const output = new Map<string, Buffer>()

  try {
    await page.goto(`${baseUrl}${brandingRoute}`, { waitUntil: 'networkidle' })

    for (const asset of ASSETS) {
      const selector = `[data-brand-export="${asset.id}"]`
      const element = await page.waitForSelector(selector, { state: 'attached' })
      if (!element) throw new Error(`Element not found: ${selector}`)

      const buffer = await element.screenshot({ type: 'png' })
      const metadata = await sharp(buffer).metadata()

      if (metadata.width !== asset.width || metadata.height !== asset.height) {
        throw new Error(
          `Captured ${asset.id} at ${metadata.width}x${metadata.height}, expected ${asset.width}x${asset.height}`,
        )
      }

      output.set(asset.id, buffer)
    }

    return output
  } finally {
    await browser.close()
  }
}

async function syncOutputs(writes: Map<string, Buffer>) {
  const changed: string[] = []

  for (const [filePath, nextContent] of writes) {
    await mkdir(path.dirname(filePath), { recursive: true })
    const current = await readExisting(filePath)
    if (current !== null && current.equals(nextContent)) continue

    changed.push(filePath)
    if (!checkMode) {
      await writeFile(filePath, nextContent)
    }
  }

  if (checkMode && changed.length > 0) {
    throw new Error(`Generated branding assets are stale:\n${changed.join('\n')}`)
  }
}

async function readExisting(filePath: string) {
  try {
    return await readFile(filePath)
  } catch {
    return null
  }
}

async function startViteServer() {
  const port = await findAvailablePort()
  const child = spawn('bun', ['x', 'vite', 'dev', '--host', '127.0.0.1', '--port', String(port)], {
    cwd: rootDir,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, CI: '1' },
  })

  let stdout = ''
  let stderr = ''
  child.stdout.on('data', (chunk: Buffer) => { stdout += String(chunk) })
  child.stderr.on('data', (chunk: Buffer) => { stderr += String(chunk) })

  const baseUrl = `http://127.0.0.1:${port}`
  const deadline = Date.now() + 30_000

  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Vite dev server exited early.\n${stdout}\n${stderr}`)
    }
    try {
      const response = await fetch(baseUrl)
      if (response.ok) return { baseUrl, process: child }
    } catch {}
    await delay(250)
  }

  child.kill('SIGTERM')
  throw new Error(`Timed out waiting for Vite dev server.\n${stdout}\n${stderr}`)
}

async function onceClosed(child: ReturnType<typeof spawn>) {
  if (child.exitCode !== null) return
  await new Promise<void>(resolve => child.once('close', () => resolve()))
}

await main()
