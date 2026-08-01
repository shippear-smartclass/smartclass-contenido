import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const code = params?.error
  const isErrorCode = typeof code === 'string' && /^[a-z0-9_]{1,64}$/.test(code)

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-secondary/30 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-2xl">
              Ocurrió un problema
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isErrorCode ? (
              <p className="text-sm text-muted-foreground">
                Código de error: {code}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Ocurrió un error no especificado. Volvé a intentar.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
