import type { Metadata } from 'next'

import { Providers } from './providers'

import './globals.css'

export const metadata: Metadata = {
  title: 'Lista de Repositórios Github',
  description: 'Lista de repositórios de usuários do github',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-zinc-950 text-zinc-50 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
