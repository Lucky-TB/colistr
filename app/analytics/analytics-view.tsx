"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Building2, Users, Heart, ArrowUpRight, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useSupabase } from "@/components/providers/supabase-provider"
import { getUserStats, getActivityTimeline, getOpportunityViewStats, getConnectionStats } from "@/actions/analytics"
import { formatDistanceToNow } from "date-fns"

export default function AnalyticsView() {
  const { toast } = useToast()
  const { user } = useSupabase()

  const [userStats, setUserStats] = useState({
    opportunitiesCount: 0,
    connectionsCount: 0,
    savedCount: 0,
    messagesCount: 0,
  })

  const [activityTimeline, setActivityTimeline] = useState<
    {
      type: string
      title: string
      date: string
      id: string
    }[]
  >([])

  const [opportunityViews, setOpportunityViews] = useState<
    {
      opportunityId: string
      title: string
      views: number
    }[]
  >([])

  const [connectionStats, setConnectionStats] = useState({
    pending: 0,
    accepted: 0,
    total: 0,
    sentVsReceived: { sent: 0, received: 0 },
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return

      try {
        const [stats, timeline, viewStats, connStats] = await Promise.all([
          getUserStats(user.id),
          getActivityTimeline(user.id),
          getOpportunityViewStats(user.id),
          getConnectionStats(user.id),
        ])

        setUserStats(stats)
        setActivityTimeline(timeline)
        setOpportunityViews(viewStats)
        setConnectionStats(connStats)
      } catch (error) {
        console.error("Error fetching analytics:", error)
        toast({
          title: "Error",
          description: "Failed to load analytics data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [user, toast])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "opportunity":
        return <Building2 className="h-4 w-4" />
      case "connection":
        return <Users className="h-4 w-4" />
      case "saved":
        return <Heart className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.opportunitiesCount}</div>
            <p className="text-xs text-muted-foreground">Properties you've listed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Connections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.connectionsCount}</div>
            <p className="text-xs text-muted-foreground">Active partner connections</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Saved Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.savedCount}</div>
            <p className="text-xs text-muted-foreground">Opportunities you've saved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.messagesCount}</div>
            <p className="text-xs text-muted-foreground">Total messages sent</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Connection Statistics</CardTitle>
            <CardDescription>Overview of your network connections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div>
                <h4 className="text-sm font-medium mb-2">Connection Status</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-muted rounded-md p-3 text-center">
                    <div className="text-2xl font-bold">{connectionStats.pending}</div>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                  <div className="bg-muted rounded-md p-3 text-center">
                    <div className="text-2xl font-bold">{connectionStats.accepted}</div>
                    <p className="text-xs text-muted-foreground">Accepted</p>
                  </div>
                  <div className="bg-muted rounded-md p-3 text-center">
                    <div className="text-2xl font-bold">{connectionStats.total}</div>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Sent vs. Received</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted rounded-md p-3 text-center">
                    <div className="text-2xl font-bold">{connectionStats.sentVsReceived.sent}</div>
                    <p className="text-xs text-muted-foreground">Sent</p>
                  </div>
                  <div className="bg-muted rounded-md p-3 text-center">
                    <div className="text-2xl font-bold">{connectionStats.sentVsReceived.received}</div>
                    <p className="text-xs text-muted-foreground">Received</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href="/match">
                Find More Partners
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Opportunity Views</CardTitle>
            <CardDescription>How many times your opportunities have been viewed</CardDescription>
          </CardHeader>
          <CardContent>
            {opportunityViews.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No opportunities yet</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first investment opportunity to see view statistics
                </p>
                <Button asChild>
                  <Link href="/opportunities/create">Create Opportunity</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {opportunityViews.map((opp) => (
                  <div key={opp.opportunityId} className="flex justify-between items-center">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{opp.title}</p>
                    </div>
                    <div className="ml-4 flex items-center">
                      <div className="bg-muted px-2 py-1 rounded text-sm">{opp.views} views</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href="/opportunities">
                View All Opportunities
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest actions and updates on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          {activityTimeline.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No activity yet</p>
              <p className="text-sm text-muted-foreground">Your recent actions will appear here</p>
            </div>
          ) : (
            <div className="space-y-8">
              {activityTimeline.map((activity) => (
                <div key={activity.id} className="flex">
                  <div className="mr-4 flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="h-full w-px bg-muted" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

