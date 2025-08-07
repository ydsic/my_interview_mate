import { useEffect, useState } from 'react';
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

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'interview' | 'favorites' | 'profile'
  >('dashboard');

  // tab 기본값 dashboard로 설정
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    } else {
      setSearchParams({ tab: 'dashboard' });
    }
  }, [tabParam, setSearchParams]);

  const handleTabClick = (
    tab: 'dashboard' | 'interview' | 'favorites' | 'profile',
  ) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <>
      <div
        className={`flex justify-center gap-10 max-sm:gap-5 items-center 
          w-full bg-white rounded-4xl
          mb-6 sm:mb-10 px-10 py-4

          max-sm:fixed max-sm:bottom-0 max-sm:left-1/2 max-sm:-translate-x-1/2
          max-sm:w-[95%] max-sm:px-0 max-sm:py-3  
          max-sm:rounded-2xl max-sm:shadow-lg 
          max-sm:z-50`}
      >
        {[
          { id: 'dashboard', icon: faChartSimple, label: '대시보드' },
          { id: 'interview', icon: faClockRotateLeft, label: '면접 기록' },
          { id: 'favorites', icon: faStar, label: '즐겨 찾기' },
          { id: 'profile', icon: faUser, label: '프로필' },
        ].map(({ id, icon, label }) => (
          <button
            key={id}
            onClick={() => handleTabClick(id as typeof activeTab)}
            className={`flex flex-col sm:flex-row items-center sm:gap-5 flex-1 cursor-pointer sm:px-5 gap-1

              transition
              ${activeTab === id ? 'text-black' : 'text-gray-400'}
              max-sm:text-[10px] sm:text-xs`}
          >
            <FontAwesomeIcon icon={icon} className="text-lg sm:text-base" />
            <span className="sm:inline max-sm:block">{label}</span>
          </button>
        ))}
      </div>

      <div className=" w-full ">{tabComponents[activeTab]}</div>
    </>
  );
}
