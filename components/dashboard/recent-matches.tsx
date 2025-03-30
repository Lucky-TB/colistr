import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare } from "lucide-react"

// Mock data for recent matches
const recentMatches = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Real Estate Agent",
    location: "New York, NY",
    matchPercentage: 92,
    avatar: "/placeholder.svg?height=40&width=40",
    specialties: ["Commercial", "Residential"],
    lastActive: "2 hours ago",
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    role: "Property Developer",
    location: "Miami, FL",
    matchPercentage: 87,
    avatar: "/placeholder.svg?height=40&width=40",
    specialties: ["Luxury", "Waterfront"],
    lastActive: "1 day ago",
  },
  {
    id: "3",
    name: "Jennifer Lee",
    role: "Investment Advisor",
    location: "Chicago, IL",
    matchPercentage: 85,
    avatar: "/placeholder.svg?height=40&width=40",
    specialties: ["Multi-family", "Commercial"],
    lastActive: "3 days ago",
  },
]

export function RecentMatches() {
  return (
    <div className="space-y-4">
      {recentMatches.map((match) => (
        <div key={match.id} className="flex items-center justify-between space-x-4 rounded-lg border p-4">
          <div className="flex items-center space-x-4">
            <Image
              src={match.avatar || "/placeholder.svg"}
              alt={match.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <div className="flex items-center">
                <h3 className="font-medium">{match.name}</h3>
                <Badge variant="secondary" className="ml-2 px-1.5 py-0.5">
                  {match.matchPercentage}% Match
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                {match.role} • {match.location}
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {match.specialties.map((specialty) => (
                  <Badge key={specialty} variant="outline" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/profile/${match.id}`}>View</Link>
            </Button>
            <Button size="sm" className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Connect</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

