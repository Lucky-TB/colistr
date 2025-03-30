"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Heart, MapPin, Clock, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination"
import { useToast } from "@/components/ui/use-toast"
import { useSupabase } from "@/components/providers/supabase-provider"
import { getOpportunities, saveOpportunity, unsaveOpportunity, isSaved } from "@/actions/opportunities"
import type { Database } from "@/types/supabase"

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

type Opportunity = Database["public"]["Tables"]["opportunities"]["Row"] & {
  profiles?: Database["public"]["Tables"]["profiles"]["Row"]
}

export function OpportunitiesGrid() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [savedProperties, setSavedProperties] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { user } = useSupabase()

  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = 6
  const offset = (page - 1) * limit

  useEffect(() => {
    const fetchOpportunities = async () => {
      setIsLoading(true)

      try {
        // Extract filter parameters from URL
        const search = searchParams.get("search") || undefined
        const location = searchParams.get("location") || undefined
        const types = searchParams.get("types")?.split(",") || undefined
        const minPrice = searchParams.get("minPrice") ? Number.parseInt(searchParams.get("minPrice")!) : undefined
        const maxPrice = searchParams.get("maxPrice") ? Number.parseInt(searchParams.get("maxPrice")!) : undefined
        const minRoi = searchParams.get("minRoi") ? Number.parseFloat(searchParams.get("minRoi")!) : undefined
        const maxRoi = searchParams.get("maxRoi") ? Number.parseFloat(searchParams.get("maxRoi")!) : undefined
        const sortBy = searchParams.get("sort") || undefined

        // Fetch opportunities with filters
        const { opportunities, count } = await getOpportunities({
          search,
          location,
          types,
          minPrice,
          maxPrice,
          minRoi,
          maxRoi,
          sortBy,
          limit,
          offset,
          saved: searchParams.get("view") === "saved" ? true : undefined,
          userId: searchParams.get("view") === "mine" ? user?.id : undefined,
        })

        setOpportunities(opportunities)
        setTotalCount(count)

        // Check which opportunities are saved by the current user
        if (user) {
          const savedStatus: Record<string, boolean> = {}

          for (const opp of opportunities) {
            savedStatus[opp.id] = await isSaved(user.id, opp.id)
          }

          setSavedProperties(savedStatus)
        }
      } catch (error) {
        console.error("Error fetching opportunities:", error)
        toast({
          title: "Error",
          description: "Failed to load opportunities. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchOpportunities()
  }, [searchParams, user, toast])

  const toggleSaved = async (id: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save properties to your favorites.",
        variant: "destructive",
      })
      return
    }

    try {
      if (savedProperties[id]) {
        await unsaveOpportunity(user.id, id)
      } else {
        await saveOpportunity(user.id, id)
      }

      setSavedProperties((prev) => ({
        ...prev,
        [id]: !prev[id],
      }))

      toast({
        title: savedProperties[id] ? "Removed from saved" : "Saved to favorites",
        description: savedProperties[id]
          ? "Property removed from your saved list"
          : "Property added to your saved list",
      })
    } catch (error) {
      console.error("Error toggling saved status:", error)
      toast({
        title: "Error",
        description: "Failed to update saved status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const totalPages = Math.ceil(totalCount / limit)

  return (
    <div className="space-y-8">
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(null)
            .map((_, i) => (
              <Card key={i} className="overflow-hidden h-full flex flex-col">
                <div className="h-48 w-full bg-gray-200 animate-pulse" />
                <CardContent className="p-4 flex-grow">
                  <div className="space-y-2">
                    <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded" />
                    <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded" />
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div className="space-y-1">
                        <div className="h-3 w-1/2 bg-gray-200 animate-pulse rounded" />
                        <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
                      </div>
                      <div className="space-y-1">
                        <div className="h-3 w-1/2 bg-gray-200 animate-pulse rounded" />
                        <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
                      </div>
                    </div>
                    <div className="h-4 w-full bg-gray-200 animate-pulse rounded mt-2" />
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <div className="h-10 w-full bg-gray-200 animate-pulse rounded" />
                </CardFooter>
              </Card>
            ))}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {opportunities.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No opportunities found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters or create a new opportunity.</p>
              <Button asChild>
                <Link href="/opportunities/create">Create New Opportunity</Link>
              </Button>
            </div>
          ) : (
            opportunities.map((property) => (
              <motion.div key={property.id} variants={itemVariants}>
                <Card className="overflow-hidden h-full flex flex-col">
                  <div className="relative">
                    <Image
                      src={property.images?.[0] || "/placeholder.svg?height=200&width=300"}
                      alt={property.title}
                      width={300}
                      height={200}
                      className="h-48 w-full object-cover"
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
                  <CardContent className="p-4 flex-grow">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold line-clamp-1">{property.title}</h3>
                        <Badge variant="outline" className="ml-2 whitespace-nowrap">
                          {property.roi}% ROI
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-1 h-3.5 w-3.5" />
                        {property.location}
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">Price</span>
                          <span className="font-medium">${property.price.toLocaleString()}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">Investment</span>
                          <span className="font-medium">${property.investment_required.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground pt-1">
                        <Clock className="mr-1 h-3.5 w-3.5" />
                        <span>Timeline: {property.timeline}</span>
                      </div>
                      <div className="pt-2 text-sm">
                        <p className="text-muted-foreground line-clamp-2">{property.partner_requirements}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/opportunities/${property.id}`}>
                        View Details
                        <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
      )}

      {totalPages > 1 && (
        <Pagination className="justify-center">
          <PaginationContent>
            {page > 1 && (
              <>
                <PaginationItem>
                  <PaginationLink
                    href={`/opportunities?${new URLSearchParams({ ...Object.fromEntries(searchParams), page: "1" })}`}
                    aria-label="Go to first page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <ChevronLeft className="h-4 w-4 -ml-2" />
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    href={`/opportunities?${new URLSearchParams({ ...Object.fromEntries(searchParams), page: (page - 1).toString() })}`}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber: number

              if (totalPages <= 5) {
                pageNumber = i + 1
              } else if (page <= 3) {
                pageNumber = i + 1
              } else if (page >= totalPages - 2) {
                pageNumber = totalPages - 4 + i
              } else {
                pageNumber = page - 2 + i
              }

              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href={`/opportunities?${new URLSearchParams({ ...Object.fromEntries(searchParams), page: pageNumber.toString() })}`}
                    isActive={pageNumber === page}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )
            })}

            {page < totalPages && (
              <>
                <PaginationItem>
                  <PaginationLink
                    href={`/opportunities?${new URLSearchParams({ ...Object.fromEntries(searchParams), page: (page + 1).toString() })}`}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    href={`/opportunities?${new URLSearchParams({ ...Object.fromEntries(searchParams), page: totalPages.toString() })}`}
                    aria-label="Go to last page"
                  >
                    <ChevronRight className="h-4 w-4" />
                    <ChevronRight className="h-4 w-4 -ml-2" />
                  </PaginationLink>
                </PaginationItem>
              </>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

