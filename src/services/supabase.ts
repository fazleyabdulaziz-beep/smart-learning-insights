import { createClient } from '@supabase/supabase-js'
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
// null => demo mode (no backend). Only the PUBLIC anon key belongs here; never the service_role key.
export const supabase = url && key ? createClient(url, key) : null
export const live = supabase !== null
