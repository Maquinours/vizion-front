import { Link, getRouteApi } from '@tanstack/react-router';
import styles from './ButtonsSection.module.scss';
import classNames from 'classnames';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/assistance/$assistanceId');

export default function AppViewAssistanceViewButtonsSectionComponent() {
  return (
    <div className={styles.buttons_container}>
      <Link to="/app/faq" className={classNames('btn btn-primary-light', styles.left)} style={{ fontSize: '14px', lineHeight: '20px' }}>
        FAQ
      </Link>
      <Link to="/app/tools/ddns/create" className="btn btn-primary">
        Créer DDNS
      </Link>
      <Link from={routeApi.id} to="pdf" search replace resetScroll={false} preload="intent" className="btn btn-secondary">
        {"Éditer l'AT"}
      </Link>
      <Link from={routeApi.id} to="delete" search replace resetScroll={false} preload="intent" className="btn btn-secondary">
        {"Supprimer l'AT"}
      </Link>
      <Link from={routeApi.id} to="/app/businesses-rma/business/$businessId/study" className={classNames('btn btn-primary', styles.left)}>
        Accès dossier technique
      </Link>
      <Link from={routeApi.id} to="create-faq" search replace resetScroll={false} preload="intent" className={classNames('btn btn-secondary', styles.left)}>
        Ajouter une FAQ
      </Link>
    </div>
  );
}
