// mulberry32 — seeded PRNG; state хранится в GameState.rngState, мутируется на месте
export function rand(s: { rngState: number }): number {
  let t = (s.rngState = (s.rngState + 0x6d2b79f5) | 0)
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

// шум ±spread вокруг 1 («жизнь шумная»)
export function noise(s: { rngState: number }, spread = 0.3): number {
  return 1 + (rand(s) * 2 - 1) * spread
}

export function pickWeighted<T>(s: { rngState: number }, items: T[], weight: (t: T) => number): T | null {
  const total = items.reduce((a, i) => a + weight(i), 0)
  if (total <= 0) return null
  let r = rand(s) * total
  for (const i of items) {
    r -= weight(i)
    if (r <= 0) return i
  }
  return items[items.length - 1]
}
