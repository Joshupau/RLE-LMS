import { Inter } from 'next/font/google'
import './globals.css'
import { EdgeStoreProvider } from '../lib/edgestore';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'NurseSync',
  description: 'NurseSync RLE Management System',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <EdgeStoreProvider>{children}</EdgeStoreProvider>
        </body>
    </html>
  )
}
