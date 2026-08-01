'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GraduationCap, LayoutGrid, LogOut, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth/auth-provider'

export function AppHeader() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  function onSignOut() {
    signOut()
    router.replace('/login')
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur no-print">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/app" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="size-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-base font-bold tracking-tight text-foreground">
              SmartClass
            </span>
            <span className="text-[11px] text-muted-foreground">Plataforma docente</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href="/app">
              <LayoutGrid className="size-4" />
              <span className="hidden sm:inline">Herramientas</span>
            </Link>
          </Button>

          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link href="/app/dashboard">
              <FolderOpen className="size-4" />
              <span className="hidden sm:inline">Mis clases</span>
            </Link>
          </Button>

          {user && (
            <>
              <span className="hidden max-w-[10rem] truncate text-sm text-muted-foreground sm:inline">
                {user.nombre}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground"
                onClick={onSignOut}
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Salir</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
