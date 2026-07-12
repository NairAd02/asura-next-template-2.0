import { AuthHashHandler } from "@/components/auth-hash-handler";
import LandingContent from "@/modules/landing/landing-content";


export default function LadingPage() {
  return (
    <>
      <AuthHashHandler />
      <LandingContent />
    </>
  )
}
