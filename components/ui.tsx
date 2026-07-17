'use client'
import { PALETTE } from '@/lib/engine/content/characters'

export function Panel({ title, children, className = '' }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`panel p-3 ${className}`}>
      {title && <div className="pixel-font text-[10px] text-[var(--muted)] mb-2 uppercase">{title}</div>}
      {children}
    </div>
  )
}

export function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="bar w-full">
      <div style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: color }} />
    </div>
  )
}

export function Sparkline({ data, color = 'var(--accent)', height = 36 }: { data: number[]; color?: string; height?: number }) {
  if (data.length < 2) return <div style={{ height }} className="flex items-center text-[var(--muted)] text-xs">—</div>
  const min = Math.min(...data)
  const max = Math.max(...data)
  const span = max - min || 1
  const w = 100
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${height - 3 - ((v - min) / span) * (height - 6)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" shapeRendering="crispEdges" />
    </svg>
  )
}

export function PixelSprite({ sprite, size = 6, className = '' }: { sprite: string[]; size?: number; className?: string }) {
  const h = sprite.length
  const w = sprite[0].length
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w * size} height={h * size} className={className} shapeRendering="crispEdges">
      {sprite.flatMap((row, y) =>
        row.split('').map((ch, x) => {
          const color = PALETTE[ch]
          return color ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={color} /> : null
        })
      )}
    </svg>
  )
}
