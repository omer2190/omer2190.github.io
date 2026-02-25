export const SUPABASE_URL = "https://ewctmoekzxkdbijlbfag.supabase.co";
export const SUPABASE_ANON_KEY =
  "sb_publishable_Rix1pS48eHBDTB6DtlQjDA_T6vX9i9H";

// Initialize Supabase Client (if library is loaded)
export function getSupabase() {
  if (typeof createClient !== "undefined") {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } else if (window.supabase) {
    return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return null;
}
