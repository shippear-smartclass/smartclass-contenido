'use client'

import { useEffect, useState } from 'react'
import { X, Check, Copy, Mail, Link2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Contacto, Material } from '@/lib/types'

type Props = {
  material: Material
  contactos: Contacto[]
  onClose: () => void
  onSave: (contactoIds: string[]) => void
}

const rolColor: Record<Contacto['rol'], string> = {
  'Alumno/a': 'bg-chart-1/15 text-chart-1',
  Familia: 'bg-chart-3/15 text-chart-3',
  Colega: 'bg-chart-4/20 text-chart-4',
}

export function CompartirDialog({ material, contactos, onClose, onSave }: Props) {
  const [seleccion, setSeleccion] = useState<string[]>(material.compartidoCon)
  const [copiado, setCopiado] = useState(false)

  // Link de demo (no navegable, ilustrativo)
  const link = `https://smartclass.app/m/${material.id}`

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function toggle(id: string) {
    setSeleccion((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  }

  function copiarLink() {
    navigator.clipboard?.writeText(link).then(
      () => {
        setCopiado(true)
        setTimeout(() => setCopiado(false), 1800)
      },
      () => setCopiado(false),
    )
  }

  const emailsSeleccionados = contactos
    .filter((c) => seleccion.includes(c.id))
    .map((c) => c.email)
    .join(',')

  const mailto = `mailto:${emailsSeleccionados}?subject=${encodeURIComponent(
    `Material: ${material.titulo}`,
  )}&body=${encodeURIComponent(`Hola, te comparto el material "${material.titulo}".\n\nAccedé desde: ${link}`)}`

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
      />
      <div className="relative z-10 flex max-h-[85vh] w-full flex-col overflow-hidden rounded-t-2xl border border-border bg-card shadow-xl sm:max-w-md sm:rounded-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-border p-5">
          <div>
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-card-foreground">
              <Users className="size-5 text-primary" />
              Compartir material
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground text-pretty">{material.titulo}</p>
          </div>
          <Button variant="ghost" size="icon" className="size-8 shrink-0" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {/* Link para compartir */}
          <div className="mb-5">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Link para compartir
            </p>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/40 p-1.5 pl-3">
              <Link2 className="size-4 shrink-0 text-muted-foreground" />
              <span className="flex-1 truncate text-sm text-foreground">{link}</span>
              <Button variant="outline" size="sm" className="shrink-0 gap-1.5" onClick={copiarLink}>
                {copiado ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                {copiado ? 'Copiado' : 'Copiar'}
              </Button>
            </div>
          </div>

          {/* Contactos */}
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Alumnos y contactos
          </p>
          <div className="flex flex-col gap-1.5">
            {contactos.map((c) => {
              const activo = seleccion.includes(c.id)
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggle(c.id)}
                  className={`flex items-center gap-3 rounded-lg border p-2.5 text-left transition-colors ${
                    activo ? 'border-primary bg-primary/5' : 'border-border hover:bg-secondary/40'
                  }`}
                >
                  <span
                    className={`flex size-5 shrink-0 items-center justify-center rounded border-2 ${
                      activo ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
                    }`}
                  >
                    {activo && <Check className="size-3.5" />}
                  </span>
                  <span className="flex flex-1 flex-col">
                    <span className="text-sm font-medium text-foreground">{c.nombre}</span>
                    <span className="text-xs text-muted-foreground">{c.email}</span>
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${rolColor[c.rol]}`}>{c.rol}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border p-4">
          <Button asChild variant="outline" size="sm" className="gap-1.5" disabled={seleccion.length === 0}>
            <a href={seleccion.length ? mailto : undefined}>
              <Mail className="size-4" />
              Enviar por email
            </a>
          </Button>
          <Button
            size="sm"
            onClick={() => {
              onSave(seleccion)
              onClose()
            }}
          >
            Guardar ({seleccion.length})
          </Button>
        </div>
      </div>
    </div>
  )
}
