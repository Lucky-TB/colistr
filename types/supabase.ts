export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          role: string | null
          location: string | null
          bio: string | null
          experience: number | null
          investment_capacity: string | null
          specialties: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          role?: string | null
          location?: string | null
          bio?: string | null
          experience?: number | null
          investment_capacity?: string | null
          specialties?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: string | null
          location?: string | null
          bio?: string | null
          experience?: number | null
          investment_capacity?: string | null
          specialties?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      opportunities: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          location: string | null
          price: number
          investment_required: number
          roi: number | null
          type: string | null
          timeline: string | null
          partner_requirements: string | null
          images: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          location?: string | null
          price: number
          investment_required: number
          roi?: number | null
          type?: string | null
          timeline?: string | null
          partner_requirements?: string | null
          images?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          location?: string | null
          price?: number
          investment_required?: number
          roi?: number | null
          type?: string | null
          timeline?: string | null
          partner_requirements?: string | null
          images?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      saved_opportunities: {
        Row: {
          id: string
          user_id: string
          opportunity_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          opportunity_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          opportunity_id?: string
          created_at?: string
        }
      }
      connections: {
        Row: {
          id: string
          requester_id: string
          recipient_id: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          requester_id: string
          recipient_id: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          requester_id?: string
          recipient_id?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

