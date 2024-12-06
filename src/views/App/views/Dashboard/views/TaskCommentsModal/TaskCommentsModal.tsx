import { getRouteApi } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import AppViewDashboardViewTaskCommentsModalViewCommentsComponent from './components/Comments/Comments';
import AppViewDashboardViewTaskCommentsModalViewInputComponent from './components/Input/Input';
import styles from './TaskCommentsModal.module.scss';

const routeApi = getRouteApi('/app/dashboard/task-comments/$taskId');

export default function AppViewDashboardViewTaskCommentsModalView() {
  const navigate = routeApi.useNavigate();

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
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
