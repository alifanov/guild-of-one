'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameState, Lang } from './engine/types'
import { applyAction, endDay, newRun, resolveEvent } from './engine/engine'
import { NICHES } from './engine/content/niches'

type Screen = 'title' | 'build' | 'idea' | 'game'

interface Store {
  lang: Lang
  screen: Screen
  seed: number
  buildId: string | null
  ideas: string[]
  game: GameState | null
  setLang: (l: Lang) => void
  toTitle: () => void
  startNewRun: () => void
  chooseBuild: (id: string) => void
  chooseIdea: (id: string) => void
  continueRun: () => void
  act: (id: string, p?: string | number) => void
  finishDay: () => void
  resolveEv: (idx: number) => void
}

// сид → 3 случайные идеи (простая перетасовка)
function pickIdeas(seed: number): string[] {
  let t = seed | 0
  const next = () => {
    t = (t + 0x6d2b79f5) | 0
    let x = Math.imul(t ^ (t >>> 15), t | 1)
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
  const pool = NICHES.map((n) => n.id)
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, 3)
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      lang: 'ru',
      screen: 'title',
      seed: 0,
      buildId: null,
      ideas: [],
      game: null,
      setLang: (lang) => set({ lang }),
      toTitle: () => set({ screen: 'title' }),
      startNewRun: () => {
        const seed = (Date.now() ^ Math.floor(Math.random() * 0x7fffffff)) & 0x7fffffff
        set({ seed, screen: 'build', buildId: null, ideas: [] })
      },
      chooseBuild: (id) => set({ buildId: id, ideas: pickIdeas(get().seed), screen: 'idea' }),
      chooseIdea: (nicheId) => {
        const { seed, buildId } = get()
        if (!buildId) return
        set({ game: newRun(seed, buildId, nicheId), screen: 'game' })
      },
      continueRun: () => set({ screen: 'game' }),
      act: (id, p) => {
        const g = get().game
        if (g) set({ game: applyAction(g, id, p) })
      },
      finishDay: () => {
        const g = get().game
        if (g) set({ game: endDay(g) })
      },
      resolveEv: (idx) => {
        const g = get().game
        if (g) set({ game: resolveEvent(g, idx) })
      },
    }),
    { name: 'guild-of-one', version: 1 }
  )
)
