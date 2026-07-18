'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { t, tl } from '@/lib/i18n'
import type { ChannelId, GameState, Lang } from '@/lib/engine/types'
import { canDoAction, energyCost, funnelMetrics, stageOf } from '@/lib/engine/engine'
import { BAL } from '@/lib/engine/balance'
import { ACTIONS } from '@/lib/engine/content/actions'
import { HIRES, hireById } from '@/lib/engine/content/hires'
import { nicheById } from '@/lib/engine/content/niches'
import { EVENTS } from '@/lib/engine/content/events'
import { insightById } from '@/lib/engine/content/insights'
import { charById, FOUNDERS } from '@/lib/engine/content/characters'
import { Bar, Panel, PixelSprite, Sparkline } from './ui'

const CHANNEL_IDS: ChannelId[] = ['seo', 'social', 'forum']

export default function Play() {
  const g = useStore((s) => s.game)
  const lang = useStore((s) => s.lang)
  const [tab, setTab] = useState<'funnel' | 'actions' | 'product'>('actions')
  if (!g) return null
  const stage = stageOf(g)
  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 flex flex-col gap-3">
      <Header g={g} lang={lang} />
      {/* мобильные табы */}
      <div className="flex gap-2 lg:hidden">
        {(['funnel', 'actions', 'product'] as const).map((k) => (
          <button
            key={k}
            className={`pbtn px-3 py-2 text-xs pixel-font flex-1 ${tab === k ? 'pbtn-accent' : ''}`}
            onClick={() => setTab(k)}
          >
            {t(lang, k === 'funnel' ? 'funnel' : k === 'actions' ? 'actions' : 'product')}
          </button>
        ))}
      </div>
      {/* desktop xl: левая часть в 2 колонки, чтобы всё влезало без скролла */}
      <div className="lg:grid lg:grid-cols-[1fr_340px] lg:gap-3 flex flex-col gap-3">
        <div className="flex flex-col gap-3 min-w-0 xl:grid xl:grid-cols-2 xl:items-start">
          <div className={`${tab === 'funnel' ? 'block' : 'hidden'} lg:block xl:col-start-1`}>
            <FunnelPanel g={g} lang={lang} />
          </div>
          <div className={`${tab === 'product' ? 'block' : 'hidden'} lg:block xl:col-start-2 xl:row-start-1`}>
            <ProductPanel g={g} lang={lang} />
          </div>
          <div className={`${tab === 'funnel' ? 'block' : 'hidden'} lg:block xl:col-start-1`}>
            <InsightsPanel g={g} lang={lang} />
          </div>
          <div className={`${tab === 'funnel' ? 'block' : 'hidden'} lg:block xl:col-start-2`}>
            <ChannelsPanel g={g} lang={lang} />
          </div>
        </div>
        <div className={`${tab === 'actions' ? 'flex' : 'hidden'} lg:flex flex-col gap-3`}>
          <ActionsPanel g={g} lang={lang} stage={stage} />
        </div>
      </div>
      <LogPanel g={g} lang={lang} />
      {g.pendingEvent && <EventModal g={g} lang={lang} />}
      {g.status !== 'playing' && <EndOverlay g={g} lang={lang} />}
    </div>
  )
}

function Header({ g, lang }: { g: GameState; lang: Lang }) {
  const stage = stageOf(g)
  return (
    <div className="panel p-2 sm:p-3 sticky top-2 z-10 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
      <span className="flex items-center gap-2">
        {FOUNDERS[g.buildId] && <PixelSprite sprite={FOUNDERS[g.buildId]} size={3} />}
        <span className="pixel-font text-[10px] text-[var(--accent)]">
          {t(lang, 'day')} {g.day} · {t(lang, stage)}
        </span>
      </span>
      <span title={t(lang, 'money')}>💰 ${Math.floor(g.money).toLocaleString()}</span>
      <span title={t(lang, 'energy')}>⚡ {g.energy}/{g.energyMax}</span>
      <span title={t(lang, 'motivation')} className={g.motivation < 30 ? 'text-[var(--bad)]' : ''}>
        ♥ {Math.round(g.motivation)}
      </span>
      <span title={t(lang, 'audience')}>👥 {Math.round(g.audience).toLocaleString()}</span>
      <span className="ml-auto flex items-center gap-2 min-w-32 grow sm:grow-0">
        <span className="pixel-font text-[10px]">MRR ${Math.round(g.mrr).toLocaleString()}</span>
        <span className="grow sm:w-28">
          <Bar value={g.mrr} max={BAL.winMRR} color="var(--accent)" />
        </span>
      </span>
    </div>
  )
}

function Row({ k, v, sub }: { k: string; v: string; sub?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-[var(--muted)] text-sm">{k}</span>
      <span className="font-mono text-sm">
        {v} {sub && <span className="text-[var(--muted)] text-xs">{sub}</span>}
      </span>
    </div>
  )
}

function FunnelPanel({ g, lang }: { g: GameState; lang: Lang }) {
  const m = funnelMetrics(g)
  const mrrData = g.history.map((h) => h.mrr)
  const moneyData = g.history.map((h) => h.money)
  const cacPaid = m.convLp * m.convPay > 0 ? m.cpv / (m.convLp * m.convPay) : 0
  const ltv = m.churnMonthly > 0 ? g.price / m.churnMonthly : 0
  return (
    <Panel title={t(lang, 'funnel')}>
      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1">
        <Row k={t(lang, 'visits')} v={`${g.lastVisits}`} />
        <Row k={t(lang, 'signups')} v={`${g.lastSignups}`} sub={`(${(m.convLp * 100).toFixed(1)}%)`} />
        <Row k={t(lang, 'paying')} v={`${g.paid}`} sub={`+${g.lastNewPaid}/−${g.lastChurned}`} />
        <Row k={t(lang, 'churn')} v={g.paid > 0 ? `${(m.churnMonthly * 100).toFixed(0)}%` : '—'} sub={g.paid > 0 ? t(lang, 'perMonth') : ''} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <div className="text-xs text-[var(--muted)] mb-1">MRR ${Math.round(g.mrr).toLocaleString()}</div>
          <Sparkline data={mrrData} color="var(--accent)" />
        </div>
        <div>
          <div className="text-xs text-[var(--muted)] mb-1">
            {t(lang, 'money')} ${Math.floor(g.money).toLocaleString()}
          </div>
          <Sparkline data={moneyData} color="var(--good)" />
        </div>
      </div>
      {g.analytics && (
        <div className="mt-3 pt-2 border-t-2 border-[var(--border)] grid sm:grid-cols-2 gap-x-6 gap-y-1">
          <Row k={t(lang, 'cac')} v={cacPaid > 0 && cacPaid < 1e5 ? `$${cacPaid.toFixed(0)}` : '—'} />
          <Row k={t(lang, 'ltv')} v={ltv > 0 ? `$${ltv.toFixed(0)}` : '—'} />
        </div>
      )}
    </Panel>
  )
}

function ChannelsPanel({ g, lang }: { g: GameState; lang: Lang }) {
  const active = CHANNEL_IDS.filter((c) => g.channels[c] > BAL.activeChannelThreshold)
  return (
    <Panel title={t(lang, 'channels')}>
      <div className="flex flex-col gap-2">
        {CHANNEL_IDS.map((c) => (
          <div key={c} className="flex items-center gap-2">
            <span className="text-sm w-36 shrink-0">{t(lang, c)}</span>
            <Bar value={Math.min(g.channels[c], 20)} max={20} color="var(--good)" />
            <span className="font-mono text-xs text-[var(--muted)] w-10 text-right">
              {g.channels[c].toFixed(1)}
            </span>
          </div>
        ))}
      </div>
      {active.length >= 2 && (
        <div className="text-xs text-[var(--bad)] mt-2">
          {`⚠ ${active.length} ${t(lang, 'multiChannelWarn')}`}
        </div>
      )}
      {g.hires.length > 0 && (
        <div className="mt-3 pt-2 border-t-2 border-[var(--border)]">
          <div className="text-xs text-[var(--muted)] mb-1">{t(lang, 'team')}</div>
          <div className="flex gap-2 flex-wrap">
            {g.hires.map((h) => {
              const hd = hireById(h)
              const c = charById(hd.char)
              return (
                <span key={h} className="flex items-center gap-1 text-xs" title={tl(lang, hd.desc)}>
                  {c && <PixelSprite sprite={c.sprite} size={2} />}
                  {tl(lang, hd.name)}
                </span>
              )
            })}
          </div>
        </div>
      )}
    </Panel>
  )
}

function InsightsPanel({ g, lang }: { g: GameState; lang: Lang }) {
  const unlocked = (g.insights ?? []).map((id) => insightById(id)).filter(Boolean)
  return (
    <Panel title={`💡 ${t(lang, 'insightsTitle')}${unlocked.length ? ` (${unlocked.length})` : ''}`}>
      {unlocked.length === 0 ? (
        <div className="text-xs text-[var(--muted)]">{t(lang, 'insightsHint')}</div>
      ) : (
        <div className="flex flex-col gap-1 text-sm">
          {unlocked.map((ins) => (
            <div key={ins!.id} className="text-[var(--good)]">
              {tl(lang, ins!.text(g))}
            </div>
          ))}
        </div>
      )}
    </Panel>
  )
}

function ProductPanel({ g, lang }: { g: GameState; lang: Lang }) {
  const n = nicheById(g.nicheId)
  const hiresMonthly = g.hires.reduce((a, h) => a + hireById(h).monthly, 0)
  const burn = BAL.burnLifeMonthly + g.infraMonthly + hiresMonthly
  return (
    <Panel title={t(lang, 'product')}>
      <div className="text-sm mb-1">{tl(lang, n.name)}</div>
      <div className="text-xs text-[var(--muted)] mb-2">
        {g.validated
          ? `${t(lang, 'demand')} ${Math.round(n.demand * 100)} · ${t(lang, 'competition')} ${Math.round(n.competition * 100)} · ${t(lang, 'cap')} $${n.arpuCap}`
          : t(lang, 'pmfHint')}
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="text-sm w-32 shrink-0">{t(lang, 'progress')}</span>
          <Bar value={g.progress} max={100} color="var(--accent)" />
          <span className="font-mono text-xs w-10 text-right">{g.progress}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm w-32 shrink-0">{t(lang, 'quality')}</span>
          <Bar value={g.quality} max={1} color="var(--good)" />
          <span className="font-mono text-xs w-10 text-right">{(g.quality * 100).toFixed(0)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm w-32 shrink-0">{t(lang, 'landing')}</span>
          <Bar value={g.landing} max={1} color="var(--good)" />
          <span className="font-mono text-xs w-10 text-right">{(g.landing * 100).toFixed(0)}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-2">
        <Row k={t(lang, 'features')} v={`${g.features}`} sub={g.features > 3 ? '⚠' : ''} />
        <Row k={t(lang, 'bugs')} v={`${g.bugs}`} sub={g.bugs > 2 ? '🐛' : ''} />
        <Row k={t(lang, 'price')} v={`$${g.price}`} sub={t(lang, 'perMonth')} />
        <Row k={t(lang, 'burn')} v={`$${burn.toLocaleString()}`} sub={t(lang, 'perMonth')} />
        <Row k={t(lang, 'deployed')} v={g.deployed ? '✅' : '—'} />
        <Row k={t(lang, 'payments')} v={g.payments ? '✅' : '—'} />
        <Row k={t(lang, 'validated')} v={g.validated ? '✅' : '—'} />
        <Row k={t(lang, 'launches')} v={`${g.launches}`} />
      </div>
    </Panel>
  )
}

function ActionsPanel({ g, lang, stage }: { g: GameState; lang: Lang; stage: string }) {
  const { act, finishDay, shutdown } = useStore()
  const [expand, setExpand] = useState<string | null>(null)
  const [price, setPrice] = useState(g.price)
  const [confirmClose, setConfirmClose] = useState(false)
  const visible = ACTIONS.filter((a) => (a.id === 'hire' ? stage === 'traction' : true))
  return (
    <Panel title={t(lang, 'actions')} className="lg:sticky lg:top-16">
      <div className="flex flex-col gap-1.5 max-h-[52vh] overflow-y-auto pr-1">
        {visible.map((a) => {
          const check = canDoAction(g, a.id)
          const cost = a.id === 'rest' ? g.energy : energyCost(g, a.id)
          const needsExpand = a.id === 'post' || a.id === 'set_price' || a.id === 'hire'
          // MVP готов — «Пилить MVP» превращается в полировку качества
          const polish = a.id === 'build_mvp' && g.progress >= 100
          return (
            <div key={a.id}>
              <button
                className="pbtn w-full px-2 py-1.5 text-left text-sm flex items-center gap-2"
                disabled={!check.ok}
                title={check.reason ? tl(lang, check.reason) : polish ? t(lang, 'polishDesc') : tl(lang, a.desc)}
                onClick={() => {
                  if (needsExpand) setExpand(expand === a.id ? null : a.id)
                  else act(a.id)
                }}
              >
                <span>{polish ? '🧹' : a.icon}</span>
                <span className="grow">{polish ? t(lang, 'polishName') : tl(lang, a.name)}</span>
                <span className="font-mono text-xs text-[var(--muted)] shrink-0">
                  {a.id === 'rest' ? '⚡all' : `${cost}⚡`}
                  {a.money ? ` $${a.money}` : ''}
                </span>
              </button>
              {expand === 'post' && a.id === 'post' && (
                <div className="flex gap-1 mt-1 pl-6">
                  {CHANNEL_IDS.map((c) => (
                    <button
                      key={c}
                      className="pbtn px-2 py-1 text-xs flex-1"
                      onClick={() => {
                        act('post', c)
                        setExpand(null)
                      }}
                    >
                      {t(lang, c)}
                    </button>
                  ))}
                </div>
              )}
              {expand === 'set_price' && a.id === 'set_price' && (
                <div className="flex gap-1 mt-1 pl-6 items-center">
                  <input
                    type="number"
                    min={1}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="panel px-2 py-1 w-20 text-sm bg-[var(--bg)]"
                  />
                  <button
                    className="pbtn px-2 py-1 text-xs"
                    onClick={() => {
                      act('set_price', price)
                      setExpand(null)
                    }}
                  >
                    OK
                  </button>
                </div>
              )}
              {expand === 'hire' && a.id === 'hire' && (
                <div className="flex flex-col gap-1 mt-1 pl-6">
                  {HIRES.map((h) => {
                    const c = charById(h.char)
                    const hired = g.hires.includes(h.id)
                    return (
                      <button
                        key={h.id}
                        className="pbtn px-2 py-1 text-xs flex items-center gap-2 text-left"
                        disabled={hired || g.money < h.monthly}
                        title={tl(lang, h.desc)}
                        onClick={() => {
                          act('hire', h.id)
                          setExpand(null)
                        }}
                      >
                        {c && <PixelSprite sprite={c.sprite} size={2} />}
                        <span className="grow">{tl(lang, h.name)}</span>
                        <span className="font-mono text-[var(--muted)]">
                          {hired ? '✅' : `$${h.monthly}${t(lang, 'perMonth')}`}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div className="mt-3 flex flex-col gap-2">
        <button
          className="pbtn pbtn-accent w-full px-3 py-2 pixel-font text-[10px]"
          onClick={finishDay}
          disabled={!!g.pendingEvent}
        >
          {t(lang, 'endDay')} ▶
        </button>
        <button
          className={`pbtn w-full px-3 py-2 pixel-font text-[10px] ${confirmClose ? 'text-[var(--bad)] border-[var(--bad)]' : 'text-[var(--muted)]'}`}
          onClick={() => (confirmClose ? shutdown() : setConfirmClose(true))}
          onBlur={() => setConfirmClose(false)}
          disabled={!!g.pendingEvent}
        >
          {confirmClose ? `⚠ ${t(lang, 'confirmClose')}` : `🪦 ${t(lang, 'closeProduct')}`}
        </button>
      </div>
    </Panel>
  )
}

function LogPanel({ g, lang }: { g: GameState; lang: Lang }) {
  return (
    <Panel title={t(lang, 'logTitle')}>
      <div className="flex flex-col-reverse gap-0.5 max-h-40 overflow-y-auto font-mono text-xs">
        {g.log.slice(-25).map((e, i) => (
          <div
            key={i}
            className={
              e.tone === 'good' ? 'text-[var(--good)]' : e.tone === 'bad' ? 'text-[var(--bad)]' : 'text-[var(--muted)]'
            }
          >
            <span className="opacity-60">[{e.day}]</span> {tl(lang, e.text)}
          </div>
        ))}
      </div>
    </Panel>
  )
}

function EventModal({ g, lang }: { g: GameState; lang: Lang }) {
  const resolveEv = useStore((s) => s.resolveEv)
  const ev = EVENTS.find((e) => e.id === g.pendingEvent)
  if (!ev) return null
  const c = charById(ev.char)
  return (
    <div className="fixed inset-0 bg-black/70 z-20 flex items-center justify-center p-4">
      <div className="panel p-4 max-w-md w-full flex flex-col gap-3">
        <div className="flex items-center gap-3">
          {c && <PixelSprite sprite={c.sprite} size={6} />}
          <div>
            <div className="text-xs text-[var(--muted)]">{c ? tl(lang, c.name) : ''}</div>
            <div className="pixel-font text-[11px] text-[var(--accent)] leading-relaxed">
              {tl(lang, ev.title)}
            </div>
          </div>
        </div>
        <p className="text-sm">{tl(lang, ev.text)}</p>
        <div className="flex flex-col gap-2">
          {ev.choices ? (
            ev.choices.map((ch, i) => (
              <button key={i} className="pbtn px-3 py-2 text-sm text-left" onClick={() => resolveEv(i)}>
                {tl(lang, ch.label)}
              </button>
            ))
          ) : (
            <button className="pbtn pbtn-accent px-3 py-2 pixel-font text-[10px]" onClick={() => resolveEv(-1)}>
              {t(lang, 'ok')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function EndOverlay({ g, lang }: { g: GameState; lang: Lang }) {
  const { startNewRun, toTitle } = useStore()
  const won = g.status === 'won'
  const verdict =
    g.status === 'won'
      ? t(lang, 'verdict_won')
      : g.status === 'lost_money'
        ? t(lang, 'verdict_money')
        : g.status === 'lost_burnout'
          ? t(lang, 'verdict_burnout')
          : g.status === 'shutdown'
            ? t(lang, 'verdict_shutdown')
            : t(lang, 'verdict_quit')
  const download = () => {
    const cv = document.createElement('canvas')
    cv.width = 800
    cv.height = 420
    const ctx = cv.getContext('2d')!
    ctx.fillStyle = '#0d0b14'
    ctx.fillRect(0, 0, 800, 420)
    ctx.strokeStyle = '#e8c840'
    ctx.lineWidth = 6
    ctx.strokeRect(12, 12, 776, 396)
    ctx.fillStyle = '#e8c840'
    ctx.font = 'bold 34px monospace'
    ctx.fillText('GUILD OF ONE', 40, 70)
    ctx.fillStyle = won ? '#5cb85c' : '#e05555'
    ctx.font = 'bold 26px monospace'
    ctx.fillText(won ? t(lang, 'won') : t(lang, 'lost'), 40, 120)
    ctx.fillStyle = '#e8e4f0'
    ctx.font = '20px monospace'
    wrapText(ctx, verdict, 40, 160, 720, 26)
    ctx.font = 'bold 46px monospace'
    ctx.fillStyle = '#e8c840'
    ctx.fillText(`MRR $${Math.round(g.mrr).toLocaleString()}`, 40, 280)
    ctx.fillStyle = '#8a82a6'
    ctx.font = '20px monospace'
    ctx.fillText(
      `${t(lang, 'daysPlayed')}: ${g.day} · ${t(lang, 'peakMrr')}: $${g.stats.peakMrr.toLocaleString()} · 👥 ${Math.round(g.stats.peakAudience)}`,
      40,
      330
    )
    ctx.fillStyle = '#e8c840'
    ctx.fillText('guildof.one', 40, 385)
    const a = document.createElement('a')
    a.download = `guild-of-one-day-${g.day}.png`
    a.href = cv.toDataURL('image/png')
    a.click()
  }
  return (
    <div className="fixed inset-0 bg-black/80 z-30 flex items-center justify-center p-4 overflow-y-auto">
      <div className="panel p-5 max-w-lg w-full flex flex-col gap-4">
        <h2 className={`pixel-font text-lg ${won ? 'text-[var(--good)]' : 'text-[var(--bad)]'}`}>
          {won ? t(lang, 'won') : t(lang, 'lost')}
        </h2>
        <p className="text-sm">
          {verdict} <span className="text-[var(--muted)]">({t(lang, 'onDay')} {g.day})</span>
        </p>
        <div>
          <div className="text-xs text-[var(--muted)] mb-1">MRR</div>
          <Sparkline data={g.history.map((h) => h.mrr)} color="var(--accent)" height={56} />
          <div className="text-xs text-[var(--muted)] mb-1 mt-2">{t(lang, 'money')}</div>
          <Sparkline data={g.history.map((h) => h.money)} color="var(--good)" height={56} />
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
          <Row k={t(lang, 'daysPlayed')} v={`${g.day}`} />
          <Row k={t(lang, 'peakMrr')} v={`$${g.stats.peakMrr.toLocaleString()}`} />
          <Row k={t(lang, 'totalSpent')} v={`$${Math.round(g.stats.totalSpend).toLocaleString()}`} />
          <Row k={t(lang, 'audience')} v={`${Math.round(g.stats.peakAudience).toLocaleString()}`} />
          <Row k={t(lang, 'totalVisitsL')} v={`${g.stats.totalVisits.toLocaleString()}`} />
          <Row k={t(lang, 'seedLabel')} v={`${g.seed}`} />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button className="pbtn pbtn-accent px-4 py-2 pixel-font text-[10px]" onClick={startNewRun}>
            ▶ {t(lang, 'newRun')}
          </button>
          <button className="pbtn px-4 py-2 pixel-font text-[10px]" onClick={download}>
            📤 {t(lang, 'share')}
          </button>
          <button className="pbtn px-4 py-2 pixel-font text-[10px]" onClick={toTitle}>
            ⌂
          </button>
        </div>
        <ShareRow g={g} lang={lang} won={won} />
      </div>
    </div>
  )
}

const GAME_URL = 'https://guildof.one'

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: Record<string, string> }) => void
  }
}

function ShareRow({ g, lang, won }: { g: GameState; lang: Lang; won: boolean }) {
  const [copied, setCopied] = useState(false)
  const text = t(lang, won ? 'share_won' : 'share_lost')
    .replace('{days}', String(g.day))
    .replace('{mrr}', g.stats.peakMrr.toLocaleString())
  const enc = encodeURIComponent
  const nets: { id: string; icon: string; href: string }[] = [
    { id: 'x', icon: '𝕏', href: `https://twitter.com/intent/tweet?text=${enc(`${text} ${GAME_URL}`)}` },
    { id: 'telegram', icon: 'TG', href: `https://t.me/share/url?url=${enc(GAME_URL)}&text=${enc(text)}` },
    { id: 'reddit', icon: '👽', href: `https://www.reddit.com/submit?url=${enc(GAME_URL)}&title=${enc(text)}` },
    { id: 'linkedin', icon: 'in', href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(GAME_URL)}` },
    { id: 'facebook', icon: 'f', href: `https://www.facebook.com/sharer/sharer.php?u=${enc(GAME_URL)}&quote=${enc(text)}` },
  ]
  const track = (id: string) => window.plausible?.('share', { props: { network: id, result: won ? 'won' : 'lost' } })
  return (
    <div className="flex items-center gap-2 flex-wrap pt-1 border-t-2 border-[var(--border)]">
      <span className="text-xs text-[var(--muted)]">{t(lang, 'shareRow')}</span>
      {nets.map((n) => (
        <a
          key={n.id}
          className="pbtn px-2.5 py-1.5 pixel-font text-[11px] no-underline"
          href={n.href}
          target="_blank"
          rel="noopener noreferrer"
          title={n.id}
          onClick={() => track(n.id)}
        >
          {n.icon}
        </a>
      ))}
      <button
        className="pbtn px-2.5 py-1.5 pixel-font text-[11px]"
        title="copy"
        onClick={() => {
          navigator.clipboard.writeText(`${text} ${GAME_URL}`).then(() => {
            setCopied(true)
            track('copy')
            setTimeout(() => setCopied(false), 1500)
          })
        }}
      >
        {copied ? `✓ ${t(lang, 'copied')}` : '📋'}
      </button>
    </div>
  )
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lh: number) {
  const words = text.split(' ')
  let line = ''
  for (const w of words) {
    if (ctx.measureText(line + w).width > maxW) {
      ctx.fillText(line, x, y)
      line = w + ' '
      y += lh
    } else line += w + ' '
  }
  ctx.fillText(line, x, y)
}
