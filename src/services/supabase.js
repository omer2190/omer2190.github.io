import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ewctmoekzxkdbijlbfag.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Rix1pS48eHBDTB6DtlQjDA_T6vX9i9H";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
