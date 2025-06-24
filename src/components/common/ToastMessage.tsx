import { motion } from 'framer-motion';
import type { Toast } from '../../store/toastStore'; // ← type-only import

type ToastKind = NonNullable<Toast['type']>; // 'info' | 'success' | 'error'

const typeStyles: Record<ToastKind, string> = {
  info: 'bg-gray-900',
  success: 'bg-green-600',
  error: 'bg-red-600',
};

export default function ToastItem({ message, type = 'info' }: Toast) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40 }}
      className={`px-4 py-2 rounded-lg text-white shadow-lg ${typeStyles[type]}`}
    >
      {message}
    </motion.div>
  );
}
