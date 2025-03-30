"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useSupabase } from "@/components/providers/supabase-provider"
import { getConversation, sendMessage, markMessagesAsRead } from "@/actions/messages"
import type { Database } from "@/types/supabase"
import { formatDistanceToNow } from "date-fns"

type Message = {
  id: string
  sender_id: string
  content: string
  created_at: string
  read: boolean
}

interface ChatWindowProps {
  conversationId: string
  participant: Database["public"]["Tables"]["profiles"]["Row"]
}

export default function ChatWindow({ conversationId, participant }: ChatWindowProps) {
  const { toast } = useToast()
  const { user } = useSupabase()

  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user) return

      try {
        const { messages } = await getConversation(conversationId)
        setMessages(messages)

        // Mark messages as read
        await markMessagesAsRead(conversationId, user.id)
      } catch (error) {
        console.error("Error fetching messages:", error)
        toast({
          title: "Error",
          description: "Failed to load messages. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchMessages()

    // Set up polling for new messages
    const intervalId = setInterval(fetchMessages, 5000) // Poll every 5 seconds

    return () => clearInterval(intervalId)
  }, [conversationId, user, toast])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !newMessage.trim()) return

    setIsSending(true)

    try {
      const { success, error } = await sendMessage(conversationId, user.id, newMessage.trim())

      if (!success || error) {
        throw new Error(`Failed to send message: ${error || "Unknown error"}`)
      }

      // Add the new message to the local state
      const newMsg: Message = {
        id: Date.now().toString(), // Temporary ID
        sender_id: user.id,
        content: newMessage.trim(),
        created_at: new Date().toISOString(),
        read: false,
      }

      setMessages((prev) => [...prev, newMsg])
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Card className="p-6 flex flex-col h-[600px]">
      <div className="flex items-center gap-3 mb-6">
        <Image
          src={participant.avatar_url || "/placeholder.svg?height=40&width=40"}
          alt={participant.full_name || "User"}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          <p className="font-semibold">{participant.full_name}</p>
          <p className="text-sm text-muted-foreground">{participant.role}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-center">
            <div>
              <p className="text-muted-foreground mb-2">No messages yet</p>
              <p className="text-sm text-muted-foreground">Send a message to start the conversation</p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => {
            const isCurrentUser = message.sender_id === user?.id
            const showDate =
              index === 0 ||
              new Date(message.created_at).toDateString() !== new Date(messages[index - 1].created_at).toDateString()

            return (
              <div key={message.id}>
                {showDate && (
                  <div className="flex justify-center my-4">
                    <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                      {new Date(message.created_at).toLocaleDateString()}
                    </div>
                  </div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] ${isCurrentUser ? "ml-auto" : "mr-auto"}`}>
                    <div
                      className={`p-3 rounded-lg ${isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                    >
                      {message.content}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </motion.div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={isSending}
        />
        <Button type="submit" size="icon" disabled={isSending || !newMessage.trim()}>
          {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </Card>
  )
}

