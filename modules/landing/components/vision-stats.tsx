const stats = [
  { value: '50', label: 'states', sub: 'The national standard within 10 years' },
  { value: '4–5', label: 'states / year', sub: 'Onboarded onto the platform annually' },
  { value: '60–90', label: 'days', sub: 'From kickoff to live state registry' },
  { value: '100%', label: 'data ownership', sub: 'Belongs to DLA & states — never siloed' },
]

export function VisionStats() {
  return (
    <section className="bg-brand-blue text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            One registry. Every state. A decade-long mission.
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-[#d6e2f3]">
            The NDLR isn&apos;t just software — it&apos;s the infrastructure for a unified national
            donor system. The Administration Portal is built to make migrating your state&apos;s
            official registry a clear, confident decision.
          </p>
        </div>

        <dl className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-start border-l-[3px] border-brand-green/85 pl-[22px]">
              <dt className="flex items-baseline gap-1.5">
                <span className="font-heading text-4xl font-semibold tracking-tight">
                  {s.value}
                </span>
                <span className="text-sm font-medium text-white/90">{s.label}</span>
              </dt>
              <dd className="mt-2.5 max-w-[300px] text-sm leading-relaxed text-[#d6e2f3]">{s.sub}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
