import type { BuildDef } from '../types'

export const BUILDS: BuildDef[] = [
  {
    id: 'coder',
    name: { ru: 'Кодер', en: 'Coder' },
    desc: {
      ru: 'Разработка −50% энергии, маркетинг +50%. Аудитория: 0. «Сейчас всё перепишу на Rust»',
      en: 'Dev −50% energy, marketing +50%. Audience: 0. "Let me just rewrite it in Rust"',
    },
    icon: '⌨️',
    money: 4000,
    audience: 0,
    devMult: 0.5,
    mktMult: 1.5,
    allMult: 1,
    motLossMult: 1,
  },
  {
    id: 'marketer',
    name: { ru: 'Маркетолог', en: 'Marketer' },
    desc: {
      ru: 'Маркетинг −50% энергии, разработка +50%. Аудитория: 500. «Лендинг уже есть, продукт потом»',
      en: 'Marketing −50% energy, dev +50%. Audience: 500. "Landing page first, product later"',
    },
    icon: '📣',
    money: 4000,
    audience: 500,
    devMult: 1.5,
    mktMult: 0.5,
    allMult: 1,
    motLossMult: 1,
  },
  {
    id: 'generalist',
    name: { ru: 'Универсал', en: 'Generalist' },
    desc: {
      ru: 'Без модификаторов, но больше денег. «Средний во всём — это тоже суперсила»',
      en: 'No modifiers, more money. "Mediocre at everything is also a superpower"',
    },
    icon: '🧰',
    money: 6000,
    audience: 100,
    devMult: 1,
    mktMult: 1,
    allMult: 1,
    motLossMult: 1,
  },
  {
    id: 'excorp',
    name: { ru: 'Экс-корпорат', en: 'Ex-corporate' },
    desc: {
      ru: 'Много денег, но всё +25% энергии (отвык от рук) и мотивация тает быстрее. «В Google было проще»',
      en: 'Lots of money, but everything costs +25% energy and motivation drains faster. "It was easier at Google"',
    },
    icon: '👔',
    money: 12000,
    audience: 50,
    devMult: 1,
    mktMult: 1,
    allMult: 1.25,
    motLossMult: 1.5,
  },
]

export const buildById = (id: string) => BUILDS.find((b) => b.id === id)!
