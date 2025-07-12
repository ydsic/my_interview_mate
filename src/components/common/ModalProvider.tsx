import { createPortal } from 'react-dom';
import { useModalStore } from '../../store/modalStore';
import { AnimatePresence, motion } from 'framer-motion';
import Button, { WhiteButton } from './Button';
import { H2_content_title, H4_placeholder } from './HTagStyle';

export default function ModalProvider() {
  const modal = useModalStore((s) => s.modal);
  const close = useModalStore((s) => s.closeModal);

  if (!modal) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        key={modal.id}
        className="fixed inset-0 z-[9998] bg-black/40 flex items-center justify-center"
      >
        <motion.div className="w-[90%] max-w-md bg-white rounded-2xl shadow-xl p-6">
          <H2_content_title>{modal.title}</H2_content_title>
          {modal.description && (
            <H4_placeholder>{modal.description}</H4_placeholder>
          )}

          <div className="flex justify-center gap-4">
            <WhiteButton
              onClick={() => {
                modal.onCancel?.();
                close();
              }}
            >
              {modal.cancelText}
            </WhiteButton>
            <Button
              onClick={() => {
                modal.onConfirm?.();
                close();
              }}
            >
              {modal.confirmText}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}
