import Link from 'next/link'
import { GraduationCap, LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur no-print">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/app" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="size-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-base font-bold tracking-tight text-foreground">
              SIPPPEAR SmartClass
            </span>
            <span className="text-[11px] text-muted-foreground">Plataforma docente</span>
          </span>
        </Link>

        <Button asChild variant="outline" size="sm" className="gap-2">
          <Link href="/app">
            <LayoutGrid className="size-4" />
            Herramientas
          </Link>
        </Button>
      </div>
    </header>
  )
}
