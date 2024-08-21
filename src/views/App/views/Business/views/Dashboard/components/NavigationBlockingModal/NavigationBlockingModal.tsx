import ReactModal from 'react-modal';
import styles from './NavigationBlockingModal.module.scss';

type AppViewBusinessViewDashboardViewNavigationBlockingModalComponentProps = Readonly<{
  proceed: () => void;
  reset: () => void;
}>;
export default function AppViewBusinessViewDashboardViewNavigationBlockingModalComponent({
  proceed,
  reset,
}: AppViewBusinessViewDashboardViewNavigationBlockingModalComponentProps) {
  return (
    <ReactModal isOpen className={styles.modal} onRequestClose={reset} overlayClassName="Overlay">
      <div className={styles.content}>
        <h1 className={styles.title}>Des modifications n'ont pas été sauvegardées. Voulez vous tout de même quitter la page ?</h1>
        <div className={styles.buttons_container}>
          <button type="button" className="btn btn-primary-light" onClick={reset}>
            Annuler
          </button>
          <button type="button" className="btn btn-secondary" onClick={proceed}>
            Quitter
          </button>
        </div>
      </div>
    </ReactModal>
  );
}
