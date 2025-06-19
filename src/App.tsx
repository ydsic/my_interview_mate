import { useEffect, useState } from 'react';
import FirstLandingPage from './page/FirstLandingPage';
import Nav from './page/Nav';

function App() {
  const [firstLandingPage, setFirstLandingPage] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('firstLandingPage');
    if (stored) {
      setFirstLandingPage(JSON.parse(stored));
    }
  }, []);

  return <div>{firstLandingPage && <FirstLandingPage />}</div>;
}

export default App;
