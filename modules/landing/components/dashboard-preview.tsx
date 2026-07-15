import {
  LayoutDashboard,
  Boxes,
  Users,
  FileBarChart,
  Map,
  Settings,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react'

const bars = [42, 55, 48, 63, 71, 66, 82, 78, 91, 86, 97, 100]
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const navIcons = [
  { icon: LayoutDashboard, label: 'Overview', active: true },
  { icon: Boxes, label: 'Items', active: false },
  { icon: FileBarChart, label: 'Reports', active: false },
  { icon: Map, label: 'Analytics', active: false },
  { icon: Users, label: 'Users & roles', active: false },
  { icon: Settings, label: 'Settings', active: false },
]

const sources = [
  { label: 'Integrations', value: 46, color: 'var(--brand-blue)' },
  { label: 'Website', value: 24, color: 'var(--brand-green)' },
  { label: 'Categories', value: 18, color: 'var(--brand-blue-light)' },
  { label: 'Partners', value: 12, color: 'var(--brand-green-dark)' },
]

export function DashboardPreview() {
  return (
    <div className="mx-auto max-w-6xl rounded-2xl border border-border bg-card p-2 shadow-2xl shadow-primary/10 ring-1 ring-black/5">
      <div className="overflow-hidden rounded-xl border border-border bg-background">
        {/* top bar */}
        <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-destructive/40" />
            <span className="size-2.5 rounded-full bg-accent/60" />
            <span className="size-2.5 rounded-full bg-brand-green-dark/40" />
          </div>
          <div className="hidden items-center gap-2 rounded-md border border-border bg-card px-3 py-1 text-[11px] text-muted-foreground sm:flex">
            app.coreadmin.io / overview
          </div>
          <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
            <span className="rounded-full bg-secondary px-2 py-0.5">Acme Corp</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr]">
          {/* sidebar */}
          <aside className="hidden flex-col gap-1 border-r border-border bg-sidebar p-3 md:flex">
            {navIcons.map(({ icon: Icon, label, active }) => (
              <div
                key={label}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium ${
                  active
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground'
                }`}
              >
                <Icon className="size-4" />
                {label}
              </div>
            ))}
          </aside>

          {/* main */}
          <div className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-sm font-semibold text-foreground">
                  Registration overview
                </h3>
                <p className="text-[11px] text-muted-foreground">Last 12 months · live</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-green/20 px-2 py-1 text-[11px] font-semibold text-brand-green-dark">
                <TrendingUp className="size-3" />
                +18.4%
              </span>
            </div>

            {/* KPI cards */}
            <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                { label: 'Total records', value: '4.92M' },
                { label: 'New this month', value: '38,204' },
                { label: 'Active items', value: '27' },
                { label: 'Sync rate', value: '99.8%' },
              ].map((kpi) => (
                <div key={kpi.label} className="rounded-lg border border-border bg-card p-3">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    {kpi.label}
                  </p>
                  <p className="mt-1 font-heading text-lg font-semibold text-foreground">
                    {kpi.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
              {/* chart */}
              <div className="rounded-lg border border-border bg-card p-4 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-foreground">Registrations by month</p>
                  <span className="text-[11px] text-muted-foreground">Source: all channels</span>
                </div>
                <div className="mt-4 flex h-32 items-end gap-1.5">
                  {bars.map((h, i) => (
                    <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                      <div className="flex w-full flex-1 items-end">
                        <div
                          className="w-full rounded-t-sm bg-primary/85"
                          style={{ height: `${h}%` }}
                        />
                      </div>
                      <span className="text-[8px] text-muted-foreground">{months[i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* source breakdown */}
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-xs font-medium text-foreground">Source attribution</p>
                <div className="mt-4 space-y-3">
                  {sources.map((s) => (
                    <div key={s.label}>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">{s.label}</span>
                        <span className="font-semibold text-foreground">{s.value}%</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full rounded-full bg-secondary">
                        <div
                          className="h-1.5 rounded-full"
                          style={{ width: `${s.value}%`, backgroundColor: s.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-1 rounded-md bg-secondary/60 px-2 py-1.5 text-[11px] text-muted-foreground">
                  <ArrowUpRight className="size-3 text-brand-green-dark" />
                  Drill down by category &amp; status
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
