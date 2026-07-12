import { NextResponse, type NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params
  const { origin } = request.nextUrl
  return NextResponse.redirect(`${origin}/${locale}/dashboard`)
}
