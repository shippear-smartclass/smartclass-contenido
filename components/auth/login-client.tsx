'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { GraduationCap, Loader2, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/components/auth/auth-provider'

type Modo = 'login' | 'registro'

export function LoginClient() {
  const { signIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/app'

  const [modo, setModo] = useState<Modo>('login')
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password.trim()) {
      setError('Completá tu email y contraseña.')
      return
    }
    if (modo === 'registro' && !nombre.trim()) {
      setError('Ingresá tu nombre para crear la cuenta.')
      return
    }

    setLoading(true)
    // Auth simulada para la demo.
    signIn(email.trim(), password, modo === 'registro' ? nombre : undefined)
    router.replace(next)
  }

  return (
    <div className="flex min-h-screen flex-col bg-secondary/30">
      <header className="w-full border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-4">
          <Link href="/" className="flex items-center gap-2.5">
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
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-1 text-center">
            <h1 className="font-display text-xl font-bold tracking-tight text-foreground">
              {modo === 'login' ? 'Ingresá a tu cuenta' : 'Creá tu cuenta'}
            </h1>
            <p className="text-sm text-muted-foreground text-pretty">
              {modo === 'login'
                ? 'Accedé a tus generadores de recursos didácticos.'
                : 'Registrate para empezar a generar recursos.'}
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
            {modo === 'registro' && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="María Docente"
                  autoComplete="name"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="docente@escuela.edu.ar"
                autoComplete="email"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={modo === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" disabled={loading} className="mt-1 gap-2">
              {loading && <Loader2 className="size-4 animate-spin" />}
              {modo === 'login' ? 'Ingresar' : 'Crear cuenta'}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {modo === 'login' ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}{' '}
            <button
              type="button"
              onClick={() => {
                setModo(modo === 'login' ? 'registro' : 'login')
                setError(null)
              }}
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              {modo === 'login' ? 'Registrate' : 'Ingresá'}
            </button>
          </p>

          <div className="mt-6 flex items-start gap-2 rounded-lg border border-border bg-secondary/50 p-3 text-xs text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0" />
            <span>
              Acceso de demostración: por ahora el ingreso es simulado. Usá cualquier email y
              contraseña para entrar.
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}
