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
import AdminPage from './page/AdminPage';

export default function App() {
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
