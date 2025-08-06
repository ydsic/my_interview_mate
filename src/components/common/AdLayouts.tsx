import AdSense from './AdSense';

// 다양한 광고 레이아웃 컴포넌트들

// 메인 페이지 상단 배너 광고
export function MainBannerAd() {
  return (
    <AdSense
      adSlot="1234567890" // 실제 광고 슬롯 ID로 변경 필요
      adFormat="horizontal"
      style={{
        width: '100%',
        height: '250px',
        marginBottom: '20px',
      }}
      className="main-banner-ad"
    />
  );
}

// 사이드바 광고
export function SidebarAd() {
  return (
    <AdSense
      adSlot="2345678901" // 실제 광고 슬롯 ID로 변경 필요
      adFormat="vertical"
      style={{
        width: '300px',
        height: '600px',
        margin: '20px 0',
      }}
      className="sidebar-ad"
    />
  );
}

// 콘텐츠 중간 광고
export function ContentAd() {
  return (
    <AdSense
      adSlot="3456789012" // 실제 광고 슬롯 ID로 변경 필요
      adFormat="rectangle"
      style={{
        width: '336px',
        height: '280px',
        margin: '20px auto',
        display: 'block',
      }}
      className="content-ad"
    />
  );
}

// 모바일 배너 광고
export function MobileBannerAd() {
  return (
    <AdSense
      adSlot="4567890123" // 실제 광고 슬롯 ID로 변경 필요
      adFormat="auto"
      style={{
        width: '100%',
        height: '100px',
        margin: '10px 0',
      }}
      className="mobile-banner-ad block md:hidden"
    />
  );
}

// 푸터 광고
export function FooterAd() {
  return (
    <AdSense
      adSlot="5678901234" // 실제 광고 슬롯 ID로 변경 필요
      adFormat="horizontal"
      style={{
        width: '100%',
        height: '90px',
        marginTop: '20px',
      }}
      className="footer-ad"
    />
  );
}
