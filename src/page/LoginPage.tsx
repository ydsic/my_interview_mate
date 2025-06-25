import { useState } from 'react';
import { SubmitButton } from '../components/common/Button';
import {
  H1_big_title,
  H3_sub_detail,
  H4_placeholder,
} from '../components/common/HTagStyle';
import { Link, useNavigate } from 'react-router-dom';
import { useLoggedInStore, useUserDataStore } from '../store/userData';
import Input from '../components/common/Input';
import { supabase } from '../supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const setUserData = useUserDataStore((state) => state.setUserData);
  const setIsLoggedIn = useLoggedInStore((state) => state.setIsLoggedIn);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !userPassword) {
      alert('이메일과 비밀번호를 입력하세요.');
      return;
    }

    // Supabase Auth로 로그인
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: userPassword,
    });

    if (error) {
      alert(error.message || '이메일 또는 비밀번호가 올바르지 않습니다.');
      return;
    }

    // 추가 정보(profile) 조회
    const { data: profile } = await supabase
      .from('profile')
      .select('*')
      .eq('email', email)
      .single();

    setUserData({
      nickname: profile?.nickname ?? '',
      email,
      profile_img: profile?.profile_img ?? '',
      job: profile?.job ?? '',
      goal: profile?.goal ?? '',
    });
    setIsLoggedIn(true);
    navigate('/');
  };

  return (
    <>
      <div className="flex flex-col h-full justify-center items-center text-center gap-5">
        <H1_big_title>모의 면접 플랫폼</H1_big_title>
        <H3_sub_detail>AI와 함께하는 스마트한 면접 준비 </H3_sub_detail>

        <div className="w-1/2 bg-gray-50 flex items-center justify-center px-4">
          <div className="w-full">
            <div className="bg-white rounded-2xl border-2 border-gray-300 p-8 shadow-sm">
              <h1 className="text-2xl font-bold text-center mb-8">로그인</h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="flex font-medium text-gray-700 mb-2">
                    이메일
                  </label>
                  <H4_placeholder>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="이메일을 입력하세요"
                    />
                  </H4_placeholder>
                </div>

                <div>
                  <label className="flex font-medium text-gray-700 mb-2">
                    비밀번호
                  </label>
                  <H4_placeholder>
                    <Input
                      type="password"
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      placeholder="비밀번호를 입력하세요"
                      autoComplete="off"
                    />
                  </H4_placeholder>
                </div>

                <SubmitButton className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-md">
                  로그인
                </SubmitButton>
              </form>

              <div className="mt-6 text-center">
                <span className="text-gray-600">계정이 없으신가요? </span>
                <Link
                  to="/signup"
                  className="text-blue-500 hover:text-blue-600 font-medium"
                >
                  회원가입
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
