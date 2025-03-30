"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Edit, MapPin, Briefcase, DollarSign, Star, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useSupabase } from "@/components/providers/supabase-provider"
import { getProfile } from "@/actions/profiles"
import type { Database } from "@/types/supabase"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

export default function ProfileView() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useSupabase()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return

      try {
        const profileData = await getProfile(user.id)
        setProfile(profileData)
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [user, toast])

  if (isLoading) {
    return <div>Loading profile...</div>
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Complete Your Profile</h2>
        <p className="text-muted-foreground mb-6">You need to complete your profile to get the most out of CoListr.</p>
        <Button onClick={() => router.push("/profile/edit")}>Complete Profile</Button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <Card>
            <CardContent className="p-6 flex flex-col items-center">
              <div className="relative mb-4">
                <Image
                  src={profile.avatar_url || "/placeholder.svg?height=200&width=200"}
                  alt={profile.full_name || "Profile"}
                  width={200}
                  height={200}
                  className="rounded-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold">{profile.full_name}</h2>
              <p className="text-primary mb-2">{profile.role}</p>

              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <MapPin className="mr-1 h-4 w-4" />
                {profile.location || "Location not specified"}
              </div>

              <div className="w-full flex flex-wrap gap-2 mb-6">
                {profile.specialties?.map((specialty, index) => (
                  <Badge key={index} variant="outline">
                    {specialty}
                  </Badge>
                ))}
              </div>

              <Button className="w-full" onClick={() => router.push("/profile/edit")}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-2/3">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">About</h3>
              <p className="text-muted-foreground whitespace-pre-line">{profile.bio || "No bio provided yet."}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Experience</p>
                    <p className="font-medium">{profile.experience} years</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Investment Capacity</p>
                    <p className="font-medium">{profile.investment_capacity}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                    <p className="font-medium">92%</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completed Deals</p>
                    <p className="font-medium">14</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

