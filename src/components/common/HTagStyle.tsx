import type React from 'react';

type textTag = {
  children: React.ReactNode;
};

export function H1_big_title({ children }: textTag) {
  return <h1 className="text-[26px] font-black h-[48px]">{children}</h1>;
}

export function H2_content_title({ children }: textTag) {
  return <h2 className="text-[24px] font-bold h-[36px]">{children}</h2>;
}

export function H3_sub_detail({ children }: textTag) {
  return <h2 className="text-[22px] font-semibold h-[48px]">{children}</h2>;
}

export function H5_button({ children }: textTag) {
  return (
    <h2 className="text-[22px] font-semibold h-[48px] bg-gradient-to-r from-Linear-Button-L to-Linear-Button-R hover:from-Linear-Button-L-h hover:to-Linear-Button -R-h">
      {children}
    </h2>
  );
}
