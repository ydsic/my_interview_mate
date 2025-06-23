import { useEffect, useState } from 'react';
import FirstLandingPage from '../components/mainpage/FirstLanding';
import Greeting from '../components/mainpage/Greeting';
import { useLoggedInStore } from '../store/userData';

export default function MainPage() {
  const [firstLandingPage, setFirstLandingPage] = useState(true);

  const isLoggedIn = useLoggedInStore((state) => state.isLoggedIn);

  useEffect(() => {
    const stored = localStorage.getItem('firstLandingPage');
    if (stored) {
      setFirstLandingPage(JSON.parse(stored));
    }
  }, []);

  return (
    <>
      {firstLandingPage ? (
        <FirstLandingPage setFirstLandingPage={setFirstLandingPage} />
      ) : (
        <>{isLoggedIn ? '로그인 시 보일 화면 컴포넌트 부분' : <Greeting />}</>
      )}
    </>
  );
}
