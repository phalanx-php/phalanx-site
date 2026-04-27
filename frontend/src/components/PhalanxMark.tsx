import type { CSSProperties } from 'react'

interface PhalanxMarkProps {
  size?: number
  primary?: string
  primaryDeep?: string
  accent?: string
  accentLight?: string
  accentDark?: string
  bg?: string
  className?: string
  style?: CSSProperties
}

export function PhalanxMark({
  size = 80,
  primary = '#C62840',
  primaryDeep = '#891428',
  accent = '#C9A55A',
  accentLight = '#ECD48E',
  accentDark = '#A07828',
  bg: _bg,
  className = '',
  style,
}: PhalanxMarkProps) {
  const uid = `phx-${Math.random().toString(36).slice(2, 8)}`

  return (
    <svg
      viewBox="0 0 80 120"
      width={size}
      height={size * 1.5}
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`${uid}-shield`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={primary} />
          <stop offset="100%" stopColor={primaryDeep} />
        </linearGradient>
        <linearGradient id={`${uid}-bronze`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor={accentLight} />
          <stop offset="50%" stopColor={accent} />
          <stop offset="100%" stopColor={accentDark} />
        </linearGradient>
      </defs>

      {/* Helmet crest / plume */}
      <path
        d="M 22 20 C 26 10, 32 4, 37 3 C 42 4, 48 10, 52 20 C 47 15, 41 11, 37 10 C 33 11, 27 15, 22 20 Z"
        fill={`url(#${uid}-bronze)`}
        opacity="0.8"
      />

      {/* Shield body */}
      <path
        d="M 37 16 L 74 30 L 71 78 Q 37 116 3 78 L 0 30 Z"
        fill={`url(#${uid}-shield)`}
      />

      {/* Double rim */}
      <path
        d="M 37 24 L 66 36 L 64 74 Q 37 106 10 74 L 8 36 Z"
        fill="none"
        stroke={`url(#${uid}-bronze)`}
        strokeWidth="1.5"
        opacity="0.35"
      />
      <path
        d="M 37 31 L 60 41 L 58 70 Q 37 97 16 70 L 14 41 Z"
        fill="none"
        stroke={`url(#${uid}-bronze)`}
        strokeWidth="0.8"
        opacity="0.18"
      />

      {/* Shield highlight */}
      <path
        d="M 37 16 L 74 30 L 72 48 Q 37 56 2 48 L 0 30 Z"
        fill="white"
        opacity="0.07"
      />

      {/* Lambda */}
      <path
        d="M 37 36 L 56 92 L 46 92 L 37 56 L 28 92 L 18 92 Z"
        fill={`url(#${uid}-bronze)`}
      />
    </svg>
  )
}
