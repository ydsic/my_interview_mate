import { useState } from 'react';
import { SubmitButton } from '../components/common/Button';
import {
  H1_big_title,
  H3_sub_detail,
  H4_placeholder,
} from '../components/common/HTagStyle';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import { supabase } from '../supabaseClient';

import { loginUserInfo } from '../api/userInfo';
import { useLoggedInStore, useUserDataStore } from '../store/userData';
import { useToast } from '../hooks/useToast';

export default function LoginPage() {
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const navigate = useNavigate();
  const setUserData = useUserDataStore((state) => state.setUserData);
  const setIsLoggedIn = useLoggedInStore((state) => state.setIsLoggedIn);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !userPassword) {
      toast('이메일과 비밀번호를 입력하세요.', 'error');
      return;
    }

    try {
      // Supabase Auth로 로그인
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: userPassword,
      });

      if (error) {
        toast('이메일 또는 비밀번호가 올바르지 않습니다.', 'error');
        return;
      }

      const { data: userInfo, error: userInfoError } =
        await loginUserInfo(email);

      if (userInfoError || !userInfo || userInfo.length === 0) {
        throw new Error('유저 정보를 불러오지 못했습니다.');
      }

      if (userInfo[0].is_deleted === true) {
        await supabase.auth.signOut();
        toast('탈퇴된 계정입니다. 관리자에게 문의하세요.', 'error');
        return;
      }

      setUserData({
        user_id: email,
        nickname: userInfo[0].nickname,
        admin: userInfo[0].admin ?? false,
        uuid: userInfo[0].uuid,
      });
      setIsLoggedIn(true);

      setTimeout(() => {
        navigate('/');
      }, 0);
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || '알 수 없는 오류가 발생했습니다.');
      console.log('로그인 에러 : ', error);
    } finally {
      setEmail('');
      setUserPassword('');
    }
  };

  return (
    <div className="relative min-h-screen overflow-y-auto overflow-x-hidden">
      <div className="fixed inset-0 -z-10" />

      <section
        className="flex flex-col items-center text-center 
      gap-5 max-sm:gap-4
      pt-10 max-sm:pt-2 pb-[12vh] max-sm:pb-20"
      >
        <H1_big_title>Aimigo</H1_big_title>
        <H3_sub_detail>AI와 함께하는 스마트한 면접 준비 </H3_sub_detail>

        <div
          className="
          w-4/5 sm:w-3/4 max-sm:w-2/7
        bg-gray-50 flex items-center justify-center 
          px-4 max-sm:pt-3"
        >
          <div className="w-full max-w-sm sm:max-w-lg md:max-w-xl">
            <div
              className="bg-white rounded-2xl border-2 border-gray-300 
              p-8 max-sm:p-6
              shadow-sm"
            >
              <h1 className="text-2xl max-sm:text-xl font-bold text-center mb-8 max-sm:mb-4">
                로그인
              </h1>

              <form onSubmit={handleSubmit} className="space-y-2" noValidate>
                <div className="pb-6 max-sm:pb-1">
                  <label className="flex font-medium text-gray-700 mb-2 max-sm:mb-1">
                    이메일
                  </label>
                  <H4_placeholder>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="이메일을 입력하세요"
                      className="max-sm:h-10 max-sm:text-sm placeholder:text-[#757575]"
                    />
                  </H4_placeholder>
                </div>

                <div className="pb-13 max-sm:pb-9">
                  <label className="flex font-medium text-gray-700 mb-2 max-sm:mb-1">
                    비밀번호
                  </label>
                  <H4_placeholder>
                    <Input
                      type="password"
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      placeholder="비밀번호를 입력하세요"
                      autoComplete="off"
                      className="max-sm:h-10 max-sm:text-sm placeholder:text-[#757575]"
                    />
                  </H4_placeholder>
                </div>

                <SubmitButton
                  className="w-full py-4 max-sm:py-3 
                  bg-gradient-to-r from-blue-500 to-purple-500 
                  text-white font-semibold rounded-lg 
                  hover:from-blue-600 hover:to-purple-600 
                  transition-all duration-200 shadow-md"
                  isDisabled={email === '' || userPassword === ''}
                >
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
      </section>
    </div>
  );
}
