import { useEffect, useState } from 'react';
import FirstLandingPage from '../components/mainpage/FirstLanding';
import Nav from '../components/common/Nav';
import Greeting from '../components/mainpage/Greeting';

export default function MainPage() {
  const [firstLandingPage, setFirstLandingPage] = useState(true);

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
        <>
          <Nav />
          <Greeting />
        </>
      )}
    </>
  );
}
