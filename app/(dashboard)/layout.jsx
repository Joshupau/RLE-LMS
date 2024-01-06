import { Inter } from 'next/font/google'
import Provider from '@/context/provider'
import { Sidebar } from './_components/sidebar'
import { Navbar } from './_components/navbar'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Provider>
      <body className={inter.className}>
      <div className="h-full">
            <div className="position-fixed top-0 left-0 right-0 z-10 h-[80px] md:pl-56 fixed inset-y-0 w-full">
                <Navbar />
            </div>
            <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
                <Sidebar />
            </div>
            <main className="md:pl-56 pt-[80px] h-full">
            {children}
            </main>
        </div>
        </body>
      </Provider>
    </html>
  )
}
