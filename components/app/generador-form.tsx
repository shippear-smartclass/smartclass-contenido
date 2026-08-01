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
  EJES_TRANSVERSALES,
  getAreas,
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

function ChipGroup({
  options,
  selected,
  onToggle,
}: {
  options: { value: string; label: string }[]
  selected: string[]
  onToggle: (value: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = selected.includes(o.value)
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(o.value)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              active
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground'
            }`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

export function GeneradorForm({ form, onChange, onSubmit, loading }: Props) {
  const areaIds = form.areaIds ?? []
  const contenidosSel = form.contenidos ?? []
  const ejesSel = form.ejesTransversales ?? []

  const areasSeleccionadas = getAreas(areaIds)
  // Contenidos disponibles agrupados por cada área elegida, para poder
  // integrar contenidos de más de un área.
  const gruposContenidos = areasSeleccionadas.map((a) => ({
    area: a.nombre,
    contenidos: a.contenidos,
  }))

  function toggleArea(id: string) {
    const next = areaIds.includes(id) ? areaIds.filter((x) => x !== id) : [...areaIds, id]
    // Filtramos los contenidos elegidos que ya no pertenezcan a ningún área seleccionada.
    const disponibles = getAreas(next).flatMap((a) => a.contenidos)
    const contenidos = contenidosSel.filter((c) => disponibles.includes(c))
    onChange({ areaIds: next, contenidos })
  }

  function toggleContenido(contenido: string) {
    const next = contenidosSel.includes(contenido)
      ? contenidosSel.filter((x) => x !== contenido)
      : [...contenidosSel, contenido]
    onChange({ contenidos: next })
  }

  function toggleEje(eje: string) {
    const next = ejesSel.includes(eje) ? ejesSel.filter((x) => x !== eje) : [...ejesSel, eje]
    onChange({ ejesTransversales: next })
  }

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

          <Field label="Áreas (podés elegir más de una para integrar contenidos)">
            <ChipGroup
              options={AREAS.map((a) => ({ value: a.id, label: a.nombre }))}
              selected={areaIds}
              onToggle={toggleArea}
            />
          </Field>
        </div>

        <Field label="Contenidos del Diseño Curricular (Santa Fe) — podés elegir varios">
          {areaIds.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border bg-muted/30 p-3 text-xs text-muted-foreground">
              Primero elegí al menos un área para ver sus contenidos.
            </p>
          ) : (
            <div className="flex flex-col gap-4 rounded-lg border border-border bg-muted/20 p-3">
              {gruposContenidos.map((g) => (
                <div key={g.area} className="flex flex-col gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {g.area}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {g.contenidos.map((c) => {
                      const active = contenidosSel.includes(c)
                      return (
                        <button
                          key={`${g.area}-${c}`}
                          type="button"
                          aria-pressed={active}
                          onClick={() => toggleContenido(c)}
                          className={`rounded-full border px-3 py-1.5 text-left text-xs font-medium transition-colors ${
                            active
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground'
                          }`}
                        >
                          {c}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Field>

        <Field label="Otros contenidos (opcional) — escribí los que quieras agregar">
          <Textarea
            value={form.contenidosExtra}
            onChange={(e) => onChange({ contenidosExtra: e.target.value })}
            placeholder="Ej: fracciones equivalentes, lectura de textos instructivos, cuidado del agua..."
            rows={3}
          />
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

        <Field label="Ejes transversales del Diseño Curricular de Santa Fe (opcional)">
          <ChipGroup
            options={EJES_TRANSVERSALES.map((e) => ({ value: e, label: e }))}
            selected={ejesSel}
            onToggle={toggleEje}
          />
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
