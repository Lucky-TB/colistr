"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Loader2, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { useSupabase } from "@/components/providers/supabase-provider"
import { getProfile, createProfile, updateProfile } from "@/actions/profiles"
import { uploadImage } from "@/actions/storage"
import type { Database } from "@/types/supabase"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

export default function ProfileEditForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useSupabase()

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    full_name: "",
    role: "",
    location: "",
    bio: "",
    experience: "",
    investment_capacity: "",
    specialties: [] as string[],
  })

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return

      try {
        const profileData = await getProfile(user.id)

        if (profileData) {
          setFormData({
            full_name: profileData.full_name || "",
            role: profileData.role || "",
            location: profileData.location || "",
            bio: profileData.bio || "",
            experience: profileData.experience?.toString() || "",
            investment_capacity: profileData.investment_capacity || "",
            specialties: profileData.specialties || [],
          })

          if (profileData.avatar_url) {
            setAvatarPreview(profileData.avatar_url)
          }
        }
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSpecialtyChange = (checked: boolean, specialty: string) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        specialties: [...prev.specialties, specialty],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        specialties: prev.specialties.filter((s) => s !== specialty),
      }))
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setAvatarFile(file)

      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setAvatarPreview(previewUrl)
    }
  }

  const removeAvatar = () => {
    setAvatarFile(null)

    // Revoke the object URL to avoid memory leaks
    if (avatarPreview && !avatarPreview.startsWith("http")) {
      URL.revokeObjectURL(avatarPreview)
    }

    setAvatarPreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to update your profile.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Upload avatar if changed
      let avatarUrl = avatarPreview

      if (avatarFile) {
        const { url, error } = await uploadImage(avatarFile, "avatars")
        if (error || !url) {
          throw new Error(`Failed to upload avatar: ${error || "Unknown error"}`)
        }
        avatarUrl = url
      }

      // Get existing profile
      const existingProfile = await getProfile(user.id)

      const profileData = {
        id: user.id,
        full_name: formData.full_name,
        avatar_url: avatarUrl,
        role: formData.role,
        location: formData.location,
        bio: formData.bio,
        experience: Number.parseInt(formData.experience) || 0,
        investment_capacity: formData.investment_capacity,
        specialties: formData.specialties,
        updated_at: new Date().toISOString(),
      }

      let result

      if (existingProfile) {
        // Update existing profile
        result = await updateProfile(profileData)
      } else {
        // Create new profile
        result = await createProfile({
          ...profileData,
          created_at: new Date().toISOString(),
        })
      }

      if (!result.success) {
        throw new Error(
          `Failed to ${existingProfile ? "update" : "create"} profile: ${result.error || "Unknown error"}`,
        )
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })

      // Redirect to profile page
      router.push("/profile")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const specialtyOptions = [
    { id: "Residential", label: "Residential" },
    { id: "Commercial", label: "Commercial" },
    { id: "Mixed-Use", label: "Mixed-Use" },
    { id: "Luxury", label: "Luxury" },
    { id: "Waterfront", label: "Waterfront" },
    { id: "Retail", label: "Retail" },
    { id: "Office", label: "Office" },
    { id: "Multi-family", label: "Multi-family" },
    { id: "Industrial", label: "Industrial" },
    { id: "Vacation", label: "Vacation" },
  ]

  const investmentCapacityOptions = [
    { value: "Under $100K", label: "Under $100K" },
    { value: "$100K - $250K", label: "$100K - $250K" },
    { value: "$250K - $500K", label: "$250K - $500K" },
    { value: "$500K - $1M", label: "$500K - $1M" },
    { value: "$1M - $5M", label: "$1M - $5M" },
    { value: "Over $5M", label: "Over $5M" },
  ]

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your profile information to help potential partners learn more about you.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
              <div className="relative">
                <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview || "/placeholder.svg"}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <Upload className="h-8 w-8" />
                    </div>
                  )}
                </div>

                {avatarPreview && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
                    onClick={removeAvatar}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}

                <div className="mt-4 flex justify-center">
                  <label className="cursor-pointer">
                    <span className="text-sm text-primary hover:underline">
                      {avatarPreview ? "Change Photo" : "Upload Photo"}
                    </span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </label>
                </div>
              </div>

              <div className="flex-1 space-y-4 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="e.g., John Doe"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Professional Role *</Label>
                    <Input
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      placeholder="e.g., Real Estate Agent"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Miami, FL"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio *</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell potential partners about yourself, your experience, and your investment approach..."
                    rows={5}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience *</Label>
                <Input
                  id="experience"
                  name="experience"
                  type="number"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g., 5"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="investment_capacity">Investment Capacity *</Label>
                <Select
                  value={formData.investment_capacity}
                  onValueChange={(value) => handleSelectChange("investment_capacity", value)}
                  required
                >
                  <SelectTrigger id="investment_capacity">
                    <SelectValue placeholder="Select investment capacity" />
                  </SelectTrigger>
                  <SelectContent>
                    {investmentCapacityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Property Specialties *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mt-2">
                {specialtyOptions.map((specialty) => (
                  <div key={specialty.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`specialty-${specialty.id}`}
                      checked={formData.specialties.includes(specialty.id)}
                      onCheckedChange={(checked) => handleSpecialtyChange(!!checked, specialty.id)}
                    />
                    <label
                      htmlFor={`specialty-${specialty.id}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {specialty.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/profile")} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  )
}

