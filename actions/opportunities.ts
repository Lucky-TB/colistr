"use server"

import { createActionSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import type { Database } from "@/types/supabase"

type Opportunity = Database["public"]["Tables"]["opportunities"]["Row"]
type OpportunityInsert = Database["public"]["Tables"]["opportunities"]["Insert"]
type OpportunityUpdate = Database["public"]["Tables"]["opportunities"]["Update"]

export async function getOpportunity(id: string): Promise<Opportunity | null> {
  const supabase = createActionSupabaseClient()

  const { data, error } = await supabase.from("opportunities").select("*, profiles(*)").eq("id", id).single()

  if (error) {
    console.error("Error fetching opportunity:", error)
    return null
  }

  return data
}

export async function createOpportunity(
  opportunity: OpportunityInsert,
): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabase = createActionSupabaseClient()

  const { data, error } = await supabase.from("opportunities").insert(opportunity).select("id").single()

  if (error) {
    console.error("Error creating opportunity:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/opportunities")
  revalidatePath("/dashboard")

  return { success: true, id: data.id }
}

export async function updateOpportunity(opportunity: OpportunityUpdate): Promise<{ success: boolean; error?: string }> {
  const supabase = createActionSupabaseClient()

  const { error } = await supabase
    .from("opportunities")
    .update({
      ...opportunity,
      updated_at: new Date().toISOString(),
    })
    .eq("id", opportunity.id!)

  if (error) {
    console.error("Error updating opportunity:", error)
    return { success: false, error: error.message }
  }

  revalidatePath(`/opportunities/${opportunity.id}`)
  revalidatePath("/opportunities")
  revalidatePath("/dashboard")

  return { success: true }
}

export async function deleteOpportunity(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createActionSupabaseClient()

  const { error } = await supabase.from("opportunities").delete().eq("id", id)

  if (error) {
    console.error("Error deleting opportunity:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/opportunities")
  revalidatePath("/dashboard")

  return { success: true }
}

export async function getOpportunities(params?: {
  search?: string
  location?: string
  types?: string[]
  minPrice?: number
  maxPrice?: number
  minRoi?: number
  maxRoi?: number
  userId?: string
  saved?: boolean
  limit?: number
  offset?: number
  sortBy?: string
}): Promise<{ opportunities: Opportunity[]; count: number }> {
  const supabase = createActionSupabaseClient()

  let query = supabase.from("opportunities").select("*, profiles!opportunities_user_id_fkey(*)", { count: "exact" })

  // Apply filters
  if (params?.search) {
    query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`)
  }

  if (params?.location) {
    query = query.ilike("location", `%${params.location}%`)
  }

  if (params?.types && params.types.length > 0) {
    query = query.in("type", params.types)
  }

  if (params?.minPrice !== undefined) {
    query = query.gte("price", params.minPrice)
  }

  if (params?.maxPrice !== undefined) {
    query = query.lte("price", params.maxPrice)
  }

  if (params?.minRoi !== undefined) {
    query = query.gte("roi", params.minRoi)
  }

  if (params?.maxRoi !== undefined) {
    query = query.lte("roi", params.maxRoi)
  }

  if (params?.userId) {
    query = query.eq("user_id", params.userId)
  }

  // Sorting
  if (params?.sortBy) {
    switch (params.sortBy) {
      case "price-low":
        query = query.order("price", { ascending: true })
        break
      case "price-high":
        query = query.order("price", { ascending: false })
        break
      case "roi-high":
        query = query.order("roi", { ascending: false })
        break
      case "investment-low":
        query = query.order("investment_required", { ascending: true })
        break
      case "latest":
      default:
        query = query.order("created_at", { ascending: false })
        break
    }
  } else {
    query = query.order("created_at", { ascending: false })
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
    console.error("Error fetching opportunities:", error)
    return { opportunities: [], count: 0 }
  }

  // If we need to filter by saved opportunities, we need to do an additional query
  if (params?.saved && params.userId) {
    const { data: savedOpps, error: savedError } = await supabase
      .from("saved_opportunities")
      .select("opportunity_id")
      .eq("user_id", params.userId)

    if (savedError) {
      console.error("Error fetching saved opportunities:", savedError)
      return { opportunities: [], count: 0 }
    }

    const savedIds = savedOpps.map((item) => item.opportunity_id)
    const filteredData = data.filter((opp) => savedIds.includes(opp.id))

    return { opportunities: filteredData, count: filteredData.length }
  }

  return { opportunities: data || [], count: count || 0 }
}

export async function saveOpportunity(
  userId: string,
  opportunityId: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createActionSupabaseClient()

  const { error } = await supabase.from("saved_opportunities").insert({
    user_id: userId,
    opportunity_id: opportunityId,
  })

  if (error) {
    // If the error is because the record already exists, we'll consider it a success
    if (error.code === "23505") {
      // Unique violation
      return { success: true }
    }
    console.error("Error saving opportunity:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/opportunities")
  revalidatePath("/dashboard")

  return { success: true }
}

export async function unsaveOpportunity(
  userId: string,
  opportunityId: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createActionSupabaseClient()

  const { error } = await supabase.from("saved_opportunities").delete().match({
    user_id: userId,
    opportunity_id: opportunityId,
  })

  if (error) {
    console.error("Error unsaving opportunity:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/opportunities")
  revalidatePath("/dashboard")

  return { success: true }
}

export async function isSaved(userId: string, opportunityId: string): Promise<boolean> {
  const supabase = createActionSupabaseClient()

  const { data, error } = await supabase
    .from("saved_opportunities")
    .select("id")
    .match({
      user_id: userId,
      opportunity_id: opportunityId,
    })
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned
      return false
    }
    console.error("Error checking if opportunity is saved:", error)
    return false
  }

  return !!data
}

