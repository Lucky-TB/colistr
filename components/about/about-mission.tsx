"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

export default function AboutMission() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl mb-8 text-muted-foreground">
            At CoListr, we're on a mission to revolutionize real estate investing by connecting professionals who share
            complementary skills, resources, and vision.
          </p>
          <div className="text-lg space-y-4 text-left">
            <p>
              We believe that collaboration is the key to unlocking greater opportunities in real estate. By bringing
              together agents, brokers, developers, and investors on one platform, we're creating a community where
              professionals can pool their expertise and capital to take on projects that might otherwise be out of
              reach.
            </p>
            <p>
              Our goal is to democratize access to real estate investments, foster meaningful professional
              relationships, and ultimately help our members build wealth through strategic partnerships.
            </p>
            <p>
              We're committed to transparency, security, and creating a trusted environment where real estate
              professionals can find their ideal co-investment partners.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

