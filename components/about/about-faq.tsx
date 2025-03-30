"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function AboutFAQ() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const faqs = [
    {
      question: "Who can join CoListr?",
      answer:
        "CoListr is exclusively for licensed real estate professionals, including agents, brokers, developers, and property managers. We verify all members' credentials during the registration process.",
    },
    {
      question: "How does the matching algorithm work?",
      answer:
        "Our proprietary algorithm considers multiple factors including investment preferences, experience level, geographic focus, property type specialization, and investment capacity to suggest potential partners who are most compatible with your goals.",
    },
    {
      question: "Is CoListr involved in the actual investment transactions?",
      answer:
        "No, CoListr is a networking platform that helps you find potential co-investment partners. We do not participate in, broker, or manage the actual investment transactions. All agreements and transactions are handled directly between the partners.",
    },
    {
      question: "How do you verify members?",
      answer:
        "We verify real estate licenses through state databases and require additional professional credentials. We also implement a thorough review process for all new members to ensure the quality and legitimacy of our community.",
    },
    {
      question: "What does CoListr cost to use?",
      answer:
        "CoListr offers a freemium model. Basic membership is free and allows you to create a profile and browse opportunities. Premium membership, which includes advanced matching, unlimited messaging, and featured listings, is available for a monthly subscription fee.",
    },
    {
      question: "How do I list a property opportunity?",
      answer:
        "Once you've created an account, you can list a property opportunity by navigating to the 'Opportunities' section and clicking 'Create New.' You'll be prompted to enter details about the property, investment requirements, and partner criteria.",
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about CoListr and how our platform works.
          </p>
        </div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}

