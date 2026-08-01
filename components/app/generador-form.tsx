'use client'

import { Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AREAS,
  GRADOS,
  TIPOS_RECURSO,
  NIVELES_APRENDIZAJE,
  TIPOS_INSTITUCION,
  TEMAS_LOCALES,
  CANTIDADES,
  DURACIONES,
  getArea,
} from '@/lib/curriculum'
import type { FormularioGeneracion } from '@/lib/types'

type Props = {
  form: FormularioGeneracion
  onChange: (patch: Partial<FormularioGeneracion>) => void
  onSubmit: () => void
  loading: boolean
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-medium text-foreground">{label}</Label>
      {children}
    </div>
  )
}

export function GeneradorForm({ form, onChange, onSubmit, loading }: Props) {
  const area = getArea(form.areaId)
  const contenidos = area?.contenidos ?? []

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
      className="flex flex-col gap-6"
    >
      <section className="flex flex-col gap-4">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-primary">
          1 · Contenido curricular
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Grado">
            <Select value={form.grado} onValueChange={(v) => onChange({ grado: v ?? '' })}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccioná el grado" />
              </SelectTrigger>
              <SelectContent>
                {GRADOS.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Área">
            <Select
              value={form.areaId}
              onValueChange={(v) => onChange({ areaId: v ?? '', contenido: '' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccioná el área" />
              </SelectTrigger>
              <SelectContent>
                {AREAS.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field label="Contenido del Diseño Curricular (Santa Fe)">
          <Select
            value={form.contenido}
            onValueChange={(v) => onChange({ contenido: v ?? '' })}
            disabled={!form.areaId}
          >
            <SelectTrigger>
              <SelectValue placeholder={form.areaId ? 'Elegí un contenido' : 'Primero elegí un área'} />
            </SelectTrigger>
            <SelectContent>
              {contenidos.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-primary">
          2 · Contexto y localización
        </h3>
        <Field label="Tema local / de actualidad (opcional)">
          <Select value={form.temaLocal} onValueChange={(v) => onChange({ temaLocal: v ?? '' })}>
            <SelectTrigger>
              <SelectValue placeholder="Vincular con un tema de Rosario / Santa Fe" />
            </SelectTrigger>
            <SelectContent>
              {TEMAS_LOCALES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nivel de aprendizaje del grupo">
            <Select value={form.nivel} onValueChange={(v) => onChange({ nivel: v ?? '' })}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccioná" />
              </SelectTrigger>
              <SelectContent>
                {NIVELES_APRENDIZAJE.map((n) => (
                  <SelectItem key={n} value={n}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Tipo de institución">
            <Select value={form.tipoInstitucion} onValueChange={(v) => onChange({ tipoInstitucion: v ?? '' })}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccioná" />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_INSTITUCION.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field label="Integración interdisciplinaria (opcional)">
          <Select
            value={form.integracion || 'ninguna'}
            onValueChange={(v) => onChange({ integracion: !v || v === 'ninguna' ? '' : v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sin integración" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ninguna">Sin integración</SelectItem>
              {AREAS.filter((a) => a.id !== form.areaId).map((a) => (
                <SelectItem key={a.id} value={a.nombre}>
                  {a.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-primary">
          3 · Formato del recurso
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Tipo de recurso">
            <Select value={form.tipoRecurso} onValueChange={(v) => onChange({ tipoRecurso: v ?? '' })}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_RECURSO.map((t) => (
                  <SelectItem key={t.id} value={t.nombre}>
                    {t.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Cantidad de actividades">
            <Select value={form.cantidad} onValueChange={(v) => onChange({ cantidad: v ?? '' })}>
              <SelectTrigger>
                <SelectValue placeholder="Cantidad" />
              </SelectTrigger>
              <SelectContent>
                {CANTIDADES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Duración disponible">
            <Select value={form.duracion} onValueChange={(v) => onChange({ duracion: v ?? '' })}>
              <SelectTrigger>
                <SelectValue placeholder="Duración" />
              </SelectTrigger>
              <SelectContent>
                {DURACIONES.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field label="Notas adicionales para el docente (opcional)">
          <Textarea
            value={form.notasDocente}
            onChange={(e) => onChange({ notasDocente: e.target.value })}
            placeholder="Ej: el grupo trabaja mucho de forma colaborativa; evitar tareas para el hogar."
            rows={3}
          />
        </Field>
      </section>

      <Button type="submit" size="lg" className="gap-2" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Generando recurso...
          </>
        ) : (
          <>
            <Sparkles className="size-4" />
            Generar recurso
          </>
        )}
      </Button>
    </form>
  )
}
