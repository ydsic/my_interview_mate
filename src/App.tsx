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
import AdminPage from './page/AdminPage';
export default function App() {
  // Supabase Auth는 기본적으로 세션을 브라우저의 localStorage에 저장해서 새로고침/재접속 시 자동 로그인 지원
  // 그래서 App.tsx에 supabase.auth.getUser()로 유저 정보를 확인해서 다시 저장

  useEffect(() => {
    // 최초 마운트 시 세션 복원
    const restoreSession = async () => {
      const sessionResult = await supabase.auth.getSession();
      const session = sessionResult.data.session;
      let user = session?.user ?? undefined;
      if (!user) {
        const { data } = await supabase.auth.getUser();
        user = data?.user ?? undefined;
      }
      if (user && user.email) {
        setUserProfileByEmail(user.email);
      }
    };
    restoreSession();

    // 토큰이 갱신되거나 세션이 변경될 때마다 유저 데이터 저장
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      const user = session?.user;
      if (user && user.email) {
        setUserProfileByEmail(user.email);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
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
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </DefaultLayout>
      </BrowserRouter>
    </>
  );
}
