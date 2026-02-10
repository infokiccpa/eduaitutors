import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './globals.css'
import { Providers } from '@/components/Providers'
import ChatWidget from '@/components/ChatWidget'
import WhatsAppButton from '@/components/WhatsAppButton'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Edu Altutors - Learning Management System',
  description: 'Your comprehensive learning platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <ChatWidget />
          <WhatsAppButton />
          <ToastContainer position="top-right" autoClose={3000} />
        </Providers>
      </body>
    </html>
  )
}

