// AdSense 광고 초기화 및 관리 유틸리티

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export const initializeAdsense = () => {
  // AdSense 스크립트가 로드되었는지 확인
  if (typeof window !== 'undefined' && !window.adsbygoogle) {
    window.adsbygoogle = [];
  }
};

export const loadAdSense = () => {
  try {
    if (typeof window !== 'undefined' && window.adsbygoogle) {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  } catch (error) {
    console.error('AdSense 로드 오류:', error);
  }
};

export const refreshAds = () => {
  try {
    if (typeof window !== 'undefined' && window.adsbygoogle) {
      window.adsbygoogle.push({});
    }
  } catch (error) {
    console.error('AdSense 새로고침 오류:', error);
  }
};
