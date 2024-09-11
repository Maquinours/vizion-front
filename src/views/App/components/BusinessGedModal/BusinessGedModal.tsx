import { useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import styles from './BusinessGedModal.module.scss';
import AppViewBusinessGedModalComponentBodyComponent from './components/Body/Body';
import AppViewBusinessGedModalComponentFooterComponent from './components/Footer/Footer';

export default function AppViewBusinessGedModalComponent() {
  const navigate = useNavigate();

  return (
    <ReactModal
      isOpen={true}
      overlayClassName="Overlay"
      onRequestClose={() =>
        navigate({
          search: (old) => ({ ...old, appModal: undefined, businessId: undefined, gedItemKey: undefined }),
          replace: true,
          resetScroll: false,
        })
      }
      className={styles.modal}
    >
      <div className={styles.modal_container}>
        <div className={styles.modal_header}>
          <h6>Importer vos photos dans l&apos;affaire</h6>
        </div>
        <AppViewBusinessGedModalComponentBodyComponent />
        <AppViewBusinessGedModalComponentFooterComponent />
      </div>
    </ReactModal>
  );
}
