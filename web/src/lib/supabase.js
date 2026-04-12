import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey && supabaseUrl !== "your_supabase_url_here"
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function getUTMParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || null,
    utm_medium: params.get("utm_medium") || null,
    utm_campaign: params.get("utm_campaign") || null,
  };
}

export function getReferralCode() {
  const params = new URLSearchParams(window.location.search);
  return params.get("ref") || null;
}
