import { Logo } from './logo'

const columns = [
  {
    title: 'Platform',
    links: ['Catalog management', 'Reporting & analytics', 'Dashboards', 'API & integrations'],
  },
  {
    title: 'For teams',
    links: ['Why switch', 'Onboarding', 'Security & compliance', 'Pricing'],
  },
  {
    title: 'Resources',
    links: ['Documentation', 'Status', 'Support', 'Contact'],
  },
]

export function SiteFooter() {
  return (
    <footer>
      <div
        className="relative overflow-hidden"
        style={{
          background:
            'linear-gradient(160deg, #EEF6E4 0%, #E4EEF8 50%, #DAE8F5 100%)',
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-5">
            <div className="col-span-2 lg:col-span-2">
              <Logo />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-mid">
                Core Admin — the secure, multi-tenant admin platform for managing your catalog,
                users, and analytics.
              </p>
            </div>

            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-semibold text-brand-blue">{col.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-brand-mid transition-colors hover:text-brand-dark"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-brand-dark">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-6 sm:px-8">
          <p className="text-xs text-[#7e8a7e]">
            © {new Date().getFullYear()} Core Admin. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-[#9fab9f]">
            <a href="#" className="underline underline-offset-2 hover:text-white">
              Privacy
            </a>
            <a href="#" className="underline underline-offset-2 hover:text-white">
              Terms
            </a>
            <a href="#" className="underline underline-offset-2 hover:text-white">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
