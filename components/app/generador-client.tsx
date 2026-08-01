'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, AlertCircle, ListChecks, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GeneradorForm } from '@/components/app/generador-form'
import { ResultadoView } from '@/components/app/resultado-view'
import type { FormularioGeneracion, SecuenciaDidactica } from '@/lib/types'

const initialForm: FormularioGeneracion = {
  grado: '',
  areaId: '',
  contenido: '',
  temaLocal: '',
  tipoRecurso: 'Secuencia didáctica',
  cantidad: '4 actividades',
  duracion: '2 clases',
  nivel: '',
  tipoInstitucion: '',
  integracion: '',
  notasDocente: '',
}

export function GeneradorClient() {
  const [form, setForm] = useState<FormularioGeneracion>(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [secuencia, setSecuencia] = useState<SecuenciaDidactica | null>(null)

  const listo = form.grado && form.areaId && form.contenido && form.nivel && form.tipoInstitucion

  function onChange(patch: Partial<FormularioGeneracion>) {
    setForm((f) => ({ ...f, ...patch }))
  }

  async function generar() {
    if (!listo) {
      setError('Completá grado, área, contenido, nivel del grupo y tipo de institución.')
      return
    }
    setError(null)
    setLoading(true)
    setSecuencia(null)
    try {
      const res = await fetch('/api/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('request failed')
      const data = await res.json()
      setSecuencia(data.secuencia as SecuenciaDidactica)
    } catch {
      setError('No se pudo generar el recurso. Revisá tu conexión e intentá nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between no-print">
        <div>
          <Button asChild variant="ghost" size="sm" className="-ml-2 gap-1.5 text-muted-foreground">
            <Link href="/app">
              <ArrowLeft className="size-4" />
              Herramientas
            </Link>
          </Button>
          <h1 className="mt-2 flex items-center gap-2 font-display text-2xl font-bold tracking-tight text-foreground">
            <ListChecks className="size-6 text-primary" />
            Generador de secuencias didácticas
          </h1>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <div className="no-print h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24">
          <GeneradorForm form={form} onChange={onChange} onSubmit={generar} loading={loading} />
          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div>
          {loading && (
            <div className="flex h-full min-h-80 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="font-display font-semibold text-foreground">Generando tu recurso...</p>
              <p className="max-w-xs text-sm text-muted-foreground">
                Sintetizando actividades alineadas al Diseño Curricular de Santa Fe.
              </p>
            </div>
          )}

          {!loading && secuencia && <ResultadoView secuencia={secuencia} onUpdate={setSecuencia} />}

          {!loading && !secuencia && (
            <div className="flex h-full min-h-80 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center">
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ListChecks className="size-6" />
              </span>
              <p className="font-display font-semibold text-foreground">Tu recurso aparecerá acá</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Completá el formulario de la izquierda y presioná "Generar recurso". Vas a poder revisar, editar e
                imprimir el material.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
