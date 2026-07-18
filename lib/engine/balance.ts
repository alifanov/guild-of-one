// ВСЕ числа баланса — здесь. Тюнится плейтестами и scripts/simulate.ts
export const BAL = {
  winMRR: 10000,
  tractionMRR: 1000,

  energyPerDay: 10,
  startMotivation: 100,
  defaultPrice: 19,

  burnLifeMonthly: 1500,
  infraTiers: [
    { users: 1000, cost: 2000 },
    { users: 200, cost: 500 },
    { users: 50, cost: 100 },
    { users: 0, cost: 20 },
  ],

  // события
  eventChance: 0.35,
  dailyNoise: 0.3,

  // мотивация
  lowMot1: 30,
  lowMot1Penalty: 2,
  lowMot2: 15,
  lowMot2Penalty: 4,
  crunchAfterDays: 4,
  crunchPenaltyPerDay: 3,
  restMotivation: 12,
  launchFlopPenalty: 8,
  firstPaidBonus: 10,
  milestoneBonus: 8,
  milestonesMRR: [100, 1000, 5000],

  // PMF: pmf = base * min(1, bonuses), base = demand * (1 - competition * 0.4)
  pmfBaseMult: 0.45, // без валидации — «лонч в пустоту»
  pmfValidated: 0.3,
  pmfDonor: 0.15,
  insightCap: 0.35,
  insightPerTalk: 0.03,

  // конверсии
  convLp: (landing: number, pmf: number) => (0.008 + 0.072 * landing) * (0.3 + 0.7 * pmf),
  convPay: (quality: number, pmf: number, priceFactor: number) =>
    (0.012 + 0.088 * quality) * (0.2 + 0.8 * pmf) * priceFactor,
  priceFactor: (price: number, arpuCap: number) => Math.min(1.2, Math.max(0.15, 1.25 - price / arpuCap)),
  churnMonthly: (quality: number, bugs: number, support: boolean) =>
    Math.min(0.4, Math.max(0.015, 0.03 + 0.2 * (1 - quality) + 0.01 * bugs - (support ? 0.05 : 0))),

  // каналы: visits(momentum), decay/день; email/partners — только Тракшн
  channels: {
    seo: { visits: (m: number, _aud: number) => 8 * Math.pow(m, 1.3), decay: 0.01, postMomentum: 1 },
    social: { visits: (m: number, aud: number) => m * (4 + aud * 0.04), decay: 0.3, postMomentum: 1 },
    forum: { visits: (m: number, _aud: number) => m * 14, decay: 0.15, postMomentum: 1 },
    email: { visits: (m: number, aud: number) => m * (8 + aud * 0.05), decay: 0.12, postMomentum: 1 },
    partners: { visits: (m: number, _aud: number) => m * 22, decay: 0.04, postMomentum: 1 },
  },
  // штраф за распыление: 1 канал ×1, 2 канала ×0.6, 3+ ×0.4
  multiChannelPenalty: (active: number) => (active <= 1 ? 1 : active === 2 ? 0.6 : 0.4),
  activeChannelThreshold: 0.5,

  // enterprise-сделки («киты»): шанс срыва по стадиям демо/пилот/контракт
  deal: { minMRR: 300, spanMRR: 1200, failProb: [0, 0.2, 0.25, 0.3] as const },

  // поздние тарифы
  proMrrMult: 1.25,
  proChurnAdd: 0.01,
  proMinFeatures: 3,
  annualShare: 0.25, // доля новых платящих, берущих годовой план
  annualUpfrontMonths: 10, // платят 10 месяцев вперёд (2 мес — дисконт)
  exitMultipleMonths: 36, // экзит = 3 годовые выручки

  // реклама: $ за визит
  adsCpv: (competition: number, landing: number) => (0.8 + competition * 4) * (1.2 - 0.5 * landing),

  // лонч
  launchSpike: (audience: number, landing: number, validated: boolean, launches: number) =>
    ((150 + audience * 1.2) * (0.4 + 0.6 * landing) * (validated ? 1 : 0.6)) / Math.max(1, launches),
  launchTailMult: 0.4,

  // аудитория
  audiencePerPost: (virality: number) => 2 + virality * 14,
  audiencePerSignup: 0.15,

  // продукт
  mvpProgressPerAction: 20,
  mvpQualityPerAction: 0.03,
  featureQualityEarly: 0.08, // фичи 1–3
  featureQualityLate: 0.01, // «ещё одна фича»
  featureBugChanceLate: 0.7,
  fixBugsPerAction: 2,
  landingPerAction: 0.15, // * (1 - landing), убывает
  talkMotivationHappy: 2,
  talkMotivationSad: -1,
} as const
