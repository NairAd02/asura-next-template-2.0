import { ArrowRight, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NetworkMap } from './network-map'
import NavigationComponent from '@/components/navigation-component/navigation-component'
import { paths } from '@/routes/paths'

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #F4F8EC 0%, #EEF4FB 100%)' }}>
      {/* Decorative brand circles */}
      <svg
        viewBox="0 0 400 400"
        className="pointer-events-none absolute -right-24 -top-28 h-[360px] w-[360px] opacity-90 md:h-[560px] md:w-[560px]"
        aria-hidden="true"
      >
        <circle cx="170" cy="200" r="120" fill="none" stroke="#AFD369" strokeWidth="22" opacity=".55" />
        <circle cx="250" cy="200" r="120" fill="none" stroke="#89B7EE" strokeWidth="22" opacity=".5" />
      </svg>

      <div className="mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Columna izquierda: Contenido de texto */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E2E9D8] bg-white px-3.5 py-1.5 text-[13px] font-semibold text-brand-green-dark shadow-sm">
              <span className="size-[7px] rounded-full bg-brand-green" />
              Trusted by growing teams · Core Admin
            </span>

            <h1 className="mt-6 text-balance font-heading text-4xl font-semibold tracking-tight text-brand-dark sm:text-5xl lg:text-6xl">
              The admin portal your team was meant to run on
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-brand-mid sm:text-lg lg:mx-0">
              Core Admin is a secure, multi-tenant command center for your catalog, workflows, and
              real-time analytics — purpose-built for growing teams and integration partners.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <NavigationComponent href={paths.dashboard.root}>
                <Button
                  size="lg"
                  className="h-11 bg-brand-green px-5 text-sm font-bold text-brand-dark shadow-[0_4px_14px_rgba(74,122,31,0.22)] transition-colors hover:bg-brand-green-dark hover:text-white"
                >
                  Request a demo
                  <ArrowRight className="size-4" />
                </Button>
              </NavigationComponent>
              <NavigationComponent href="#onboarding">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-11 border-brand-blue px-5 text-sm font-semibold text-brand-blue"
                >
                  See how onboarding works
                </Button>
              </NavigationComponent>
            </div>

            <p className="mt-5 flex items-center justify-center gap-2 text-xs text-brand-muted lg:justify-start">
              <ShieldCheck className="size-4 text-brand-green-dark" />
              Secure by design · MFA enforced · Full audit trail
            </p>
          </div>

          {/* Columna derecha: NetworkMap */}
          <div className="mt-14 lg:mt-0">
            <NetworkMap />
          </div>
        </div>
      </div>
    </section>
  )
}
