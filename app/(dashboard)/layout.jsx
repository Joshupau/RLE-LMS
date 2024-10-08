import { Inter } from 'next/font/google'
import Provider from '@/context/provider'
import { Sidebar } from './_components/sidebar'
import { Navbar } from './_components/navbar'
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from 'react'
import LoadingModal from '@/components/ui/loading-modal'

import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'NurseSync',
  description: 'NurseSync RLE Management System',
}

export default async function RootLayout({ children }) {

  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <Provider session={session}>
      <body className={inter.className}>
      <div className="h-full">
            <div className="position-fixed top-0 left-0 right-0 z-10 h-[80px] md:pl-56 fixed inset-y-0 w-full">
                <Navbar session={session}/>
            </div>
            <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
                <Sidebar session={session} />
            </div>
            <main className="md:pl-56 h-full">
              <Suspense fallback={<LoadingModal/>}>
                 {children}
              </Suspense>
            </main>
        </div>
        <Toaster />
        </body>
      </Provider>
    </html>
  )
}
