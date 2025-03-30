"use server"

import { createActionSupabaseClient } from "@/lib/supabase"
import { getProfile } from "./profiles"
import type { Database } from "@/types/supabase"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

interface MatchScore {
  profile: Profile
  score: number
  matchReasons: string[]
}

export async function findMatches(userId: string, limit = 10): Promise<MatchScore[]> {
  const supabase = createActionSupabaseClient()

  // Get the user's profile
  const userProfile = await getProfile(userId)

  if (!userProfile) {
    throw new Error("User profile not found")
  }

  // Get all other profiles
  const { data: profiles, error } = await supabase.from("profiles").select("*").neq("id", userId)

  if (error) {
    console.error("Error fetching profiles:", error)
    return []
  }

  // Calculate match scores
  const matches: MatchScore[] = profiles.map((profile) => {
    const { score, matchReasons } = calculateMatchScore(userProfile, profile)
    return { profile, score, matchReasons }
  })

  // Sort by score (highest first) and limit
  return matches.sort((a, b) => b.score - a.score).slice(0, limit)
}

function calculateMatchScore(userProfile: Profile, otherProfile: Profile): { score: number; matchReasons: string[] } {
  let score = 0
  const matchReasons: string[] = []

  // Location match (20 points)
  if (userProfile.location && otherProfile.location) {
    // Simple string comparison for now, could be improved with geocoding
    if (userProfile.location.toLowerCase() === otherProfile.location.toLowerCase()) {
      score += 20
      matchReasons.push("Same location")
    } else if (
      userProfile.location.split(",")[0].trim().toLowerCase() ===
      otherProfile.location.split(",")[0].trim().toLowerCase()
    ) {
      // Same city
      score += 15
      matchReasons.push("Same city")
    }
  }

  // Specialties match (30 points max)
  if (userProfile.specialties && otherProfile.specialties) {
    const commonSpecialties = userProfile.specialties.filter((s) => otherProfile.specialties?.includes(s))

    if (commonSpecialties.length > 0) {
      // 10 points per common specialty, max 30
      const specialtyScore = Math.min(commonSpecialties.length * 10, 30)
      score += specialtyScore

      if (commonSpecialties.length === 1) {
        matchReasons.push(`Common specialty: ${commonSpecialties[0]}`)
      } else {
        matchReasons.push(`${commonSpecialties.length} common specialties`)
      }
    }
  }

  // Experience complementarity (15 points max)
  if (userProfile.experience !== null && otherProfile.experience !== null) {
    // If one has more experience than the other, it's a good match
    const experienceDiff = Math.abs(userProfile.experience - otherProfile.experience)

    if (experienceDiff >= 5) {
      // Significant experience difference can be complementary
      score += 15
      matchReasons.push("Complementary experience levels")
    } else if (experienceDiff >= 2) {
      // Some experience difference
      score += 10
      matchReasons.push("Similar experience levels")
    } else {
      // Very similar experience
      score += 5
      matchReasons.push("Matching experience levels")
    }
  }

  // Investment capacity complementarity (15 points max)
  if (userProfile.investment_capacity && otherProfile.investment_capacity) {
    const capacityRanges = ["Under $100K", "$100K - $250K", "$250K - $500K", "$500K - $1M", "$1M - $5M", "Over $5M"]

    const userCapacityIndex = capacityRanges.indexOf(userProfile.investment_capacity)
    const otherCapacityIndex = capacityRanges.indexOf(otherProfile.investment_capacity)

    if (userCapacityIndex !== -1 && otherCapacityIndex !== -1) {
      if (userCapacityIndex === otherCapacityIndex) {
        // Same capacity range
        score += 10
        matchReasons.push("Matching investment capacity")
      } else if (Math.abs(userCapacityIndex - otherCapacityIndex) === 1) {
        // Adjacent capacity ranges
        score += 15
        matchReasons.push("Complementary investment capacity")
      } else {
        // Different capacity ranges
        score += 5
        matchReasons.push("Different investment capacity")
      }
    }
  }

  // Role complementarity (20 points max)
  if (userProfile.role && otherProfile.role) {
    const roleGroups = [
      ["Real Estate Agent", "Realtor", "Broker"],
      ["Property Developer", "Developer"],
      ["Investment Advisor", "Financial Advisor"],
      ["Property Manager"],
    ]

    let userRoleGroup = -1
    let otherRoleGroup = -1

    roleGroups.forEach((group, index) => {
      if (group.some((role) => userProfile.role?.toLowerCase().includes(role.toLowerCase()))) {
        userRoleGroup = index
      }
      if (group.some((role) => otherProfile.role?.toLowerCase().includes(role.toLowerCase()))) {
        otherRoleGroup = index
      }
    })

    if (userRoleGroup !== -1 && otherRoleGroup !== -1) {
      if (userRoleGroup !== otherRoleGroup) {
        // Different role groups are complementary
        score += 20
        matchReasons.push("Complementary professional roles")
      } else {
        // Same role group
        score += 10
        matchReasons.push("Similar professional background")
      }
    }
  }

  // Normalize score to 0-100
  score = Math.min(Math.max(score, 0), 100)

  return { score, matchReasons }
}

export async function getConnectionStatus(
  userId: string,
  otherUserId: string,
): Promise<{ connected: boolean; status: string | null }> {
  const supabase = createActionSupabaseClient()

  const { data, error } = await supabase
    .from("connections")
    .select("status")
    .or(
      `and(requester_id.eq.${userId},recipient_id.eq.${otherUserId}),and(requester_id.eq.${otherUserId},recipient_id.eq.${userId})`,
    )
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned
      return { connected: false, status: null }
    }
    console.error("Error checking connection status:", error)
    return { connected: false, status: null }
  }

  return { connected: true, status: data.status }
}

export async function createConnection(
  requesterId: string,
  recipientId: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createActionSupabaseClient()

  // Check if connection already exists
  const { connected } = await getConnectionStatus(requesterId, recipientId)

  if (connected) {
    return { success: false, error: "Connection already exists" }
  }

  // Create connection
  const { error } = await supabase.from("connections").insert({
    requester_id: requesterId,
    recipient_id: recipientId,
    status: "pending",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })

  if (error) {
    console.error("Error creating connection:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

