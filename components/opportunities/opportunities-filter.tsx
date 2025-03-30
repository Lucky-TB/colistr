"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

interface OpportunitiesFilterProps {
  onClose?: () => void
}

export function OpportunitiesFilter({ onClose }: OpportunitiesFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get filter values from URL params
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number.parseInt(searchParams.get("minPrice") || "0"),
    Number.parseInt(searchParams.get("maxPrice") || "10000000"),
  ])
  const [roiRange, setRoiRange] = useState<[number, number]>([
    Number.parseInt(searchParams.get("minRoi") || "0"),
    Number.parseInt(searchParams.get("maxRoi") || "20"),
  ])
  const [propertyTypes, setPropertyTypes] = useState<string[]>(searchParams.get("types")?.split(",") || [])
  const [location, setLocation] = useState(searchParams.get("location") || "")
  const [timeline, setTimeline] = useState(searchParams.get("timeline") || "any")
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "latest")

  const propertyTypeOptions = [
    { id: "residential", label: "Residential" },
    { id: "commercial", label: "Commercial" },
    { id: "mixed-use", label: "Mixed-Use" },
    { id: "vacation", label: "Vacation" },
    { id: "retail", label: "Retail" },
    { id: "industrial", label: "Industrial" },
  ]

  const timelineOptions = [
    { id: "any", label: "Any Timeline" },
    { id: "short", label: "Short Term (< 12 months)" },
    { id: "medium", label: "Medium Term (12-24 months)" },
    { id: "long", label: "Long Term (> 24 months)" },
  ]

  const handlePropertyTypeChange = (checked: boolean, type: string) => {
    if (checked) {
      setPropertyTypes([...propertyTypes, type])
    } else {
      setPropertyTypes(propertyTypes.filter((t) => t !== type))
    }
  }

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    // Update params with filter values
    params.set("minPrice", priceRange[0].toString())
    params.set("maxPrice", priceRange[1].toString())
    params.set("minRoi", roiRange[0].toString())
    params.set("maxRoi", roiRange[1].toString())

    if (propertyTypes.length > 0) {
      params.set("types", propertyTypes.join(","))
    } else {
      params.delete("types")
    }

    if (location) {
      params.set("location", location)
    } else {
      params.delete("location")
    }

    if (timeline !== "any") {
      params.set("timeline", timeline)
    } else {
      params.delete("timeline")
    }

    params.set("sort", sortBy)
    params.set("page", "1") // Reset to first page on filter change

    router.push(`/opportunities?${params.toString()}`)

    if (onClose) {
      onClose()
    }
  }

  const resetFilters = () => {
    setPriceRange([0, 10000000])
    setRoiRange([0, 20])
    setPropertyTypes([])
    setLocation("")
    setTimeline("any")
    setSortBy("latest")

    router.push("/opportunities")

    if (onClose) {
      onClose()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Price Range</h3>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            min={0}
            max={10000000}
            step={100000}
            onValueChange={(value) => setPriceRange(value as [number, number])}
          />
          <div className="flex items-center justify-between">
            <div className="w-[45%]">
              <Label htmlFor="minPrice">Min</Label>
              <Input
                id="minPrice"
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number.parseInt(e.target.value), priceRange[1]])}
                className="mt-1"
              />
            </div>
            <div className="w-[45%]">
              <Label htmlFor="maxPrice">Max</Label>
              <Input
                id="maxPrice"
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-2">ROI Range</h3>
        <div className="space-y-4">
          <Slider
            value={roiRange}
            min={0}
            max={20}
            step={0.5}
            onValueChange={(value) => setRoiRange(value as [number, number])}
          />
          <div className="flex items-center justify-between">
            <div className="w-[45%]">
              <Label htmlFor="minRoi">Min %</Label>
              <Input
                id="minRoi"
                type="number"
                value={roiRange[0]}
                onChange={(e) => setRoiRange([Number.parseFloat(e.target.value), roiRange[1]])}
                className="mt-1"
              />
            </div>
            <div className="w-[45%]">
              <Label htmlFor="maxRoi">Max %</Label>
              <Input
                id="maxRoi"
                type="number"
                value={roiRange[1]}
                onChange={(e) => setRoiRange([roiRange[0], Number.parseFloat(e.target.value)])}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-2">Property Type</h3>
        <div className="space-y-2">
          {propertyTypeOptions.map((type) => (
            <div key={type.id} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${type.id}`}
                checked={propertyTypes.includes(type.id)}
                onCheckedChange={(checked) => handlePropertyTypeChange(!!checked, type.id)}
              />
              <label
                htmlFor={`type-${type.id}`}
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {type.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-2">Location</h3>
        <Input placeholder="City, State, or ZIP" value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-2">Investment Timeline</h3>
        <RadioGroup value={timeline} onValueChange={setTimeline}>
          {timelineOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.id} id={`timeline-${option.id}`} />
              <label
                htmlFor={`timeline-${option.id}`}
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {option.label}
              </label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-2">Sort By</h3>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="roi-high">Highest ROI</SelectItem>
            <SelectItem value="investment-low">Lowest Investment</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 pt-4">
        <Button onClick={applyFilters} className="flex-1">
          Apply Filters
        </Button>
        <Button variant="outline" onClick={resetFilters}>
          Reset
        </Button>
      </div>
    </div>
  )
}

