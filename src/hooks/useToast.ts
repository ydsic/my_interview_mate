import { useCallback } from 'react';
import { useToastStore } from '../store/toastStore';

export const useToast = () => {
  const showToast = useToastStore((s) => s.showToast);

  return useCallback(
    (msg: string, type?: 'success' | 'error' | 'info') =>
      showToast({ message: msg, type }),
    [showToast],
  );
};
