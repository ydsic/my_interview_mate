import { supabase } from '../supabaseClient';

export async function loginUserInfo(email: string) {
  return await supabase.from('profile').select('*').eq('email', email).single();
}
