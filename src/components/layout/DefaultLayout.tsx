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
    <div className="pt-[7vh] w-full flex justify-center min-h-[100vh] bg-gray-15">
      <div className={`w-full max-w-7xl px-5 ${noPadding ? 'py-0' : 'py-10'}`}>
        {children}
      </div>
    </div>
  );
}
