"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Search, MessageSquare } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useSupabase } from "@/components/providers/supabase-provider"
import { getConversations, markMessagesAsRead } from "@/actions/messages"
import type { Database } from "@/types/supabase"
import { formatDistanceToNow } from "date-fns"
import ChatWindow from "@/components/messages/chat-window"

type Conversation = {
  id: string
  participant: Database["public"]["Tables"]["profiles"]["Row"]
  last_message: {
    id: string
    content: string
    sender_id: string
    created_at: string
    read: boolean
  } | null
  unread_count: number
}

export default function MessagesView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { user } = useSupabase()

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(searchParams.get("id") || null)

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return

      try {
        const { conversations } = await getConversations(user.id)
        setConversations(conversations)
      } catch (error) {
        console.error("Error fetching conversations:", error)
        toast({
          title: "Error",
          description: "Failed to load conversations. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchConversations()

    // Set up polling for new messages
    const intervalId = setInterval(fetchConversations, 10000) // Poll every 10 seconds

    return () => clearInterval(intervalId)
  }, [user, toast])

  useEffect(() => {
    // Update selected conversation from URL
    const conversationId = searchParams.get("id")
    if (conversationId) {
      setSelectedConversationId(conversationId)
    }
  }, [searchParams])

  const handleSelectConversation = async (conversationId: string) => {
    setSelectedConversationId(conversationId)

    // Update URL
    router.push(`/messages?id=${conversationId}`, { scroll: false })

    // Mark messages as read
    if (user) {
      try {
        await markMessagesAsRead(conversationId, user.id)

        // Update local state to reflect read status
        setConversations((prev) =>
          prev.map((conv) => (conv.id === conversationId ? { ...conv, unread_count: 0 } : conv)),
        )
      } catch (error) {
        console.error("Error marking messages as read:", error)
      }
    }
  }

  const filteredConversations = conversations.filter((conv) =>
    conv.participant.full_name?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const selectedConversation = conversations.find((conv) => conv.id === selectedConversationId)

  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search conversations..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          {isLoading ? (
            Array(3)
              .fill(null)
              .map((_, i) => (
                <Card key={i} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
                      <div className="h-3 w-1/2 bg-gray-200 animate-pulse rounded" />
                    </div>
                  </div>
                </Card>
              ))
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No conversations yet</p>
              <p className="text-sm text-muted-foreground">Start a conversation by visiting a user's profile</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className={`p-4 cursor-pointer hover:bg-accent transition-colors ${
                    selectedConversationId === conversation.id ? "bg-accent" : ""
                  }`}
                  onClick={() => handleSelectConversation(conversation.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Image
                        src={conversation.participant.avatar_url || "/placeholder.svg?height=40&width=40"}
                        alt={conversation.participant.full_name || "User"}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      {conversation.unread_count > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-primary">
                          {conversation.unread_count}
                        </Badge>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-medium truncate">{conversation.participant.full_name}</p>
                        {conversation.last_message && (
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(conversation.last_message.created_at), { addSuffix: false })}
                          </p>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.last_message ? (
                          <>
                            {conversation.last_message.sender_id === user?.id && "You: "}
                            {conversation.last_message.content}
                          </>
                        ) : (
                          "No messages yet"
                        )}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <div>
        {selectedConversation ? (
          <ChatWindow conversationId={selectedConversation.id} participant={selectedConversation.participant} />
        ) : (
          <Card className="h-[600px] flex flex-col items-center justify-center p-6">
            <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Conversation Selected</h3>
            <p className="text-muted-foreground text-center mb-6">
              Select a conversation from the list or start a new one by visiting a user's profile.
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}

