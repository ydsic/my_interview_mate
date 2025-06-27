import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPage from './page/MainPage';
import StyleTest from './page/StyleTest';
import LoginPage from './page/LoginPage';
import DefaultLayout from './components/layout/DefaultLayout';
import MyPage from './page/MyPage';
import SignupPage from './page/SignupPage';
import Nav from './components/common/Nav';
import InterviewPage from './page/InterviewPage';
import ToastProvider from './components/common/ToastProvider';

import { supabase } from './supabaseClient';
import { useEffect } from 'react';
import { setUserProfileByEmail } from './api/setUserProfile';

export default function App() {
  // Supabase Auth는 기본적으로 세션을 브라우저의 localStorage에 저장해서 새로고침/재접속 시 자동 로그인 지원
  // 그래서 App.tsx에 supabase.auth.getUser()로 유저 정보를 확인해서 다시 저장

  useEffect(() => {
    const restoreSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user && user.email) {
        await setUserProfileByEmail(user.email);
      }
    };
    restoreSession();
  }, []);

  return (
    <>
      <ToastProvider />
      <BrowserRouter>
        <Nav />
        <DefaultLayout>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/styleTest" element={<StyleTest />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/interview/:category" element={<InterviewPage />} />
          </Routes>
        </DefaultLayout>
      </BrowserRouter>
    </>
  );
}
