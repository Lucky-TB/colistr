"use server"

import { createActionSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import type { Database } from "@/types/supabase"

type Connection = Database["public"]["Tables"]["connections"]["Row"]
type ConnectionInsert = Database["public"]["Tables"]["connections"]["Insert"]
type ConnectionUpdate = Database["public"]["Tables"]["connections"]["Update"]

export async function getConnection(id: string): Promise<Connection | null> {
  const supabase = createActionSupabaseClient()

  const { data, error } = await supabase.from("connections").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching connection:", error)
    return null
  }

  return data
}

export async function createConnection(
  connection: ConnectionInsert,
): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabase = createActionSupabaseClient()

  // Check if connection already exists
  const { data: existingConnection, error: checkError } = await supabase
    .from("connections")
    .select("id")
    .or(`requester_id.eq.${connection.requester_id},recipient_id.eq.${connection.requester_id}`)
    .or(`requester_id.eq.${connection.recipient_id},recipient_id.eq.${connection.recipient_id}`)
    .single()

  if (checkError && checkError.code !== "PGRST116") {
    // PGRST116 means no rows returned
    console.error("Error checking existing connection:", checkError)
    return { success: false, error: checkError.message }
  }

  if (existingConnection) {
    return { success: false, error: "Connection already exists between these users" }
  }

  const { data, error } = await supabase.from("connections").insert(connection).select("id").single()

  if (error) {
    console.error("Error creating connection:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/match")
  revalidatePath("/dashboard")

  return { success: true, id: data.id }
}

export async function updateConnectionStatus(
  id: string,
  status: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createActionSupabaseClient()

  const { error } = await supabase
    .from("connections")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating connection status:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/match")
  revalidatePath("/dashboard")

  return { success: true }
}

export async function deleteConnection(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createActionSupabaseClient()

  const { error } = await supabase.from("connections").delete().eq("id", id)

  if (error) {
    console.error("Error deleting connection:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/match")
  revalidatePath("/dashboard")

  return { success: true }
}

export async function getUserConnections(
  userId: string,
  status?: string,
): Promise<{ connections: (Connection & { profile: any })[]; count: number }> {
  const supabase = createActionSupabaseClient()

  let query = supabase
    .from("connections")
    .select(
      `
      *,
      requester:profiles!connections_requester_id_fkey(*),
      recipient:profiles!connections_recipient_id_fkey(*)
    `,
      { count: "exact" },
    )
    .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`)

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error, count } = await query

  if (error) {
    console.error("Error fetching user connections:", error)
    return { connections: [], count: 0 }
  }

  // Transform the data to include the other user's profile
  const connections = data.map((conn) => {
    const isRequester = conn.requester_id === userId
    const profile = isRequester ? conn.recipient : conn.requester

    return {
      ...conn,
      profile,
    }
  })

  return { connections, count: count || 0 }
}

export async function getPendingConnectionRequests(
  userId: string,
): Promise<{ connections: (Connection & { requester: any })[]; count: number }> {
  const supabase = createActionSupabaseClient()

  const { data, error, count } = await supabase
    .from("connections")
    .select(
      `
      *,
      requester:profiles!connections_requester_id_fkey(*)
    `,
      { count: "exact" },
    )
    .eq("recipient_id", userId)
    .eq("status", "pending")

  if (error) {
    console.error("Error fetching pending connection requests:", error)
    return { connections: [], count: 0 }
  }

  return { connections: data, count: count || 0 }
}

export async function getConnectionStatus(
  userId1: string,
  userId2: string,
): Promise<{ status: string | null; connectionId: string | null }> {
  const supabase = createActionSupabaseClient()

  const { data, error } = await supabase
    .from("connections")
    .select("id, status")
    .or(
      `and(requester_id.eq.${userId1},recipient_id.eq.${userId2}),and(requester_id.eq.${userId2},recipient_id.eq.${userId1})`,
    )
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned
      return { status: null, connectionId: null }
    }
    console.error("Error checking connection status:", error)
    return { status: null, connectionId: null }
  }

  return { status: data.status, connectionId: data.id }
}

