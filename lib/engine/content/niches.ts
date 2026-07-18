import type { NicheDef } from '../types'

// ~4 заведомо мёртвые (spрос ≈ 0) — валидация существует, чтобы это выяснять ДО
export const NICHES: NicheDef[] = [
  {
    id: 'ai_screenshots',
    name: { ru: 'AI-тулза для скриншотов кода', en: 'AI tool for code screenshots', es: 'Herramienta AI para capturas de código', zh: 'AI 代码截图工具', pt: 'Ferramenta AI para screenshots de código' },
    legend: { ru: 'Красивые скриншоты кода для Xitter. Все делают, значит и ты сможешь', en: 'Pretty code screenshots for Xitter. Everyone builds one, so can you', es: 'Capturas de código bonitas para Xitter. Todos hacen una, tú también podrás', zh: '给 Xitter 做漂亮的代码截图。人人都在做，你也行', pt: 'Screenshots bonitos de código para o Xitter. Todo mundo faz um, você também consegue' },
    demand: 0.7, competition: 0.85, arpuCap: 15, virality: 0.6,
  },
  {
    id: 'cat_habits',
    name: { ru: 'Трекер привычек для котов', en: 'Habit tracker for cats', es: 'Rastreador de hábitos para gatos', zh: '猫咪习惯追踪器', pt: 'Rastreador de hábitos para gatos' },
    legend: { ru: 'Коты не платят. Но их владельцы — тоже вряд ли', en: "Cats don't pay. Their owners probably won't either", es: 'Los gatos no pagan. Sus dueños probablemente tampoco', zh: '猫不会付钱。猫主人八成也不会', pt: 'Gatos não pagam. Os donos provavelmente também não' },
    demand: 0.12, competition: 0.2, arpuCap: 8, virality: 0.85,
  },
  {
    id: 'dragon_walking',
    name: { ru: 'SaaS для выгула драконов', en: 'SaaS for dragon walking', es: 'SaaS para pasear dragones', zh: '遛龙 SaaS', pt: 'SaaS para passear dragões' },
    legend: { ru: 'Ноль конкурентов! Возможно, неспроста', en: 'Zero competitors! Possibly for a reason', es: '¡Cero competidores! Posiblemente por algo', zh: '零竞争对手！也许是有原因的', pt: 'Zero concorrentes! Possivelmente por um motivo' },
    demand: 0.03, competition: 0.05, arpuCap: 90, virality: 0.5,
  },
  {
    id: 'freelance_invoices',
    name: { ru: 'Инвойсы для фрилансеров', en: 'Invoices for freelancers', es: 'Facturas para freelancers', zh: '自由职业者发票工具', pt: 'Faturas para freelancers' },
    legend: { ru: 'Скучно, зато платят. Конкурентов — легион', en: 'Boring, but they pay. Competitors: legion', es: 'Aburrido, pero pagan. Competidores: legión', zh: '无聊，但有人付钱。竞争对手：多如牛毛', pt: 'Chato, mas pagam. Concorrentes: uma legião' },
    demand: 0.8, competition: 0.9, arpuCap: 25, virality: 0.2,
  },
  {
    id: 'seo_audit',
    name: { ru: 'SEO-аудит одной кнопкой', en: 'One-click SEO audit', es: 'Auditoría SEO con un clic', zh: '一键 SEO 审计', pt: 'Auditoria SEO com um clique' },
    legend: { ru: 'Каждый второй индихакер делал такое. Каждый первый — бросил', en: 'Every second indie hacker built one. Every first one quit', es: 'Uno de cada dos indie hackers hizo una. Y todos la abandonaron', zh: '每两个独立开发者就有一个做过。每一个都放弃了', pt: 'Um em cada dois indie hackers fez uma. E todos desistiram' },
    demand: 0.75, competition: 0.85, arpuCap: 49, virality: 0.3,
  },
  {
    id: 'habit_tracker',
    name: { ru: 'Ещё один трекер привычек', en: 'Yet another habit tracker', es: 'Otro rastreador de hábitos más', zh: '又一个习惯追踪器', pt: 'Mais um rastreador de hábitos' },
    legend: { ru: 'В этот раз — с геймификацией! (как у всех)', en: 'This time — gamified! (like all of them)', es: '¡Esta vez — gamificado! (como todos)', zh: '这次带游戏化！（和大家一样）', pt: 'Desta vez — gamificado! (como todos os outros)' },
    demand: 0.6, competition: 0.95, arpuCap: 10, virality: 0.4,
  },
  {
    id: 'dwarf_jobboard',
    name: { ru: 'Джоб-борд для гномов-девопсов', en: 'Job board for dwarf devops', es: 'Bolsa de empleo para enanos devops', zh: '矮人运维招聘板', pt: 'Job board para anões devops' },
    legend: { ru: 'Узкая ниша, широкие бороды. B2B-чек', en: 'Narrow niche, wide beards. B2B pricing', es: 'Nicho estrecho, barbas anchas. Precios B2B', zh: '市场很窄，胡子很宽。B2B 定价', pt: 'Nicho estreito, barbas largas. Preço B2B' },
    demand: 0.45, competition: 0.3, arpuCap: 99, virality: 0.25,
  },
  {
    id: 'mage_newsletter',
    name: { ru: 'Рассылки для магов', en: 'Newsletters for mages', es: 'Newsletters para magos', zh: '法师邮件通讯', pt: 'Newsletters para magos' },
    legend: { ru: 'Email жив. Маги — не факт', en: 'Email is alive. Mages — debatable', es: 'El email está vivo. Los magos — discutible', zh: 'Email 还活着。法师就难说了', pt: 'O email está vivo. Os magos — discutível' },
    demand: 0.5, competition: 0.7, arpuCap: 29, virality: 0.35,
  },
  {
    id: 'crypto_tax',
    name: { ru: 'Налоги по крипте', en: 'Crypto tax calculator', es: 'Calculadora de impuestos cripto', zh: '加密货币税务计算器', pt: 'Calculadora de impostos cripto' },
    legend: { ru: 'Боль реальная, сезонная и юридически стрёмная', en: 'Real pain, seasonal and legally sketchy', es: 'Dolor real, estacional y legalmente turbio', zh: '真实痛点，季节性强，法律上有点悬', pt: 'Dor real, sazonal e juridicamente duvidosa' },
    demand: 0.55, competition: 0.5, arpuCap: 79, virality: 0.3,
  },
  {
    id: 'meme_scheduler',
    name: { ru: 'Планировщик мемов', en: 'Meme scheduler', es: 'Programador de memes', zh: '梗图定时发布器', pt: 'Agendador de memes' },
    legend: { ru: 'Постинг мемов по расписанию. Виральность — твоя единственная надежда', en: 'Scheduled meme posting. Virality is your only hope', es: 'Publicación de memes programada. La viralidad es tu única esperanza', zh: '定时发梗图。病毒式传播是你唯一的希望', pt: 'Postagem de memes agendada. Viralidade é sua única esperança' },
    demand: 0.4, competition: 0.4, arpuCap: 12, virality: 0.9,
  },
  {
    id: 'dungeon_crm',
    name: { ru: 'CRM для владельцев подземелий', en: 'CRM for dungeon owners', es: 'CRM para dueños de mazmorras', zh: '地下城主 CRM', pt: 'CRM para donos de masmorras' },
    legend: { ru: 'Учёт приключенцев, лута и жалоб. Дорогой B2B', en: 'Track adventurers, loot and complaints. Pricey B2B', es: 'Registro de aventureros, botín y quejas. B2B caro', zh: '管理冒险者、战利品和投诉。昂贵的 B2B', pt: 'Controle de aventureiros, loot e reclamações. B2B caro' },
    demand: 0.65, competition: 0.35, arpuCap: 120, virality: 0.3,
  },
  {
    id: 'ai_cover_letters',
    name: { ru: 'AI-генератор сопроводительных писем', en: 'AI cover letter generator', es: 'Generador AI de cartas de presentación', zh: 'AI 求职信生成器', pt: 'Gerador AI de cartas de apresentação' },
    legend: { ru: 'Спрос огромный. И у 4000 конкурентов тоже', en: 'Huge demand. For all 4000 competitors too', es: 'Demanda enorme. También para los 4000 competidores', zh: '需求巨大。4000 个竞争对手也这么想', pt: 'Demanda enorme. Para os 4000 concorrentes também' },
    demand: 0.7, competition: 0.92, arpuCap: 9, virality: 0.45,
  },
  {
    id: 'crystal_uptime',
    name: { ru: 'Мониторинг аптайма кристаллов', en: 'Crystal uptime monitoring', es: 'Monitoreo de uptime de cristales', zh: '水晶在线率监控', pt: 'Monitoramento de uptime de cristais' },
    legend: { ru: 'Пинг, алерт, дашборд. Рынок есть, но тесноват', en: 'Ping, alert, dashboard. Market exists, a bit crowded', es: 'Ping, alerta, dashboard. El mercado existe, algo saturado', zh: 'Ping、告警、仪表盘。市场存在，但有点挤', pt: 'Ping, alerta, dashboard. Mercado existe, meio apertado' },
    demand: 0.6, competition: 0.6, arpuCap: 35, virality: 0.25,
  },
  {
    id: 'nft_pets',
    name: { ru: 'NFT-питомцы (возрождение)', en: 'NFT pets (revival)', es: 'Mascotas NFT (renacimiento)', zh: 'NFT 宠物（复兴版）', pt: 'Pets NFT (renascimento)' },
    legend: { ru: '«Сейчас самое время вернуться в NFT» — сказал никто', en: '"Now is the time to get back into NFTs" — said no one', es: '"Es el momento perfecto para volver a los NFT" — dijo nadie', zh: '"现在正是重返 NFT 的好时机"——没有人这么说过', pt: '"Agora é a hora de voltar aos NFT" — disse ninguém' },
    demand: 0.05, competition: 0.7, arpuCap: 20, virality: 0.6,
  },
  {
    id: 'voice_todo',
    name: { ru: 'Голосовой туду-лист', en: 'Voice-first todo list', es: 'Lista de tareas por voz', zh: '语音待办清单', pt: 'Lista de tarefas por voz' },
    legend: { ru: 'Наговорил — записалось. Все попробуют один раз', en: 'Speak — it writes. Everyone will try it once', es: 'Hablas — se anota. Todos lo probarán una vez', zh: '说一句，记一条。每个人都会试一次', pt: 'Você fala — ele anota. Todo mundo vai testar uma vez' },
    demand: 0.25, competition: 0.5, arpuCap: 11, virality: 0.5,
  },
  {
    id: 'tarot_api',
    name: { ru: 'API гаданий на таро', en: 'Tarot reading API', es: 'API de lecturas de tarot', zh: '塔罗占卜 API', pt: 'API de leitura de tarô' },
    legend: { ru: 'B2B-эзотерика. Смешно, пока не увидишь чеки', en: 'B2B esoterics. Funny until you see the invoices', es: 'Esoterismo B2B. Gracioso hasta que ves las facturas', zh: 'B2B 玄学。看到账单之前都觉得好笑', pt: 'Esoterismo B2B. Engraçado até você ver as faturas' },
    demand: 0.35, competition: 0.25, arpuCap: 39, virality: 0.7,
  },
]

export const nicheById = (id: string) => NICHES.find((n) => n.id === id)!

// насколько канал попадает в ЦА ниши (множитель к визитам); раскрывается инсайтами
export const CHANNEL_FIT: Record<string, { seo: number; social: number; forum: number }> = {
  ai_screenshots: { seo: 0.8, social: 1.4, forum: 1.0 },
  cat_habits: { seo: 0.7, social: 1.5, forum: 0.9 },
  dragon_walking: { seo: 0.9, social: 1.0, forum: 1.0 },
  freelance_invoices: { seo: 1.4, social: 0.7, forum: 1.0 },
  seo_audit: { seo: 1.5, social: 0.9, forum: 0.8 },
  habit_tracker: { seo: 1.0, social: 1.3, forum: 0.7 },
  dwarf_jobboard: { seo: 1.1, social: 0.6, forum: 1.4 },
  mage_newsletter: { seo: 1.0, social: 1.2, forum: 0.8 },
  crypto_tax: { seo: 1.4, social: 0.7, forum: 1.1 },
  meme_scheduler: { seo: 0.6, social: 1.6, forum: 0.9 },
  dungeon_crm: { seo: 1.2, social: 0.6, forum: 1.3 },
  ai_cover_letters: { seo: 1.5, social: 0.8, forum: 0.7 },
  crystal_uptime: { seo: 1.2, social: 0.7, forum: 1.2 },
  nft_pets: { seo: 0.5, social: 1.4, forum: 0.8 },
  voice_todo: { seo: 0.9, social: 1.2, forum: 0.8 },
  tarot_api: { seo: 0.8, social: 1.1, forum: 1.3 },
}

export const fitFor = (nicheId: string) => CHANNEL_FIT[nicheId] ?? { seo: 1, social: 1, forum: 1 }
