type GtagCommand = 'js' | 'config' | 'event';
type GtagParams = Record<string, string | number | boolean | Date>;

declare global {
  interface Window {
    gtag?: (
      command: GtagCommand,
      targetId: string | Date,
      config?: GtagParams,
    ) => void;
    dataLayer?: unknown[];
  }
}

let gaTrackingId: string = '';

export const initGA = (trackingId: string): void => {
  gaTrackingId = trackingId;

  if (!window.gtag) {
    // dataLayer 초기화
    if (!window.dataLayer) {
      window.dataLayer = [];
    }

    // gtag 함수 정의
    function gtag(...args: unknown[]): void {
      window.dataLayer!.push(args);
    }

    window.gtag = gtag;

    // GA 스크립트 로드
    const script: HTMLScriptElement = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    script.onload = () => {
      // 스크립트 로드 완료 후 설정
      gtag('js', new Date());
      gtag('config', trackingId, {
        page_title: document.title,
        page_location: window.location.href,
        send_page_view: true,
      });
      console.log('Google Analytics initialized with ID:', trackingId);
    };
    document.head.appendChild(script);
  }
};

export const logPageView = (url: string): void => {
  if (window.gtag && gaTrackingId) {
    window.gtag('config', gaTrackingId, {
      page_path: url,
      page_title: document.title,
      page_location: window.location.href,
    });
    console.log('GA Page view logged:', url);
  }
};

// 이벤트 트래킹 함수
export const logEvent = (eventName: string, parameters?: GtagParams): void => {
  if (window.gtag) {
    window.gtag('event', eventName, parameters);
    console.log('GA Event logged:', eventName, parameters);
  }
};

export const logCustomEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number,
): void => {
  if (window.gtag) {
    const eventParams: GtagParams = {
      event_category: category,
    };

    if (label !== undefined) {
      eventParams.event_label = label;
    }

    if (value !== undefined) {
      eventParams.value = value;
    }

    window.gtag('event', action, eventParams);
    console.log('GA Custom event logged:', action, eventParams);
  }
};
