'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/components/auth/auth-provider'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (ready && !user) {
      const next = encodeURIComponent(pathname || '/app')
      router.replace(`/login?next=${next}`)
    }
  }, [ready, user, router, pathname])

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/30">
        <Loader2 className="size-6 animate-spin text-primary" />
        <span className="sr-only">Cargando…</span>
      </div>
    )
  }

  return <>{children}</>
}
