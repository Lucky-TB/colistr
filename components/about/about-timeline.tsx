"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

export default function AboutTimeline() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const milestones = [
    {
      year: "2020",
      title: "Concept Development",
      description:
        "The idea for CoListr was born out of the founders' frustration with the fragmented nature of real estate co-investment.",
    },
    {
      year: "2021",
      title: "Company Founded",
      description: "CoListr was officially incorporated and began development of the platform.",
    },
    {
      year: "2022",
      title: "Beta Launch",
      description:
        "The platform was launched in beta with a select group of real estate professionals in major markets.",
    },
    {
      year: "2023",
      title: "Public Launch",
      description: "CoListr opened to all verified real estate professionals nationwide.",
    },
    {
      year: "2024",
      title: "Expansion",
      description: "Reached 5,000+ verified users and expanded features to include advanced matching algorithms.",
    },
    {
      year: "2025",
      title: "Future Vision",
      description:
        "Planning international expansion and enhanced tools for property analysis and portfolio management.",
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Journey</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The story of CoListr's growth and evolution over the years.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto"
        >
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-primary"></div>

            {/* Timeline items */}
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`relative mb-12 md:mb-24 ${
                  index % 2 === 0
                    ? "md:pr-12 md:text-right md:ml-auto md:mr-auto md:pl-0"
                    : "md:pl-12 md:ml-auto md:mr-auto md:pr-0"
                } md:w-1/2`}
              >
                <div className={`flex items-center ${index % 2 === 0 ? "md:justify-end" : "md:justify-start"}`}>
                  <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold z-10">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                  <div
                    className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 ${
                      index % 2 === 0 ? "md:mr-8" : "md:ml-8"
                    }`}
                  >
                    <div className="text-primary font-bold text-xl mb-2">{milestone.year}</div>
                    <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

