import { getRouteApi, useNavigate } from '@tanstack/react-router';
import styles from './Footer.module.scss';

const Route = getRouteApi('/app/dashboard/task-email/$taskId');

export default function AppViewDashboardViewTaskEmailModalViewFooterComponent() {
  const navigate = useNavigate();

  return (
    <div className={styles.modal_footer}>
      <div className={styles.buttons_container}>
        <button className="btn btn-secondary" onClick={() => navigate({ from: Route.id, to: '../..', search: (old) => old })}>
          Fermer
        </button>
        <button className="btn btn-primary" onClick={() => navigate({ from: Route.id, to: './reply', search: (old) => old })}>
          Répondre
        </button>
      </div>
    </div>
  );
}
