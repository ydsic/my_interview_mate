import { useModalStore } from '../store/modalStore';

export const useModal = () => {
  const openModal = useModalStore((s) => s.openModal);
  return (params: Omit<Parameters<typeof openModal>[0], 'id'>) =>
    openModal(params);
};
