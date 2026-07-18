import type { ChannelId, GameState, L } from '../types'
import { fitFor, nicheById } from './niches'

const CH_NAME: Record<ChannelId, string> = { seo: 'SEO', social: 'Xitter', forum: 'Dungeon Boards', email: 'Owl Mail', partners: 'Partner Guild' }

export interface InsightDef {
  id: string
  when: (s: GameState) => boolean
  text: (s: GameState) => L
}

// факты о скрытых механиках; открываются «Общаться с юзерами» и «Смотреть метрики».
// порядок = приоритет выдачи
export const INSIGHTS: InsightDef[] = [
  {
    id: 'best_channel',
    when: () => true,
    text: (s) => {
      const fit = fitFor(s.nicheId)
      const best = (Object.keys(fit) as ChannelId[]).sort((a, b) => fit[b] - fit[a])[0]
      const ch = CH_NAME[best]
      const x = fit[best].toFixed(1)
      return {
        ru: `💡 Твоя ЦА живёт в ${ch}: посты туда работают на ×${x}`,
        en: `💡 Your audience lives on ${ch}: posts there work at ×${x}`,
        es: `💡 Tu público vive en ${ch}: los posts ahí rinden ×${x}`,
        zh: `💡 你的目标用户都在 ${ch}：在那里发帖效果 ×${x}`,
        pt: `💡 Seu público vive no ${ch}: posts lá rendem ×${x}`,
      }
    },
  },
  {
    id: 'worst_channel',
    when: (s) => {
      const fit = fitFor(s.nicheId)
      return Math.min(fit.seo, fit.social, fit.forum) < 0.8
    },
    text: (s) => {
      const fit = fitFor(s.nicheId)
      const worst = (Object.keys(fit) as ChannelId[]).sort((a, b) => fit[a] - fit[b])[0]
      const ch = CH_NAME[worst]
      return {
        ru: `💡 ${ch} для этой ниши почти мёртв (×${fit[worst].toFixed(1)}) — не трать туда энергию`,
        en: `💡 ${ch} is nearly dead for this niche (×${fit[worst].toFixed(1)}) — don't waste energy there`,
        es: `💡 ${ch} está casi muerto para este nicho (×${fit[worst].toFixed(1)}) — no gastes energía ahí`,
        zh: `💡 对这个细分市场来说 ${ch} 基本没用（×${fit[worst].toFixed(1)}）——别浪费精力`,
        pt: `💡 ${ch} está quase morto para esse nicho (×${fit[worst].toFixed(1)}) — não desperdice energia lá`,
      }
    },
  },
  {
    id: 'churn_bugs',
    when: (s) => s.bugs >= 2 && s.paid > 0,
    text: (s) => ({
      ru: `💡 Главная причина отписок сейчас — баги (${s.bugs} шт). Почини — churn заметно упадёт`,
      en: `💡 The top churn driver right now is bugs (${s.bugs}). Fix them and churn drops noticeably`,
      es: `💡 La principal causa de churn ahora son los bugs (${s.bugs}). Arréglalos y bajará bastante`,
      zh: `💡 目前流失的头号原因是 bug（${s.bugs} 个）。修掉它们，churn 会明显下降`,
      pt: `💡 A principal causa de churn agora são os bugs (${s.bugs}). Conserte e o churn cai na hora`,
    }),
  },
  {
    id: 'price_room',
    when: (s) => s.validated && s.payments,
    text: (s) => {
      const cap = nicheById(s.nicheId).arpuCap
      const low = s.price < cap * 0.5
      return low
        ? {
            ru: `💡 Юзеры считают $${s.price} дешёвым: потолок ниши ~$${cap} — есть запас поднять цену`,
            en: `💡 Users find $${s.price} cheap: the niche cap is ~$${cap} — there's room to raise the price`,
            es: `💡 A los usuarios $${s.price} les parece barato: el techo del nicho es ~$${cap} — hay margen para subir`,
            zh: `💡 用户觉得 $${s.price} 挺便宜：这个细分市场的上限约 $${cap}——还有涨价空间`,
            pt: `💡 Os usuários acham $${s.price} barato: o teto do nicho é ~$${cap} — dá para subir o preço`,
          }
        : {
            ru: `💡 Цена $${s.price} у потолка ниши (~$${cap}): выше — конверсия начнёт душиться`,
            en: `💡 Your $${s.price} price is near the niche cap (~$${cap}): go higher and conversion chokes`,
            es: `💡 Tu precio de $${s.price} está cerca del techo (~$${cap}): más arriba, la conversión se ahoga`,
            zh: `💡 $${s.price} 已接近细分市场上限（~$${cap}）：再高转化率就要窒息了`,
            pt: `💡 Seu preço de $${s.price} está perto do teto (~$${cap}): acima disso a conversão sufoca`,
          }
    },
  },
  {
    id: 'quality_churn',
    when: (s) => s.quality < 0.5 && s.paid > 0,
    text: () => ({
      ru: '💡 Продукт сыроват: качество ниже 50 — юзеры уходят быстрее, чем приходят новые',
      en: "💡 The product is raw: quality under 50 means users leave faster than new ones arrive",
      es: '💡 El producto está verde: con calidad bajo 50 los usuarios se van más rápido de lo que llegan',
      zh: '💡 产品还很糙：质量低于 50，用户流失比新增还快',
      pt: '💡 O produto está cru: qualidade abaixo de 50 faz os usuários saírem mais rápido do que entram',
    }),
  },
  {
    id: 'feature_trap',
    when: (s) => s.features > 3,
    text: (s) => ({
      ru: `💡 Никто не просил ${s.features} фич. Юзеры просят, чтобы работало то, что есть`,
      en: `💡 Nobody asked for ${s.features} features. Users ask for the existing ones to work`,
      es: `💡 Nadie pidió ${s.features} features. Los usuarios piden que funcione lo que ya hay`,
      zh: `💡 没人要过 ${s.features} 个功能。用户只想要现有的能正常用`,
      pt: `💡 Ninguém pediu ${s.features} features. Os usuários pedem que o que existe funcione`,
    }),
  },
  {
    id: 'virality',
    when: (s) => s.stats.totalSignups > 0,
    text: (s) => {
      const v = nicheById(s.nicheId).virality
      return v >= 0.6
        ? {
            ru: '💡 Ниша виральная: юзеры сами шарят продукт — каждый пост приводит аудиторию с бонусом',
            en: '💡 The niche is viral: users share on their own — every post brings bonus audience',
            es: '💡 El nicho es viral: los usuarios comparten solos — cada post trae audiencia extra',
            zh: '💡 这个领域自带传播性：用户会自发分享——每条帖子都带来额外受众',
            pt: '💡 O nicho é viral: os usuários compartilham sozinhos — cada post traz audiência extra',
          }
        : {
            ru: '💡 Сарафан тут не работает: никто не шарит инвойсы с друзьями. Рассчитывай на SEO и рекламу',
            en: "💡 Word of mouth doesn't work here: nobody shares invoices with friends. Count on SEO and ads",
            es: '💡 El boca a boca no funciona aquí: nadie comparte facturas con amigos. Cuenta con SEO y anuncios',
            zh: '💡 口碑传播在这里行不通：没人会跟朋友分享发票。指望 SEO 和广告吧',
            pt: '💡 Boca a boca não funciona aqui: ninguém compartilha faturas com amigos. Conte com SEO e anúncios',
          }
    },
  },
  {
    id: 'competition',
    when: (s) => s.validated && nicheById(s.nicheId).competition > 0.7,
    text: () => ({
      ru: '💡 Рынок красный: конкуренция давит конверсии и CAC. Выделяйся качеством или нишуйся глубже',
      en: '💡 Red ocean: competition squeezes conversions and CAC. Stand out on quality or niche down',
      es: '💡 Océano rojo: la competencia aprieta conversiones y CAC. Destaca en calidad o busca un subnicho',
      zh: '💡 红海市场：竞争压低转化率、抬高 CAC。要么拼质量，要么继续细分',
      pt: '💡 Oceano vermelho: a concorrência espreme conversões e CAC. Destaque-se na qualidade ou nichifique mais',
    }),
  },
]

export const insightById = (id: string) => INSIGHTS.find((i) => i.id === id)
