import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Hero } from '@/components/landing/hero'
import { Problema } from '@/components/landing/problema'
import { ComoFunciona } from '@/components/landing/como-funciona'
import { Diferenciales } from '@/components/landing/diferenciales'
import { Planes } from '@/components/landing/planes'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Problema />
        <ComoFunciona />
        <Diferenciales />
        <Planes />
      </main>
      <SiteFooter />
    </div>
  )
}
