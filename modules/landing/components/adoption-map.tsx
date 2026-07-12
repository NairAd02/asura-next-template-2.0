const states = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
]

const live = new Set(['CA', 'TX', 'FL', 'NY', 'PA', 'OH', 'IL', 'GA'])
const onboarding = new Set(['NC', 'MI', 'WA', 'AZ', 'CO'])

function tileClass(code: string) {
  if (live.has(code)) return 'bg-primary text-primary-foreground border-primary'
  if (onboarding.has(code))
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
              National rollout
            </span>
            <h2 className="mt-3 text-balance font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Built to scale from a handful of states to all 50
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
              Each state operates inside its own jurisdiction — separate data, campaigns, and users —
              on shared, nationally scalable infrastructure. As more states join, the network value
              compounds for everyone.
            </p>

            <ul className="mt-8 space-y-3">
              <li className="flex items-center gap-3 text-sm text-foreground">
                <span className="size-4 rounded border border-primary bg-primary" />
                Live on the NDLR — official state registry
              </li>
              <li className="flex items-center gap-3 text-sm text-foreground">
                <span className="size-4 rounded border border-brand-green/40 bg-brand-green/25" />
                Onboarding now — 60–90 day implementation
              </li>
              <li className="flex items-center gap-3 text-sm text-foreground">
                <span className="size-4 rounded border border-border bg-card" />
                Open for 2026–2027 onboarding cohorts
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
            <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
              {states.map((code) => (
                <div
                  key={code}
                  className={`flex aspect-square items-center justify-center rounded-md border text-[9px] font-semibold sm:text-[11px] ${tileClass(
                    code,
                  )}`}
                >
                  {code}
                </div>
              ))}
            </div>
            <p className="mt-5 text-center text-xs text-muted-foreground">
              Illustrative national adoption · 50-state vision
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
