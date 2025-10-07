import { createClient } from '@supabase/supabase-js'

// Direct database connection - replace with your actual Supabase project details
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// User roles enum
export enum UserRole {
  MEMBER = 'member',
  AGENT_MUNICIPAL = 'agent_municipal',
  CHEF_MUNICIPAL = 'chef_municipal'
}

// Database types
export interface User {
  id: string
  clerk_id: string
  email: string
  first_name?: string
  last_name?: string
  role: UserRole
  points: number
  created_at: string
  updated_at: string
}

export interface SmartBin {
  id: string
  bin_code: string
  location_name: string
  address?: string
  latitude?: number
  longitude?: number
  bin_type: 'general' | 'recyclable' | 'organic' | 'plastic'
  capacity_percentage: number
  status: 'active' | 'maintenance' | 'full' | 'out_of_order'
  last_collected?: string
  created_at: string
  updated_at: string
}

export interface Collection {
  id: string
  bin_id: string
  agent_id: string
  collected_at: string
  notes?: string
  created_at: string
}
