import ReactModal from 'react-modal';
import SendEmailComponent, { SendEmailComponentProps } from '../SendEmail/SendEmail';
import styles from './SendEmailModal.module.scss';

type SendEmailModalComponentProps = Readonly<SendEmailComponentProps & { isOpen: boolean; onClose: () => void }>;
export default function SendEmailModalComponent({ isOpen, onClose, ...props }: SendEmailModalComponentProps) {
  return (
    <ReactModal isOpen={isOpen} onRequestClose={onClose} overlayClassName="Overlay" className={styles.modal}>
      <SendEmailComponent onEmailSent={onClose} {...props} />
    </ReactModal>
  );
}
