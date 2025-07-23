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
  const { data, error: authError } = await supabase.auth.signUp({
    email: userId,
    password,
  });

  if (authError) {
    if (authError.message.includes('already registered')) {
      throw new Error('이미 가입된 이메일입니다.');
    }
    if (authError.message.includes('Invalid email')) {
      throw new Error('올바른 이메일 주소를 입력해주세요.');
    }
    if (authError.message.includes('is invalid')) {
      throw new Error('올바른 이메일 주소를 입력해주세요.');
    }
    throw authError;
  }

  const user = data.user;

  if (!user) {
    throw new Error('회원가입에 실패했습니다. 다시 시도해 주세요.');
  }

  const { error: insertError } = await supabase.from('user').insert({
    uuid: user.id,
    user_id: userId,
    nickname,
    job,
    goal,
    created_at: new Date(),
    profile_img,
    admin: false,
  });

  if (insertError) {
    if (insertError.code === '23505') {
      throw new Error('이미 가입된 이메일입니다.');
    }
    throw insertError;
  }

  return { message: '회원가입 성공' };
}
