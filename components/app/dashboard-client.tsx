'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Clock,
  Eye,
  Plus,
  Share2,
  Trash2,
  Users,
  X,
  FolderOpen,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/components/auth/auth-provider'
import { CompartirDialog } from '@/components/app/compartir-dialog'
import { ResultadoView } from '@/components/app/resultado-view'
import {
  deleteMaterial,
  ensureSeed,
  getContactos,
  getCursos,
  getMateriales,
  updateMaterial,
} from '@/lib/store'
import type { Contacto, Curso, Material } from '@/lib/types'

const colorClasses: Record<string, string> = {
  'chart-1': 'bg-chart-1',
  'chart-2': 'bg-chart-2',
  'chart-3': 'bg-chart-3',
  'chart-4': 'bg-chart-4',
  'chart-5': 'bg-chart-5',
}

function formatFecha(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function DashboardClient() {
  const { user } = useAuth()
  const [cursos, setCursos] = useState<Curso[]>([])
  const [materiales, setMateriales] = useState<Material[]>([])
  const [contactos, setContactos] = useState<Contacto[]>([])
  const [verMaterial, setVerMaterial] = useState<Material | null>(null)
  const [compartir, setCompartir] = useState<Material | null>(null)

  function recargar(email: string) {
    setCursos(getCursos(email))
    setMateriales(getMateriales(email))
    setContactos(getContactos(email))
  }

  useEffect(() => {
    if (!user) return
    ensureSeed(user.email)
    recargar(user.email)
  }, [user])

  const materialesPorCurso = useMemo(() => {
    const map = new Map<string, Material[]>()
    for (const m of materiales) {
      const arr = map.get(m.cursoId) ?? []
      arr.push(m)
      map.set(m.cursoId, arr)
    }
    return map
  }, [materiales])

  const totalMateriales = materiales.length
  const totalCompartidos = materiales.filter((m) => m.compartidoCon.length > 0).length

  function onEliminar(m: Material) {
    if (!user) return
    if (!confirm(`¿Eliminar "${m.titulo}"? Esta acción no se puede deshacer.`)) return
    deleteMaterial(user.email, m.id)
    recargar(user.email)
  }

  function onGuardarCompartir(ids: string[]) {
    if (!user || !compartir) return
    updateMaterial(user.email, compartir.id, { compartidoCon: ids })
    recargar(user.email)
  }

  return (
    <div>
      {/* Encabezado + stats */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">Mis clases</h1>
          <p className="mt-1 text-muted-foreground">
            Todo el material que fuiste creando, organizado por curso.
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/app/generador">
            <Plus className="size-4" />
            Crear recurso
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={FolderOpen} label="Cursos" valor={cursos.length} />
        <StatCard icon={BookOpen} label="Materiales creados" valor={totalMateriales} />
        <StatCard icon={Users} label="Compartidos" valor={totalCompartidos} />
      </div>

      {/* Cursos */}
      <div className="mt-8 flex flex-col gap-8">
        {cursos.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/60 p-10 text-center">
            <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="size-6" />
            </span>
            <p className="font-display font-semibold text-foreground">Todavía no tenés material</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Creá tu primer recurso y va a aparecer acá, organizado por curso.
            </p>
            <Button asChild className="mt-2 gap-2">
              <Link href="/app/generador">
                <Plus className="size-4" />
                Crear recurso
              </Link>
            </Button>
          </div>
        )}

        {cursos.map((curso) => {
          const items = materialesPorCurso.get(curso.id) ?? []
          return (
            <section key={curso.id}>
              <div className="mb-3 flex items-center gap-3">
                <span className={`size-3 shrink-0 rounded-full ${colorClasses[curso.color] ?? 'bg-primary'}`} />
                <h2 className="font-display text-lg font-bold text-foreground">{curso.nombre}</h2>
                <Badge variant="secondary" className="ml-1">
                  {curso.grado}
                </Badge>
                <span className="text-sm text-muted-foreground">· {curso.turno}</span>
                <span className="ml-auto text-sm text-muted-foreground">
                  {items.length} {items.length === 1 ? 'material' : 'materiales'}
                </span>
              </div>

              {items.length === 0 ? (
                <p className="rounded-xl border border-dashed border-border bg-card/40 p-4 text-sm text-muted-foreground">
                  Sin material en este curso todavía.
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {items.map((m) => (
                    <MaterialCard
                      key={m.id}
                      material={m}
                      contactos={contactos}
                      onVer={() => setVerMaterial(m)}
                      onCompartir={() => setCompartir(m)}
                      onEliminar={() => onEliminar(m)}
                    />
                  ))}
                </div>
              )}
            </section>
          )
        })}
      </div>

      {/* Modal ver material */}
      {verMaterial && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          <div className="flex items-center justify-between border-b border-border px-4 py-3 no-print">
            <div className="min-w-0">
              <p className="truncate font-display font-semibold text-foreground">{verMaterial.titulo}</p>
              <p className="text-xs text-muted-foreground">Creado el {formatFecha(verMaterial.creadoEn)}</p>
            </div>
            <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => setVerMaterial(null)}>
              <X className="size-4" />
              Cerrar
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="mx-auto max-w-4xl">
              <ResultadoView
                secuencia={verMaterial.secuencia}
                onUpdate={(s) => {
                  if (!user) return
                  updateMaterial(user.email, verMaterial.id, { secuencia: s })
                  setVerMaterial({ ...verMaterial, secuencia: s })
                  recargar(user.email)
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal compartir */}
      {compartir && (
        <CompartirDialog
          material={compartir}
          contactos={contactos}
          onClose={() => setCompartir(null)}
          onSave={onGuardarCompartir}
        />
      )}
    </div>
  )
}

function StatCard({ icon: Icon, label, valor }: { icon: React.ElementType; label: string; valor: number }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
      <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="font-display text-xl font-bold text-foreground">{valor}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

function MaterialCard({
  material,
  contactos,
  onVer,
  onCompartir,
  onEliminar,
}: {
  material: Material
  contactos: Contacto[]
  onVer: () => void
  onCompartir: () => void
  onEliminar: () => void
}) {
  const compartidos = contactos.filter((c) => material.compartidoCon.includes(c.id))

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <Badge variant="secondary">{material.area}</Badge>
        <Badge variant="secondary">{material.tipoRecurso}</Badge>
      </div>
      <h3 className="mt-3 font-display text-base font-semibold text-card-foreground text-pretty">{material.titulo}</h3>
      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="size-3.5" />
        {formatFecha(material.creadoEn)}
      </p>

      {compartidos.length > 0 && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-primary">
          <Share2 className="size-3.5" />
          Compartido con {compartidos.length} {compartidos.length === 1 ? 'contacto' : 'contactos'}
        </p>
      )}

      <div className="mt-4 flex items-center gap-1.5 border-t border-border pt-3">
        <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={onVer}>
          <Eye className="size-4" />
          Ver
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={onCompartir}>
          <Share2 className="size-4" />
          <span className="hidden sm:inline">Compartir</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-9 shrink-0 text-muted-foreground hover:text-destructive"
          onClick={onEliminar}
          aria-label="Eliminar material"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  )
}
