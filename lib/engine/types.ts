export type Lang = 'ru' | 'en' | 'es' | 'zh' | 'pt'
// ru/en обязательны; остальные — с фолбэком на en
export type L = { ru: string; en: string } & Partial<Record<'es' | 'zh' | 'pt', string>>
export const LANGS: Lang[] = ['ru', 'en', 'es', 'zh', 'pt']
export const LANG_LABELS: Record<Lang, string> = { ru: 'RU', en: 'EN', es: 'ES', zh: '中文', pt: 'PT' }

export type ChannelId = 'seo' | 'social' | 'forum' | 'email' | 'partners'
// email и partners открываются на стадии Тракшн
export const BASE_CHANNELS: ChannelId[] = ['seo', 'social', 'forum']
export const TRACTION_CHANNELS: ChannelId[] = ['email', 'partners']
export type Stage = 'garage' | 'traction'
export type Status = 'playing' | 'won' | 'lost_money' | 'lost_burnout' | 'quit_job' | 'shutdown' | 'sold'

export interface NicheDef {
  id: string
  name: L
  legend: L
  // скрытые параметры — открываются валидацией
  demand: number // 0..1
  competition: number // 0..1
  arpuCap: number // $
  virality: number // 0..1
}

export interface BuildDef {
  id: string
  name: L
  desc: L
  icon: string
  money: number
  audience: number
  devMult: number // множитель энергии на dev-действия
  mktMult: number
  allMult: number
  motLossMult: number // множитель потерь мотивации
}

export type ActionKind = 'dev' | 'mkt' | 'other'

export interface ActionDef {
  id: string
  name: L
  desc: L
  icon: string
  energy: number
  money?: number
  kind: ActionKind
  once?: boolean // максимум 1 раз за ран
  perDay?: number // максимум N раз в день
}

export interface Effects {
  money?: number
  motivation?: number
  energy?: number // на сегодня
  audience?: number
  audienceMult?: number
  bugs?: number
  quality?: number
  landing?: number
  pmfBonus?: number // добавка к insight
  paid?: number
  churnPct?: number // потерять долю платящих сейчас
  traffic?: { mult: number; days: number }
  demand?: { mult: number; days: number }
  sick?: { energy: number; days: number }
  infra?: number // к ежемесячной инфре
  share?: number // доля инвестора
  end?: Status
}

export interface EventChoice {
  label: L
  fx: Effects
  risk?: { prob: number; fx: Effects; label: L }
}

export interface EventDef {
  id: string
  cat: 'market' | 'tech' | 'social' | 'personal' | 'money' | 'users'
  char: string
  stageW: { garage: number; traction: number }
  requires?: (s: GameState) => boolean
  title: L
  text: L
  fx?: Effects // мгновенное
  choices?: EventChoice[]
}

export interface CharacterDef {
  id: string
  name: L
  sprite: string[] // pixel map
}

export interface HireDef {
  id: string
  char: string
  name: L
  desc: L
  monthly: number
}

export interface Mod {
  kind: 'traffic' | 'demand' | 'energy'
  value: number
  days: number
}

export interface LogEntry {
  day: number
  text: L
  tone: 'good' | 'bad' | 'info'
}

export interface DayAction {
  id: string
  p?: string | number
}

export interface GameState {
  v: number
  seed: number
  rngState: number
  day: number
  status: Status
  buildId: string
  nicheId: string
  // ресурсы
  money: number
  energy: number
  energyMax: number
  motivation: number
  audience: number
  // продукт
  progress: number // 0..100, MVP готов на 100
  quality: number // 0..1
  features: number
  bugs: number
  landing: number // 0..1
  price: number
  deployed: boolean
  payments: boolean
  launches: number
  launchToday: boolean
  launchTail: number
  // PMF
  validated: boolean
  donorResearched: boolean
  insight: number // 0..0.35 — из общения с юзерами и т.п.
  insights: string[] // id открытых фактов-инсайтов
  analytics: boolean
  // воронка
  paid: number
  paidFrac: number
  churnFrac: number
  mrr: number
  investorShare: number
  // каналы
  channels: Record<ChannelId, number> // momentum
  postsToday: Partial<Record<ChannelId, number>>
  adsSpendToday: number
  supportToday: boolean
  restToday: boolean
  // поздняя стадия
  deal: { mrr: number; stage: 1 | 2 | 3 } | null // enterprise-сделка: найден → демо → пилот → контракт
  proTier: boolean
  annualPlans: boolean
  questsDone: string[]
  // команда/расходы
  hires: string[]
  infraMonthly: number
  // модификаторы и счётчики
  mods: Mod[]
  crunchStreak: number
  firstPaidSeen: boolean
  milestones: number[] // достигнутые MRR-вехи
  actionCounts: Record<string, number>
  // день
  todayActions: DayAction[]
  pendingEvent: string | null
  // отчётность
  lastVisits: number
  lastSignups: number
  lastNewPaid: number
  lastChurned: number
  log: LogEntry[]
  history: { day: number; mrr: number; money: number; visits: number; signups: number; paid: number; motivation: number }[]
  stats: { totalSpend: number; totalVisits: number; totalSignups: number; peakMrr: number; peakAudience: number }
}
