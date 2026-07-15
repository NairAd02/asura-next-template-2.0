const orgs = Array.from({ length: 60 }, (_, i) => `Org ${i + 1}`)

const live = new Set(orgs.slice(0, 22))
const onboarding = new Set(orgs.slice(22, 34))

function tileClass(name: string) {
  if (live.has(name)) return 'bg-primary text-primary-foreground border-primary'
  if (onboarding.has(name))
    return 'bg-brand-green/25 text-brand-green-dark border-brand-green/40'
  return 'bg-card text-muted-foreground border-border'
}

export function AdoptionMap() {
  return (
    <section className="bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-green-dark">
              Rollout at scale
            </span>
            <h2 className="mt-3 text-balance font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Built to scale from a handful of teams to hundreds
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
              Each organization operates inside its own tenant — separate items, categories, and users —
              on shared, horizontally scalable infrastructure. As more teams join, the network value
              compounds for everyone.
            </p>

            <ul className="mt-8 space-y-3">
              <li className="flex items-center gap-3 text-sm text-foreground">
                <span className="size-4 rounded border border-primary bg-primary" />
                Live on Core Admin — active tenant
              </li>
              <li className="flex items-center gap-3 text-sm text-foreground">
                <span className="size-4 rounded border border-brand-green/40 bg-brand-green/25" />
                Onboarding now — 60–90 day implementation
              </li>
              <li className="flex items-center gap-3 text-sm text-foreground">
                <span className="size-4 rounded border border-border bg-card" />
                Open for upcoming onboarding cohorts
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
            <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
              {orgs.map((name, i) => (
                <div
                  key={name}
                  className={`flex aspect-square items-center justify-center rounded-md border text-[9px] font-semibold sm:text-[11px] ${tileClass(
                    name,
                  )}`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <p className="mt-5 text-center text-xs text-muted-foreground">
              Illustrative rollout · growing network
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
