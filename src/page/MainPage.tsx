import { useEffect, useState } from 'react';
import FirstLandingPage from '../components/mainpage/FirstLanding';
import Greeting from '../components/mainpage/Greeting';
import { useLoggedInStore } from '../store/userData';
import UserMain from '../components/mainpage/UserMain';

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
        <>{isLoggedIn ? <UserMain /> : <Greeting />}</>
      )}
    </>
  );
}
