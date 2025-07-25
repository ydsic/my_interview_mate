import {
  BrowserRouter,
  Route,
  Routes,
  Outlet,
  useLocation,
} from 'react-router-dom';
import { initGA, logPageView } from './utils/analytics';

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

export default function App() {
  const location = useLocation();

  useEffect(() => {
    initGA(TRACKING_ID);
  }, []);

  useEffect(() => {
    logPageView(location.pathname);
  }, [location]);
  return (
    <>
      <ModalProvider />
      <ToastProvider />
      <BrowserRouter>
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
              path="/admin"
              element={
                <CheckAdminUuid>
                  <AdminPage />
                </CheckAdminUuid>
              }
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
