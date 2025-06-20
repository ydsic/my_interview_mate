import { useState } from 'react';
import Dashboard from '../components/mypage/Dashboard';
import InterviewLog from '../components/mypage/InterviewLog';
import Favorites from '../components/mypage/Favorites';
import Profile from '../components/mypage/Profile';

const tabComponents: Record<string, React.JSX.Element> = {
  dashboard: <Dashboard />,
  interview: <InterviewLog />,
  favorites: <Favorites />,
  profile: <Profile />,
};

export default function MyPage() {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'interview' | 'favorites' | 'profile'
  >('dashboard');

  return (
    <>
      <div className="flex justify-between w-ful px-10 py-3 bg-white rounded-4xl my-10">
        <div
          className={`px-5 cursor-pointer ${activeTab === 'dashboard' ? 'text-black' : 'text-gray-400'}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <p> 대시보드</p>
        </div>
        <div
          className={`px-5 cursor-pointer ${activeTab === 'interview' ? 'text-black' : 'text-gray-400'}`}
          onClick={() => setActiveTab('interview')}
        >
          <p> 면접 기록</p>
        </div>
        <div
          className={`px-5 cursor-pointer ${activeTab === 'favorites' ? 'text-black' : 'text-gray-400'}`}
          onClick={() => setActiveTab('favorites')}
        >
          <p> 즐겨 찾기</p>
        </div>
        <div
          className={`px-5 cursor-pointer ${activeTab === 'profile' ? 'text-black' : 'text-gray-400'}`}
          onClick={() => setActiveTab('profile')}
        >
          <p> 프로필</p>
        </div>
      </div>

      <div className=" w-full rounded-4xl px-10 py-3">
        {tabComponents[activeTab]}
      </div>
    </>
  );
}
