"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { UserPlus, Search, Handshake, Building } from "lucide-react"

export default function AboutHowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const steps = [
    {
      icon: UserPlus,
      title: "Create Your Profile",
      description:
        "Sign up and complete your professional profile with your investment preferences, experience, and goals.",
    },
    {
      icon: Search,
      title: "Find Opportunities",
      description: "Browse property listings or search for potential partners based on your specific criteria.",
    },
    {
      icon: Handshake,
      title: "Connect & Collaborate",
      description: "Reach out to potential partners, discuss details, and form your co-investment partnership.",
    },
    {
      icon: Building,
      title: "Invest Together",
      description: "Pool resources, close on properties, and manage your investments as a team.",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How CoListr Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our platform makes it easy to find co-investment partners in just a few simple steps.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto"
        >
          {steps.map((step, index) => (
            <motion.div key={index} variants={itemVariants} className="relative">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md h-full flex flex-col items-center text-center border border-gray-200 dark:border-gray-700">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="absolute -top-3 -left-3 h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 w-8 h-0.5 bg-primary z-10">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary rotate-45"></div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

