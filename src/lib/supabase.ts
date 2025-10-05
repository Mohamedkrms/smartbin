import { createClient } from '@supabase/supabase-js'

// Direct database connection - replace with your actual Supabase project details
const supabaseUrl = 'https://prlsgxukwtahbbcrpyar.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBybHNneHVrd3RhaGJiY3JweWFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2MDIxOTQsImV4cCI6MjA3NTE3ODE5NH0.tcGlxZulWGZDxGgBF-cAPZcfyXxf9ewQRfoHUQ_Tj8E'

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
