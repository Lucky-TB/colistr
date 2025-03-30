"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function AboutHero() {
  return (
    <section className="hero-gradient pt-32 pb-20 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            About CoListr
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-200 mb-8"
          >
            Transforming how real estate professionals collaborate on property investments
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-xl"
          >
            <Image
              src="/placeholder.svg?height=400&width=800"
              alt="CoListr team and office"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

