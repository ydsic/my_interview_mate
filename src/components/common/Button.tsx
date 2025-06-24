import React, { useState } from 'react';

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
/* ---------- 새로 추가한 Submit 전용 Button ---------- */
export function SubmitButton({
  children,
  onClick,
  className = '',
}: Omit<ButtonProps, 'type'>) {
  const [isHover, setIsHover] = useState(false);

  return (
    <button
      type="submit"
      onClick={onClick}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className={`px-10 py-3 text-white font-semibold rounded-xl transition cursor-pointer ${className}`}
      style={{
        backgroundColor: 'var(--color-front-text-tag)',
        opacity: isHover ? 0.9 : 1,
      }}
    >
      {children}
    </button>
  );
}
