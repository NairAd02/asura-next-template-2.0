import { Lock, KeyRound, ScrollText, Languages, ServerCog, EyeOff } from 'lucide-react'

const items = [
  {
    icon: Lock,
    title: 'Encryption everywhere',
    body: 'Data encrypted in transit and at rest, aligned to HIPAA and NIST controls.',
  },
  {
    icon: KeyRound,
    title: 'MFA & RBAC',
    body: 'Mandatory multi-factor authentication and additive, scope-based permissions.',
  },
  {
    icon: ScrollText,
    title: 'Immutable audit logs',
    body: 'Every administrative action recorded permanently and never editable.',
  },
  {
    icon: EyeOff,
    title: 'PII protection',
    body: 'Reporting roles see only aggregated, de-identified data — drill-down blocked.',
  },
  {
    icon: ServerCog,
    title: 'High availability',
    body: 'Disaster recovery, automated backups, and 24/7 support with SLAs.',
  },
  {
    icon: Languages,
    title: 'Accessible & multilingual',
    body: 'ADA/WCAG compliant with native English and Spanish, extensible i18n.',
  },
]

export function Security() {
  return (
    <section id="security" className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-green-dark">
              Security &amp; compliance
            </span>
            <h2 className="mt-3 text-balance font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Trusted with your most sensitive data
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
              Your data is a legal responsibility. Core Admin is engineered so that teams and
              partners can meet their obligations with confidence — and prove it.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {items.map((it) => (
              <div key={it.title} className="rounded-2xl border border-border bg-card p-6">
                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-brand-subtle text-primary">
                  <it.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
                  {it.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{it.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
