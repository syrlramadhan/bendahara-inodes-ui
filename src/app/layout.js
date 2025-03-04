import { Inter } from 'next/font/google'
import './globals.css'
import { SoftUIControllerProvider } from '@/context'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'UI Bendahara',
  description: 'Aplikasi Manajemen Keuangan',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <SoftUIControllerProvider>
          {children}
        </SoftUIControllerProvider>
      </body>
    </html>
  )
}
