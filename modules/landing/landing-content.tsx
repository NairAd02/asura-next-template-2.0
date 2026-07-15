import { AdoptionMap } from "./components/adoption-map";
import { CTA } from "./components/cta";
import { DashboardPreview } from "./components/dashboard-preview";
import { Hero } from "./components/hero";
import { Modules } from "./components/modules";
import { OnboardingTimeline } from "./components/onboarding-timeline";
import { Security } from "./components/security";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { TrustBar } from "./components/trust-bar";
import { VisionStats } from "./components/vision-stats";
import { WhyStates } from "./components/why-states";



export default function LandingContent() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SiteHeader />
            <main className="flex-1">
                <Hero />
                <TrustBar />
                <Modules />
                <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="mx-auto mb-8 max-w-2xl text-center">
                        <h2 className="text-balance font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                            One command center for the whole program
                        </h2>
                        <p className="mt-3 text-pretty text-muted-foreground">
                            Real-time item metrics, category trends, and source-of-truth reporting — ready for
                            your team on day one.
                        </p>
                    </div>
                    <DashboardPreview />
                </section>
                <AdoptionMap />
                <VisionStats />
                <WhyStates />
                <OnboardingTimeline />
                <Security />
                <CTA />
            </main>
            <SiteFooter />
        </div>
    )
}
