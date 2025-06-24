import { supabase } from '../supabaseClient';

export async function chatgptkey() {
  return await supabase.from('openaikey').select('openai').limit(1).single();
}
