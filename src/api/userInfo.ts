//import Dashboard from '../components/mypage/Dashboard';
import { supabase } from '../supabaseClient';

// 이메일로 프로필 전체 정보 조회
export async function loginUserInfo(userId: string) {
  return await supabase.from('user').select('*').eq('user_id', userId);
}

// 이메일로 닉네임 조회
export async function getUserNickname(userId: string) {
  return await supabase
    .from('user')
    .select('nickname')
    .eq('user_id', userId)
    .single();
}

// 이메일로 직업 조회
export async function getUserJob(userId: string) {
  return await supabase
    .from('user')
    .select('job')
    .eq('user_id', userId)
    .single();
}

// 이메일로 직업 업데이트
export async function updateUserJob(userId: string, job: string) {
  return await supabase.from('user').update({ job }).eq('user_id', userId);
}

// 이메일로 목표 조회
export async function getUserGoal(userId: string) {
  return await supabase
    .from('user')
    .select('goal')
    .eq('user_id', userId)
    .single();
}

// 목표 업데이트
export async function updateUserGoal(userId: string, goal: string) {
  return await supabase.from('user').update({ goal }).eq('user_id', userId);
}

// dashboard 조회
export async function getUserDashboard(userId: string) {
  return await supabase
    .from('userStats')
    .select('*')
    .eq('user_id', userId)
    .single();
}

// dashboard score_trand 조회
export async function getScoreTrend(userId: string) {
  return await supabase
    .from('score_trend_view')
    .select('date, avg_score')
    .eq('user_id', userId);
}

// history 조회
export async function getUserhistory(userId: string) {
  return await supabase
    .from('profile')
    .select('history')
    .eq('user_id', userId)
    .single();
}

// history 업데이트
export async function updateUserhistory(userId: string, history: string[]) {
  return await supabase
    .from('profile')
    .update({ history })
    .eq('user_id', userId);
}

// bookmark 조회
export async function getUserBookmark(userId: string) {
  return await supabase
    .from('bookmark')
    .select('question_id, created_at')
    .eq('user_id', userId);
}

// bookmark 업데이트
export async function updateUserBookmark(userId: string, bookmark: string[]) {
  return await supabase
    .from('bookmark')
    .update({ bookmark })
    .eq('user_id', userId);
}

// 이메일로 프로필 사진 조회
export async function getUserImage(userId: string) {
  return await supabase
    .from('user')
    .select('profile_img')
    .eq('user_id', userId)
    .single();
}

// 이메일로 프로필 사진 업데이트
export async function updateUserImage(userId: string, imageUrl: string) {
  return await supabase
    .from('user')
    .update({ profile_img: imageUrl })
    .eq('user_id', userId);
}

// Storage에만 업로드하고 publicUrl 반환하는 간단한 함수로 정리
export async function uploadUserImageOnly(file: File, userId: string) {
  const safeuserId = userId.replace(/[^a-zA-Z0-9]/g, '_');

  const rawExt =
    file.name.split('.').pop() || file.type.split('/').pop() || 'png';

  const fileExt = rawExt.toLowerCase();
  const unique = Date.now();
  const filePath = `profile/${safeuserId}_${unique}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('profile-images')
    .upload(filePath, file, { upsert: true, contentType: file.type });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from('profile-images')
    .getPublicUrl(filePath);

  return `${urlData.publicUrl}?t=${unique}`;
}

// 되돌리기 클릭 시 storage에서 이미지 삭제
export async function deleteImageFromStorage(userId: string) {
  const safeuserId = userId.replace(/[^a-zA-Z0-9]/g, '_');

  const { data: files, error: listErr } = await supabase.storage
    .from('profile-images')
    .list('profile');

  if (listErr) throw listErr;

  const targets = files
    .filter((f) => f.name.startsWith(safeuserId))
    .map((f) => `profile/${f.name}`);

  if (targets.length === 0) return;

  const { error } = await supabase.storage
    .from('profile-images')
    .remove(targets);

  if (error) throw error;
}

// 프로필 정보 업데이트
export async function updateUserProfile(
  userId: string,
  updatedData: {
    nickname: string;
    job: string;
    goal: string;
    profile_img: string;
  },
) {
  const { data, error } = await supabase
    .from('user')
    .update(updatedData)
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}

// 필요시: 모든 컬럼을 한 번에
export async function getUserAllFields(userId: string) {
  return await supabase
    .from('profile')
    .select('*')
    .eq('user_id', userId)
    .single();
}
