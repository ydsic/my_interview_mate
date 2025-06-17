import { useEffect, useState } from 'react';
import LandingPage from './components/page/LandingPage';

function App() {
  const [landingPage, setLandingPage] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('landingPage');
    if (stored) {
      setLandingPage(JSON.parse(stored));
    }
  }, []);

  return <div>{landingPage && <LandingPage />}</div>;
}

export default App;
