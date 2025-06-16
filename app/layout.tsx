import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Admin dashboard',
  description: 'Created by Satyam',
  generator: 'vs code',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
