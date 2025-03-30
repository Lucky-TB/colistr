"use server"

import { createActionSupabaseClient } from "@/lib/supabase"

export async function getUserStats(userId: string): Promise<{
  opportunitiesCount: number
  connectionsCount: number
  savedCount: number
  messagesCount: number
}> {
  const supabase = createActionSupabaseClient()

  // Get opportunities count
  const { count: opportunitiesCount } = await supabase
    .from("opportunities")
    .select("*", { count: "exact" })
    .eq("user_id", userId)

  // Get connections count
  const { count: connectionsCount } = await supabase
    .from("connections")
    .select("*", { count: "exact" })
    .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`)
    .eq("status", "accepted")

  // Get saved opportunities count
  const { count: savedCount } = await supabase
    .from("saved_opportunities")
    .select("*", { count: "exact" })
    .eq("user_id", userId)

  // Get messages count
  const { count: messagesCount } = await supabase
    .from("messages")
    .select("*", { count: "exact" })
    .eq("sender_id", userId)

  return {
    opportunitiesCount: opportunitiesCount || 0,
    connectionsCount: connectionsCount || 0,
    savedCount: savedCount || 0,
    messagesCount: messagesCount || 0,
  }
}

export async function getActivityTimeline(
  userId: string,
  limit = 10,
): Promise<
  {
    type: string
    title: string
    date: string
    id: string
  }[]
> {
  const supabase = createActionSupabaseClient()

  // Get recent opportunities
  const { data: opportunities } = await supabase
    .from("opportunities")
    .select("id, title, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  // Get recent connections
  const { data: connections } = await supabase
    .from("connections")
    .select(`
      id, 
      status, 
      created_at, 
      updated_at,
      requester:profiles!connections_requester_id_fkey(full_name),
      recipient:profiles!connections_recipient_id_fkey(full_name)
    `)
    .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`)
    .order("updated_at", { ascending: false })
    .limit(limit)

  // Get recent saved opportunities
  const { data: savedOpportunities } = await supabase
    .from("saved_opportunities")
    .select(`
      id, 
      created_at,
      opportunities!saved_opportunities_opportunity_id_fkey(id, title)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  // Combine and format the data
  const timeline: {
    type: string
    title: string
    date: string
    id: string
  }[] = []

  opportunities?.forEach((opp) => {
    timeline.push({
      type: "opportunity",
      title: `Created opportunity: ${opp.title}`,
      date: opp.created_at,
      id: opp.id,
    })
  })

  connections?.forEach((conn) => {
    const isRequester = conn.requester.full_name !== null
    const otherPerson = isRequester ? conn.recipient.full_name : conn.requester.full_name

    let title = ""
    if (conn.status === "pending") {
      title = isRequester
        ? `Sent connection request to ${otherPerson}`
        : `Received connection request from ${otherPerson}`
    } else if (conn.status === "accepted") {
      title = `Connected with ${otherPerson}`
    }

    timeline.push({
      type: "connection",
      title,
      date: conn.updated_at,
      id: conn.id,
    })
  })

  savedOpportunities?.forEach((saved) => {
    if (saved.opportunities) {
      timeline.push({
        type: "saved",
        title: `Saved opportunity: ${saved.opportunities.title}`,
        date: saved.created_at,
        id: saved.id,
      })
    }
  })

  // Sort by date (newest first)
  return timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, limit)
}

export async function getOpportunityViewStats(userId: string): Promise<
  {
    opportunityId: string
    title: string
    views: number
  }[]
> {
  const supabase = createActionSupabaseClient()

  // In a real app, you would have a table to track views
  // For now, we'll return mock data based on the user's opportunities

  const { data: opportunities } = await supabase.from("opportunities").select("id, title").eq("user_id", userId)

  if (!opportunities) {
    return []
  }

  // Generate random view counts for demo purposes
  return opportunities.map((opp) => ({
    opportunityId: opp.id,
    title: opp.title,
    views: Math.floor(Math.random() * 100) + 1, // Random number between 1-100
  }))
}

export async function getConnectionStats(userId: string): Promise<{
  pending: number
  accepted: number
  total: number
  sentVsReceived: { sent: number; received: number }
}> {
  const supabase = createActionSupabaseClient()

  // Get all connections
  const { data: connections, error } = await supabase
    .from("connections")
    .select("id, requester_id, recipient_id, status")
    .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`)

  if (error || !connections) {
    console.error("Error fetching connection stats:", error)
    return {
      pending: 0,
      accepted: 0,
      total: 0,
      sentVsReceived: { sent: 0, received: 0 },
    }
  }

  const pending = connections.filter((conn) => conn.status === "pending").length
  const accepted = connections.filter((conn) => conn.status === "accepted").length
  const total = connections.length

  const sent = connections.filter((conn) => conn.requester_id === userId).length
  const received = connections.filter((conn) => conn.recipient_id === userId).length

  return {
    pending,
    accepted,
    total,
    sentVsReceived: { sent, received },
  }
}

