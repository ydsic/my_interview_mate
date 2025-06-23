import React from 'react';

type InputProps = {
  type?: string; // "text", "password" 등
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  name?: string;
  autoComplete?: string;
  required?: boolean;
};

export default function Input({
  type = 'text',
  value,
  onChange,
  placeholder,
  className = '',
  name,
  autoComplete,
  required,
}: InputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      name={name}
      autoComplete={autoComplete}
      required={required}
    />
  );
}
