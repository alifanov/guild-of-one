import type { ActionDef } from '../types'

export const ACTIONS: ActionDef[] = [
  {
    id: 'research_niche',
    name: { ru: 'Исследовать нишу', en: 'Research niche', es: 'Investigar el nicho', zh: '调研细分市场', pt: 'Pesquisar o nicho' },
    desc: { ru: 'Открывает спрос/конкуренцию/потолок цены. Сильно повышает PMF', en: 'Reveals demand/competition/price cap. Big PMF boost', es: 'Revela demanda/competencia/techo de precio. Gran impulso al PMF', zh: '揭示需求/竞争/价格上限。大幅提升 PMF', pt: 'Revela demanda/concorrência/teto de preço. Grande impulso no PMF' },
    icon: '🔍', energy: 3, kind: 'mkt', once: true,
  },
  {
    id: 'research_competitor',
    name: { ru: 'Изучить конкурента-донора', en: 'Study donor competitor', es: 'Estudiar al competidor donante', zh: '研究可抄的竞品', pt: 'Estudar o concorrente doador' },
    desc: { ru: 'Не придумывай — копируй валидированное. +PMF', en: "Don't invent — copy what's validated. +PMF", es: 'No inventes — copia lo validado. +PMF', zh: '别瞎发明——抄经过验证的。+PMF', pt: 'Não invente — copie o que já foi validado. +PMF' },
    icon: '🕵️', energy: 2, kind: 'mkt', once: true,
  },
  {
    id: 'build_mvp',
    name: { ru: 'Пилить MVP', en: 'Build MVP', es: 'Construir el MVP', zh: '打磨 MVP', pt: 'Construir o MVP' },
    desc: { ru: '+20% прогресса. На 100% можно деплоить и лончить', en: '+20% progress. At 100% you can deploy & launch', es: '+20% de progreso. Al 100% puedes desplegar y lanzar', zh: '+20% 进度。到 100% 就能部署和发布', pt: '+20% de progresso. Em 100% dá para fazer deploy e lançar' },
    icon: '🔨', energy: 4, kind: 'dev',
  },
  {
    id: 'add_feature',
    name: { ru: 'Добавить фичу', en: 'Add feature', es: 'Añadir función', zh: '加个新功能', pt: 'Adicionar feature' },
    desc: { ru: '+качество. После 3-й — убывающая отдача и баги', en: '+quality. After the 3rd — diminishing returns and bugs', es: '+calidad. A partir de la 3.ª — rendimientos decrecientes y bugs', zh: '+质量。第 3 个之后——收益递减还带 bug', pt: '+qualidade. Depois da 3.ª — retornos decrescentes e bugs' },
    icon: '✨', energy: 4, kind: 'dev',
  },
  {
    id: 'fix_bugs',
    name: { ru: 'Чинить баги', en: 'Fix bugs', es: 'Corregir bugs', zh: '修 bug', pt: 'Corrigir bugs' },
    desc: { ru: '−2 бага. Баги кормят churn-демона', en: '−2 bugs. Bugs feed the churn demon', es: '−2 bugs. Los bugs alimentan al demonio del churn', zh: '−2 个 bug。bug 是 churn 恶魔的口粮', pt: '−2 bugs. Bugs alimentam o demônio do churn' },
    icon: '🐛', energy: 2, kind: 'dev',
  },
  {
    id: 'deploy',
    name: { ru: 'Задеплоить на Wyvercel', en: 'Deploy to Wyvercel', es: 'Desplegar en Wyvercel', zh: '部署到 Wyvercel', pt: 'Fazer deploy na Wyvercel' },
    desc: { ru: 'Нужно для лонча. +$20/мес инфры', en: 'Required for launch. +$20/mo infra', es: 'Necesario para el lanzamiento. +$20/mes de infra', zh: '发布必备。基础设施 +$20/月', pt: 'Necessário para o lançamento. +$20/mês de infra' },
    icon: '🚀', energy: 2, money: 50, kind: 'dev', once: true,
  },
  {
    id: 'landing',
    name: { ru: 'Улучшить лендинг', en: 'Improve landing', es: 'Mejorar la landing', zh: '优化落地页', pt: 'Melhorar a landing' },
    desc: { ru: '+конверсия визит→регистрация', en: '+visit→signup conversion', es: '+conversión visita→registro', zh: '+访问→注册转化率', pt: '+conversão visita→cadastro' },
    icon: '📄', energy: 3, kind: 'mkt',
  },
  {
    id: 'post',
    name: { ru: 'Пост в канал', en: 'Post to channel', es: 'Publicar en un canal', zh: '发帖到渠道', pt: 'Postar no canal' },
    desc: { ru: '+трафик канала, +аудитория. 1 канал — путь, 3 канала — распыление', en: '+channel traffic, +audience. 1 channel = focus, 3 = spray', es: '+tráfico del canal, +audiencia. 1 canal = enfoque, 3 = dispersión', zh: '+渠道流量，+受众。1 个渠道是专注，3 个是撒胡椒面', pt: '+tráfego do canal, +audiência. 1 canal = foco, 3 = dispersão' },
    icon: '📢', energy: 2, kind: 'mkt',
  },
  {
    id: 'ads',
    name: { ru: 'Запустить рекламу', en: 'Run ads', es: 'Lanzar anuncios', zh: '投广告', pt: 'Rodar anúncios' },
    desc: { ru: 'Платный трафик. CAC зависит от ниши и лендинга', en: 'Paid traffic. CAC depends on niche and landing', es: 'Tráfico de pago. El CAC depende del nicho y la landing', zh: '付费流量。CAC 取决于细分市场和落地页', pt: 'Tráfego pago. O CAC depende do nicho e da landing' },
    icon: '💸', energy: 1, money: 100, kind: 'mkt',
  },
  {
    id: 'launch',
    name: { ru: 'Лонч на Product Cave', en: 'Launch on Product Cave', es: 'Lanzamiento en Product Cave', zh: '在 Product Cave 上发布', pt: 'Lançar no Product Cave' },
    desc: { ru: 'Разовый всплеск трафика × аудитория × подготовка', en: 'One-time traffic spike × audience × preparation', es: 'Pico de tráfico único × audiencia × preparación', zh: '一次性流量高峰 × 受众 × 准备程度', pt: 'Pico de tráfego único × audiência × preparação' },
    icon: '🎉', energy: 5, kind: 'mkt',
  },
  {
    id: 'talk_users',
    name: { ru: 'Общаться с юзерами', en: 'Talk to users', es: 'Hablar con los usuarios', zh: '和用户聊天', pt: 'Falar com usuários' },
    desc: { ru: '+инсайты (PMF), −churn, ±мотивация', en: '+insights (PMF), −churn, ±motivation', es: '+insights (PMF), −churn, ±motivación', zh: '+洞察 (PMF)，−churn，±动力', pt: '+insights (PMF), −churn, ±motivação' },
    icon: '💬', energy: 2, kind: 'mkt', perDay: 1,
  },
  {
    id: 'set_price',
    name: { ru: 'Изменить цену', en: 'Change price', es: 'Cambiar el precio', zh: '调整价格', pt: 'Mudar o preço' },
    desc: { ru: 'ARPU vs конверсия. Потолок задаёт ниша', en: 'ARPU vs conversion. The niche sets the ceiling', es: 'ARPU vs conversión. El techo lo pone el nicho', zh: 'ARPU vs 转化率。上限由细分市场决定', pt: 'ARPU vs conversão. O teto é definido pelo nicho' },
    icon: '🏷️', energy: 1, kind: 'other', perDay: 1,
  },
  {
    id: 'payments',
    name: { ru: 'Подключить Gold Golem Pay', en: 'Connect Gold Golem Pay', es: 'Conectar Gold Golem Pay', zh: '接入 Gold Golem Pay', pt: 'Conectar o Gold Golem Pay' },
    desc: { ru: 'Без платежей MRR = $0. Логично', en: 'Without payments MRR = $0. Obviously', es: 'Sin pagos, MRR = $0. Lógico', zh: '不接支付，MRR = $0。这很合理', pt: 'Sem pagamentos, MRR = $0. Óbvio' },
    icon: '🪙', energy: 2, kind: 'dev', once: true,
  },
  {
    id: 'metrics',
    name: { ru: 'Смотреть метрики', en: 'Check metrics', es: 'Ver métricas', zh: '看数据指标', pt: 'Ver métricas' },
    desc: { ru: 'Открывает детальную аналитику (CAC/LTV/churn)', en: 'Unlocks detailed analytics (CAC/LTV/churn)', es: 'Desbloquea analítica detallada (CAC/LTV/churn)', zh: '解锁详细分析 (CAC/LTV/churn)', pt: 'Desbloqueia análises detalhadas (CAC/LTV/churn)' },
    icon: '📊', energy: 1, kind: 'other', once: true,
  },
  {
    id: 'rest',
    name: { ru: 'Отдых', en: 'Rest', es: 'Descansar', zh: '休息', pt: 'Descansar' },
    desc: { ru: 'Вся энергия дня → +мотивация. Иногда это лучший ход', en: 'All day energy → +motivation. Sometimes the best move', es: 'Toda la energía del día → +motivación. A veces es la mejor jugada', zh: '全天精力 → +动力。有时这是最优解', pt: 'Toda a energia do dia → +motivação. Às vezes é a melhor jogada' },
    icon: '🛌', energy: 0, kind: 'other', perDay: 1,
  },
  {
    id: 'hire',
    name: { ru: 'Нанять помощника', en: 'Hire helper', es: 'Contratar ayudante', zh: '雇个帮手', pt: 'Contratar ajudante' },
    desc: { ru: 'NPC автоматизирует класс действий. Стадия Тракшн', en: 'NPC automates an action class. Traction stage', es: 'Un NPC automatiza una clase de acciones. Etapa de Tracción', zh: 'NPC 自动化一类行动。Traction 阶段', pt: 'Um NPC automatiza uma classe de ações. Estágio de Tração' },
    icon: '🤝', energy: 2, kind: 'other',
  },
]

export const actionById = (id: string) => ACTIONS.find((a) => a.id === id)!
