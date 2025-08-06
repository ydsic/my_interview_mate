import { useEffect, useState } from 'react';

export default function useScrollDir() {
  const [scrollDir, setScrollDir] = useState<'up' | 'down'>('up');
  const [isBottom, setIsBottom] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;

      // 스ㅡ크롤 방향 감지
      if (Math.abs(y - lastY) < 4) {
        setScrollDir(y > lastY ? 'down' : 'up');
        lastY = y;
      }

      // 하단 도달 여부
      const scrollBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;
      setIsBottom(scrollBottom);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return { scrollDir, isBottom };
}
