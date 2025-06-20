import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPage from './page/MainPage';
import StyleTest from './page/StyleTest';
import LoginPage from './page/LoginPage';
import DefaultLayout from './components/layout/DefaultLayout';
import Nav from './components/common/Nav';

export default function App() {
  return (
    <BrowserRouter basename="/my_interview_mate">
      <Nav />
      <DefaultLayout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/styleTest" element={<StyleTest />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </DefaultLayout>
    </BrowserRouter>
  );
}
