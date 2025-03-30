"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Shield, Lock, CheckCircle, Award } from "lucide-react"

export default function AboutTrust() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const trustFactors = [
    {
      icon: Shield,
      title: "Verified Professionals",
      description: "We verify the real estate license and credentials of every member on our platform.",
    },
    {
      icon: Lock,
      title: "Data Security",
      description: "Your data is protected with enterprise-grade encryption and security protocols.",
    },
    {
      icon: CheckCircle,
      title: "Transparent Process",
      description: "Our matching and connection processes are transparent and clearly explained.",
    },
    {
      icon: Award,
      title: "Industry Compliance",
      description: "We adhere to all relevant real estate and financial regulations.",
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
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Trust & Security</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're committed to creating a secure and trusted environment for real estate professionals.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {trustFactors.map((factor, index) => (
            <motion.div key={index} variants={itemVariants}>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 h-full flex flex-col items-center text-center">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <factor.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{factor.title}</h3>
                <p className="text-muted-foreground">{factor.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground max-w-3xl mx-auto">
            CoListr is a platform for connecting real estate professionals and does not provide legal, financial, or
            investment advice. Always conduct your own due diligence and consult with appropriate professionals before
            entering into any investment partnership.
          </p>
        </div>
      </div>
    </section>
  )
}

