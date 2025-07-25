import { Routes, Route } from 'react-router-dom';
import AdminMainPage from '../components/adminpage/AdminMain';
import UserList from '../components/adminpage/UserList';
import QuestionList from '../components/adminpage/QuestionList';

export default function AdminPage() {
  return (
    <Routes>
      <Route index element={<AdminMainPage />} />
      <Route path="user" element={<UserList />} />
      <Route path="question" element={<QuestionList />} />
    </Routes>

    // <>
    //   {view === 'main' && (
    //     <AdminMainPage
    //       onUserClick={() => setView('user')}
    //       onQuestionClick={() => setView('question')}
    //     />
    //   )}
    //   {view === 'user' && <UserList setView={setView} />}
    //   {view === 'question' && <QuestionList setView={setView} />}
    // </>
  );
}
