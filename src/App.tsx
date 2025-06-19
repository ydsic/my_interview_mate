import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPage from './page/MainPage';
import StyleTest from './page/styleTest';

export default function App() {
  return (
    <BrowserRouter basename="/my_interview_mate">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/styleTest" element={<StyleTest />} />
      </Routes>
    </BrowserRouter>
  );
}
