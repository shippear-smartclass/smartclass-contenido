import Link from 'next/link'
import { GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="size-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-base font-bold tracking-tight text-foreground">
              SmartClass
            </span>
            <span className="text-[11px] text-muted-foreground">Recursos didácticos · Santa Fe</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <a href="#problema" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            El problema
          </a>
          <a href="#como-funciona" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Cómo funciona
          </a>
          <a href="#diferenciales" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Diferenciales
          </a>
        </nav>

        <Button asChild size="sm">
          <Link href="/login">Ingresar a la plataforma</Link>
        </Button>
      </div>
    </header>
  )
}
