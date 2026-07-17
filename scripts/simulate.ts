// Авто-симуляция баланса: N ботов с разными стратегиями.
// Проверяет: «правильная» стратегия достижимо побеждает, анти-паттерны — проигрывают.
// Запуск: pnpm sim
import assert from 'node:assert'
import { applyAction, canDoAction, endDay, newRun, resolveEvent, stageOf } from '../lib/engine/engine'
import type { GameState } from '../lib/engine/types'
import { NICHES, nicheById } from '../lib/engine/content/niches'
import { EVENTS } from '../lib/engine/content/events'

const MAX_DAYS = 720
const RUNS = 150

function shuffle3(seed: number): string[] {
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

type Policy = (s: GameState) => { id: string; p?: string | number } | null

// «Правильный путь»: валидация → MVP → лендинг → деплой → платежи → лонч → 1 канал → саппорт
const smartPolicy: Policy = (s) => {
  const n = nicheById(s.nicheId)
  const tryA = (id: string, p?: string | number) => (canDoAction(s, id, p).ok ? { id, p } : null)
  if (s.motivation < 35) return tryA('rest')
  if (!s.validated) return tryA('research_niche')
  if (!s.donorResearched) return tryA('research_competitor')
  if (s.progress < 100) return tryA('build_mvp')
  if (s.landing < 0.55) return tryA('landing')
  if (!s.deployed) return tryA('deploy')
  if (!s.payments) return tryA('payments')
  if (s.price !== Math.max(5, Math.round(n.arpuCap * 0.6)) && canDoAction(s, 'set_price').ok)
    return { id: 'set_price', p: Math.max(5, Math.round(n.arpuCap * 0.6)) }
  if (s.launches === 0) return tryA('launch')
  if (s.bugs >= 2) return tryA('fix_bugs')
  if (s.features < 3) return tryA('add_feature')
  if (stageOf(s) === 'traction' && !s.hires.includes('support_goblin') && s.money > 3000)
    return tryA('hire', 'support_goblin')
  if (canDoAction(s, 'talk_users').ok) return { id: 'talk_users' }
  if (s.money > 6000 && s.landing > 0.6) {
    const ads = tryA('ads')
    if (ads && s.adsSpendToday < 300) return ads
  }
  return tryA('post', 'seo')
}

// Анти-паттерны: без валидации, фичи после 3-й, распыление на 3 канала, без общения с юзерами
const naivePolicy: Policy = (s) => {
  const tryA = (id: string, p?: string | number) => (canDoAction(s, id, p).ok ? { id, p } : null)
  if (s.progress < 100) return tryA('build_mvp')
  if (s.features < 6) return tryA('add_feature')
  if (!s.deployed) return tryA('deploy')
  if (!s.payments) return tryA('payments')
  if (s.launches === 0) return tryA('launch')
  if (s.landing < 0.3) return tryA('landing')
  const ch = (['seo', 'social', 'forum'] as const)[s.day % 3]
  return tryA('post', ch)
}

function runBot(seed: number, buildId: string, policy: Policy, pickBest: boolean) {
  const ideas = shuffle3(seed)
  const nicheId = pickBest
    ? ideas.reduce((best, id) => {
        const a = nicheById(id)
        const b = nicheById(best)
        const score = (x: typeof a) => x.demand * (1 - x.competition * 0.4) * Math.min(x.arpuCap, 80)
        return score(a) > score(b) ? id : best
      })
    : ideas[0]
  let s = newRun(seed, buildId, nicheId)
  while (s.status === 'playing' && s.day <= MAX_DAYS) {
    if (s.pendingEvent) {
      const ev = EVENTS.find((e) => e.id === s.pendingEvent)!
      const idx = ev.choices ? (pickBest ? 0 : ev.choices.length - 1) : -1
      s = resolveEvent(s, idx)
      continue
    }
    let guard = 0
    while (s.energy > 0 && s.status === 'playing' && guard++ < 30) {
      const a = policy(s)
      if (!a) break
      const next = applyAction(s, a.id, a.p)
      if (next === s) break
      s = next
    }
    if (s.status === 'playing') s = endDay(s)
    assert(Number.isFinite(s.money) && Number.isFinite(s.mrr) && Number.isFinite(s.motivation), `NaN at day ${s.day}`)
  }
  return s
}

function runBatch(name: string, buildId: string, policy: Policy, pickBest: boolean) {
  let wins = 0
  const winDays: number[] = []
  const causes: Record<string, number> = {}
  for (let i = 0; i < RUNS; i++) {
    const s = runBot(1000 + i * 7919, buildId, policy, pickBest)
    if (s.status === 'won') {
      wins++
      winDays.push(s.day)
    } else {
      const cause = s.status === 'playing' ? 'timeout' : s.status
      causes[cause] = (causes[cause] ?? 0) + 1
    }
  }
  const rate = wins / RUNS
  const avgWin = winDays.length ? Math.round(winDays.reduce((a, b) => a + b, 0) / winDays.length) : 0
  console.log(
    `${name.padEnd(22)} winrate ${(rate * 100).toFixed(0).padStart(3)}%  avg win day ${String(avgWin).padStart(3)}  losses:`,
    causes
  )
  return { rate, avgWin }
}

console.log(`Симуляция: ${RUNS} ранов на стратегию, максимум ${MAX_DAYS} дней\n`)
const smart = runBatch('smart (методология)', 'coder', smartPolicy, true)
const smartMkt = runBatch('smart (маркетолог)', 'marketer', smartPolicy, true)
const naive = runBatch('naive (анти-паттерны)', 'coder', naivePolicy, false)

// баланс-инварианты
assert(smart.rate >= 0.3, `smart winrate слишком низкий: ${smart.rate}`)
assert(naive.rate <= smart.rate - 0.2, `анти-паттерны должны сильно проигрывать: naive ${naive.rate} vs smart ${smart.rate}`)
assert(smart.avgWin > 30, `победа слишком быстрая: ${smart.avgWin} дней`)
console.log('\n✅ Баланс-инварианты держатся: методология побеждает, анти-паттерны наказаны')
void smartMkt
