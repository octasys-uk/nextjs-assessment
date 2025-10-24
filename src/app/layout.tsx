import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { TRPCProvider } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI App Builder',
  description: 'Build applications with AI',
}

// BUG #7: React Hydration Mismatch
// ISSUE: Date rendering causes hydration errors
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // BUG: Server and client render different values
  const timestamp = new Date().toISOString()

  return (
    <html lang="en">
      <body className={inter.className}>
        <TRPCProvider>
          <header className="border-b">
            <div className="container mx-auto px-4 py-4">
              <h1 className="text-2xl font-bold">AI App Builder</h1>
              {/* BUG: This causes hydration mismatch */}
              <p className="text-sm text-gray-500">Last updated: {timestamp}</p>
            </div>
          </header>
          {children}
        </TRPCProvider>
      </body>
    </html>
  )
}
