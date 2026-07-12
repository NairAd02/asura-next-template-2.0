import Image from 'next/image'
import Link from 'next/link'

export function Logo() {
  return (
    <Link href="/" className="flex items-center" aria-label={"donate-life-america.svg"}>
      <Image
        src={"/donate-life-america.svg"}
        alt={"donate-life-america.svg"}
        width={180}
        height={64}
        priority
        className="h-12! w-auto md:h-16!"
        style={{ width: 'auto', height: 'auto' }}
      />
    </Link>
  )
}
