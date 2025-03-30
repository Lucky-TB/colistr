"use server"

import { createActionSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import type { Database } from "@/types/supabase"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]
type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"]
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"]

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = createActionSupabaseClient()

  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) {
    console.error("Error fetching profile:", error)
    return null
  }

  return data
}

export async function createProfile(profile: ProfileInsert): Promise<{ success: boolean; error?: string }> {
  const supabase = createActionSupabaseClient()

  const { error } = await supabase.from("profiles").insert(profile)

  if (error) {
    console.error("Error creating profile:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/profile")
  revalidatePath("/dashboard")

  return { success: true }
}

export async function updateProfile(profile: ProfileUpdate): Promise<{ success: boolean; error?: string }> {
  const supabase = createActionSupabaseClient()

  const { error } = await supabase.from("profiles").update(profile).eq("id", profile.id!)

  if (error) {
    console.error("Error updating profile:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/profile")
  revalidatePath("/dashboard")

  return { success: true }
}

export async function deleteProfile(userId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createActionSupabaseClient()

  const { error } = await supabase.from("profiles").delete().eq("id", userId)

  if (error) {
    console.error("Error deleting profile:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/profile")

  return { success: true }
}

export async function getProfiles(params?: {
  search?: string
  location?: string
  specialties?: string[]
  minExperience?: number
  maxExperience?: number
  investmentCapacity?: string
  limit?: number
  offset?: number
}): Promise<{ profiles: Profile[]; count: number }> {
  const supabase = createActionSupabaseClient()

  let query = supabase.from("profiles").select("*", { count: "exact" })

  // Apply filters
  if (params?.search) {
    query = query.or(`full_name.ilike.%${params.search}%,bio.ilike.%${params.search}%`)
  }

  if (params?.location) {
    query = query.ilike("location", `%${params.location}%`)
  }

  if (params?.specialties && params.specialties.length > 0) {
    query = query.overlaps("specialties", params.specialties)
  }

  if (params?.minExperience !== undefined) {
    query = query.gte("experience", params.minExperience)
  }

  if (params?.maxExperience !== undefined) {
    query = query.lte("experience", params.maxExperience)
  }

  if (params?.investmentCapacity) {
    query = query.eq("investment_capacity", params.investmentCapacity)
  }

  // Pagination
  if (params?.limit) {
    query = query.limit(params.limit)
  }

  if (params?.offset) {
    query = query.range(params.offset, params.offset + (params.limit || 10) - 1)
  }

  const { data, error, count } = await query

  if (error) {
    console.error("Error fetching profiles:", error)
    return { profiles: [], count: 0 }
  }

  return { profiles: data || [], count: count || 0 }
}

