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

interface PartnersFilterProps {
  onClose?: () => void
}

export function PartnersFilter({ onClose }: PartnersFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get filter values from URL params
  const [experienceRange, setExperienceRange] = useState<[number, number]>([
    Number.parseInt(searchParams.get("minExperience") || "0"),
    Number.parseInt(searchParams.get("maxExperience") || "20"),
  ])
  const [matchPercentage, setMatchPercentage] = useState(Number.parseInt(searchParams.get("minMatch") || "0"))
  const [propertyTypes, setPropertyTypes] = useState<string[]>(searchParams.get("propertyTypes")?.split(",") || [])
  const [location, setLocation] = useState(searchParams.get("location") || "")
  const [investmentCapacity, setInvestmentCapacity] = useState(searchParams.get("capacity") || "any")
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "match")

  const propertyTypeOptions = [
    { id: "residential", label: "Residential" },
    { id: "commercial", label: "Commercial" },
    { id: "mixed-use", label: "Mixed-Use" },
    { id: "luxury", label: "Luxury" },
    { id: "vacation", label: "Vacation" },
    { id: "retail", label: "Retail" },
    { id: "office", label: "Office" },
    { id: "multi-family", label: "Multi-Family" },
  ]

  const capacityOptions = [
    { id: "any", label: "Any Capacity" },
    { id: "low", label: "Under $250K" },
    { id: "medium", label: "$250K - $1M" },
    { id: "high", label: "$1M - $5M" },
    { id: "very-high", label: "Over $5M" },
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
    params.set("minExperience", experienceRange[0].toString())
    params.set("maxExperience", experienceRange[1].toString())
    params.set("minMatch", matchPercentage.toString())

    if (propertyTypes.length > 0) {
      params.set("propertyTypes", propertyTypes.join(","))
    } else {
      params.delete("propertyTypes")
    }

    if (location) {
      params.set("location", location)
    } else {
      params.delete("location")
    }

    if (investmentCapacity !== "any") {
      params.set("capacity", investmentCapacity)
    } else {
      params.delete("capacity")
    }

    params.set("sort", sortBy)
    params.set("page", "1") // Reset to first page on filter change

    router.push(`/partners?${params.toString()}`)

    if (onClose) {
      onClose()
    }
  }

  const resetFilters = () => {
    setExperienceRange([0, 20])
    setMatchPercentage(0)
    setPropertyTypes([])
    setLocation("")
    setInvestmentCapacity("any")
    setSortBy("match")

    router.push("/partners")

    if (onClose) {
      onClose()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Experience</h3>
        <div className="space-y-4">
          <Slider
            value={experienceRange}
            min={0}
            max={20}
            step={1}
            onValueChange={(value) => setExperienceRange(value as [number, number])}
          />
          <div className="flex items-center justify-between">
            <div className="w-[45%]">
              <Label htmlFor="minExperience">Min Years</Label>
              <Input
                id="minExperience"
                type="number"
                value={experienceRange[0]}
                onChange={(e) => setExperienceRange([Number.parseInt(e.target.value), experienceRange[1]])}
                className="mt-1"
              />
            </div>
            <div className="w-[45%]">
              <Label htmlFor="maxExperience">Max Years</Label>
              <Input
                id="maxExperience"
                type="number"
                value={experienceRange[1]}
                onChange={(e) => setExperienceRange([experienceRange[0], Number.parseInt(e.target.value)])}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-2">Minimum Match</h3>
        <div className="space-y-4">
          <Slider
            value={[matchPercentage]}
            min={0}
            max={100}
            step={5}
            onValueChange={(value) => setMatchPercentage(value[0])}
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Minimum: {matchPercentage}%</span>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-2">Property Specialties</h3>
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
        <h3 className="text-lg font-semibold mb-2">Investment Capacity</h3>
        <RadioGroup value={investmentCapacity} onValueChange={setInvestmentCapacity}>
          {capacityOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.id} id={`capacity-${option.id}`} />
              <label
                htmlFor={`capacity-${option.id}`}
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
            <SelectItem value="match">Best Match</SelectItem>
            <SelectItem value="experience-high">Most Experienced</SelectItem>
            <SelectItem value="success-high">Highest Success Rate</SelectItem>
            <SelectItem value="recent">Recently Active</SelectItem>
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

