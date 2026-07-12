'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from './logo'
import NavigationComponent from '@/components/navigation-component/navigation-component'
import { paths } from '@/routes/paths'

const navItems = [
  { label: 'Platform', href: '#platform' },
  { label: 'For Teams', href: '#why-states' },
  { label: 'Onboarding', href: '#onboarding' },
  { label: 'Security', href: '#security' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
         <div className='pt-4'> <Logo /></div>
        

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {navItems.map((item) => (
            <NavigationComponent
              key={item.label}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {item.label}
            </NavigationComponent>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <NavigationComponent href="#login">
            <Button variant="ghost" size="lg">Admin sign in</Button>
          </NavigationComponent>
          <NavigationComponent href={paths.dashboard.root}>
            <Button size="lg">Request a demo</Button>
          </NavigationComponent>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex size-10 items-center justify-center rounded-lg border border-border text-foreground md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4" aria-label="Mobile">
            {navItems.map((item) => (
              <NavigationComponent
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
              >
                {item.label}
              </NavigationComponent>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <NavigationComponent href="#login">
                <Button variant="outline" size="lg">Admin sign in</Button>
              </NavigationComponent>
              <NavigationComponent href="#demo">
                <Button size="lg">Request a demo</Button>
              </NavigationComponent>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
