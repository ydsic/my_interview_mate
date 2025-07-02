import { supabase } from '../supabaseClient';

export async function signUpUser({
  userId,
  password,
  nickname,
  job = '',
  goal = ' ',
  profile_img = '',
}: {
  userId: string;
  password: string;
  nickname: string;
  job: string | null;
  goal: string | null;
  profile_img: string | null;
}) {
  const { error: authError } = await supabase.auth.signUp({
    email: userId,
    password,
  });

  if (authError) {
    if (authError.message.includes('already registered')) {
      throw new Error('이미 가입된 이메일입니다.');
    }
    throw authError;
  }

  const { error: insertError } = await supabase.from('user').insert({
    user_id: userId,
    nickname,
    job,
    goal,
    created_at: new Date(),
    profile_img,
  });

  if (insertError) {
    if (insertError.code === '23505') {
      throw new Error('이미 가입된 이메일입니다.');
    }
    throw insertError;
  }

  return { message: '회원가입 성공' };
}
