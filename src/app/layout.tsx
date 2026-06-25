import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Depgrow Leads — Smart Lead Capture for Indian Businesses',
  description: 'Multi-step lead forms with auto-scoring, WhatsApp notifications, and CRM — built for Depgrow clients.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
