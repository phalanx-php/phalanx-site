import net from 'node:net'
import path from 'node:path'
import pngToIco from 'png-to-ico'
import sharp from 'sharp'

export type OutputFormat = 'png' | 'jpg' | 'ico'

export type OutputSpec = {
  target: 'design-kit' | 'public'
  path: string
  format?: OutputFormat
  quality?: number
}

export async function encodeOutput(input: Promise<Buffer> | Buffer, output: OutputSpec) {
  const buffer = await input
  if (output.format === 'jpg') {
    return sharp(buffer).jpeg({ quality: output.quality ?? 92 }).toBuffer()
  }
  if (output.format === 'ico') {
    return pngToIco([buffer])
  }
  return buffer
}

export async function findAvailablePort() {
  return new Promise<number>((resolve, reject) => {
    const server = net.createServer()
    server.unref()
    server.on('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      if (!address || typeof address === 'string') {
        server.close(() => reject(new Error('Unable to determine an open port')))
        return
      }
      const { port } = address
      server.close(error => {
        if (error) reject(error)
        else resolve(port)
      })
    })
  })
}

export async function applyRoundedMask(input: Buffer, size: number, radiusPercent = 20) {
  const radius = Math.round(size * (radiusPercent / 100))
  const mask = Buffer.from(
    `<svg width="${size}" height="${size}">
      <rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="white"/>
    </svg>`,
  )
  return sharp(input)
    .resize(size, size)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer()
}

export function resolveOutputPath(
  designKitDir: string,
  publicDir: string,
  runtimeBase: string,
  target: 'design-kit' | 'public',
  relativePath: string,
) {
  return target === 'design-kit'
    ? path.join(designKitDir, relativePath)
    : path.join(publicDir, runtimeBase, relativePath)
}
