"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"
import { Linkedin, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutTeam() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Co-Founder",
      bio: "Former real estate broker with 15+ years of experience in luxury properties.",
      image: "/placeholder.svg?height=200&width=200",
      social: {
        linkedin: "#",
        twitter: "#",
      },
    },
    {
      name: "Michael Rodriguez",
      role: "CTO & Co-Founder",
      bio: "Tech entrepreneur with a background in real estate technology and platform development.",
      image: "/placeholder.svg?height=200&width=200",
      social: {
        linkedin: "#",
        twitter: "#",
      },
    },
    {
      name: "Jennifer Lee",
      role: "Chief Marketing Officer",
      bio: "Marketing executive with expertise in digital strategy for real estate brands.",
      image: "/placeholder.svg?height=200&width=200",
      social: {
        linkedin: "#",
        twitter: "#",
      },
    },
    {
      name: "David Wilson",
      role: "Head of Partnerships",
      bio: "Former investment advisor specializing in real estate portfolio management.",
      image: "/placeholder.svg?height=200&width=200",
      social: {
        linkedin: "#",
        twitter: "#",
      },
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The passionate professionals behind CoListr who are dedicated to transforming real estate co-investment.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {team.map((member, index) => (
            <motion.div key={index} variants={itemVariants}>
              <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md border border-gray-200 dark:border-gray-700">
                <div className="relative h-64">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-primary mb-2">{member.role}</p>
                  <p className="text-muted-foreground mb-4">{member.bio}</p>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                      <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-5 w-5" />
                        <span className="sr-only">LinkedIn</span>
                      </a>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <a href={member.social.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-5 w-5" />
                        <span className="sr-only">Twitter</span>
                      </a>
                    </Button>
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

