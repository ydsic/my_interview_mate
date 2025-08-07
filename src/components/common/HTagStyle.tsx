import type React from 'react';

type textTag = {
  children: React.ReactNode;
  className?: string;
};

export function H1_big_title({ children }: textTag) {
  return (
    <h1 className="text-[26px] font-black h-[48px] max-sm:text-[23px] max-sm:font-bold">
      {children}
    </h1>
  );
}

export function H2_content_title({ children }: textTag) {
  return (
    <h2 className="text-[24px] font-bold h-[36px] max-sm:text-[20px]">
      {children}
    </h2>
  );
}

export function H3_sub_detail({ children }: textTag) {
  return (
    <h3 className="text-[22px] font-semibold leading-none">{children}</h3>
  ); /* 해당 부분 상의 필요 height 높이를 정하느냐 아니면 leading-none */
}

export function H4_placeholder({ children, className }: textTag) {
  return (
    <h4 className={`text-[16px] font-semibold ${className}`}>{children}</h4>
  );
}

export function H5_button({ children }: textTag) {
  return (
    <h2 className="text-[22px] font-semibold h-[48px] bg-gradient-to-r from-Linear-Button-L to-Linear-Button-R hover:from-Linear-Button-L-h hover:to-Linear-Button-R-h">
      {children}
    </h2>
  );
}
