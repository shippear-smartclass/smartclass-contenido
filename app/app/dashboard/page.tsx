import { AppHeader } from '@/components/app/app-header'
import { DashboardClient } from '@/components/app/dashboard-client'

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-secondary/30">
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <DashboardClient />
      </main>
    </div>
  )
}
