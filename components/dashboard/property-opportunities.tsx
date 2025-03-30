import Image from "next/image"
import Link from "next/link"
import { Heart, MapPin, Users, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data for property opportunities
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
    saved: true,
    mine: false,
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
    saved: false,
    mine: true,
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
    saved: false,
    mine: false,
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
    saved: true,
    mine: false,
  },
]

interface PropertyOpportunitiesProps {
  saved?: boolean
  mine?: boolean
}

export function PropertyOpportunities({ saved = false, mine = false }: PropertyOpportunitiesProps) {
  // Filter properties based on props
  let filteredProperties = properties
  if (saved) {
    filteredProperties = properties.filter((property) => property.saved)
  } else if (mine) {
    filteredProperties = properties.filter((property) => property.mine)
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredProperties.map((property) => (
        <Card key={property.id} className="overflow-hidden">
          <div className="relative">
            <Image
              src={property.image || "/placeholder.svg"}
              alt={property.title}
              width={300}
              height={200}
              className="h-48 w-full object-cover"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/80 text-rose-500 backdrop-blur-sm hover:bg-white/70 hover:text-rose-600"
            >
              <Heart className="h-4 w-4" />
              <span className="sr-only">Save property</span>
            </Button>
            <Badge className="absolute left-2 top-2">{property.type}</Badge>
          </div>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold">{property.title}</h3>
                <Badge variant="outline" className="ml-2">
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
                  <span className="font-medium">${property.investmentRequired.toLocaleString()}</span>
                </div>
              </div>
              <div className="pt-2 text-sm">
                <div className="flex items-start">
                  <Users className="mr-1 mt-0.5 h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-muted-foreground">{property.partnerRequirements}</p>
                </div>
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
      ))}
    </div>
  )
}

