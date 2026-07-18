import type { Metadata, Viewport } from 'next'
import { Press_Start_2P } from 'next/font/google'
import './globals.css'

const pixel = Press_Start_2P({
  weight: '400',
  subsets: ['latin', 'cyrillic'],
  variable: '--font-pixel',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Guild of One — соло-фаундер roguelike',
  description: 'Пошаговый roguelike-симулятор запуска продукта соло-основателем. От идеи до $10k MRR или смерти.',
}

export const viewport: Viewport = {
  themeColor: '#0d0b14',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={pixel.variable}>
      <body className="min-h-screen antialiased">
        {children}
        <script defer data-domain="guildof.one" src="https://plausible.chatindex.app/js/script.js" />
      </body>
    </html>
  )
}
