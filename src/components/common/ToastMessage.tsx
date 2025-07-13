import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck, // success
  faExclamation, // info
  faXmark, // error
} from '@fortawesome/free-solid-svg-icons';
import { useToastStore } from '../../store/toastStore';
import type { Toast } from '../../store/toastStore';

type Kind = NonNullable<Toast['type']>;

const ICONS: Record<Kind, any> = {
  success: faCheck,
  info: faExclamation,
  error: faXmark,
};

const BADGE_BG: Record<Kind, string> = {
  success:
    'bg-[linear-gradient(to_right,var(--color-button-l),var(--color-button-r))]',
  info: 'bg-orange-100',
  error: 'bg-red-500',
};

export default function ToastMessage({ id, message, type = 'info' }: Toast) {
  const removeToast = useToastStore((s) => s.removeToast);

  useEffect(() => {
    const t = setTimeout(() => removeToast(id), 3000);
    return () => clearTimeout(t);
  }, [id, removeToast]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40 }}
      className="min-w-[320px] m-auto flex items-center gap-5 rounded-xl bg-white p-4
               shadow-md shadow-gray-100/30 ring-[#E9F0FF]"
    >
      {/* 아이콘 */}
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white ${BADGE_BG[type]}`}
      >
        <FontAwesomeIcon icon={ICONS[type]} size="xl" />
      </span>

      {/* 메시지 */}
      <p className="p-2 flex-1 text-center text-lg text-gray-100 whitespace-pre-line">
        {message}
      </p>
    </motion.div>
  );
}
