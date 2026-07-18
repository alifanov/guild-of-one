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
  metadataBase: new URL('https://guildof.one'),
  title: 'Guild of One — соло-фаундер roguelike',
  description: 'Пошаговый roguelike-симулятор запуска продукта соло-основателем. От идеи до $10k MRR или смерти.',
  openGraph: {
    title: 'Guild of One',
    description: 'Solo founder roguelike — from idea to $10k MRR or death.',
    url: 'https://guildof.one',
    siteName: 'Guild of One',
    images: [{ url: '/og.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guild of One',
    description: 'Solo founder roguelike — from idea to $10k MRR or death.',
    images: ['/og.png'],
  },
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
