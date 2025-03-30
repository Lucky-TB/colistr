"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Building2, Users, Handshake, DollarSign, Shield, Search } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { SectionHeading } from "@/components/ui/section-heading"
import { AnimatedCounter } from "@/components/ui/animated-counter"

// Animations
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="hero-gradient pt-32 pb-20 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Find Your Perfect Real Estate Co-Investment Partner
              </h1>
              <p className="text-xl text-gray-200 max-w-lg">
                CoListr connects real estate professionals to share investment opportunities and find compatible
                partners to split property investments and profits.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" asChild>
                  <Link href="/auth/signup">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <Image
                src="/placeholder.svg?height=600&width=600"
                alt="Real estate professionals collaborating"
                width={600}
                height={600}
                className="rounded-lg shadow-2xl"
                priority
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-primary">
                <AnimatedCounter value={5000} suffix="+" />
              </h3>
              <p className="text-muted-foreground">Verified Realtors</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-primary">
                <AnimatedCounter value={1200} suffix="+" />
              </h3>
              <p className="text-muted-foreground">Active Listings</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-primary">
                <AnimatedCounter value={850} suffix="+" />
              </h3>
              <p className="text-muted-foreground">Successful Matches</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-primary">
                <AnimatedCounter value={25} prefix="$" suffix="M+" />
              </h3>
              <p className="text-muted-foreground">Investment Value</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Why Choose CoListr"
            subtitle="Our platform offers unique features designed specifically for real estate professionals looking to collaborate on investments."
            centered
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <motion.div
              variants={fadeIn}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
            >
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Professional Network</h3>
              <p className="text-muted-foreground">
                Connect with verified real estate professionals who share your investment goals and vision.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
            >
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Property Opportunities</h3>
              <p className="text-muted-foreground">
                Browse and share exclusive property investment opportunities not available on the open market.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
            >
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Handshake className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
              <p className="text-muted-foreground">
                Our algorithm matches you with partners based on investment criteria, experience, and location.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
            >
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Investment Tracking</h3>
              <p className="text-muted-foreground">
                Track your co-investment opportunities and manage your portfolio all in one place.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
            >
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Profiles</h3>
              <p className="text-muted-foreground">
                All members are verified real estate professionals, ensuring trust and credibility.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
            >
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Filtering</h3>
              <p className="text-muted-foreground">
                Find exactly what you're looking for with our comprehensive search and filtering options.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="How CoListr Works"
            subtitle="Our platform makes it easy to find co-investment partners in just a few simple steps."
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="relative">
                <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-primary -z-10"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
              <p className="text-muted-foreground">
                Sign up and complete your professional profile with your investment preferences and experience.
              </p>
            </div>

            <div className="text-center">
              <div className="relative">
                <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-primary -z-10"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse Opportunities</h3>
              <p className="text-muted-foreground">
                Explore property listings or post your own investment opportunities to find potential partners.
              </p>
            </div>

            <div className="text-center">
              <div className="relative">
                <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  3
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect & Collaborate</h3>
              <p className="text-muted-foreground">
                Match with compatible partners, discuss details through our secure messaging, and finalize your
                co-investment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="What Our Users Say"
            subtitle="Hear from real estate professionals who have found success using CoListr."
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <Image
                    src="/placeholder.svg?height=60&width=60"
                    alt="Sarah Johnson"
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-muted-foreground">Real Estate Agent, NYC</p>
                </div>
              </div>
              <p className="italic text-muted-foreground">
                "CoListr has completely transformed how I approach investment properties. I've found three amazing
                partners and we've already closed on two properties together."
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <Image
                    src="/placeholder.svg?height=60&width=60"
                    alt="Michael Rodriguez"
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Michael Rodriguez</h4>
                  <p className="text-sm text-muted-foreground">Commercial Broker, Miami</p>
                </div>
              </div>
              <p className="italic text-muted-foreground">
                "The verification process gives me peace of mind when connecting with potential partners. The platform
                is intuitive and the matching algorithm is spot on."
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <Image
                    src="/placeholder.svg?height=60&width=60"
                    alt="Jennifer Lee"
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Jennifer Lee</h4>
                  <p className="text-sm text-muted-foreground">Property Developer, Chicago</p>
                </div>
              </div>
              <p className="italic text-muted-foreground">
                "As a developer, finding the right investment partners used to be challenging. CoListr has streamlined
                this process and helped me expand my network significantly."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Next Co-Investment Partner?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of real estate professionals already using CoListr to discover new investment opportunities.
          </p>
          <Button size="lg" className="bg-gold hover:bg-gold-dark text-navy" asChild>
            <Link href="/auth/signup">Get Started Today</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </>
  )
}

