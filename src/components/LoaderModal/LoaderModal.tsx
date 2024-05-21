import Modal from 'react-modal';
import { RingLoader } from 'react-spinners';
import styles from './LoaderModal.module.scss';

type LoaderProps = {
  isLoading?: boolean;
};
export default function LoaderModal({ isLoading = true }: LoaderProps) {
  return (
    <Modal isOpen={isLoading} className={styles.modal} shouldCloseOnOverlayClick={!isLoading} shouldCloseOnEsc={!isLoading} overlayClassName="Overlay">
      <div className={styles.container}>
        <RingLoader size={80} color="#31385A" loading={isLoading} speedMultiplier={1} />
      </div>
    </Modal>
  );
}
