import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export type PracticeLead = {
  id?: string;
  name?: string | null;
  email: string;
  specialty: string;
  overall_score: number;
  visibility_score: number;
  trust_score: number;
  pricing_score: number;
  retention_score: number;
  authority_score: number;
  weakest_area: string;
  package_fit: string;
  status?: string;
  notes?: string | null;
  created_at?: string;
};

export function getSupabaseAdmin() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
