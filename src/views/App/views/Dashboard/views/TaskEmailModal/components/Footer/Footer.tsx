import { Link, getRouteApi } from '@tanstack/react-router';
import styles from './Footer.module.scss';

const routeApi = getRouteApi('/app/dashboard/task-email/$taskId');

export default function AppViewDashboardViewTaskEmailModalViewFooterComponent() {
  return (
    <div className={styles.modal_footer}>
      <div className={styles.buttons_container}>
        <Link from={routeApi.id} to="../.." search={(old) => old} replace className="btn btn-secondary">
          Fermer
        </Link>
        <Link from={routeApi.id} to="reply" search={(old) => old} replace className="btn btn-primary">
          Répondre
        </Link>
      </div>
    </div>
  );
}
