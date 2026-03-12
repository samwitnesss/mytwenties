import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase env vars:', { supabaseUrl: !!supabaseUrl, supabaseAnonKey: !!supabaseAnonKey })
}

export function createClient() {
  return createBrowserClient(
    supabaseUrl ?? '',
    supabaseAnonKey ?? ''
  )
}
