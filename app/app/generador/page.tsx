import { AppHeader } from '@/components/app/app-header'
import { GeneradorClient } from '@/components/app/generador-client'

export default function GeneradorPage() {
  return (
    <div className="flex min-h-screen flex-col bg-secondary/30">
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <GeneradorClient />
      </main>
    </div>
  )
}
