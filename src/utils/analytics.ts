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

export const initGA = (trackingId: string): void => {
  if (!window.gtag) {
    const script: HTMLScriptElement = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    document.head.appendChild(script);

    if (!window.dataLayer) {
      window.dataLayer = [];
    }

    function gtag(
      command: GtagCommand,
      targetId: string | Date,
      config?: GtagParams,
    ): void {
      window.dataLayer!.push([command, targetId, config]);
    }

    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', trackingId);
  }
};

export const logPageView = (url: string): void => {
  if (window.gtag) {
    window.gtag('config', 'G-TJFKXS7LCF', { page_path: url });
  }
};

// 이벤트 트래킹 함수
export const logEvent = (eventName: string, parameters?: GtagParams): void => {
  if (window.gtag) {
    window.gtag('event', eventName, parameters);
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
  }
};
