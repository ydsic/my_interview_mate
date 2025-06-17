import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
};

export default function Button({
  children,
  onClick,
  className = '',
  type = 'button',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-10 py-3 text-white font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 transition ${className}`}
    >
      {children}
    </button>
  );
}
