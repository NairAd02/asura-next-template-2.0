import Link from 'next/link'
import { Package, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const t = await getTranslations('error403')
  const tApp = await getTranslations('app')
  return {
    title: `${t('title')} | ${tApp('name')}`,
    description: t('description'),
  }
}

export default async function Error403Page() {
  const t = await getTranslations('error403')

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="p-4">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Package className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
          </div>
          <span className="text-xl font-bold text-foreground">App Name</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <ShieldAlert className="h-8 w-8 text-destructive" aria-hidden="true" />
            </div>
            <CardTitle className="text-2xl">{t('title')}</CardTitle>
            <CardDescription>
              {t('description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t('message')}
            </p>
          </CardContent>
          <CardFooter className="justify-center gap-3 flex-col">
            <Button asChild className="w-full">
              <Link href="/">{t('goHome')}</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
