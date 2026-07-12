import Link from 'next/link'
import { Package, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthErrorPage() {
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
              <AlertCircle className="h-8 w-8 text-destructive" aria-hidden="true" />
            </div>
            <CardTitle className="text-2xl">Authentication Error</CardTitle>
            <CardDescription>
              Something went wrong during authentication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The authentication link may have expired or is invalid. Please try signing in again.
            </p>
          </CardContent>
          <CardFooter className="justify-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/">Home</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/login">Try Again</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
