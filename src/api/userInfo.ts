import { supabase } from '../supabaseClient';

export async function loginUserInfo(userId: string, userPassword: string) {
  return await supabase
    .from('user_info')
    .select('*')
    .eq('user_id', userId)
    .eq('password', userPassword)
    .single();
}
