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

// 이메일로 직업 조회
export async function getUserJob(email: string) {
  return await supabase
    .from('profile')
    .select('job')
    .eq('email', email)
    .single();
}

// 이메일로 직업 업데이트
export async function updateUserJob(email: string, job: string) {
  return await supabase.from('profile').update({ job }).eq('email', email);
}

// 이메일로 목표 조회
export async function getUserGoal(email: string) {
  return await supabase
    .from('profile')
    .select('goal')
    .eq('email', email)
    .single();
}

// 이메일로 목표 업데이트
export async function updateUserGoal(email: string, goal: string) {
  return await supabase.from('profile').update({ goal }).eq('email', email);
}

// 이메일로 프로필 사진 조회
export async function getUserImage(email: string) {
  return await supabase
    .from('profile')
    .select('profile_img')
    .eq('email', email)
    .single();
}

// 이메일로 프로필 사진 업데이트
export async function updateUserImage(email: string, imageUrl: string) {
  return await supabase
    .from('profile')
    .update({ profile_img: imageUrl })
    .eq('email', email);
}

// Storage에 이미지 업로드 후 publicUrl을 user profile 테이블에 저장
export async function uploadAndSetUserImage(file: File, email: string) {
  const safeEmail = email.replace(/[^a-zA-Z0-9]/g, '_');
  const fileExt =
    file.name.split('.').pop() || file.type.split('/').pop() || 'png';
  const filePath = `profile/${safeEmail}.${fileExt}`;
  console.log('file:', file, 'fileExt:', fileExt, 'filePath:', filePath);
  const { error: uploadError } = await supabase.storage
    .from('profile-images')
    .upload(filePath, file, { upsert: true, contentType: file.type });
  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from('profile-images')
    .getPublicUrl(filePath);
  const publicUrl = urlData.publicUrl;

  const { error: updateError } = await supabase
    .from('profile')
    .update({ profile_img: publicUrl })
    .eq('email', email);
  if (updateError) throw updateError;

  return publicUrl;
}

// 필요시: 모든 컬럼을 한 번에
export async function getUserAllFields(email: string) {
  return await supabase.from('profile').select('*').eq('email', email).single();
}
