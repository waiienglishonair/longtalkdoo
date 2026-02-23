import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LongTalkDoo - Speak English with Confidence',
  description: 'Interactive lessons designed for fast learning and real conversations.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-background text-white selection:bg-primary/30">
        {children}
      </body>
    </html>
  )
}
