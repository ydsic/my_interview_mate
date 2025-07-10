import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useToastStore } from '../../store/toastStore';
import ToastMessage from './ToastMessage';

export default function ToastProvider() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  useEffect(() => {
    if (!toasts.length) return;
    const id = toasts[0].id;
    const timer = setTimeout(() => removeToast(id), 3000);
    return () => clearTimeout(timer);
  }, [toasts, removeToast]);

  return createPortal(
    <div
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[9999]
               flex flex-col items-center gap-4 px-4"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastMessage key={t.id} {...t} />
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
