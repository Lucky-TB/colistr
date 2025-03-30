"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Users, Building2, Handshake, DollarSign, Shield, Search } from "lucide-react"

export default function AboutBenefits() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const benefits = [
    {
      icon: Users,
      title: "Expanded Network",
      description: "Connect with verified real estate professionals who share your investment goals and vision.",
    },
    {
      icon: Building2,
      title: "Access to Larger Deals",
      description: "Pool resources to participate in investment opportunities that would be out of reach individually.",
    },
    {
      icon: Handshake,
      title: "Complementary Expertise",
      description: "Partner with professionals whose skills and knowledge complement your own.",
    },
    {
      icon: DollarSign,
      title: "Shared Risk",
      description: "Distribute investment risk across multiple partners while maintaining attractive returns.",
    },
    {
      icon: Shield,
      title: "Verified Professionals",
      description: "All members are verified real estate professionals, ensuring trust and credibility.",
    },
    {
      icon: Search,
      title: "Smart Matching",
      description: "Our algorithm matches you with partners based on investment criteria, experience, and location.",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Benefits of Using CoListr</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our platform offers unique advantages designed specifically for real estate professionals.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {benefits.map((benefit, index) => (
            <motion.div key={index} variants={itemVariants}>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 h-full">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

