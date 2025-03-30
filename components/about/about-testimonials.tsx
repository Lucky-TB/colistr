"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"
import { Quote } from "lucide-react"

export default function AboutTestimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const testimonials = [
    {
      quote:
        "CoListr has completely transformed how I approach investment properties. I've found three amazing partners and we've already closed on two properties together.",
      name: "Sarah Johnson",
      role: "Real Estate Agent, NYC",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      quote:
        "The verification process gives me peace of mind when connecting with potential partners. The platform is intuitive and the matching algorithm is spot on.",
      name: "Michael Rodriguez",
      role: "Commercial Broker, Miami",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      quote:
        "As a developer, finding the right investment partners used to be challenging. CoListr has streamlined this process and helped me expand my network significantly.",
      name: "Jennifer Lee",
      role: "Property Developer, Chicago",
      image: "/placeholder.svg?height=60&width=60",
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hear from real estate professionals who have found success using CoListr.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={itemVariants}>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 h-full flex flex-col">
                <div className="mb-4 text-primary">
                  <Quote className="h-8 w-8" />
                </div>
                <p className="italic text-muted-foreground mb-6 flex-grow">{testimonial.quote}</p>
                <div className="flex items-center">
                  <div className="mr-4">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

