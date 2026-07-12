import Link from 'next/link'

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="Core Admin">
      <span className="flex size-8 items-center justify-center rounded-lg bg-brand-green text-sm font-bold text-brand-dark">
        CA
      </span>
      <span className="font-heading text-lg font-semibold tracking-tight text-brand-dark">
        Core Admin
      </span>
    </Link>
  )
}
