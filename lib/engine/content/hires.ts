import type { HireDef } from '../types'

export const HIRES: HireDef[] = [
  {
    id: 'support_goblin',
    char: 'support_goblin',
    name: { ru: 'Саппорт-гоблин', en: 'Support goblin', es: 'Goblin de soporte', zh: '客服哥布林', pt: 'Goblin de suporte' },
    desc: { ru: 'Перевоспитанный. Отвечает юзерам за тебя: −churn каждый день', en: 'Reformed. Answers users for you: −churn every day', es: 'Reformado. Responde a los usuarios por ti: −churn cada día', zh: '改邪归正。替你回复用户：每天 −churn', pt: 'Regenerado. Responde aos usuários por você: −churn todo dia' },
    monthly: 600,
  },
  {
    id: 'gnome_devops',
    char: 'gnome_devops',
    name: { ru: 'Гном-девопс', en: 'Dwarf devops', es: 'Enano devops', zh: '矮人运维', pt: 'Anão devops' },
    desc: { ru: 'Чинит по багу в день и пьёт пиво за счёт компании', en: 'Fixes a bug a day and drinks beer on the company', es: 'Arregla un bug al día y bebe cerveza a cuenta de la empresa', zh: '每天修一个 bug，啤酒记在公司账上', pt: 'Conserta um bug por dia e bebe cerveja por conta da empresa' },
    monthly: 1000,
  },
  {
    id: 'elf_designer',
    char: 'elf_designer',
    name: { ru: 'Эльфийка-дизайнер', en: 'Elf designer', es: 'Elfa diseñadora', zh: '精灵设计师', pt: 'Elfa designer' },
    desc: { ru: 'Пассивно улучшает лендинг. Медленно, но эльфийски красиво', en: 'Passively improves the landing. Slowly, but elvishly', es: 'Mejora la landing pasivamente. Despacio, pero con elegancia élfica', zh: '被动优化落地页。慢，但精灵范儿十足', pt: 'Melhora a landing passivamente. Devagar, mas com elegância élfica' },
    monthly: 1500,
  },
  {
    id: 'oracle_analyst',
    char: 'oracle_analyst',
    name: { ru: 'Оракул-аналитик', en: 'Oracle analyst', es: 'Oráculo analista', zh: '神谕分析师', pt: 'Oráculo analista' },
    desc: { ru: 'Смотрит метрики за тебя: капает инсайт в PMF', en: 'Watches metrics for you: drips insight into PMF', es: 'Mira las métricas por ti: gotea insights al PMF', zh: '替你盯指标：一点点往 PMF 里滴洞察', pt: 'Olha as métricas por você: pinga insights no PMF' },
    monthly: 800,
  },
]

export const hireById = (id: string) => HIRES.find((h) => h.id === id)!
