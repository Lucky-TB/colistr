"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Clock,
  DollarSign,
  Percent,
  Users,
  MessageSquare,
  Edit,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useSupabase } from "@/components/providers/supabase-provider"
import { getOpportunity, deleteOpportunity, saveOpportunity, unsaveOpportunity, isSaved } from "@/actions/opportunities"
import { getProfile } from "@/actions/profiles"
import type { Database } from "@/types/supabase"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type Opportunity = Database["public"]["Tables"]["opportunities"]["Row"] & {
  profiles?: Database["public"]["Tables"]["profiles"]["Row"]
}

export default function OpportunityDetail({ id }: { id: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useSupabase()

  const [opportunity, setOpportunity] = useState<Opportunity | null>(null)
  const [owner, setOwner] = useState<Database["public"]["Tables"]["profiles"]["Row"] | null>(null)
  const [isSavedByUser, setIsSavedByUser] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const opportunityData = await getOpportunity(id)

        if (!opportunityData) {
          toast({
            title: "Not found",
            description: "This opportunity could not be found.",
            variant: "destructive",
          })
          router.push("/opportunities")
          return
        }

        setOpportunity(opportunityData)

        if (opportunityData.user_id) {
          const ownerProfile = await getProfile(opportunityData.user_id)
          setOwner(ownerProfile)
        }

        // Set the first image as selected
        if (opportunityData.images && opportunityData.images.length > 0) {
          setSelectedImage(opportunityData.images[0])
        }

        // Check if saved by current user
        if (user) {
          const saved = await isSaved(user.id, id)
          setIsSavedByUser(saved)
        }
      } catch (error) {
        console.error("Error fetching opportunity:", error)
        toast({
          title: "Error",
          description: "Failed to load opportunity details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchOpportunity()
  }, [id, user, toast, router])

  const handleToggleSave = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save this opportunity.",
        variant: "destructive",
      })
      return
    }

    try {
      if (isSavedByUser) {
        await unsaveOpportunity(user.id, id)
      } else {
        await saveOpportunity(user.id, id)
      }

      setIsSavedByUser(!isSavedByUser)

      toast({
        title: isSavedByUser ? "Removed from saved" : "Saved to favorites",
        description: isSavedByUser
          ? "Opportunity removed from your saved list"
          : "Opportunity added to your saved list",
      })
    } catch (error) {
      console.error("Error toggling saved status:", error)
      toast({
        title: "Error",
        description: "Failed to update saved status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: opportunity?.title || "Investment Opportunity",
          text: `Check out this investment opportunity: ${opportunity?.title}`,
          url: window.location.href,
        })
        .catch((error) => {
          console.error("Error sharing:", error)
        })
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "The link has been copied to your clipboard.",
      })
    }
  }

  const handleDelete = async () => {
    if (!user || !opportunity) return

    if (user.id !== opportunity.user_id) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to delete this opportunity.",
        variant: "destructive",
      })
      return
    }

    setIsDeleting(true)

    try {
      const { success, error } = await deleteOpportunity(id)

      if (!success || error) {
        throw new Error(`Failed to delete opportunity: ${error || "Unknown error"}`)
      }

      toast({
        title: "Opportunity deleted",
        description: "The investment opportunity has been successfully deleted.",
      })

      router.push("/opportunities")
    } catch (error) {
      console.error("Error deleting opportunity:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete opportunity. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  if (isLoading) {
    return <div>Loading opportunity details...</div>
  }

  if (!opportunity) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Opportunity Not Found</h2>
        <p className="text-muted-foreground mb-6">The investment opportunity you're looking for could not be found.</p>
        <Button asChild>
          <Link href="/opportunities">Browse Opportunities</Link>
        </Button>
      </div>
    )
  }

  const isOwner = user?.id === opportunity.user_id

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <Button variant="ghost" onClick={() => router.back()} className="p-0 h-auto">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Opportunities
        </Button>

        <div className="flex-1" />

        <div className="flex gap-2">
          {isOwner && (
            <>
              <Button variant="outline" asChild>
                <Link href={`/opportunities/${id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
              <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </>
          )}

          {!isOwner && (
            <>
              <Button
                variant={isSavedByUser ? "default" : "outline"}
                className={isSavedByUser ? "bg-rose-500 hover:bg-rose-600" : ""}
                onClick={handleToggleSave}
              >
                <Heart className="mr-2 h-4 w-4" fill={isSavedByUser ? "currentColor" : "none"} />
                {isSavedByUser ? "Saved" : "Save"}
              </Button>
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative rounded-lg overflow-hidden h-[400px]">
            <Image
              src={selectedImage || opportunity.images?.[0] || "/placeholder.svg?height=400&width=800"}
              alt={opportunity.title}
              fill
              className="object-cover"
              priority
            />
            <Badge className="absolute left-4 top-4">{opportunity.type}</Badge>
          </div>

          {opportunity.images && opportunity.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {opportunity.images.map((image, index) => (
                <div
                  key={index}
                  className={`relative h-20 w-20 flex-shrink-0 rounded cursor-pointer overflow-hidden ${
                    selectedImage === image ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Property image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          <div>
            <h1 className="text-3xl font-bold mb-2">{opportunity.title}</h1>
            <div className="flex items-center text-muted-foreground mb-4">
              <MapPin className="mr-1 h-4 w-4" />
              {opportunity.location}
            </div>

            <p className="whitespace-pre-line">{opportunity.description}</p>
          </div>

          <Separator />

          <div>
            <h2 className="text-xl font-semibold mb-4">Partner Requirements</h2>
            <p className="whitespace-pre-line">{opportunity.partner_requirements}</p>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Investment Details</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-lg font-semibold">${opportunity.price.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Investment</p>
                  <p className="text-lg font-semibold">${opportunity.investment_required.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ROI</p>
                  <p className="text-lg font-semibold">{opportunity.roi}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Timeline</p>
                  <p className="text-lg font-semibold">{opportunity.timeline}</p>
                </div>
              </div>

              <div className="flex items-center mt-6">
                <DollarSign className="h-5 w-5 text-primary mr-2" />
                <p className="text-sm">
                  <span className="font-medium">Investment Required:</span> $
                  {opportunity.investment_required.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center mt-2">
                <Percent className="h-5 w-5 text-primary mr-2" />
                <p className="text-sm">
                  <span className="font-medium">Expected ROI:</span> {opportunity.roi}%
                </p>
              </div>
              <div className="flex items-center mt-2">
                <Clock className="h-5 w-5 text-primary mr-2" />
                <p className="text-sm">
                  <span className="font-medium">Timeline:</span> {opportunity.timeline}
                </p>
              </div>
              <div className="flex items-center mt-2">
                <Users className="h-5 w-5 text-primary mr-2" />
                <p className="text-sm">
                  <span className="font-medium">Partners Needed:</span>{" "}
                  {opportunity.partner_requirements?.match(/\d+/)?.[0] || "Multiple"}
                </p>
              </div>

              {!isOwner && (
                <Button className="w-full mt-6" asChild>
                  <Link href={`/messages/new?partner=${opportunity.user_id}`}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact Owner
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {owner && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Listed By</h3>

                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={owner.avatar_url || "/placeholder.svg?height=48&width=48"}
                    alt={owner.full_name || "Profile"}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{owner.full_name}</p>
                    <p className="text-sm text-muted-foreground">{owner.role}</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{owner.bio}</p>
              </CardContent>
              <CardFooter className="px-6 pb-6 pt-0">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/partners/${owner.id}`}>View Profile</Link>
                </Button>
              </CardFooter>
            </Card>
          )}

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Property Details</h3>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium">{opportunity.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium">{opportunity.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Listed:</span>
                  <span className="font-medium">{new Date(opportunity.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this investment opportunity.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}

