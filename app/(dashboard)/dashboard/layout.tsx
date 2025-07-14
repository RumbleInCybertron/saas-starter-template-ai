// app/dashboard/layout.tsx
import '@/styles/globals.css'
import { DashboardShell } from "@/components/shell"
import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/sonner"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ['latin'], variable: "--font-sans" })

export const metadata = {
  title: 'AI SaaS Dashboard',
  description: 'Your dashboard for managing AI SaaS features',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Providers>
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
          <DashboardShell>
            {children}
          </DashboardShell>
        </main>
        <Toaster />
      </Providers>
    </>


  )
}
