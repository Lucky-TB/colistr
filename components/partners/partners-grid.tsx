"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Heart, MapPin, Star, MessageSquare, DollarSign, Briefcase, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"
import { useToast } from "@/components/ui/use-toast"
import { useSupabase } from "@/components/providers/supabase-provider"

// Animation variants
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
    transition: { duration: 0.3 },
  },
}

// Mock data for partners
const partners = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Real Estate Agent",
    location: "New York, NY",
    matchPercentage: 92,
    avatar: "/placeholder.svg?height=200&width=200",
    specialties: ["Commercial", "Residential"],
    experience: 8,
    investmentCapacity: "$500K - $1M",
    successRate: 95,
    bio: "Experienced real estate agent specializing in luxury properties and commercial investments in the New York area.",
    saved: false,
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    role: "Property Developer",
    location: "Miami, FL",
    matchPercentage: 87,
    avatar: "/placeholder.svg?height=200&width=200",
    specialties: ["Luxury", "Waterfront"],
    experience: 12,
    investmentCapacity: "$1M - $5M",
    successRate: 90,
    bio: "Property developer with over a decade of experience in luxury waterfront properties in South Florida.",
    saved: true,
  },
  {
    id: "3",
    name: "Jennifer Lee",
    role: "Investment Advisor",
    location: "Chicago, IL",
    matchPercentage: 85,
    avatar: "/placeholder.svg?height=200&width=200",
    specialties: ["Multi-family", "Commercial"],
    experience: 6,
    investmentCapacity: "$250K - $500K",
    successRate: 88,
    bio: "Investment advisor focusing on multi-family properties and commercial real estate in the Midwest.",
    saved: false,
  },
  {
    id: "4",
    name: "David Wilson",
    role: "Real Estate Broker",
    location: "Los Angeles, CA",
    matchPercentage: 78,
    avatar: "/placeholder.svg?height=200&width=200",
    specialties: ["Residential", "Luxury"],
    experience: 15,
    investmentCapacity: "$500K - $1M",
    successRate: 92,
    bio: "Seasoned real estate broker specializing in high-end residential properties in Southern California.",
    saved: false,
  },
  {
    id: "5",
    name: "Amanda Chen",
    role: "Commercial Investor",
    location: "San Francisco, CA",
    matchPercentage: 75,
    avatar: "/placeholder.svg?height=200&width=200",
    specialties: ["Office", "Retail"],
    experience: 10,
    investmentCapacity: "$1M - $5M",
    successRate: 85,
    bio: "Commercial investor with a focus on office and retail properties in the Bay Area tech corridor.",
    saved: true,
  },
  {
    id: "6",
    name: "Robert Taylor",
    role: "Property Manager",
    location: "Austin, TX",
    matchPercentage: 72,
    avatar: "/placeholder.svg?height=200&width=200",
    specialties: ["Multi-family", "Residential"],
    experience: 7,
    investmentCapacity: "$250K - $500K",
    successRate: 80,
    bio: "Property manager specializing in multi-family and residential properties in the growing Austin market.",
    saved: false,
  },
]

export function PartnersGrid() {
  const [savedPartners, setSavedPartners] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { user } = useSupabase()

  // In a real app, this would come from the database
  useEffect(() => {
    const initialSaved = partners.reduce(
      (acc, partner) => {
        acc[partner.id] = partner.saved
        return acc
      },
      {} as Record<string, boolean>,
    )

    setSavedPartners(initialSaved)
  }, [])

  const toggleSaved = (id: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save partners to your favorites.",
        variant: "destructive",
      })
      return
    }

    setSavedPartners((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))

    toast({
      title: savedPartners[id] ? "Removed from saved" : "Saved to favorites",
      description: savedPartners[id] ? "Partner removed from your saved list" : "Partner added to your saved list",
    })
  }

  return (
    <div className="space-y-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {partners.map((partner) => (
          <motion.div key={partner.id} variants={itemVariants}>
            <Card className="overflow-hidden h-full flex flex-col">
              <CardContent className="p-4 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <Image
                      src={partner.avatar || "/placeholder.svg"}
                      alt={partner.name}
                      width={64}
                      height={64}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{partner.name}</h3>
                      <p className="text-sm text-muted-foreground">{partner.role}</p>
                    </div>
                  </div>
                  <Badge
                    variant={partner.matchPercentage >= 85 ? "default" : "outline"}
                    className={partner.matchPercentage >= 85 ? "bg-green-500" : ""}
                  >
                    {partner.matchPercentage}% Match
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-1 h-3.5 w-3.5" />
                    {partner.location}
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <Briefcase className="mr-1 h-3.5 w-3.5" />
                    {partner.experience} years experience
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <DollarSign className="mr-1 h-3.5 w-3.5" />
                    Investment: {partner.investmentCapacity}
                  </div>

                  <div className="flex items-center text-sm">
                    <Star className="mr-1 h-3.5 w-3.5 text-amber-500" />
                    <span className="font-medium">{partner.successRate}% Success Rate</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {partner.specialties.map((specialty) => (
                      <Badge key={specialty} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{partner.bio}</p>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <Button variant="outline" asChild>
                  <Link href={`/partners/${partner.id}`}>View Profile</Link>
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={savedPartners[partner.id] ? "text-rose-500" : ""}
                    onClick={() => toggleSaved(partner.id)}
                    aria-label={savedPartners[partner.id] ? "Remove from saved" : "Save partner"}
                  >
                    <Heart className="h-4 w-4" fill={savedPartners[partner.id] ? "currentColor" : "none"} />
                  </Button>
                  <Button variant="default" size="icon" asChild>
                    <Link href={`/messages/new?partner=${partner.id}`}>
                      <MessageSquare className="h-4 w-4" />
                      <span className="sr-only">Message</span>
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <Pagination className="justify-center">
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#" aria-label="Go to first page">
              <ChevronLeft className="h-4 w-4" />
              <ChevronLeft className="h-4 w-4 -ml-2" />
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationPrevious />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>8</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" aria-label="Go to last page">
              <ChevronRight className="h-4 w-4" />
              <ChevronRight className="h-4 w-4 -ml-2" />
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

