import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import styles from './BusinessGedModal.module.scss';
import AppViewBusinessGedModalComponentBodyComponent from './components/Body/Body';
import AppViewBusinessGedModalComponentFooterComponent from './components/Footer/Footer';

const Route = getRouteApi('/app');

export default function AppViewBusinessGedModalComponent() {
  const navigate = useNavigate();

  return (
    <ReactModal
      isOpen={true}
      overlayClassName="Overlay"
      onRequestClose={() => navigate({ from: Route.id, search: (old) => ({ ...old, modal: undefined, businessId: undefined, gedItemKey: undefined }) })}
      className={styles.modal}
    >
      <div className={styles.modal_container}>
        <div className={styles.modal_header}>
          <h6>Importer vos photos dans l&pos;affaire</h6>
        </div>
        <AppViewBusinessGedModalComponentBodyComponent />
        <AppViewBusinessGedModalComponentFooterComponent />
      </div>
    </ReactModal>
  );
}
