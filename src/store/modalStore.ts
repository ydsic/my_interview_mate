import { create } from 'zustand';

export type ModalConfig = {
  id: string;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

type ModalState = {
  modal: ModalConfig | null;
  openModal: (cfg: Omit<ModalConfig, 'id'>) => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalState>((set) => ({
  modal: null,
  openModal: (cfg) =>
    set({
      modal: {
        id: crypto.randomUUID(),
        confirmText: '확인',
        cancelText: '취소',
        ...cfg,
      },
    }),
  closeModal: () => set({ modal: null }),
}));
