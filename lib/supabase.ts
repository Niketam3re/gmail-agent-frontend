import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'

// Client component client (for use in 'use client' components)
export const createSupabaseClient = () => {
  return createClientComponentClient()
}

// Browser client (for pages) - with fallback values for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gepycxkxiyjfbcpjemix.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlcHljeGt4aXlqZmJjcGplbWl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5Nzg0ODcsImV4cCI6MjA3NjU1NDQ4N30.kfIjIlCWQg0BFB_0M3DU6s9vur3wTkAEgC1PExbo6Cg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
