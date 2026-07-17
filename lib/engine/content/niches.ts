import type { NicheDef } from '../types'

// ~4 заведомо мёртвые (spрос ≈ 0) — валидация существует, чтобы это выяснять ДО
export const NICHES: NicheDef[] = [
  {
    id: 'ai_screenshots',
    name: { ru: 'AI-тулза для скриншотов кода', en: 'AI tool for code screenshots' },
    legend: { ru: 'Красивые скриншоты кода для Xitter. Все делают, значит и ты сможешь', en: 'Pretty code screenshots for Xitter. Everyone builds one, so can you' },
    demand: 0.7, competition: 0.85, arpuCap: 15, virality: 0.6,
  },
  {
    id: 'cat_habits',
    name: { ru: 'Трекер привычек для котов', en: 'Habit tracker for cats' },
    legend: { ru: 'Коты не платят. Но их владельцы — тоже вряд ли', en: "Cats don't pay. Their owners probably won't either" },
    demand: 0.12, competition: 0.2, arpuCap: 8, virality: 0.85,
  },
  {
    id: 'dragon_walking',
    name: { ru: 'SaaS для выгула драконов', en: 'SaaS for dragon walking' },
    legend: { ru: 'Ноль конкурентов! Возможно, неспроста', en: 'Zero competitors! Possibly for a reason' },
    demand: 0.03, competition: 0.05, arpuCap: 90, virality: 0.5,
  },
  {
    id: 'freelance_invoices',
    name: { ru: 'Инвойсы для фрилансеров', en: 'Invoices for freelancers' },
    legend: { ru: 'Скучно, зато платят. Конкурентов — легион', en: 'Boring, but they pay. Competitors: legion' },
    demand: 0.8, competition: 0.9, arpuCap: 25, virality: 0.2,
  },
  {
    id: 'seo_audit',
    name: { ru: 'SEO-аудит одной кнопкой', en: 'One-click SEO audit' },
    legend: { ru: 'Каждый второй индихакер делал такое. Каждый первый — бросил', en: 'Every second indie hacker built one. Every first one quit' },
    demand: 0.75, competition: 0.85, arpuCap: 49, virality: 0.3,
  },
  {
    id: 'habit_tracker',
    name: { ru: 'Ещё один трекер привычек', en: 'Yet another habit tracker' },
    legend: { ru: 'В этот раз — с геймификацией! (как у всех)', en: 'This time — gamified! (like all of them)' },
    demand: 0.6, competition: 0.95, arpuCap: 10, virality: 0.4,
  },
  {
    id: 'dwarf_jobboard',
    name: { ru: 'Джоб-борд для гномов-девопсов', en: 'Job board for dwarf devops' },
    legend: { ru: 'Узкая ниша, широкие бороды. B2B-чек', en: 'Narrow niche, wide beards. B2B pricing' },
    demand: 0.45, competition: 0.3, arpuCap: 99, virality: 0.25,
  },
  {
    id: 'mage_newsletter',
    name: { ru: 'Рассылки для магов', en: 'Newsletters for mages' },
    legend: { ru: 'Email жив. Маги — не факт', en: 'Email is alive. Mages — debatable' },
    demand: 0.5, competition: 0.7, arpuCap: 29, virality: 0.35,
  },
  {
    id: 'crypto_tax',
    name: { ru: 'Налоги по крипте', en: 'Crypto tax calculator' },
    legend: { ru: 'Боль реальная, сезонная и юридически стрёмная', en: 'Real pain, seasonal and legally sketchy' },
    demand: 0.55, competition: 0.5, arpuCap: 79, virality: 0.3,
  },
  {
    id: 'meme_scheduler',
    name: { ru: 'Планировщик мемов', en: 'Meme scheduler' },
    legend: { ru: 'Постинг мемов по расписанию. Виральность — твоя единственная надежда', en: 'Scheduled meme posting. Virality is your only hope' },
    demand: 0.4, competition: 0.4, arpuCap: 12, virality: 0.9,
  },
  {
    id: 'dungeon_crm',
    name: { ru: 'CRM для владельцев подземелий', en: 'CRM for dungeon owners' },
    legend: { ru: 'Учёт приключенцев, лута и жалоб. Дорогой B2B', en: 'Track adventurers, loot and complaints. Pricey B2B' },
    demand: 0.65, competition: 0.35, arpuCap: 120, virality: 0.3,
  },
  {
    id: 'ai_cover_letters',
    name: { ru: 'AI-генератор сопроводительных писем', en: 'AI cover letter generator' },
    legend: { ru: 'Спрос огромный. И у 4000 конкурентов тоже', en: 'Huge demand. For all 4000 competitors too' },
    demand: 0.7, competition: 0.92, arpuCap: 9, virality: 0.45,
  },
  {
    id: 'crystal_uptime',
    name: { ru: 'Мониторинг аптайма кристаллов', en: 'Crystal uptime monitoring' },
    legend: { ru: 'Пинг, алерт, дашборд. Рынок есть, но тесноват', en: 'Ping, alert, dashboard. Market exists, a bit crowded' },
    demand: 0.6, competition: 0.6, arpuCap: 35, virality: 0.25,
  },
  {
    id: 'nft_pets',
    name: { ru: 'NFT-питомцы (возрождение)', en: 'NFT pets (revival)' },
    legend: { ru: '«Сейчас самое время вернуться в NFT» — сказал никто', en: '"Now is the time to get back into NFTs" — said no one' },
    demand: 0.05, competition: 0.7, arpuCap: 20, virality: 0.6,
  },
  {
    id: 'voice_todo',
    name: { ru: 'Голосовой туду-лист', en: 'Voice-first todo list' },
    legend: { ru: 'Наговорил — записалось. Все попробуют один раз', en: 'Speak — it writes. Everyone will try it once' },
    demand: 0.25, competition: 0.5, arpuCap: 11, virality: 0.5,
  },
  {
    id: 'tarot_api',
    name: { ru: 'API гаданий на таро', en: 'Tarot reading API' },
    legend: { ru: 'B2B-эзотерика. Смешно, пока не увидишь чеки', en: 'B2B esoterics. Funny until you see the invoices' },
    demand: 0.35, competition: 0.25, arpuCap: 39, virality: 0.7,
  },
]

export const nicheById = (id: string) => NICHES.find((n) => n.id === id)!
