import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { MailCheck } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-secondary/30 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <span className="mb-1 flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MailCheck className="size-6" />
            </span>
            <CardTitle className="font-display text-2xl">
              ¡Gracias por registrarte!
            </CardTitle>
            <CardDescription>Revisá tu correo para confirmar</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Te enviamos un enlace de confirmación. Confirmá tu cuenta desde el
              correo antes de ingresar a la plataforma.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
