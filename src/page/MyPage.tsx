import { useState } from 'react';
import Dashboard from '../components/mypage/Dashboard';
import Bookmark from '../components/mypage/Bookmark';
import Profile from '../components/mypage/Profile';
import InterviewHistory from '../components/mypage/InterviewHistory';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartSimple } from '@fortawesome/free-solid-svg-icons';
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useSearchParams } from 'react-router-dom';

const tabComponents: Record<string, React.JSX.Element> = {
  dashboard: <Dashboard />,
  interview: <InterviewHistory />,
  favorites: <Bookmark />,
  profile: <Profile />,
};

export default function MyPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as
    | 'dashboard'
    | 'interview'
    | 'favorites'
    | 'profile'
    | null;

  const defaultTab: 'dashboard' | 'interview' | 'favorites' | 'profile' =
    tabParam || 'dashboard';
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabClick = (
    tab: 'dashboard' | 'interview' | 'favorites' | 'profile',
  ) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <>
      <div className="flex justify-between w-ful px-10 py-3 bg-white rounded-4xl mb-10 ">
        <div
          className={`flex items-center px-5 cursor-pointer gap-5 ${activeTab === 'dashboard' ? 'text-black' : 'text-gray-400'}`}
          onClick={() => handleTabClick('dashboard')}
        >
          <FontAwesomeIcon icon={faChartSimple} />
          <p> 대시보드</p>
        </div>
        <div
          className={`flex items-center px-5 cursor-pointer gap-5 ${activeTab === 'interview' ? 'text-black' : 'text-gray-400'}`}
          onClick={() => handleTabClick('interview')}
        >
          <FontAwesomeIcon icon={faClockRotateLeft} />
          <p> 면접 기록</p>
        </div>
        <div
          className={`flex items-center px-5 cursor-pointer gap-5 ${activeTab === 'favorites' ? 'text-black' : 'text-gray-400'}`}
          onClick={() => handleTabClick('favorites')}
        >
          <FontAwesomeIcon icon={faStar} />
          <p> 즐겨 찾기</p>
        </div>
        <div
          className={`flex items-center px-5 cursor-pointer gap-5 ${activeTab === 'profile' ? 'text-black' : 'text-gray-400'}`}
          onClick={() => handleTabClick('profile')}
        >
          <FontAwesomeIcon icon={faUser} />
          <p> 프로필</p>
        </div>
      </div>

      <div className=" w-full ">{tabComponents[activeTab]}</div>
    </>
  );
}
