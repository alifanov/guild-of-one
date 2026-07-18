import { BAL } from './balance'
import { rand, noise, pickWeighted } from './rng'
import type { ChannelId, DayAction, Effects, GameState, L, Stage } from './types'
import { buildById } from './content/builds'
import { nicheById } from './content/niches'
import { actionById } from './content/actions'
import { hireById, HIRES } from './content/hires'
import { EVENTS } from './content/events'
import { FLAVOR } from './content/flavor'
import { INSIGHTS } from './content/insights'
import { fitFor } from './content/niches'

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

// выдаёт первый ещё не открытый актуальный инсайт (общение с юзерами / метрики)
function unlockInsight(s: GameState) {
  if (!s.insights) s.insights = [] // сейвы до появления инсайтов
  const next = INSIGHTS.find((i) => !s.insights.includes(i.id) && i.when(s))
  if (next) {
    s.insights.push(next.id)
    log(s, next.text(s), 'good')
  }
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
    insights: [],
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
  log(s, { ru: 'День 1. Сбережения на столе, идея в голове, кофе в кружке.', en: 'Day 1. Savings on the table, an idea in your head, coffee in the mug.', es: 'Día 1. Los ahorros en la mesa, una idea en la cabeza, café en la taza.', zh: '第 1 天。积蓄摆在桌上，点子装在脑里，咖啡倒在杯里。', pt: 'Dia 1. As economias na mesa, uma ideia na cabeça, café na caneca.' })
  return s
}

export function energyCost(s: GameState, actionId: string): number {
  const a = actionById(actionId)
  const b = buildById(s.buildId)
  const kindMult = a.kind === 'dev' ? b.devMult : a.kind === 'mkt' ? b.mktMult : 1
  return Math.max(1, Math.round(a.energy * kindMult * b.allMult))
}

export function canDoAction(s: GameState, actionId: string, p?: string | number): { ok: boolean; reason?: L; hide?: boolean } {
  const a = actionById(actionId)
  if (s.status !== 'playing') return { ok: false }
  if (s.pendingEvent) return { ok: false }
  // структурные блокировки (hide: true) — действие прячется из списка;
  // ресурсные (энергия/деньги/лимит дня) — кнопка остаётся, но серая
  if (a.once && s.actionCounts[actionId]) return { ok: false, hide: true, reason: { ru: 'Уже сделано', en: 'Already done', es: 'Ya está hecho', zh: '已经做过了', pt: 'Já feito' } }
  switch (actionId) {
    case 'add_feature':
    case 'deploy':
    // продвижение заблокировано, пока нет продукта — нечего продвигать
    case 'post':
    case 'ads':
      if (s.progress < 100) return { ok: false, hide: true, reason: { ru: 'Сначала допили MVP', en: 'Finish the MVP first', es: 'Primero termina el MVP', zh: '先把 MVP 做完', pt: 'Termine o MVP primeiro' } }
      break
    case 'landing':
      if (s.landing >= 1) return { ok: false, hide: true, reason: { ru: 'Лендинг уже идеален', en: 'The landing is already perfect', es: 'La landing ya es perfecta', zh: '落地页已经完美了', pt: 'A landing já está perfeita' } }
      break
    case 'launch':
      if (!s.deployed) return { ok: false, hide: true, reason: { ru: 'Сначала задеплой', en: 'Deploy first', es: 'Primero haz deploy', zh: '先部署', pt: 'Faça o deploy primeiro' } }
      break
    case 'payments':
      if (!s.deployed) return { ok: false, hide: true, reason: { ru: 'Сначала задеплой', en: 'Deploy first', es: 'Primero haz deploy', zh: '先部署', pt: 'Faça o deploy primeiro' } }
      break
    case 'fix_bugs':
      if (s.bugs <= 0) return { ok: false, hide: true, reason: { ru: 'Багов нет (пока)', en: 'No bugs (yet)', es: 'No hay bugs (todavía)', zh: '没有 bug（暂时）', pt: 'Sem bugs (por enquanto)' } }
      break
    case 'talk_users':
      if (s.stats.totalSignups <= 0) return { ok: false, hide: true, reason: { ru: 'Не с кем: юзеров нет', en: 'Nobody to talk to: no users', es: 'No hay con quién hablar: no hay usuarios', zh: '没人可聊：还没有用户', pt: 'Ninguém para conversar: sem usuários' } }
      break
    case 'hire': {
      if (stageOf(s) !== 'traction') return { ok: false, hide: true, reason: { ru: 'Доступно со стадии Тракшн ($1k MRR)', en: 'Unlocked at Traction stage ($1k MRR)', es: 'Se desbloquea en la etapa Tracción ($1k MRR)', zh: '增长阶段解锁（$1k MRR）', pt: 'Desbloqueado na fase Tração ($1k MRR)' } }
      const h = p ? hireById(String(p)) : null
      if (h && s.hires.includes(h.id)) return { ok: false, hide: true, reason: { ru: 'Уже в команде', en: 'Already on the team', es: 'Ya está en el equipo', zh: '已经在团队里了', pt: 'Já está no time' } }
      if (h && s.money < h.monthly) return { ok: false, reason: { ru: 'Не хватает денег на первый месяц', en: 'Cannot afford the first month', es: 'No alcanza para el primer mes', zh: '付不起第一个月', pt: 'Não dá para pagar o primeiro mês' } }
      if (!p && HIRES.every((x) => s.hires.includes(x.id))) return { ok: false, hide: true, reason: { ru: 'Все уже наняты', en: 'Everyone is hired', es: 'Ya contrataste a todos', zh: '所有人都雇了', pt: 'Todos já foram contratados' } }
      break
    }
  }
  const cost = actionId === 'rest' ? 0 : energyCost(s, actionId)
  if (s.energy < cost) return { ok: false, reason: { ru: 'Не хватает энергии', en: 'Not enough energy', es: 'No hay energía suficiente', zh: '精力不足', pt: 'Energia insuficiente' } }
  if (a.money && s.money < a.money) return { ok: false, reason: { ru: 'Не хватает денег', en: 'Not enough money', es: 'No hay dinero suficiente', zh: '钱不够', pt: 'Dinheiro insuficiente' } }
  if (a.perDay && s.todayActions.filter((t) => t.id === actionId).length >= a.perDay)
    return { ok: false, reason: { ru: 'Хватит на сегодня', en: 'Enough for today', es: 'Suficiente por hoy', zh: '今天够了', pt: 'Chega por hoje' } }
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
      log(s, { ru: `Валидация: спрос ${Math.round(n.demand * 100)}/100, конкуренция ${Math.round(n.competition * 100)}/100, потолок цены ~$${n.arpuCap}`, en: `Validation: demand ${Math.round(n.demand * 100)}/100, competition ${Math.round(n.competition * 100)}/100, price cap ~$${n.arpuCap}`, es: `Validación: demanda ${Math.round(n.demand * 100)}/100, competencia ${Math.round(n.competition * 100)}/100, techo de precio ~$${n.arpuCap}`, zh: `验证结果：需求 ${Math.round(n.demand * 100)}/100，竞争 ${Math.round(n.competition * 100)}/100，价格上限 ~$${n.arpuCap}`, pt: `Validação: demanda ${Math.round(n.demand * 100)}/100, concorrência ${Math.round(n.competition * 100)}/100, teto de preço ~$${n.arpuCap}` }, 'good')
      break
    case 'research_competitor':
      s.donorResearched = true
      log(s, { ru: 'Изучил донора: фичи, цены, отзывы. Копировать — не стыдно, стыдно — придумывать.', en: 'Studied the donor: features, prices, reviews. Copying is fine; inventing is the sin.', es: 'Estudiaste al competidor donante: features, precios, reseñas. Copiar no da vergüenza; inventar, sí.', zh: '研究了对标产品：功能、价格、评价。抄不丢人，瞎编才丢人。', pt: 'Estudou o concorrente-doador: features, preços, reviews. Copiar não é vergonha; inventar é que é.' }, 'good')
      break
    case 'build_mvp':
      if (s.progress < 100) {
        s.progress = Math.min(100, s.progress + BAL.mvpProgressPerAction)
        s.quality = clamp(s.quality + BAL.mvpQualityPerAction, 0, 1)
        if (s.progress >= 100) log(s, { ru: 'MVP готов! Можно деплоить. Или добавить ещё одну фичу (не надо)', en: 'MVP is done! Time to deploy. Or add one more feature (don\'t)', es: '¡MVP listo! Hora del deploy. O de añadir una feature más (no lo hagas)', zh: 'MVP 完成了！可以部署了。或者再加一个功能（别）', pt: 'MVP pronto! Hora do deploy. Ou de adicionar mais uma feature (não faça isso)' }, 'good')
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
          log(s, { ru: 'Ещё одна фича — ещё один баг. Кто бы мог подумать.', en: 'One more feature — one more bug. Who could have guessed.', es: 'Una feature más — un bug más. Quién lo hubiera imaginado.', zh: '多一个功能，多一个 bug。真是万万没想到。', pt: 'Mais uma feature — mais um bug. Quem diria.' }, 'bad')
        }
      }
      break
    case 'fix_bugs':
      s.bugs = Math.max(0, s.bugs - BAL.fixBugsPerAction)
      break
    case 'deploy':
      s.deployed = true
      s.infraMonthly += 20
      log(s, { ru: 'Продукт в проде на Wyvercel. Теперь он может падать по-настоящему.', en: 'Deployed to Wyvercel. Now it can crash for real.', es: 'Desplegado en Wyvercel. Ahora puede caerse de verdad.', zh: '已部署到 Wyvercel。现在它可以真正地宕机了。', pt: 'No ar na Wyvercel. Agora ele pode cair de verdade.' }, 'good')
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
        ? { ru: 'Юзеры в целом довольны. Записал пару инсайтов.', en: 'Users are mostly happy. Wrote down a couple of insights.', es: 'Los usuarios están contentos en general. Anotaste un par de insights.', zh: '用户总体还算满意。记下了几条洞察。', pt: 'Os usuários estão satisfeitos no geral. Anotou alguns insights.' }
        : { ru: 'Юзеры жалуются на качество. Больно, но полезно.', en: 'Users complain about quality. Painful but useful.', es: 'Los usuarios se quejan de la calidad. Duele, pero sirve.', zh: '用户在抱怨质量。很痛，但有用。', pt: 'Os usuários reclamam da qualidade. Dói, mas é útil.' }, happy ? 'good' : 'bad')
      unlockInsight(s)
      break
    }
    case 'set_price': {
      const newPrice = Math.max(1, Math.round(Number(p) || s.price))
      s.price = newPrice
      s.mrr = s.paid * s.price
      log(s, { ru: `Новая цена: $${newPrice}/мес`, en: `New price: $${newPrice}/mo`, es: `Nuevo precio: $${newPrice}/mes`, zh: `新价格：$${newPrice}/月`, pt: `Novo preço: $${newPrice}/mês` })
      break
    }
    case 'payments':
      s.payments = true
      log(s, { ru: 'Gold Golem Pay подключён. Голем берёт 2.9% + жертвоприношение.', en: 'Gold Golem Pay connected. The golem takes 2.9% + a small sacrifice.', es: 'Gold Golem Pay conectado. El gólem cobra 2.9% + un pequeño sacrificio.', zh: 'Gold Golem Pay 已接入。石魔收取 2.9% 外加一点祭品。', pt: 'Gold Golem Pay conectado. O golem cobra 2.9% + um pequeno sacrifício.' }, 'good')
      break
    case 'metrics':
      if (!s.analytics) {
        s.analytics = true
        log(s, { ru: 'Аналитика открыта: CAC, LTV, churn — теперь на дашборде.', en: 'Analytics unlocked: CAC, LTV, churn — now on the dashboard.', es: 'Analítica desbloqueada: CAC, LTV, churn — ahora en el dashboard.', zh: '数据分析已解锁：CAC、LTV、churn 都上仪表盘了。', pt: 'Analytics desbloqueado: CAC, LTV, churn — agora no dashboard.' }, 'good')
      }
      unlockInsight(s)
      break
    case 'rest':
      s.restToday = true
      s.motivation = clamp(s.motivation + BAL.restMotivation, 0, 100)
      s.crunchStreak = 0
      break
    case 'hire': {
      const h = hireById(String(p))
      s.hires.push(h.id)
      log(s, { ru: `${h.name.ru} в команде (+$${h.monthly}/мес)`, en: `${h.name.en} joined (+$${h.monthly}/mo)`, es: `${h.name.es ?? h.name.en} se unió al equipo (+$${h.monthly}/mes)`, zh: `${h.name.zh ?? h.name.en} 加入了团队（+$${h.monthly}/月）`, pt: `${h.name.pt ?? h.name.en} entrou no time (+$${h.monthly}/mês)` }, 'good')
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
  const fit = fitFor(s.nicheId)
  let organic = 0
  for (const c of active) organic += BAL.channels[c].visits(s.channels[c], s.audience) * chPenalty * fit[c]
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
      log(s, { ru: 'Кранч который день подряд. Внутренний огонёк коптит.', en: 'Crunching for days in a row. The inner flame is smoking.', es: 'Crunch un día tras otro. La llamita interior echa humo.', zh: '连轴加班好几天了。内心的小火苗开始冒黑烟。', pt: 'Crunch um dia atrás do outro. A chaminha interior está soltando fumaça.' }, 'bad')
    }
  } else if (s.restToday || s.energy >= s.energyMax * 0.5) {
    s.crunchStreak = 0
  }
  if (s.launchToday && signups === 0) {
    s.motivation = clamp(s.motivation - BAL.launchFlopPenalty * b.motLossMult, 0, 100)
    log(s, { ru: 'Лонч в пустоту. Ноль регистраций. Классика жанра.', en: 'Launched into the void. Zero signups. A genre classic.', es: 'Lanzamiento al vacío. Cero registros. Un clásico del género.', zh: '发布进了虚空。零注册。业界经典。', pt: 'Lançamento no vazio. Zero cadastros. Um clássico do gênero.' }, 'bad')
  }
  if (newPaid > 0 && !s.firstPaidSeen) {
    s.firstPaidSeen = true
    s.motivation = clamp(s.motivation + BAL.firstPaidBonus, 0, 100)
    log(s, { ru: 'ПЕРВЫЙ ПЛАТЯЩИЙ КЛИЕНТ! Скриншот. В рамку. На стену.', en: 'FIRST PAYING CUSTOMER! Screenshot it. Frame it. Wall it.', es: '¡PRIMER CLIENTE DE PAGO! Captura. Marco. Pared.', zh: '第一个付费用户！截图。装裱。挂墙上。', pt: 'PRIMEIRO CLIENTE PAGANTE! Print. Moldura. Parede.' }, 'good')
  }
  for (const ms of BAL.milestonesMRR) {
    if (s.mrr >= ms && !s.milestones.includes(ms)) {
      s.milestones.push(ms)
      s.motivation = clamp(s.motivation + BAL.milestoneBonus, 0, 100)
      log(s, { ru: `Веха: $${ms} MRR!`, en: `Milestone: $${ms} MRR!`, es: `¡Hito: $${ms} MRR!`, zh: `里程碑：$${ms} MRR！`, pt: `Marco: $${ms} MRR!` }, 'good')
    }
  }

  // лог дня
  if (visits > 0 || signups > 0 || newPaid > 0 || churned > 0) {
    log(s, {
      ru: `+${visits} визитов, +${signups} регистраций, +${newPaid} платящих, −${churned} отписок`,
      en: `+${visits} visits, +${signups} signups, +${newPaid} paid, −${churned} churned`,
      es: `+${visits} visitas, +${signups} registros, +${newPaid} de pago, −${churned} bajas`,
      zh: `+${visits} 访问，+${signups} 注册，+${newPaid} 付费，−${churned} 流失`,
      pt: `+${visits} visitas, +${signups} cadastros, +${newPaid} pagantes, −${churned} cancelamentos`,
    })
  }
  // ироничный коммент к итогу дня
  const flavorGroup =
    churned > newPaid && churned >= 2 ? 'churnHeavy'
    : newPaid > 0 ? 'newPaid'
    : s.money < 500 ? 'moneyLow'
    : signups > 0 && s.payments ? 'signupsNoPaid'
    : visits > 0 && signups === 0 ? 'visitsNoSignups'
    : visits === 0 && s.launches > 0 ? 'zeroVisits'
    : !s.deployed ? 'building'
    : 'quiet'
  const pool = FLAVOR[flavorGroup]
  const flavorTone = flavorGroup === 'newPaid' ? 'good' : flavorGroup === 'churnHeavy' || flavorGroup === 'moneyLow' ? 'bad' : 'info'
  log(s, pool[Math.floor(rand(s) * pool.length)], flavorTone)

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

// фаундер сдался сам — не поражение по ресурсам, отдельная концовка
export function giveUp(state: GameState): GameState {
  if (state.status !== 'playing') return state
  const s = structuredClone(state)
  s.status = 'shutdown'
  log(s, {
    ru: 'Продукт закрыт решением основателя. Совет директоров (ты) единогласен.',
    en: 'Product shut down by founder decision. The board (you) voted unanimously.',
    es: 'Producto cerrado por decisión del fundador. La junta (tú) votó por unanimidad.',
    zh: '创始人决定关停产品。董事会（你）全票通过。',
    pt: 'Produto encerrado por decisão do fundador. O conselho (você) votou por unanimidade.',
  })
  return s
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
