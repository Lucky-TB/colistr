import type { Metadata } from "next"
import AboutHero from "@/components/about/about-hero"
import AboutMission from "@/components/about/about-mission"
import AboutHowItWorks from "@/components/about/about-how-it-works"
import AboutBenefits from "@/components/about/about-benefits"
import AboutTeam from "@/components/about/about-team"
import AboutStats from "@/components/about/about-stats"
import AboutTestimonials from "@/components/about/about-testimonials"
import AboutTimeline from "@/components/about/about-timeline"
import AboutTrust from "@/components/about/about-trust"
import AboutFAQ from "@/components/about/about-faq"
import AboutContact from "@/components/about/about-contact"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "About CoListr | Real Estate Co-Investment Platform",
  description:
    "Learn about CoListr's mission to connect real estate professionals for successful co-investment opportunities. Discover how our platform works and the benefits of joining our community.",
  keywords: "real estate co-investment, about CoListr, real estate platform, property investment partners",
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <AboutHero />
        <AboutMission />
        <AboutHowItWorks />
        <AboutBenefits />
        <AboutStats />
        <AboutTeam />
        <AboutTestimonials />
        <AboutTimeline />
        <AboutTrust />
        <AboutFAQ />
        <AboutContact />
      </main>
      <Footer />
    </>
  )
}

