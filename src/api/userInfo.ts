import { supabase } from '../supabaseClient';

// 이메일로 프로필 전체 정보 조회
export async function loginUserInfo(email: string) {
  return await supabase.from('profile').select('*').eq('email', email).single();
}

// 이메일로 닉네임 조회
export async function getUserNickname(email: string) {
  return await supabase
    .from('profile')
    .select('nickname')
    .eq('email', email)
    .single();
}

// 이메일로 프로필 사진 조회
export async function getUserImage(email: string) {
  return await supabase
    .from('profile')
    .select('image')
    .eq('email', email)
    .single();
}

// 이메일로 직업 조회
export async function getUserJob(email: string) {
  return await supabase
    .from('profile')
    .select('job')
    .eq('email', email)
    .single();
}

// 이메일로 목표 조회
export async function getUserGoal(email: string) {
  return await supabase
    .from('profile')
    .select('goal')
    .eq('email', email)
    .single();
}

// 필요시: 모든 컬럼을 한 번에
export async function getUserAllFields(email: string) {
  return await supabase.from('profile').select('*').eq('email', email).single();
}
