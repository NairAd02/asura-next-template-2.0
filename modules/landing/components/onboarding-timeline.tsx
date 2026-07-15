const phases = [
  {
    window: 'Days 1–15',
    title: 'Discovery & data mapping',
    body: 'Kickoff with your team, map existing records, define tenant scope, roles, and matching rules.',
  },
  {
    window: 'Days 15–45',
    title: 'Migration & configuration',
    body: 'Securely migrate records with full audit history intact, configure categories, branding, and integrations.',
  },
  {
    window: 'Days 45–75',
    title: 'Validation & training',
    body: 'Parallel testing, deduplication review, admin training, and role-based access provisioning with MFA.',
  },
  {
    window: 'Days 75–90',
    title: 'Go live',
    body: 'Cut over to Core Admin as your system of record with 24/7 support, monitoring, and a dedicated success contact.',
  },
]

export function OnboardingTimeline() {
  return (
    <section id="onboarding" className="bg-brand-subtle/60">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-green-dark">
            Onboarding
          </span>
          <h2 className="mt-3 text-balance font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            From kickoff to live rollout in 60–90 days
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
            A proven, low-risk migration path that preserves your historical data and keeps your
            program running every step of the way.
          </p>
        </div>

        <ol className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {phases.map((p, i) => (
            <li key={p.title} className="relative rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary font-heading text-sm font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="text-xs font-semibold text-brand-green-dark">{p.window}</span>
              </div>
              <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
