import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPage from './page/MainPage';

export default function App() {
  return (
    <BrowserRouter basename="/my_interview_mate">
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}
