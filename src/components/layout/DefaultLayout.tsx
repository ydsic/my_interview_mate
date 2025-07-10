import React from 'react';

interface DefaultLayoutProps {
  children: React.ReactNode;
  noPadding?: boolean;
}

export default function DefaultLayout({
  children,
  noPadding = false,
}: DefaultLayoutProps) {
  return (
    <div className="w-full flex justify-center min-h-[93vh] bg-gray-15">
      <div
        className={`min-w-[1280px] max-w-7xl px-5 ${noPadding ? 'py-0' : 'py-10'}`}
      >
        {children}
      </div>
    </div>
  );
}
