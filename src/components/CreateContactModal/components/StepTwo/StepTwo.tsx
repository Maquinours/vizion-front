import ReactModal from 'react-modal';
import styles from './StepTwo.module.scss';

type CreateContactModalComponentStepTwoComponentProps = Readonly<{
  onClose: () => void;
  onConfirm: () => void;
}>;
export default function CreateContactModalComponentStepTwoComponent({ onClose, onConfirm }: CreateContactModalComponentStepTwoComponentProps) {
  return (
    <ReactModal isOpen={true} onRequestClose={() => onClose()} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.container}>
        <div className={styles.title}>
          <p>Envoi du mot de passe</p>
        </div>

        <div className={styles.content}>
          <p>Voulez-vous envoyer le mot de passe mail par mail ?</p>
        </div>

        <div className={styles.footer}>
          <button className="btn btn-primary" onClick={() => onClose()}>
            Annuler
          </button>
          <button className="btn btn-secondary" onClick={() => onConfirm()}>
            Confirmer
          </button>
        </div>
      </div>
    </ReactModal>
  );
}
