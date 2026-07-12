import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { DashBoardLayoutAppSidebar } from '@/components/app-sidebar/dashboard-layout-app-sidebar'
import { MobileHeader, DesktopHeader } from '@/components/app-sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <SidebarProvider defaultOpen={true}>
          <DashBoardLayoutAppSidebar />
          <SidebarInset className="flex flex-col w-full overflow-y-auto h-svh">
            <MobileHeader />
            <DesktopHeader />
            <main className="flex-1 p-4 md:p-6">{children}</main>
          </SidebarInset>
          <Toaster />
        </SidebarProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}
