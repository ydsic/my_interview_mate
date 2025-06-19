import React from 'react';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="w-full flex justify-center min-h-[93vh]">
      <div className="w-[1280px] max-w-7xl px-5">{children}</div>
    </div>
  );
}
