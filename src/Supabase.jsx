import { createClient } from "@supabase/supabase-js";

const SupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const SupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const Supabase = createClient(SupabaseUrl, SupabaseAnonKey);

export default Supabase;
