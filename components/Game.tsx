'use client'
import { useEffect, useState } from 'react'
import { useStore } from '@/lib/store'
import { t, tl } from '@/lib/i18n'
import { BUILDS } from '@/lib/engine/content/builds'
import { nicheById } from '@/lib/engine/content/niches'
import { CHARACTERS, FOUNDERS } from '@/lib/engine/content/characters'
import { Panel, PixelSprite } from './ui'
import Play from './Play'

export default function Game() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const screen = useStore((s) => s.screen)
  if (!mounted)
    return (
      <div className="min-h-screen flex items-center justify-center pixel-font text-[var(--accent)]">
        GUILD OF ONE…
      </div>
    )
  if (screen === 'title') return <Title />
  if (screen === 'build') return <BuildPick />
  if (screen === 'idea') return <IdeaPick />
  return <Play />
}

function LangToggle() {
  const { lang, setLang } = useStore()
  return (
    <button
      className="pbtn px-3 py-1 text-xs pixel-font"
      onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}
    >
      {lang === 'ru' ? 'RU → EN' : 'EN → RU'}
    </button>
  )
}

function Title() {
  const { lang, game, startNewRun, continueRun } = useStore()
  const canContinue = game && game.status === 'playing'
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4">
      <div className="text-center">
        <div className="flex justify-center gap-3 mb-4">
          {CHARACTERS.filter((c) =>
            ['goblin_hater', 'dragon_investor', 'churn_demon', 'paladin_fan', 'gnome_devops'].includes(c.id)
          ).map((c) => (
            <PixelSprite key={c.id} sprite={c.sprite} size={4} />
          ))}
        </div>
        <h1 className="pixel-font text-2xl sm:text-4xl text-[var(--accent)] leading-relaxed">
          GUILD OF ONE
        </h1>
        <p className="text-[var(--muted)] mt-3 max-w-md">{t(lang, 'tagline')}</p>
        <p className="pixel-font text-[10px] text-[var(--muted)] mt-2">{t(lang, 'mrrGoal')}</p>
      </div>
      <div className="flex flex-col gap-3 w-64">
        <button className="pbtn pbtn-accent px-4 py-3 pixel-font text-xs" onClick={startNewRun}>
          ▶ {t(lang, 'newRun')}
        </button>
        {canContinue && (
          <button className="pbtn px-4 py-3 pixel-font text-xs" onClick={continueRun}>
            {t(lang, 'continueRun')} (
            {lang === 'ru' ? 'день' : 'day'} {game.day})
          </button>
        )}
        <div className="flex justify-center gap-2">
          <LangToggle />
        </div>
      </div>
      <p className="text-xs text-[var(--muted)]">{t(lang, 'soundOff')}</p>
    </div>
  )
}

function BuildPick() {
  const { lang, chooseBuild } = useStore()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4">
      <h2 className="pixel-font text-sm sm:text-lg text-[var(--accent)]">{t(lang, 'pickBuild')}</h2>
      <div className="grid sm:grid-cols-2 gap-4 max-w-3xl w-full">
        {BUILDS.map((b) => (
          <button
            key={b.id}
            className="pbtn p-4 text-left flex flex-col gap-2"
            onClick={() => chooseBuild(b.id)}
          >
            <div className="flex items-center gap-3">
              {FOUNDERS[b.id] ? <PixelSprite sprite={FOUNDERS[b.id]} size={5} /> : <span className="text-3xl">{b.icon}</span>}
              <span className="pixel-font text-xs text-[var(--accent)]">{tl(lang, b.name)}</span>
            </div>
            <div className="text-sm text-[var(--muted)]">{tl(lang, b.desc)}</div>
            <div className="text-sm">
              💰 ${b.money.toLocaleString()} · 👥 {b.audience}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function IdeaPick() {
  const { lang, ideas, chooseIdea } = useStore()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4">
      <h2 className="pixel-font text-sm sm:text-lg text-[var(--accent)] text-center">
        {t(lang, 'pickIdea')}
      </h2>
      <div className="grid sm:grid-cols-3 gap-4 max-w-4xl w-full">
        {ideas.map((id) => {
          const n = nicheById(id)
          return (
            <button
              key={id}
              className="pbtn p-4 text-left flex flex-col gap-2 min-h-40"
              onClick={() => chooseIdea(id)}
            >
              <div className="pixel-font text-[11px] text-[var(--accent)] leading-relaxed">
                {tl(lang, n.name)}
              </div>
              <div className="text-sm text-[var(--muted)] grow">{tl(lang, n.legend)}</div>
              <div className="text-xs text-[var(--muted)]">
                {lang === 'ru' ? 'Спрос' : 'Demand'}: ??? · {lang === 'ru' ? 'Конкуренция' : 'Competition'}: ???
              </div>
            </button>
          )
        })}
      </div>
      <Panel className="max-w-md text-center text-xs text-[var(--muted)]">
        {t(lang, 'ideaHidden')}
      </Panel>
    </div>
  )
}
