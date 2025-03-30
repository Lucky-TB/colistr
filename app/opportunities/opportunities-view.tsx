"use client"

import type React from "react"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Plus, Grid, List, Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSupabase } from "@/components/providers/supabase-provider"
import { OpportunitiesGrid } from "@/components/opportunities/opportunities-grid"
import { OpportunitiesList } from "@/components/opportunities/opportunities-list"
import { OpportunitiesFilter } from "@/components/opportunities/opportunities-filter"
import { useToast } from "@/components/ui/use-toast"
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

export default function OpportunitiesView() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useSupabase()
  const { toast } = useToast()

  // Get filter values from URL params
  const propertyType = searchParams.get("type") || "all"
  const minPrice = searchParams.get("minPrice") || "0"
  const maxPrice = searchParams.get("maxPrice") || "10000000"
  const minRoi = searchParams.get("minRoi") || "0"
  const sortBy = searchParams.get("sort") || "latest"
  const location = searchParams.get("location") || ""
  const page = searchParams.get("page") || "1"

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Update URL with search query
    const params = new URLSearchParams(searchParams.toString())
    params.set("search", searchQuery)
    params.set("page", "1") // Reset to first page on new search
    router.push(`/opportunities?${params.toString()}`)
  }

  const handleCreateOpportunity = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a new investment opportunity.",
        variant: "destructive",
      })
      router.push("/auth/signin?from=/opportunities/create")
      return
    }

    router.push("/opportunities/create")
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
        <OpportunitiesFilter />
      </div>

      {/* Mobile Filter Sheet */}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>
            <OpportunitiesFilter onClose={() => setIsFilterOpen(false)} />
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
                placeholder="Search opportunities..."
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
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-secondary" : ""}
              aria-label="Grid view"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-secondary" : ""}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button onClick={handleCreateOpportunity}>
              <Plus className="h-4 w-4 mr-2" />
              Create New
            </Button>
          </div>
        </div>

        {/* Results */}
        {viewMode === "grid" ? <OpportunitiesGrid /> : <OpportunitiesList />}
      </div>
    </motion.div>
  )
}

