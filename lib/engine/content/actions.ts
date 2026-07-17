import type { ActionDef } from '../types'

export const ACTIONS: ActionDef[] = [
  {
    id: 'research_niche',
    name: { ru: 'Исследовать нишу', en: 'Research niche' },
    desc: { ru: 'Открывает спрос/конкуренцию/потолок цены. Сильно повышает PMF', en: 'Reveals demand/competition/price cap. Big PMF boost' },
    icon: '🔍', energy: 3, kind: 'mkt', once: true,
  },
  {
    id: 'research_competitor',
    name: { ru: 'Изучить конкурента-донора', en: 'Study donor competitor' },
    desc: { ru: 'Не придумывай — копируй валидированное. +PMF', en: "Don't invent — copy what's validated. +PMF" },
    icon: '🕵️', energy: 2, kind: 'mkt', once: true,
  },
  {
    id: 'build_mvp',
    name: { ru: 'Пилить MVP', en: 'Build MVP' },
    desc: { ru: '+20% прогресса. На 100% можно деплоить и лончить', en: '+20% progress. At 100% you can deploy & launch' },
    icon: '🔨', energy: 4, kind: 'dev',
  },
  {
    id: 'add_feature',
    name: { ru: 'Добавить фичу', en: 'Add feature' },
    desc: { ru: '+качество. После 3-й — убывающая отдача и баги', en: '+quality. After the 3rd — diminishing returns and bugs' },
    icon: '✨', energy: 4, kind: 'dev',
  },
  {
    id: 'fix_bugs',
    name: { ru: 'Чинить баги', en: 'Fix bugs' },
    desc: { ru: '−2 бага. Баги кормят churn-демона', en: '−2 bugs. Bugs feed the churn demon' },
    icon: '🐛', energy: 2, kind: 'dev',
  },
  {
    id: 'deploy',
    name: { ru: 'Задеплоить на Wyvercel', en: 'Deploy to Wyvercel' },
    desc: { ru: 'Нужно для лонча. +$20/мес инфры', en: 'Required for launch. +$20/mo infra' },
    icon: '🚀', energy: 2, money: 50, kind: 'dev', once: true,
  },
  {
    id: 'landing',
    name: { ru: 'Улучшить лендинг', en: 'Improve landing' },
    desc: { ru: '+конверсия визит→регистрация', en: '+visit→signup conversion' },
    icon: '📄', energy: 3, kind: 'mkt',
  },
  {
    id: 'post',
    name: { ru: 'Пост в канал', en: 'Post to channel' },
    desc: { ru: '+трафик канала, +аудитория. 1 канал — путь, 3 канала — распыление', en: '+channel traffic, +audience. 1 channel = focus, 3 = spray' },
    icon: '📢', energy: 2, kind: 'mkt',
  },
  {
    id: 'ads',
    name: { ru: 'Запустить рекламу', en: 'Run ads' },
    desc: { ru: 'Платный трафик. CAC зависит от ниши и лендинга', en: 'Paid traffic. CAC depends on niche and landing' },
    icon: '💸', energy: 1, money: 100, kind: 'mkt',
  },
  {
    id: 'launch',
    name: { ru: 'Лонч на Product Cave', en: 'Launch on Product Cave' },
    desc: { ru: 'Разовый всплеск трафика × аудитория × подготовка', en: 'One-time traffic spike × audience × preparation' },
    icon: '🎉', energy: 5, kind: 'mkt',
  },
  {
    id: 'talk_users',
    name: { ru: 'Общаться с юзерами', en: 'Talk to users' },
    desc: { ru: '+инсайты (PMF), −churn, ±мотивация', en: '+insights (PMF), −churn, ±motivation' },
    icon: '💬', energy: 2, kind: 'mkt', perDay: 1,
  },
  {
    id: 'set_price',
    name: { ru: 'Изменить цену', en: 'Change price' },
    desc: { ru: 'ARPU vs конверсия. Потолок задаёт ниша', en: 'ARPU vs conversion. The niche sets the ceiling' },
    icon: '🏷️', energy: 1, kind: 'other', perDay: 1,
  },
  {
    id: 'payments',
    name: { ru: 'Подключить Gold Golem Pay', en: 'Connect Gold Golem Pay' },
    desc: { ru: 'Без платежей MRR = $0. Логично', en: 'Without payments MRR = $0. Obviously' },
    icon: '🪙', energy: 2, kind: 'dev', once: true,
  },
  {
    id: 'metrics',
    name: { ru: 'Смотреть метрики', en: 'Check metrics' },
    desc: { ru: 'Открывает детальную аналитику (CAC/LTV/churn)', en: 'Unlocks detailed analytics (CAC/LTV/churn)' },
    icon: '📊', energy: 1, kind: 'other', once: true,
  },
  {
    id: 'rest',
    name: { ru: 'Отдых', en: 'Rest' },
    desc: { ru: 'Вся энергия дня → +мотивация. Иногда это лучший ход', en: 'All day energy → +motivation. Sometimes the best move' },
    icon: '🛌', energy: 0, kind: 'other', perDay: 1,
  },
  {
    id: 'hire',
    name: { ru: 'Нанять помощника', en: 'Hire helper' },
    desc: { ru: 'NPC автоматизирует класс действий. Стадия Тракшн', en: 'NPC automates an action class. Traction stage' },
    icon: '🤝', energy: 2, kind: 'other',
  },
]

export const actionById = (id: string) => ACTIONS.find((a) => a.id === id)!
