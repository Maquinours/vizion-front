import ReactModal from 'react-modal';
import styles from './UnsavedChangesBlockingModal.module.scss';
import { PulseLoader } from 'react-spinners';

type UnsavedChangesBlockingModalComponentProps = Readonly<{
  proceed: () => void;
  reset: () => void;
  save: () => void;
  isSaving: boolean;
}>;
export default function UnsavedChangesBlockingModalComponent({ proceed, reset, save, isSaving }: UnsavedChangesBlockingModalComponentProps) {
  return (
    <ReactModal isOpen className={styles.modal} onRequestClose={reset} overlayClassName="Overlay">
      <div className={styles.content}>
        <h1 className={styles.title}>
          Des modifications n&apos;ont pas été sauvegardées.
          <br />
          Voulez vous tout de même <span className="text-(--secondary-color)">quitter</span> la page ?
        </h1>
        <div className="flex items-center justify-center">
          <PulseLoader color="#31385A" loading={isSaving} className="m-4" size={10} speedMultiplier={0.5} />
        </div>
        <div className={styles.buttons_container}>
          <button type="button" className="btn btn-primary-light" onClick={reset}>
            Annuler
          </button>
          <button type="button" className="btn btn-secondary" onClick={proceed}>
            Ignorer et quitter
          </button>
          <button type="button" className="btn btn-primary" onClick={save}>
            Sauvegarder et quitter
          </button>
        </div>
      </div>
    </ReactModal>
  );
}
