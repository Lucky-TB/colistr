"use client"

import type React from "react"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PartnersGrid } from "@/components/partners/partners-grid"
import { PartnersFilter } from "@/components/partners/partners-filter"
import { Sheet, SheetContent } from "@/components/ui/sheet"

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

export default function PartnersView() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const searchParams = useSearchParams()
  const router = useRouter()

  // Get filter values from URL params
  const experienceLevel = searchParams.get("experience") || "all"
  const investmentCapacity = searchParams.get("capacity") || "all"
  const location = searchParams.get("location") || ""
  const propertyTypes = searchParams.get("propertyTypes")?.split(",") || []
  const sortBy = searchParams.get("sort") || "match"
  const page = searchParams.get("page") || "1"

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Update URL with search query
    const params = new URLSearchParams(searchParams.toString())
    params.set("search", searchQuery)
    params.set("page", "1") // Reset to first page on new search
    router.push(`/partners?${params.toString()}`)
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8"
    >
      {/* Desktop Filter Sidebar */}
      <div className="hidden lg:block">
        <PartnersFilter />
      </div>

      {/* Mobile Filter Sheet */}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>
            <PartnersFilter onClose={() => setIsFilterOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search partners by name, location, or specialty..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit">Search</Button>
          </form>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden"
              aria-label="Open filters"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Results */}
        <PartnersGrid />
      </div>
    </motion.div>
  )
}

