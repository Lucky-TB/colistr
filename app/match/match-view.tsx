"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { MapPin, Briefcase, DollarSign, MessageSquare, UserPlus, Check, Clock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { useSupabase } from "@/components/providers/supabase-provider"
import { findMatches, getConnectionStatus, createConnection } from "@/actions/matching"
import { getOrCreateConversation } from "@/actions/messages"
import type { Database } from "@/types/supabase"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

interface MatchScore {
  profile: Profile
  score: number
  matchReasons: string[]
}

export default function MatchView() {
  const { toast } = useToast()
  const { user } = useSupabase()

  const [matches, setMatches] = useState<MatchScore[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<
    Record<string, { connected: boolean; status: string | null }>
  >({})
  const [connectingIds, setConnectingIds] = useState<string[]>([])
  const [messagingIds, setMessagingIds] = useState<string[]>([])

  useEffect(() => {
    const fetchMatches = async () => {
      if (!user) return

      try {
        const matchesData = await findMatches(user.id)
        setMatches(matchesData)

        // Get connection status for each match
        const statuses: Record<string, { connected: boolean; status: string | null }> = {}

        for (const match of matchesData) {
          const status = await getConnectionStatus(user.id, match.profile.id)
          statuses[match.profile.id] = status
        }

        setConnectionStatus(statuses)
      } catch (error) {
        console.error("Error fetching matches:", error)
        toast({
          title: "Error",
          description: "Failed to load partner matches. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchMatches()
  }, [user, toast])

  const handleConnect = async (profileId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to connect with partners.",
        variant: "destructive",
      })
      return
    }

    setConnectingIds((prev) => [...prev, profileId])

    try {
      const { success, error } = await createConnection(user.id, profileId)

      if (!success || error) {
        throw new Error(`Failed to connect: ${error || "Unknown error"}`)
      }

      // Update local state
      setConnectionStatus((prev) => ({
        ...prev,
        [profileId]: { connected: true, status: "pending" },
      }))

      toast({
        title: "Connection request sent",
        description: "Your connection request has been sent successfully.",
      })
    } catch (error) {
      console.error("Error connecting:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send connection request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setConnectingIds((prev) => prev.filter((id) => id !== profileId))
    }
  }

  const handleMessage = async (profileId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to message partners.",
        variant: "destructive",
      })
      return
    }

    setMessagingIds((prev) => [...prev, profileId])

    try {
      const { conversationId, error } = await getOrCreateConversation(user.id, profileId)

      if (!conversationId || error) {
        throw new Error(`Failed to create conversation: ${error || "Unknown error"}`)
      }

      // Redirect to messages page
      window.location.href = `/messages?id=${conversationId}`
    } catch (error) {
      console.error("Error creating conversation:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create conversation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setMessagingIds((prev) => prev.filter((id) => id !== profileId))
    }
  }

  const getConnectionStatusText = (profileId: string) => {
    const status = connectionStatus[profileId]

    if (!status || !status.connected) {
      return null
    }

    switch (status.status) {
      case "pending":
        return "Connection Pending"
      case "accepted":
        return "Connected"
      case "rejected":
        return "Connection Declined"
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-12">
          <UserPlus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Matches Found</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            We couldn't find any matches based on your profile. Try updating your profile with more information to
            improve matching.
          </p>
          <Button asChild>
            <Link href="/profile/edit">Update Profile</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map(({ profile, score, matchReasons }) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full flex flex-col">
                <CardContent className="p-6 flex-grow">
                  <div className="flex items-center gap-4 mb-4">
                    <Image
                      src={profile.avatar_url || "/placeholder.svg?height=64&width=64"}
                      alt={profile.full_name || "Profile"}
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold">{profile.full_name}</h3>
                      <p className="text-sm text-muted-foreground">{profile.role}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Match Score</span>
                      <span className="text-sm font-medium">{score}%</span>
                    </div>
                    <Progress value={score} className="h-2" />
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      {profile.location || "Location not specified"}
                    </div>
                    <div className="flex items-center text-sm">
                      <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                      {profile.experience} years experience
                    </div>
                    <div className="flex items-center text-sm">
                      <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                      {profile.investment_capacity || "Investment capacity not specified"}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Why you match:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {matchReasons.map((reason, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="mr-1 h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {profile.specialties?.map((specialty, index) => (
                      <Badge key={index} variant="outline">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-0 flex justify-between gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleMessage(profile.id)}
                    disabled={messagingIds.includes(profile.id)}
                  >
                    {messagingIds.includes(profile.id) ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <MessageSquare className="mr-2 h-4 w-4" />
                    )}
                    Message
                  </Button>

                  {connectionStatus[profile.id]?.connected ? (
                    <Button variant="secondary" className="flex-1" disabled>
                      {connectionStatus[profile.id]?.status === "pending" ? (
                        <Clock className="mr-2 h-4 w-4" />
                      ) : (
                        <Check className="mr-2 h-4 w-4" />
                      )}
                      {getConnectionStatusText(profile.id)}
                    </Button>
                  ) : (
                    <Button
                      className="flex-1"
                      onClick={() => handleConnect(profile.id)}
                      disabled={connectingIds.includes(profile.id)}
                    >
                      {connectingIds.includes(profile.id) ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <UserPlus className="mr-2 h-4 w-4" />
                      )}
                      Connect
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

