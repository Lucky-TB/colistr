"use server"

import { createActionSupabaseClient } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"

export async function uploadImage(file: File, bucket = "properties"): Promise<{ url: string | null; error?: string }> {
  const supabase = createActionSupabaseClient()

  // Generate a unique file name
  const fileExt = file.name.split(".").pop()
  const fileName = `${uuidv4()}.${fileExt}`
  const filePath = `${bucket}/${fileName}`

  // Upload the file
  const { error } = await supabase.storage.from(bucket).upload(filePath, file)

  if (error) {
    console.error("Error uploading file:", error)
    return { url: null, error: error.message }
  }

  // Get the public URL
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)

  return { url: data.publicUrl }
}

export async function deleteImage(url: string, bucket = "properties"): Promise<{ success: boolean; error?: string }> {
  const supabase = createActionSupabaseClient()

  // Extract the file path from the URL
  const urlObj = new URL(url)
  const pathParts = urlObj.pathname.split("/")
  const filePath = pathParts.slice(pathParts.indexOf(bucket) + 1).join("/")

  const { error } = await supabase.storage.from(bucket).remove([filePath])

  if (error) {
    console.error("Error deleting file:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

