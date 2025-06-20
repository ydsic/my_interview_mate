import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPage from './page/MainPage';
import StyleTest from './page/StyleTest';
import LoginPage from './page/LoginPage';
import DefaultLayout from './components/layout/DefaultLayout';
import MyPage from './page/MyPage';
import SignupPage from './page/SignupPage';
import Nav from './components/common/Nav';
import InterviewPage from './page/InterviewPage';

export default function App() {
  return (
    <BrowserRouter basename="/my_interview_mate">
      <Nav />
      <DefaultLayout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/styleTest" element={<StyleTest />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* <Route
            path="/test"
            element={
              <InterviewQuestion
                category="git"
                question="React의 상태관리는 어떻게 하나요?"
              />
            }
          /> */}
          <Route path="/interview" element={<InterviewPage />} />
        </Routes>
      </DefaultLayout>
    </BrowserRouter>
  );
}
