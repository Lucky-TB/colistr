"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2, Plus, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useSupabase } from "@/components/providers/supabase-provider"
import { createOpportunity } from "@/actions/opportunities"
import { uploadImage } from "@/actions/storage"

export default function CreateOpportunityPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useSupabase()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    investmentRequired: "",
    roi: "",
    type: "",
    timeline: "",
    partnerRequirements: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files)
      setImages((prev) => [...prev, ...newImages])

      // Create preview URLs
      const newImageUrls = newImages.map((file) => URL.createObjectURL(file))
      setImageUrls((prev) => [...prev, ...newImageUrls])
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(imageUrls[index])
    setImageUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create an opportunity.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Upload images
      const uploadedImageUrls: string[] = []

      for (const image of images) {
        const { url, error } = await uploadImage(image)
        if (error || !url) {
          throw new Error(`Failed to upload image: ${error || "Unknown error"}`)
        }
        uploadedImageUrls.push(url)
      }

      // Create opportunity
      const { success, id, error } = await createOpportunity({
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        price: Number.parseFloat(formData.price),
        investment_required: Number.parseFloat(formData.investmentRequired),
        roi: Number.parseFloat(formData.roi),
        type: formData.type,
        timeline: formData.timeline,
        partner_requirements: formData.partnerRequirements,
        images: uploadedImageUrls,
      })

      if (!success || error) {
        throw new Error(`Failed to create opportunity: ${error || "Unknown error"}`)
      }

      toast({
        title: "Opportunity created",
        description: "Your investment opportunity has been successfully created.",
      })

      // Redirect to the new opportunity page
      router.push(`/opportunities/${id}`)
    } catch (error) {
      console.error("Error creating opportunity:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create opportunity. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const propertyTypes = [
    { value: "Residential", label: "Residential" },
    { value: "Commercial", label: "Commercial" },
    { value: "Mixed-Use", label: "Mixed-Use" },
    { value: "Vacation", label: "Vacation" },
    { value: "Retail", label: "Retail" },
    { value: "Industrial", label: "Industrial" },
  ]

  const timelineOptions = [
    { value: "0-6 months", label: "0-6 months" },
    { value: "6-12 months", label: "6-12 months" },
    { value: "12-18 months", label: "12-18 months" },
    { value: "18-24 months", label: "18-24 months" },
    { value: "24-36 months", label: "24-36 months" },
    { value: "36+ months", label: "36+ months" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold mb-2">Create Investment Opportunity</h1>
        <p className="text-muted-foreground mb-8">
          Share your property investment opportunity with potential partners.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
            <CardDescription>Provide detailed information about your investment opportunity.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Property Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Luxury Apartment Complex"
                    required
                  />
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
                  <Label htmlFor="price">Total Property Price ($) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g., 2500000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="investmentRequired">Investment Required ($) *</Label>
                  <Input
                    id="investmentRequired"
                    name="investmentRequired"
                    type="number"
                    value={formData.investmentRequired}
                    onChange={handleChange}
                    placeholder="e.g., 500000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roi">Expected ROI (%) *</Label>
                  <Input
                    id="roi"
                    name="roi"
                    type="number"
                    step="0.1"
                    value={formData.roi}
                    onChange={handleChange}
                    placeholder="e.g., 12.5"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Property Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)} required>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeline">Investment Timeline *</Label>
                  <Select
                    value={formData.timeline}
                    onValueChange={(value) => handleSelectChange("timeline", value)}
                    required
                  >
                    <SelectTrigger id="timeline">
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      {timelineOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Property Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide a detailed description of the property and investment opportunity..."
                  rows={5}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="partnerRequirements">Partner Requirements *</Label>
                <Textarea
                  id="partnerRequirements"
                  name="partnerRequirements"
                  value={formData.partnerRequirements}
                  onChange={handleChange}
                  placeholder="Describe what you're looking for in potential partners..."
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Property Images</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative rounded-md overflow-hidden h-40">
                      <img
                        src={url || "/placeholder.svg"}
                        alt={`Property image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                        onClick={() => removeImage(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <label className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md h-40 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Upload Image</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} multiple />
                  </label>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Opportunity
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}

