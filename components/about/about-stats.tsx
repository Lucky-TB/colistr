"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { AnimatedCounter } from "@/components/ui/animated-counter"

export default function AboutStats() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="py-20 hero-gradient text-white">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">CoListr by the Numbers</h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Our growing community of real estate professionals is making an impact in the industry.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <h3 className="text-4xl font-bold">
              <AnimatedCounter value={5000} suffix="+" />
            </h3>
            <p className="text-gray-300">Verified Realtors</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl font-bold">
              <AnimatedCounter value={1200} suffix="+" />
            </h3>
            <p className="text-gray-300">Active Listings</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl font-bold">
              <AnimatedCounter value={850} suffix="+" />
            </h3>
            <p className="text-gray-300">Successful Matches</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl font-bold">
              <AnimatedCounter value={25} prefix="$" suffix="M+" />
            </h3>
            <p className="text-gray-300">Investment Value</p>
          </div>
        </div>
      </div>
    </section>
  )
}

