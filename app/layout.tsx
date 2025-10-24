import './globals.css'
import type { ReactNode } from 'react'

export const metadata = { title: 'Flex Reviews Dashboard' }

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-black/10 bg-white">
          <div className="container flex items-center justify-between py-4">
            <div className="flex items-center gap-2 font-semibold">
              <span className="text-xl">🏠</span>
              <span>the flex.</span>
            </div>
            <nav className="flex gap-4 text-sm">
              <a className="hover:underline" href="/dashboard">Dashboard</a>
              <a className="hover:underline" href="/listings/2B-N1-A">Property Page</a>
            </nav>
          </div>
        </header>
        <main className="container py-8">{children}</main>
      </body>
    </html>
  )
}
