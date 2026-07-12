import {
  Megaphone,
  BarChart3,
  MapPinned,
  ShieldCheck,
  Download,
  History,
  Users,
  Plug,
} from 'lucide-react'

const modules = [
  {
    icon: Megaphone,
    title: 'Campaign CMS',
    body: 'Launch custom registration pages with unique slugs, templates, and per-campaign metrics. State-created campaigns flow through a built-in DLA approval workflow.',
  },
  {
    icon: BarChart3,
    title: 'Reporting & analytics',
    body: 'Build dynamic and ad-hoc reports across date, demographics, and source. Save configurations, schedule delivery, and drill from state to campaign to record.',
  },
  {
    icon: MapPinned,
    title: 'Geospatial heat maps',
    body: 'Visualize registrations by state and ZIP code. Spot coverage gaps, target recruitment, and measure campaign lift on an interactive map.',
  },
  {
    icon: Users,
    title: 'Users, roles & permissions',
    body: 'Granular RBAC with jurisdiction scoping. Super Admin, National, State/Org Admin, Reporting, Search, and Viewer — additive from zero with mandatory MFA.',
  },
  {
    icon: ShieldCheck,
    title: 'Identity & deduplication',
    body: 'Configurable matching rules guarantee one citizen, one profile — across DMV, web, and partner channels — with the full change history preserved.',
  },
  {
    icon: History,
    title: 'Immutable audit trail',
    body: 'Every login, export, and record change is logged permanently. Nobody — not even a Super Admin — can alter history. Built for legal accountability.',
  },
  {
    icon: Download,
    title: 'Data export & BI',
    body: 'Export to CSV, Excel, and PDF, schedule automated email delivery, and connect Power BI, Tableau, or Looker. Your data is never locked in.',
  },
  {
    icon: Plug,
    title: 'Partner integrations',
    body: 'Real-time and batch sync with Apple, Epic MyChart, Walgreens, and state DMVs through the centralized API — with automatic source attribution.',
  },
]

export function Modules() {
  return (
    <section id="platform" className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-green-dark">
            The platform
          </span>
          <h2 className="mt-3 text-balance font-heading text-3xl font-semibold tracking-tight text-brand-dark sm:text-4xl">
            Everything a state program needs in one portal
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-brand-mid">
            Campaign management, analytics, and administration unified behind a single secure
            login — with state-level data isolation by default.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-brand-border bg-brand-border sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((m) => (
            <div
              key={m.title}
              className="group bg-card p-6 transition-colors hover:bg-brand-cream/50"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-brand-subtle text-brand-green transition-transform group-hover:-translate-y-0.5">
                <m.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-heading text-base font-semibold text-brand-dark">
                {m.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted">{m.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
