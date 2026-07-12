import { Building2, HeartHandshake, IdCard, Check } from 'lucide-react'

const audiences = [
  {
    icon: Building2,
    role: 'Operations & IT leads',
    points: [
      'Own your data and your tenant — fully isolated, fully exportable',
      'Real-time visibility into activity, categories, and campaign ROI',
      'Replace aging vendor systems without a multi-year rebuild',
    ],
  },
  {
    icon: HeartHandshake,
    role: 'Team & department managers',
    points: [
      'Cross-team record lookup for authorized coordinators, fully logged',
      'De-identified analytics for staff who need trends, not PII',
      'Confidence in legal accountability with an immutable audit trail',
    ],
  },
  {
    icon: IdCard,
    role: 'Integration partners',
    points: [
      'Real-time and batch sync through a documented, versioned API',
      'Automatic source attribution on every record',
      'Deduplication that guarantees one record, one profile',
    ],
  },
]

export function WhyStates() {
  return (
    <section id="why-states" className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-green-dark">
            For decision makers
          </span>
          <h2 className="mt-3 text-balance font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Compelling reasons to make Core Admin your system of record
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
            The portal is designed around the people who decide — and the outcomes they&apos;re
            accountable for.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {audiences.map((a) => (
            <div
              key={a.role}
              className="flex flex-col rounded-2xl border border-border bg-card p-7 shadow-sm"
            >
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <a.icon className="size-6" />
              </span>
              <h3 className="mt-5 font-heading text-lg font-semibold text-foreground">{a.role}</h3>
              <ul className="mt-4 space-y-3">
                {a.points.map((p) => (
                  <li key={p} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand-green-dark" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
