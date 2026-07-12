import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import NavigationComponent from '@/components/navigation-component/navigation-component'

export function CTA() {
  return (
    <section id="demo" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-24">
        <div className="grid grid-cols-1 items-center gap-8 rounded-[24px] bg-brand-blue-light p-8 sm:p-12 md:grid-cols-[1.5fr_1fr] md:gap-10 md:p-[54px] md:px-14">
          <div>
            <h2 className="text-balance font-heading text-3xl font-semibold tracking-tight text-brand-dark sm:text-4xl">
              See what Core Admin could do for your team
            </h2>
            <p className="mt-4 max-w-[520px] text-base leading-relaxed text-[#1d2a38] sm:text-[17px]">
              Book a guided walkthrough of the Administration Portal with our team. We&apos;ll map a
              migration plan tailored to your data, partners, and timeline.
            </p>
          </div>
          <div className="flex flex-col gap-3.5">
            <NavigationComponent href="#contact">
              <Button
                size="lg"
                className="h-11 rounded-full bg-brand-dark px-4 py-4 text-base font-bold text-white transition-opacity hover:opacity-90"
              >
                Request a demo
                <ArrowRight className="size-4" />
              </Button>
            </NavigationComponent>
            <NavigationComponent href="#contact">
              <Button
                variant="outline"
                size="lg"
                className="h-11 rounded-full border-[1.5px] border-brand-dark px-4 py-[15px] text-base font-bold text-brand-dark transition-colors hover:bg-brand-dark hover:text-white"
              >
                Talk to the team
              </Button>
            </NavigationComponent>
          </div>
        </div>
      </div>
    </section>
  )
}
