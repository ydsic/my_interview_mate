import clsx from 'clsx';

type InputOrTextProps = {
  isEditing: boolean;
  name: string;
  value: string;
  placeholder: string;
  maxLength: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function InputOrText({
  isEditing,
  name,
  value,
  placeholder,
  maxLength,
  onChange,
}: InputOrTextProps) {
  return isEditing ? (
    <input
      name={name}
      type="text"
      value={value}
      className="bg-gray-15 px-5 py-3 rounded-xl focus:outline-none w-full"
      placeholder={placeholder}
      maxLength={maxLength}
      onChange={onChange}
    />
  ) : (
    <p
      className={clsx(
        'grow-1 focus:outline-none rounded-2xl max-sm:rounded-xl',
        name === 'nickname'
          ? 'text-[24px] max-sm:text-[22px] font-bold h-[36px] max-sm:h-[30px]'
          : 'px-5 py-3 max-sm:py-2 bg-gray-15',
        value.trim() === '' && 'text-gray-70',
      )}
    >
      {value.trim() === '' ? ' 아직 입력되지 않았어요! ' : value}
    </p>
  );
}
