import { BAL } from './balance'
import { rand, noise, pickWeighted } from './rng'
import type { ChannelId, DayAction, Effects, GameState, L, Stage } from './types'
import { buildById } from './content/builds'
import { nicheById } from './content/niches'
import { actionById } from './content/actions'
import { hireById, HIRES } from './content/hires'
import { EVENTS } from './content/events'

export const SAVE_VERSION = 1

export function stageOf(s: GameState): Stage {
  return s.mrr >= BAL.tractionMRR ? 'traction' : 'garage'
}

export function pmfOf(s: GameState): number {
  const n = nicheById(s.nicheId)
  const base = n.demand * (1 - n.competition * 0.4)
  const mult = Math.min(
    1,
    BAL.pmfBaseMult + (s.validated ? BAL.pmfValidated : 0) + (s.donorResearched ? BAL.pmfDonor : 0) + s.insight
  )
  return Math.min(1, base * mult)
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

function modMult(s: GameState, kind: 'traffic' | 'demand'): number {
  return s.mods.filter((m) => m.kind === kind).reduce((a, m) => a * m.value, 1)
}

function log(s: GameState, text: L, tone: 'good' | 'bad' | 'info' = 'info') {
  s.log.push({ day: s.day, text, tone })
  if (s.log.length > 60) s.log.splice(0, s.log.length - 60)
}

export function newRun(seed: number, buildId: string, nicheId: string): GameState {
  const b = buildById(buildId)
  const s: GameState = {
    v: SAVE_VERSION,
    seed,
    rngState: seed | 0,
    day: 1,
    status: 'playing',
    buildId,
    nicheId,
    money: b.money,
    energy: BAL.energyPerDay,
    energyMax: BAL.energyPerDay,
    motivation: BAL.startMotivation,
    audience: b.audience,
    progress: 0,
    quality: 0,
    features: 0,
    bugs: 0,
    landing: 0,
    price: BAL.defaultPrice,
    deployed: false,
    payments: false,
    launches: 0,
    launchToday: false,
    launchTail: 0,
    validated: false,
    donorResearched: false,
    insight: 0,
    analytics: false,
    paid: 0,
    paidFrac: 0,
    churnFrac: 0,
    mrr: 0,
    investorShare: 0,
    channels: { seo: 0, social: 0, forum: 0 },
    postsToday: {},
    adsSpendToday: 0,
    supportToday: false,
    restToday: false,
    hires: [],
    infraMonthly: 0,
    mods: [],
    crunchStreak: 0,
    firstPaidSeen: false,
    milestones: [],
    actionCounts: {},
    todayActions: [],
    pendingEvent: null,
    lastVisits: 0,
    lastSignups: 0,
    lastNewPaid: 0,
    lastChurned: 0,
    log: [],
    history: [],
    stats: { totalSpend: 0, totalVisits: 0, totalSignups: 0, peakMrr: 0, peakAudience: b.audience },
  }
  log(s, { ru: 'День 1. Сбережения на столе, идея в голове, кофе в кружке.', en: 'Day 1. Savings on the table, an idea in your head, coffee in the mug.' })
  return s
}

export function energyCost(s: GameState, actionId: string): number {
  const a = actionById(actionId)
  const b = buildById(s.buildId)
  const kindMult = a.kind === 'dev' ? b.devMult : a.kind === 'mkt' ? b.mktMult : 1
  return Math.max(1, Math.round(a.energy * kindMult * b.allMult))
}

export function canDoAction(s: GameState, actionId: string, p?: string | number): { ok: boolean; reason?: L } {
  const a = actionById(actionId)
  if (s.status !== 'playing') return { ok: false }
  if (s.pendingEvent) return { ok: false }
  const cost = actionId === 'rest' ? 0 : energyCost(s, actionId)
  if (s.energy < cost) return { ok: false, reason: { ru: 'Не хватает энергии', en: 'Not enough energy' } }
  if (a.money && s.money < a.money) return { ok: false, reason: { ru: 'Не хватает денег', en: 'Not enough money' } }
  if (a.once && s.actionCounts[actionId]) return { ok: false, reason: { ru: 'Уже сделано', en: 'Already done' } }
  if (a.perDay && s.todayActions.filter((t) => t.id === actionId).length >= a.perDay)
    return { ok: false, reason: { ru: 'Хватит на сегодня', en: 'Enough for today' } }
  switch (actionId) {
    case 'add_feature':
    case 'deploy':
    // продвижение заблокировано, пока нет продукта — нечего продвигать
    case 'post':
    case 'ads':
      if (s.progress < 100) return { ok: false, reason: { ru: 'Сначала допили MVP', en: 'Finish the MVP first' } }
      break
    case 'landing':
      if (s.landing >= 1) return { ok: false, reason: { ru: 'Лендинг уже идеален', en: 'The landing is already perfect' } }
      break
    case 'launch':
      if (!s.deployed) return { ok: false, reason: { ru: 'Сначала задеплой', en: 'Deploy first' } }
      break
    case 'payments':
      if (!s.deployed) return { ok: false, reason: { ru: 'Сначала задеплой', en: 'Deploy first' } }
      break
    case 'fix_bugs':
      if (s.bugs <= 0) return { ok: false, reason: { ru: 'Багов нет (пока)', en: 'No bugs (yet)' } }
      break
    case 'talk_users':
      if (s.stats.totalSignups <= 0) return { ok: false, reason: { ru: 'Не с кем: юзеров нет', en: 'Nobody to talk to: no users' } }
      break
    case 'hire': {
      if (stageOf(s) !== 'traction') return { ok: false, reason: { ru: 'Доступно со стадии Тракшн ($1k MRR)', en: 'Unlocked at Traction stage ($1k MRR)' } }
      const h = p ? hireById(String(p)) : null
      if (h && s.hires.includes(h.id)) return { ok: false, reason: { ru: 'Уже в команде', en: 'Already on the team' } }
      if (h && s.money < h.monthly) return { ok: false, reason: { ru: 'Не хватает денег на первый месяц', en: 'Cannot afford the first month' } }
      if (!p && HIRES.every((x) => s.hires.includes(x.id))) return { ok: false, reason: { ru: 'Все уже наняты', en: 'Everyone is hired' } }
      break
    }
  }
  return { ok: true }
}

// применяет действие к КОПИИ состояния
export function applyAction(state: GameState, actionId: string, p?: string | number): GameState {
  const check = canDoAction(state, actionId, p)
  if (!check.ok) return state
  const s = structuredClone(state)
  const n = nicheById(s.nicheId)
  const cost = actionId === 'rest' ? s.energy : energyCost(s, actionId)
  const a = actionById(actionId)
  s.energy -= cost
  if (a.money) {
    s.money -= a.money
    s.stats.totalSpend += a.money
  }
  s.actionCounts[actionId] = (s.actionCounts[actionId] ?? 0) + 1
  s.todayActions.push({ id: actionId, p })

  switch (actionId) {
    case 'research_niche':
      s.validated = true
      log(s, { ru: `Валидация: спрос ${Math.round(n.demand * 100)}/100, конкуренция ${Math.round(n.competition * 100)}/100, потолок цены ~$${n.arpuCap}`, en: `Validation: demand ${Math.round(n.demand * 100)}/100, competition ${Math.round(n.competition * 100)}/100, price cap ~$${n.arpuCap}` }, 'good')
      break
    case 'research_competitor':
      s.donorResearched = true
      log(s, { ru: 'Изучил донора: фичи, цены, отзывы. Копировать — не стыдно, стыдно — придумывать.', en: 'Studied the donor: features, prices, reviews. Copying is fine; inventing is the sin.' }, 'good')
      break
    case 'build_mvp':
      if (s.progress < 100) {
        s.progress = Math.min(100, s.progress + BAL.mvpProgressPerAction)
        s.quality = clamp(s.quality + BAL.mvpQualityPerAction, 0, 1)
        if (s.progress >= 100) log(s, { ru: 'MVP готов! Можно деплоить. Или добавить ещё одну фичу (не надо)', en: 'MVP is done! Time to deploy. Or add one more feature (don\'t)' }, 'good')
      } else {
        s.quality = clamp(s.quality + 0.02, 0, 1)
      }
      break
    case 'add_feature':
      s.features += 1
      if (s.features <= 3) {
        s.quality = clamp(s.quality + BAL.featureQualityEarly, 0, 1)
      } else {
        s.quality = clamp(s.quality + BAL.featureQualityLate, 0, 1)
        if (rand(s) < BAL.featureBugChanceLate) {
          s.bugs += 1
          log(s, { ru: 'Ещё одна фича — ещё один баг. Кто бы мог подумать.', en: 'One more feature — one more bug. Who could have guessed.' }, 'bad')
        }
      }
      break
    case 'fix_bugs':
      s.bugs = Math.max(0, s.bugs - BAL.fixBugsPerAction)
      break
    case 'deploy':
      s.deployed = true
      s.infraMonthly += 20
      log(s, { ru: 'Продукт в проде на Wyvercel. Теперь он может падать по-настоящему.', en: 'Deployed to Wyvercel. Now it can crash for real.' }, 'good')
      break
    case 'landing':
      // минимальный шаг 0.04 — иначе асимптота застревает на «99%»
      s.landing = clamp(s.landing + Math.max(0.04, BAL.landingPerAction * (1 - s.landing)), 0, 1)
      break
    case 'post': {
      const ch = (p as ChannelId) || 'social'
      const already = s.postsToday[ch] ?? 0
      // убывающая отдача повторных постов в один день — спам не стратегия
      s.channels[ch] += BAL.channels[ch].postMomentum / (1 + already)
      s.postsToday[ch] = already + 1
      break
    }
    case 'ads':
      s.adsSpendToday += a.money ?? 100
      break
    case 'launch': {
      s.launches += 1
      s.launchToday = true
      break
    }
    case 'talk_users': {
      s.insight = clamp(s.insight + BAL.insightPerTalk, 0, BAL.insightCap)
      s.supportToday = true
      const happy = s.quality >= 0.4 && s.bugs < 3
      s.motivation = clamp(s.motivation + (happy ? BAL.talkMotivationHappy : BAL.talkMotivationSad), 0, 100)
      log(s, happy
        ? { ru: 'Юзеры в целом довольны. Записал пару инсайтов.', en: 'Users are mostly happy. Wrote down a couple of insights.' }
        : { ru: 'Юзеры жалуются на качество. Больно, но полезно.', en: 'Users complain about quality. Painful but useful.' }, happy ? 'good' : 'bad')
      break
    }
    case 'set_price': {
      const newPrice = Math.max(1, Math.round(Number(p) || s.price))
      s.price = newPrice
      s.mrr = s.paid * s.price
      log(s, { ru: `Новая цена: $${newPrice}/мес`, en: `New price: $${newPrice}/mo` })
      break
    }
    case 'payments':
      s.payments = true
      log(s, { ru: 'Gold Golem Pay подключён. Голем берёт 2.9% + жертвоприношение.', en: 'Gold Golem Pay connected. The golem takes 2.9% + a small sacrifice.' }, 'good')
      break
    case 'metrics':
      s.analytics = true
      log(s, { ru: 'Аналитика открыта: CAC, LTV, churn — теперь на дашборде.', en: 'Analytics unlocked: CAC, LTV, churn — now on the dashboard.' }, 'good')
      break
    case 'rest':
      s.restToday = true
      s.motivation = clamp(s.motivation + BAL.restMotivation, 0, 100)
      s.crunchStreak = 0
      break
    case 'hire': {
      const h = hireById(String(p))
      s.hires.push(h.id)
      log(s, { ru: `${h.name.ru} в команде (+$${h.monthly}/мес)`, en: `${h.name.en} joined (+$${h.monthly}/mo)` }, 'good')
      break
    }
  }
  return s
}

export function applyEffects(state: GameState, fx: Effects, eventId?: string): GameState {
  const s = structuredClone(state)
  const b = buildById(s.buildId)
  if (fx.money) {
    s.money += fx.money
    if (fx.money < 0) s.stats.totalSpend -= fx.money
  }
  if (eventId === 'annual_plan') s.money += s.price * 10
  if (fx.motivation) s.motivation = clamp(s.motivation + (fx.motivation < 0 ? fx.motivation * b.motLossMult : fx.motivation), 0, 100)
  if (fx.energy) s.energy = Math.max(0, s.energy + fx.energy)
  if (fx.audience) s.audience = Math.max(0, s.audience + fx.audience)
  if (fx.audienceMult) s.audience = Math.round(s.audience * fx.audienceMult)
  if (fx.bugs) s.bugs = Math.max(0, s.bugs + fx.bugs)
  if (fx.quality) s.quality = clamp(s.quality + fx.quality, 0, 1)
  if (fx.landing) s.landing = clamp(s.landing + fx.landing, 0, 1)
  if (fx.pmfBonus) s.insight = clamp(s.insight + fx.pmfBonus, 0, BAL.insightCap + 0.1)
  if (fx.paid) {
    s.paid = Math.max(0, s.paid + fx.paid)
    s.mrr = s.paid * s.price
  }
  if (fx.churnPct) {
    const lost = Math.ceil(s.paid * fx.churnPct)
    s.paid = Math.max(0, s.paid - lost)
    s.mrr = s.paid * s.price
  }
  if (fx.traffic) s.mods.push({ kind: 'traffic', value: fx.traffic.mult, days: fx.traffic.days })
  if (fx.demand) s.mods.push({ kind: 'demand', value: fx.demand.mult, days: fx.demand.days })
  if (fx.sick) s.mods.push({ kind: 'energy', value: fx.sick.energy, days: fx.sick.days })
  if (fx.infra) s.infraMonthly = Math.max(10, s.infraMonthly + fx.infra)
  if (fx.share) s.investorShare = clamp(s.investorShare + fx.share, 0, 0.9)
  if (fx.end) s.status = fx.end
  return s
}

export function resolveEvent(state: GameState, choiceIdx: number): GameState {
  const ev = EVENTS.find((e) => e.id === state.pendingEvent)
  if (!ev) return { ...state, pendingEvent: null }
  let s = state
  if (ev.choices && choiceIdx >= 0 && ev.choices[choiceIdx]) {
    const ch = ev.choices[choiceIdx]
    s = applyEffects(s, ch.fx, ev.id)
    if (ch.risk && rand(s) < ch.risk.prob) {
      s = applyEffects(s, ch.risk.fx, ev.id)
      log(s, ch.risk.label, 'bad')
    }
  } else if (ev.fx) {
    s = applyEffects(s, ev.fx, ev.id)
  }
  s = structuredClone(s)
  s.pendingEvent = null
  checkEndConditions(s)
  return s
}

function rollEvent(s: GameState) {
  if (rand(s) >= BAL.eventChance) return
  const stage = stageOf(s)
  const candidates = EVENTS.filter((e) => e.stageW[stage] > 0 && (!e.requires || e.requires(s)))
  const ev = pickWeighted(s, candidates, (e) => e.stageW[stage])
  if (ev) s.pendingEvent = ev.id
}

// метрики воронки текущего дня — используются и в тике, и в UI-прогнозе
export function funnelMetrics(s: GameState) {
  const n = nicheById(s.nicheId)
  const pmf = pmfOf(s)
  const demandMult = modMult(s, 'demand')
  const trafficMult = modMult(s, 'traffic')
  const active = (Object.keys(s.channels) as ChannelId[]).filter((c) => s.channels[c] > BAL.activeChannelThreshold)
  const chPenalty = active.length >= 2 ? BAL.multiChannelPenalty : 1
  let organic = 0
  for (const c of active) organic += BAL.channels[c].visits(s.channels[c], s.audience) * chPenalty
  const cpv = BAL.adsCpv(n.competition, s.landing)
  const adsVisits = s.adsSpendToday / cpv
  const spike = s.launchToday ? BAL.launchSpike(s.audience, s.landing, s.validated, s.launches) : 0
  const convLp = BAL.convLp(s.landing, pmf) * Math.min(1.5, demandMult)
  const priceFactor = BAL.priceFactor(s.price, n.arpuCap)
  const convPay = BAL.convPay(s.quality, pmf, priceFactor) * Math.min(1.5, demandMult)
  const support = s.supportToday || s.hires.includes('support_goblin')
  const churnMonthly = BAL.churnMonthly(s.quality, s.bugs, support)
  return { pmf, organic, adsVisits, spike, convLp, convPay, churnMonthly, cpv, trafficMult, demandMult }
}

export function endDay(state: GameState): GameState {
  if (state.status !== 'playing' || state.pendingEvent) return state
  const s = structuredClone(state)
  const n = nicheById(s.nicheId)
  const b = buildById(s.buildId)

  // найм: пассивные эффекты
  if (s.hires.includes('gnome_devops')) s.bugs = Math.max(0, s.bugs - 1)
  if (s.hires.includes('elf_designer')) s.landing = clamp(s.landing + 0.005, 0, 0.9)
  if (s.hires.includes('oracle_analyst')) s.insight = clamp(s.insight + 0.0015, 0, BAL.insightCap)

  const m = funnelMetrics(s)
  const visits = Math.round(
    (m.organic * m.trafficMult + m.adsVisits + m.spike + s.launchTail) * noise(s, BAL.dailyNoise)
  )
  const signups = Math.round(visits * m.convLp * noise(s, BAL.dailyNoise))

  let newPaid = 0
  if (s.payments) {
    s.paidFrac += signups * m.convPay
    newPaid = Math.floor(s.paidFrac)
    s.paidFrac -= newPaid
  }
  s.churnFrac += s.paid * (m.churnMonthly / 30)
  const churned = Math.min(s.paid, Math.floor(s.churnFrac))
  s.churnFrac -= churned

  s.paid = s.paid + newPaid - churned
  s.mrr = s.paid * s.price

  // деньги: доход и burn — подневно
  const hiresMonthly = s.hires.reduce((a, h) => a + hireById(h).monthly, 0)
  const burnMonthly = BAL.burnLifeMonthly + s.infraMonthly + hiresMonthly
  s.money += (s.mrr * (1 - s.investorShare)) / 30 - burnMonthly / 30

  // инфра растёт ступенями с юзерами
  if (s.deployed) {
    const tier = BAL.infraTiers.find((t) => s.paid >= t.users)!
    s.infraMonthly = Math.max(s.infraMonthly, tier.cost)
  }

  // аудитория
  const posts = Object.values(s.postsToday).reduce((a, v) => a + (v ?? 0), 0)
  const audGain = Math.round(posts * BAL.audiencePerPost(n.virality) * noise(s) + signups * BAL.audiencePerSignup)
  s.audience += audGain

  // мотивация
  const spentAll = s.energy <= 0 && !s.restToday
  if (spentAll) {
    s.crunchStreak += 1
    if (s.crunchStreak >= BAL.crunchAfterDays) {
      s.motivation = clamp(s.motivation - BAL.crunchPenaltyPerDay * b.motLossMult, 0, 100)
      log(s, { ru: 'Кранч который день подряд. Внутренний огонёк коптит.', en: 'Crunching for days in a row. The inner flame is smoking.' }, 'bad')
    }
  } else if (s.restToday || s.energy >= s.energyMax * 0.5) {
    s.crunchStreak = 0
  }
  if (s.launchToday && signups === 0) {
    s.motivation = clamp(s.motivation - BAL.launchFlopPenalty * b.motLossMult, 0, 100)
    log(s, { ru: 'Лонч в пустоту. Ноль регистраций. Классика жанра.', en: 'Launched into the void. Zero signups. A genre classic.' }, 'bad')
  }
  if (newPaid > 0 && !s.firstPaidSeen) {
    s.firstPaidSeen = true
    s.motivation = clamp(s.motivation + BAL.firstPaidBonus, 0, 100)
    log(s, { ru: 'ПЕРВЫЙ ПЛАТЯЩИЙ КЛИЕНТ! Скриншот. В рамку. На стену.', en: 'FIRST PAYING CUSTOMER! Screenshot it. Frame it. Wall it.' }, 'good')
  }
  for (const ms of BAL.milestonesMRR) {
    if (s.mrr >= ms && !s.milestones.includes(ms)) {
      s.milestones.push(ms)
      s.motivation = clamp(s.motivation + BAL.milestoneBonus, 0, 100)
      log(s, { ru: `Веха: $${ms} MRR!`, en: `Milestone: $${ms} MRR!` }, 'good')
    }
  }

  // лог дня
  if (visits > 0 || signups > 0 || newPaid > 0 || churned > 0) {
    log(s, {
      ru: `+${visits} визитов, +${signups} регистраций, +${newPaid} платящих, −${churned} отписок`,
      en: `+${visits} visits, +${signups} signups, +${newPaid} paid, −${churned} churned`,
    })
  }

  // тик модификаторов
  s.mods = s.mods.map((mod) => ({ ...mod, days: mod.days - 1 })).filter((mod) => mod.days > 0)

  // launch tail на завтра
  s.launchTail = s.launchToday ? m.spike * BAL.launchTailMult : 0

  // отчёт
  s.lastVisits = visits
  s.lastSignups = signups
  s.lastNewPaid = newPaid
  s.lastChurned = churned
  s.stats.totalVisits += visits
  s.stats.totalSignups += signups
  s.stats.peakMrr = Math.max(s.stats.peakMrr, s.mrr)
  s.stats.peakAudience = Math.max(s.stats.peakAudience, s.audience)
  s.history.push({ day: s.day, mrr: s.mrr, money: Math.round(s.money), visits, signups, paid: s.paid, motivation: s.motivation })

  // новый день
  s.day += 1
  s.launchToday = false
  s.postsToday = {}
  s.adsSpendToday = 0
  s.supportToday = false
  s.restToday = false
  s.todayActions = []
  // decay каналов
  for (const c of Object.keys(s.channels) as ChannelId[]) {
    s.channels[c] = s.channels[c] * (1 - BAL.channels[c].decay)
    if (s.channels[c] < 0.05) s.channels[c] = 0
  }
  // энергия следующего дня
  const sickPenalty = s.mods.filter((mod) => mod.kind === 'energy').reduce((a, mod) => a + mod.value, 0)
  const motPenalty = s.motivation < BAL.lowMot2 ? BAL.lowMot2Penalty : s.motivation < BAL.lowMot1 ? BAL.lowMot1Penalty : 0
  s.energy = Math.max(2, BAL.energyPerDay - motPenalty + sickPenalty)
  s.energyMax = BAL.energyPerDay

  checkEndConditions(s)
  if (s.status === 'playing') rollEvent(s)
  return s
}

function checkEndConditions(s: GameState) {
  if (s.status !== 'playing') return
  if (s.mrr >= BAL.winMRR) s.status = 'won'
  else if (s.money <= 0) s.status = 'lost_money'
  else if (s.motivation <= 0) s.status = 'lost_burnout'
}

// «повторить день ×7»: реплей действий текущего дня, прерывается событием/порогами
export function fastForward(state: GameState): GameState {
  if (state.status !== 'playing' || state.pendingEvent) return state
  const template: DayAction[] = state.todayActions.slice()
  let s = endDay(state)
  for (let i = 0; i < 6; i++) {
    if (s.status !== 'playing' || s.pendingEvent) break
    if (s.money < 300 || s.motivation < 25) break
    for (const t of template) {
      const next = applyAction(s, t.id, t.p)
      if (next !== s) s = next
    }
    const before = s.mrr
    s = endDay(s)
    // прервались на MRR-вехе
    if ([...BAL.milestonesMRR, BAL.winMRR].some((ms) => before < ms && s.mrr >= ms)) break
  }
  return s
}
