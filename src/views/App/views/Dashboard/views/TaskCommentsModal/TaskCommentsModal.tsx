import ReactModal from 'react-modal';
import AppViewDashboardViewTaskCommentsModalViewCommentsComponent from './components/Comments/Comments';
import AppViewDashboardViewTaskCommentsModalViewInputComponent from './components/Input/Input';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import styles from './TaskCommentsModal.module.scss';

const Route = getRouteApi('/app/dashboard/task-comments/$taskId');

export default function AppViewDashboardViewTaskCommentsModalView() {
  const navigate = useNavigate();

  const onClose = () => {
    navigate({ from: Route.id, to: '../..', search: (old) => old });
  };

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <p>Commentaires</p>
        </div>
        <AppViewDashboardViewTaskCommentsModalViewCommentsComponent />
        <AppViewDashboardViewTaskCommentsModalViewInputComponent onClose={onClose} />
      </div>
    </ReactModal>
  );
}
