import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight, Building2, Users, TrendingUp, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecentMatches } from "@/components/dashboard/recent-matches"
import { PropertyOpportunities } from "@/components/dashboard/property-opportunities"
import { ProfileCompletion } from "@/components/dashboard/profile-completion"

export const metadata: Metadata = {
  title: "Dashboard - CoListr",
  description: "Manage your real estate co-investment opportunities",
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your co-investment activities.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+4 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Opportunities</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investment Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1.2M</div>
            <p className="text-xs text-muted-foreground">+$250K from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Connections</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Recent Matches</CardTitle>
            <CardDescription>Your latest partner matches based on your preferences.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentMatches />
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="ml-auto" asChild>
              <Link href="/match">
                View all matches
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Profile Completion</CardTitle>
            <CardDescription>Complete your profile to improve match quality.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileCompletion />
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="ml-auto" asChild>
              <Link href="/profile">
                Complete profile
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Opportunities</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
            <TabsTrigger value="mine">My Listings</TabsTrigger>
          </TabsList>
          <Button asChild>
            <Link href="/opportunities/create">Add New Opportunity</Link>
          </Button>
        </div>
        <TabsContent value="all" className="space-y-4">
          <PropertyOpportunities />
        </TabsContent>
        <TabsContent value="saved" className="space-y-4">
          <PropertyOpportunities saved />
        </TabsContent>
        <TabsContent value="mine" className="space-y-4">
          <PropertyOpportunities mine />
        </TabsContent>
      </Tabs>
    </div>
  )
}

