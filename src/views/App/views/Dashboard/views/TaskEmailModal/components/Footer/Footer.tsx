import { Link, getRouteApi } from '@tanstack/react-router';
import styles from './Footer.module.scss';

const routeApi = getRouteApi('/app/dashboard/task-email/$taskId');

export default function AppViewDashboardViewTaskEmailModalViewFooterComponent() {
  return (
    <div className={styles.modal_footer}>
      <div className={styles.buttons_container}>
        <Link from={routeApi.id} to="../.." search replace resetScroll={false} className="btn btn-secondary">
          Fermer
        </Link>
        <div className="flex gap-1">
          <Link from={routeApi.id} to="resend" search replace resetScroll={false} className="btn btn-primary">
            Renvoyer
          </Link>
          <Link from={routeApi.id} to="reply" search replace resetScroll={false} className="btn btn-primary">
            Répondre
          </Link>
        </div>
      </div>
    </div>
  );
}
