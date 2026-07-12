'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { User, LogOutIcon, Menu } from 'lucide-react'
import { toast } from 'sonner'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageToggle } from '@/components/language-toggle'
import { paths } from '@/routes/paths'

const MOCK_USER = {
  fullName: 'Template Admin',
  email: 'admin@template.dev',
}

function UserMenu() {
  const t = useTranslations('user')

  const handleSignOut = () => {
    toast.info('Demo mode — authentication is not wired yet.')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline max-w-[120px] truncate">
            {MOCK_USER.fullName}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem disabled className="text-xs text-muted-foreground">
          {MOCK_USER.email}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOutIcon className="mr-2 h-4 w-4" />
          <span>{t('signOut')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function DesktopHeader() {
  return (
    <header className="sticky top-0 z-30 hidden h-16 items-center justify-between gap-2 border-b bg-background py-2.5 px-4 md:flex">
      <SidebarTrigger>
        <Menu className="h-5 w-5" />
      </SidebarTrigger>
      <div className="flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  )
}

export function MobileHeader() {
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations('app')

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background py-2.5 px-4 md:hidden">
      <SidebarTrigger>
        <Menu className="h-5 w-5" />
      </SidebarTrigger>
      <Link href={`/${locale}${paths.dashboard.root}`} className="flex items-center gap-2.5">
        <span className="font-semibold text-lg tracking-tight">
          {t('name')}
        </span>
      </Link>
      <div className="ml-auto flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  )
}
