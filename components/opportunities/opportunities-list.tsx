"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Heart, MapPin, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
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

// Mock data for property opportunities - same as in opportunities-grid.tsx
const properties = [
  {
    id: "1",
    title: "Luxury Apartment Complex",
    location: "Miami, FL",
    price: 2500000,
    investmentRequired: 500000,
    roi: 12.5,
    type: "Residential",
    image: "/placeholder.svg?height=200&width=300",
    partnerRequirements: "Looking for 3 partners with experience in luxury properties",
    timeline: "12-18 months",
    saved: false,
  },
  {
    id: "2",
    title: "Commercial Office Building",
    location: "Chicago, IL",
    price: 4800000,
    investmentRequired: 1200000,
    roi: 9.8,
    type: "Commercial",
    image: "/placeholder.svg?height=200&width=300",
    partnerRequirements: "Seeking 2 partners with commercial property management experience",
    timeline: "24-36 months",
    saved: false,
  },
  {
    id: "3",
    title: "Mixed-Use Development",
    location: "Austin, TX",
    price: 3200000,
    investmentRequired: 800000,
    roi: 11.2,
    type: "Mixed-Use",
    image: "/placeholder.svg?height=200&width=300",
    partnerRequirements: "Looking for 4 partners with diverse real estate backgrounds",
    timeline: "18-24 months",
    saved: true,
  },
  {
    id: "4",
    title: "Waterfront Vacation Rentals",
    location: "San Diego, CA",
    price: 1800000,
    investmentRequired: 450000,
    roi: 14.5,
    type: "Vacation",
    image: "/placeholder.svg?height=200&width=300",
    partnerRequirements: "Seeking 2 partners with short-term rental experience",
    timeline: "6-12 months",
    saved: false,
  },
  {
    id: "5",
    title: "Urban Retail Center",
    location: "Seattle, WA",
    price: 3800000,
    investmentRequired: 950000,
    roi: 10.2,
    type: "Retail",
    image: "/placeholder.svg?height=200&width=300",
    partnerRequirements: "Looking for 3 partners with retail property experience",
    timeline: "24-30 months",
    saved: false,
  },
  {
    id: "6",
    title: "Multi-Family Housing Complex",
    location: "Denver, CO",
    price: 2900000,
    investmentRequired: 725000,
    roi: 13.1,
    type: "Residential",
    image: "/placeholder.svg?height=200&width=300",
    partnerRequirements: "Seeking 3 partners with multi-family property experience",
    timeline: "12-24 months",
    saved: true,
  },
]

export function OpportunitiesList() {
  const [savedProperties, setSavedProperties] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { user } = useSupabase()

  // In a real app, this would come from the database
  useEffect(() => {
    const initialSaved = properties.reduce(
      (acc, property) => {
        acc[property.id] = property.saved
        return acc
      },
      {} as Record<string, boolean>,
    )

    setSavedProperties(initialSaved)
  }, [])

  const toggleSaved = (id: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save properties to your favorites.",
        variant: "destructive",
      })
      return
    }

    setSavedProperties((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))

    toast({
      title: savedProperties[id] ? "Removed from saved" : "Saved to favorites",
      description: savedProperties[id] ? "Property removed from your saved list" : "Property added to your saved list",
    })
  }

  return (
    <div className="space-y-8">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
        {properties.map((property) => (
          <motion.div key={property.id} variants={itemVariants}>
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="relative md:w-1/4">
                    <Image
                      src={property.image || "/placeholder.svg"}
                      alt={property.title}
                      width={300}
                      height={200}
                      className="h-48 md:h-full w-full object-cover"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`absolute right-2 top-2 h-8 w-8 rounded-full ${
                        savedProperties[property.id]
                          ? "bg-rose-500 text-white hover:bg-rose-600 hover:text-white"
                          : "bg-white/80 text-gray-600 backdrop-blur-sm hover:bg-white/70"
                      }`}
                      onClick={() => toggleSaved(property.id)}
                      aria-label={savedProperties[property.id] ? "Remove from saved" : "Save property"}
                    >
                      <Heart className="h-4 w-4" fill={savedProperties[property.id] ? "currentColor" : "none"} />
                    </Button>
                    <Badge className="absolute left-2 top-2">{property.type}</Badge>
                  </div>
                  <div className="p-4 md:w-3/4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{property.title}</h3>
                          <Badge variant="outline">{property.roi}% ROI</Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="mr-1 h-3.5 w-3.5" />
                          {property.location}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-right">
                          <span className="text-sm text-muted-foreground">Price</span>
                          <p className="font-medium">${property.price.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-muted-foreground">Investment</span>
                          <p className="font-medium">${property.investmentRequired.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-1 h-3.5 w-3.5" />
                          <span>Timeline: {property.timeline}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{property.partnerRequirements}</p>
                      </div>
                      <div className="flex items-center justify-end md:justify-end mt-4 md:mt-0">
                        <Button variant="outline" className="mr-2" asChild>
                          <Link href={`/opportunities/${property.id}`}>View Details</Link>
                        </Button>
                        <Button asChild>
                          <Link href={`/opportunities/${property.id}/contact`}>Contact Owner</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
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
            <PaginationNext />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" aria-label="Go to last page">
              <ChevronRight className="h-4 w-4" />
              <ChevronRight className="h-4 w-4 -ml-2" />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

