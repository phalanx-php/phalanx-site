import type { CSSProperties } from 'react'
import { PhalanxMark } from './PhalanxMark'

type Surface = 'dark' | 'light' | 'transparent'
type Ink = 'brand' | 'mono' | 'reversed'

interface PhalanxLockupProps {
  height?: number
  surface?: Surface
  ink?: Ink
  showTagline?: boolean
  className?: string
  style?: CSSProperties
}

function resolveColors(surface: Surface, ink: Ink) {
  const base = {
    dark: { bg: '#0A0A0A', text: '#E8E8E8', muted: '#888888' },
    light: { bg: '#FFFFFF', text: '#1A1A1A', muted: '#666666' },
    transparent: { bg: 'transparent', text: '#E8E8E8', muted: '#888888' },
  }[surface]

  if (ink === 'mono') {
    return {
      ...base,
      primary: surface === 'light' ? '#1A1A1A' : '#E8E8E8',
      primaryDeep: surface === 'light' ? '#333333' : '#CCCCCC',
      accent: surface === 'light' ? '#555555' : '#AAAAAA',
      accentLight: surface === 'light' ? '#777777' : '#CCCCCC',
      accentDark: surface === 'light' ? '#333333' : '#888888',
    }
  }

  if (ink === 'reversed') {
    return {
      ...base,
      text: '#FFFFFF',
      muted: '#CCCCCC',
      primary: '#FFFFFF',
      primaryDeep: '#CCCCCC',
      accent: '#FFFFFF',
      accentLight: '#FFFFFF',
      accentDark: '#CCCCCC',
    }
  }

  return {
    ...base,
    primary: '#C62840',
    primaryDeep: '#891428',
    accent: '#C9A55A',
    accentLight: '#ECD48E',
    accentDark: '#A07828',
  }
}

export function PhalanxLockup({
  height = 80,
  surface = 'dark',
  ink = 'brand',
  showTagline = false,
  className = '',
  style,
}: PhalanxLockupProps) {
  const colors = resolveColors(surface, ink)
  const markHeight = height * 0.7
  const fontSize = height * 0.28
  const taglineSize = height * 0.12

  return (
    <div
      className={`inline-flex flex-col items-center gap-2 ${className}`}
      style={style}
    >
      <PhalanxMark
        size={markHeight / 1.5}
        primary={colors.primary}
        primaryDeep={colors.primaryDeep}
        accent={colors.accent}
        accentLight={colors.accentLight}
        accentDark={colors.accentDark}
      />
      <span
        className="font-mono font-bold tracking-[0.15em]"
        style={{ fontSize, color: colors.text }}
      >
        PHALANX
      </span>
      {showTagline && (
        <span
          className="tracking-[0.1em] uppercase"
          style={{ fontSize: taglineSize, color: colors.muted }}
        >
          Supervised execution framework for modern PHP
        </span>
      )}
    </div>
  )
}

export { resolveColors }
export type { Surface, Ink }
