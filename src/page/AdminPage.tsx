import { useState } from 'react';
import AdminMainPage from '../components/adminpage/AdminMain';
import UserList from '../components/adminpage/UserList';
import QuestionList from '../components/adminpage/QuestionList';

export default function AdminPage() {
  const [view, setView] = useState<'main' | 'user' | 'question'>('main');
  return (
    <>
      {view === 'main' && (
        <AdminMainPage
          onUserClick={() => setView('user')}
          onQuestionClick={() => setView('question')}
        />
      )}
      {view === 'user' && <UserList setView={setView} />}
      {view === 'question' && <QuestionList setView={setView} />}
    </>
  );
}
