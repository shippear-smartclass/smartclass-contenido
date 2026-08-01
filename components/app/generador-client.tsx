'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, AlertCircle, ListChecks, Loader2, Sparkles, SlidersHorizontal, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GeneradorForm } from '@/components/app/generador-form'
import { GeneradorWizard } from '@/components/app/generador-wizard'
import { ResultadoView } from '@/components/app/resultado-view'
import { useAuth } from '@/components/auth/auth-provider'
import { ensureSeed, getCursos, saveCurso, saveMaterial } from '@/lib/store'
import type { Curso, FormularioGeneracion, SecuenciaDidactica } from '@/lib/types'

const initialForm: FormularioGeneracion = {
  grado: '',
  areaId: '',
  contenido: '',
  temaLocal: '',
  tipoRecurso: 'Secuencia didáctica',
  cantidad: '4 actividades',
  duracion: '2 clases',
  nivel: '',
  tipoInstitucion: 'Escuela pública laica',
  integracion: '',
  notasDocente: '',
}

type Modo = 'asistente' | 'avanzado'

export function GeneradorClient() {
  const { user } = useAuth()
  const [modo, setModo] = useState<Modo>('asistente')
  const [form, setForm] = useState<FormularioGeneracion>(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [secuencia, setSecuencia] = useState<SecuenciaDidactica | null>(null)
  const [cursos, setCursos] = useState<Curso[]>([])
  const [guardadoId, setGuardadoId] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    ensureSeed(user.email)
    setCursos(getCursos(user.email))
  }, [user])

  // En modo asistente exigimos menos campos (grado, área, contenido, nivel).
  const listoAvanzado = form.grado && form.areaId && form.contenido && form.nivel && form.tipoInstitucion
  const listoAsistente = form.grado && form.areaId && form.contenido && form.nivel
  const listo = modo === 'avanzado' ? listoAvanzado : listoAsistente

  function onChange(patch: Partial<FormularioGeneracion>) {
    setForm((f) => ({ ...f, ...patch }))
  }

  async function generar() {
    if (!listo) {
      setError(
        modo === 'avanzado'
          ? 'Completá grado, área, contenido, nivel del grupo y tipo de institución.'
          : 'Completá los pasos: grado, materia, tema y grupo.',
      )
      return
    }
    setError(null)
    setLoading(true)
    setSecuencia(null)
    setGuardadoId(null)
    try {
      const res = await fetch('/api/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        throw new Error(data?.error ?? 'No se pudo generar el recurso. Revisá tu conexión e intentá nuevamente.')
      }
      const nueva = data.secuencia as SecuenciaDidactica
      setSecuencia(nueva)
      persistir(nueva)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo generar el recurso. Revisá tu conexión e intentá nuevamente.',
      )
    } finally {
      setLoading(false)
    }
  }

  // Guarda el material en el curso indicado. Si no hay cursos, crea uno automático
  // a partir del grado, para que el dashboard nunca quede vacío.
  function persistir(nueva: SecuenciaDidactica) {
    if (!user) return
    let listaCursos = getCursos(user.email)
    let cursoId = listaCursos.find((c) => c.grado === nueva.grado)?.id
    if (!cursoId) {
      const creado = saveCurso(user.email, {
        nombre: `${nueva.grado} - Mi clase`,
        grado: nueva.grado,
        turno: 'Mañana',
        color: 'chart-1',
      })
      cursoId = creado.id
      listaCursos = getCursos(user.email)
      setCursos(listaCursos)
    }
    const mat = saveMaterial(user.email, {
      cursoId,
      secuencia: nueva,
      tipoRecurso: form.tipoRecurso,
    })
    setGuardadoId(mat.id)
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4 no-print">
        <div>
          <Button asChild variant="ghost" size="sm" className="-ml-2 gap-1.5 text-muted-foreground">
            <Link href="/app">
              <ArrowLeft className="size-4" />
              Herramientas
            </Link>
          </Button>
          <h1 className="mt-2 flex items-center gap-2 font-display text-2xl font-bold tracking-tight text-foreground">
            <ListChecks className="size-6 text-primary" />
            Generador de recursos
          </h1>
        </div>

        {/* Toggle de modo */}
        <div className="inline-flex rounded-xl border border-border bg-card p-1">
          <ModeButton activo={modo === 'asistente'} onClick={() => setModo('asistente')} icon={Wand2}>
            Asistente guiado
          </ModeButton>
          <ModeButton activo={modo === 'avanzado'} onClick={() => setModo('avanzado')} icon={SlidersHorizontal}>
            Avanzado
          </ModeButton>
        </div>
      </div>

      {modo === 'asistente' ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)]">
          <div className="no-print">
            <GeneradorWizard form={form} onChange={onChange} onSubmit={generar} loading={loading} />
            {error && <ErrorBox mensaje={error} />}
          </div>
          <ResultadoPanel loading={loading} secuencia={secuencia} onUpdate={setSecuencia} guardado={!!guardadoId} />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
          <div className="no-print h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24">
            <GeneradorForm form={form} onChange={onChange} onSubmit={generar} loading={loading} />
            {error && <ErrorBox mensaje={error} />}
          </div>
          <ResultadoPanel loading={loading} secuencia={secuencia} onUpdate={setSecuencia} guardado={!!guardadoId} />
        </div>
      )}
    </div>
  )
}

function ModeButton({
  activo,
  onClick,
  icon: Icon,
  children,
}: {
  activo: boolean
  onClick: () => void
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
        activo ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      <Icon className="size-4" />
      <span className="hidden sm:inline">{children}</span>
    </button>
  )
}

function ErrorBox({ mensaje }: { mensaje: string }) {
  return (
    <div className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      <span>{mensaje}</span>
    </div>
  )
}

function ResultadoPanel({
  loading,
  secuencia,
  onUpdate,
  guardado,
}: {
  loading: boolean
  secuencia: SecuenciaDidactica | null
  onUpdate: (s: SecuenciaDidactica) => void
  guardado: boolean
}) {
  return (
    <div>
      {loading && (
        <div className="flex h-full min-h-80 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="font-display font-semibold text-foreground">Creando tu recurso...</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            Estamos preparando actividades con imágenes de Rosario.
          </p>
        </div>
      )}

      {!loading && secuencia && (
        <div>
          {guardado && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm text-foreground no-print">
              <Sparkles className="size-4 shrink-0 text-primary" />
              <span>Recurso guardado en tu panel. Podés verlo en "Mis clases".</span>
            </div>
          )}
          <ResultadoView secuencia={secuencia} onUpdate={onUpdate} />
        </div>
      )}

      {!loading && !secuencia && (
        <div className="flex h-full min-h-80 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center">
          <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ListChecks className="size-6" />
          </span>
          <p className="font-display font-semibold text-foreground">Tu recurso aparecerá acá</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Seguí los pasos y presioná "Crear recurso". Vas a poder revisarlo, editarlo, descargarlo y compartirlo.
          </p>
        </div>
      )}
    </div>
  )
}
