"use server"

import { createActionSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import type { Database } from "@/types/supabase"

// Add message table to our Database type
interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
  read: boolean
}

interface Conversation {
  id: string
  participant1_id: string
  participant2_id: string
  last_message_at: string
  created_at: string
}

export async function getConversations(userId: string): Promise<{
  conversations: (Conversation & {
    participant: Database["public"]["Tables"]["profiles"]["Row"]
    last_message: Message | null
    unread_count: number
  })[]
  count: number
}> {
  const supabase = createActionSupabaseClient()

  // Get all conversations for the user
  const { data: conversations, error } = await supabase
    .from("conversations")
    .select(`
      *,
      participant1:profiles!conversations_participant1_id_fkey(*),
      participant2:profiles!conversations_participant2_id_fkey(*)
    `)
    .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
    .order("last_message_at", { ascending: false })

  if (error) {
    console.error("Error fetching conversations:", error)
    return { conversations: [], count: 0 }
  }

  // Transform the data to include the other participant's profile
  const transformedConversations = await Promise.all(
    conversations.map(async (conv) => {
      const isParticipant1 = conv.participant1_id === userId
      const otherParticipantId = isParticipant1 ? conv.participant2_id : conv.participant1_id
      const participant = isParticipant1 ? conv.participant2 : conv.participant1

      // Get the last message
      const { data: lastMessages } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conv.id)
        .order("created_at", { ascending: false })
        .limit(1)

      const lastMessage = lastMessages && lastMessages.length > 0 ? lastMessages[0] : null

      // Get unread count
      const { count } = await supabase
        .from("messages")
        .select("*", { count: "exact" })
        .eq("conversation_id", conv.id)
        .eq("sender_id", otherParticipantId)
        .eq("read", false)

      return {
        ...conv,
        participant,
        last_message: lastMessage,
        unread_count: count || 0,
      }
    }),
  )

  return { conversations: transformedConversations, count: transformedConversations.length }
}

export async function getConversation(conversationId: string): Promise<{
  conversation: Conversation | null
  messages: Message[]
  participants: {
    participant1: Database["public"]["Tables"]["profiles"]["Row"] | null
    participant2: Database["public"]["Tables"]["profiles"]["Row"] | null
  }
}> {
  const supabase = createActionSupabaseClient()

  // Get the conversation
  const { data: conversation, error } = await supabase
    .from("conversations")
    .select(`
      *,
      participant1:profiles!conversations_participant1_id_fkey(*),
      participant2:profiles!conversations_participant2_id_fkey(*)
    `)
    .eq("id", conversationId)
    .single()

  if (error) {
    console.error("Error fetching conversation:", error)
    return { conversation: null, messages: [], participants: { participant1: null, participant2: null } }
  }

  // Get all messages for the conversation
  const { data: messages, error: messagesError } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })

  if (messagesError) {
    console.error("Error fetching messages:", messagesError)
    return {
      conversation,
      messages: [],
      participants: {
        participant1: conversation.participant1,
        participant2: conversation.participant2,
      },
    }
  }

  return {
    conversation,
    messages: messages || [],
    participants: {
      participant1: conversation.participant1,
      participant2: conversation.participant2,
    },
  }
}

export async function getOrCreateConversation(
  userId1: string,
  userId2: string,
): Promise<{ conversationId: string | null; error?: string }> {
  const supabase = createActionSupabaseClient()

  // Check if conversation already exists
  const { data: existingConversation, error: checkError } = await supabase
    .from("conversations")
    .select("id")
    .or(
      `and(participant1_id.eq.${userId1},participant2_id.eq.${userId2}),and(participant1_id.eq.${userId2},participant2_id.eq.${userId1})`,
    )
    .single()

  if (checkError && checkError.code !== "PGRST116") {
    // PGRST116 means no rows returned
    console.error("Error checking existing conversation:", checkError)
    return { conversationId: null, error: checkError.message }
  }

  if (existingConversation) {
    return { conversationId: existingConversation.id }
  }

  // Create new conversation
  const { data: newConversation, error: createError } = await supabase
    .from("conversations")
    .insert({
      participant1_id: userId1,
      participant2_id: userId2,
      last_message_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    })
    .select("id")
    .single()

  if (createError) {
    console.error("Error creating conversation:", createError)
    return { conversationId: null, error: createError.message }
  }

  return { conversationId: newConversation.id }
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const supabase = createActionSupabaseClient()

  // Insert the message
  const { data: message, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      created_at: new Date().toISOString(),
      read: false,
    })
    .select("id")
    .single()

  if (error) {
    console.error("Error sending message:", error)
    return { success: false, error: error.message }
  }

  // Update the conversation's last_message_at
  const { error: updateError } = await supabase
    .from("conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", conversationId)

  if (updateError) {
    console.error("Error updating conversation:", updateError)
    // We still consider the message sent successfully even if updating the conversation fails
  }

  revalidatePath("/messages")
  revalidatePath(`/messages/${conversationId}`)

  return { success: true, messageId: message.id }
}

export async function markMessagesAsRead(
  conversationId: string,
  userId: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createActionSupabaseClient()

  // Get the conversation to find the other participant
  const { data: conversation, error: convError } = await supabase
    .from("conversations")
    .select("participant1_id, participant2_id")
    .eq("id", conversationId)
    .single()

  if (convError) {
    console.error("Error fetching conversation:", convError)
    return { success: false, error: convError.message }
  }

  const otherParticipantId =
    conversation.participant1_id === userId ? conversation.participant2_id : conversation.participant1_id

  // Mark all messages from the other participant as read
  const { error } = await supabase
    .from("messages")
    .update({ read: true })
    .eq("conversation_id", conversationId)
    .eq("sender_id", otherParticipantId)
    .eq("read", false)

  if (error) {
    console.error("Error marking messages as read:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/messages")
  revalidatePath(`/messages/${conversationId}`)

  return { success: true }
}

export async function getUnreadMessageCount(userId: string): Promise<number> {
  const supabase = createActionSupabaseClient()

  // Get all conversations for the user
  const { data: conversations, error } = await supabase
    .from("conversations")
    .select("id, participant1_id, participant2_id")
    .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)

  if (error) {
    console.error("Error fetching conversations:", error)
    return 0
  }

  let totalUnread = 0

  // For each conversation, count unread messages from the other participant
  for (const conv of conversations) {
    const otherParticipantId = conv.participant1_id === userId ? conv.participant2_id : conv.participant1_id

    const { count } = await supabase
      .from("messages")
      .select("*", { count: "exact" })
      .eq("conversation_id", conv.id)
      .eq("sender_id", otherParticipantId)
      .eq("read", false)

    totalUnread += count || 0
  }

  return totalUnread
}

