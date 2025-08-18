import {
  BrowserRouter,
  Route,
  Routes,
  Outlet,
  useLocation,
} from 'react-router-dom';
import { initGA, logPageView } from './utils/analytics';
import { supabase } from './supabaseClient';
import { useLoggedInStore, useUserDataStore } from './store/userData';

import MainPage from './page/MainPage';
import StyleTest from './page/StyleTest';
import LoginPage from './page/LoginPage';
import DefaultLayout from './components/layout/DefaultLayout';
import MyPage from './page/MyPage';
import SignupPage from './page/SignupPage';
import Nav from './components/common/Nav';
import InterviewPage from './page/InterviewPage';
import ToastProvider from './components/common/ToastProvider';
import AdminPage from './page/AdminPage';
import CheckAdminUuid from './components/mainpage/CheckAdminUuid';
import NotFound from './page/NotFound';
import InterviewViewPage from './page/InterviewViewPage';
import ModalProvider from './components/common/ModalProvider';
import { useEffect } from 'react';

const TRACKING_ID = 'G-TJFKXS7LCF';

function LayoutWrapper() {
  return (
    <DefaultLayout>
      <Outlet />
    </DefaultLayout>
  );
}
// 테스트
export default function App() {
  const setIsLoggedIn = useLoggedInStore((state) => state.setIsLoggedIn);
  const setUserData = useUserDataStore((state) => state.setUserData);

  useEffect(() => {
    initGA(TRACKING_ID);

    // 세션 복원 시도
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (session && !error) {
          console.log('세션 복원 성공:', session);
          setIsLoggedIn(true);

          // 사용자 데이터도 복원 (필요시)
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user?.email) {
            // 기존 사용자 데이터가 있으면 유지, 없으면 기본값
            const savedUserData = useUserDataStore.getState().userData;
            if (!savedUserData.user_id) {
              setUserData({
                user_id: user.email,
                nickname: user.user_metadata?.nickname || '',
                admin: false,
                uuid: user.id,
              });
            }
          }
        } else {
          console.log('세션 없음 또는 에러:', error);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('세션 복원 실패:', error);
        setIsLoggedIn(false);
      }
    };

    initializeAuth();

    // 인증 상태 변화 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);

      if (session) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [setIsLoggedIn, setUserData]);

  return (
    <>
      <ModalProvider />
      <ToastProvider />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </>
  );
}

function AppContent() {
  const location = useLocation();
  useEffect(() => {
    logPageView(location.pathname);
  }, [location]);
  return (
    <>
      <Nav />
      <Routes>
        <Route
          path="/"
          element={
            <DefaultLayout noPadding>
              <MainPage />
            </DefaultLayout>
          }
        />
        <Route element={<LayoutWrapper />}>
          <Route path="/styleTest" element={<StyleTest />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/interview/:category" element={<InterviewPage />} />
          <Route
            path="/interview-view/:answerId"
            element={<InterviewViewPage />}
          />
          <Route
            path="/admin/*"
            element={
              <CheckAdminUuid>
                <AdminPage />
              </CheckAdminUuid>
            }
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
