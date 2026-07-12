const partners = ['Apple Health', 'Epic MyChart', 'Walgreens', 'State DMVs', 'Power BI', 'Tableau']

export function TrustBar() {
  return (
    <section className="border-y border-brand-border bg-brand-cream/50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-brand-green-dark">
          Connected to the channels donors already use
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-12">
          {partners.map((p) => (
            <span
              key={p}
              className="font-heading text-base font-semibold tracking-tight text-brand-mid"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
