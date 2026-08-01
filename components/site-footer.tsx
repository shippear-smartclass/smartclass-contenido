import { GraduationCap } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="size-4" />
          </span>
          <span className="font-display text-sm font-bold text-foreground">SIPPPEAR SmartClass</span>
        </div>
        <p className="text-center text-xs text-muted-foreground sm:text-right">
          Educación Primaria · Provincia de Santa Fe (Rosario y región).
          <br className="hidden sm:block" />
          La IA no reemplaza al docente; lo potencia.
        </p>
      </div>
    </footer>
  )
}
