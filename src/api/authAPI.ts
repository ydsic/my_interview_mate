import { supabase } from '../supabaseClient';

// 이메일 중복 체크 함수 (Edge Function 사용)
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke(
      'check-email-exists',
      {
        body: { email },
      },
    );

    if (error) {
      console.error('이메일 중복 체크 오류:', error);
      return false;
    }

    return data?.emailExists || false;
  } catch (error) {
    console.error('이메일 중복 체크 중 오류 발생:', error);
    return false;
  }
}

// 더 간단한 방법: user 테이블에서 직접 확인 (RLS 정책 고려)
export async function checkEmailExistsLocal(email: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user')
      .select('user_id')
      .eq('user_id', email)
      .maybeSingle();

    if (error) {
      console.error('이메일 중복 체크 오류:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('이메일 중복 체크 중 오류 발생:', error);
    return false;
  }
}

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
