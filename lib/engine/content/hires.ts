import type { HireDef } from '../types'

export const HIRES: HireDef[] = [
  {
    id: 'support_goblin',
    char: 'support_goblin',
    name: { ru: 'Саппорт-гоблин', en: 'Support goblin' },
    desc: { ru: 'Перевоспитанный. Отвечает юзерам за тебя: −churn каждый день', en: 'Reformed. Answers users for you: −churn every day' },
    monthly: 600,
  },
  {
    id: 'gnome_devops',
    char: 'gnome_devops',
    name: { ru: 'Гном-девопс', en: 'Dwarf devops' },
    desc: { ru: 'Чинит по багу в день и пьёт пиво за счёт компании', en: 'Fixes a bug a day and drinks beer on the company' },
    monthly: 1000,
  },
  {
    id: 'elf_designer',
    char: 'elf_designer',
    name: { ru: 'Эльфийка-дизайнер', en: 'Elf designer' },
    desc: { ru: 'Пассивно улучшает лендинг. Медленно, но эльфийски красиво', en: 'Passively improves the landing. Slowly, but elvishly' },
    monthly: 1500,
  },
  {
    id: 'oracle_analyst',
    char: 'oracle_analyst',
    name: { ru: 'Оракул-аналитик', en: 'Oracle analyst' },
    desc: { ru: 'Смотрит метрики за тебя: капает инсайт в PMF', en: 'Watches metrics for you: drips insight into PMF' },
    monthly: 800,
  },
]

export const hireById = (id: string) => HIRES.find((h) => h.id === id)!
