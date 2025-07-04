import React, { useState } from 'react';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
};

export default function Button({
  children,
  onClick,
  className = '',
  type = 'button',
}: ButtonProps) {
  const [isHover, setIsHover] = useState(false);

  const backgroundStyle = isHover
    ? 'linear-gradient(to right, var(--color-button-l-h), var(--color-button-r-h))'
    : 'linear-gradient(to right, var(--color-button-l), var(--color-button-r))';

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className={`px-10 py-3 text-white font-semibold rounded-xl transition cursor-pointer ${className}`}
      style={{ background: backgroundStyle }}
    >
      {children}
    </button>
  );
}
/* ---------- Submit 전용 Button ---------- */
export function SubmitButton({
  children,
  onClick,
  className = '',
  isDisabled = false,
}: Omit<ButtonProps, 'type'> & { isDisabled?: boolean }) {
  const [isHover, setIsHover] = useState(false);

  return (
    <button
      type="submit"
      onClick={onClick}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className={`
        px-5 py-2 text-white rounded-xl flex items-center justify-center gap-2 cursor-pointer
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}
        ${className}
      `}
      style={{
        backgroundColor: 'var(--color-front-text-tag)',
        opacity: isDisabled ? 0.5 : isHover ? 0.9 : 1,
      }}
    >
      {children}
    </button>
  );
}

// 수정 및 일반 버튼
export function WhiteButton({
  children,
  onClick,
  className = '',
  type = 'button',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center
        h-9 px-5 text-base font-medium 
        border border-gray-25 bg-white shadow-sm text-gray-100 rounded-lg cursor-pointer
        hover:bg-gray-25 transition ${className}`}
    >
      {children}
    </button>
  );
}
