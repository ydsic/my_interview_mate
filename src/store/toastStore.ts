import { create } from 'zustand';

export type Toast = {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
};

type ToastState = {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
};

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  showToast: ({ message, type = 'info', duration = 3000 }) =>
    set((s) => {
      const id = crypto.randomUUID();
      // 자동 제거 타이머 설정
      setTimeout(() => {
        set((cur) => ({
          toasts: cur.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
      return { toasts: [...s.toasts, { id, message, type }] };
    }),
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
