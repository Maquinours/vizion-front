import { Link, getRouteApi } from '@tanstack/react-router';
import styles from './Header.module.scss';

const Route = getRouteApi('/app/emails/send');

export default function SendEmailViewHeaderComponent() {
  return (
    <div className={styles.header_container}>
      <div className={styles.header_right}>
        <Link from={Route.id} search={{ sendEmailModal: 'predefined-messages' }} className="btn btn-primary">
          Messages prédéfinis
        </Link>
      </div>
    </div>
  );
}
