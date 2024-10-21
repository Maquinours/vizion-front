import { Link, getRouteApi } from '@tanstack/react-router';
import styles from './ButtonsSection.module.scss';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/assistance/$assistanceId');

export default function AppViewAssistanceViewButtonsSectionComponent() {
  return (
    <div className={styles.buttons_container}>
      <div className="flex flex-1 flex-col gap-y-2">
        <Link to="/app/faq" className="btn btn-primary" style={{ fontSize: '14px', lineHeight: '20px' }}>
          FAQ
        </Link>
        <Link from={routeApi.id} to="create-faq" search replace resetScroll={false} preload="intent" className="btn btn-secondary">
          Ajouter une FAQ
        </Link>
        <Link from={routeApi.id} to="/app/businesses-rma/business/$businessId/study" className="btn btn-primary">
          Accès dossier technique
        </Link>
        <Link from={routeApi.id} to="/app/businesses-rma/business/$businessId/quotation" className="btn btn-primary">
          Accès liste du matériel
        </Link>
      </div>
      <div className="flex flex-1 flex-col gap-y-2">
        <Link to="/app/tools/ddns/create" className="btn btn-primary">
          Créer DDNS
        </Link>
        <Link from={routeApi.id} to="pdf" search replace resetScroll={false} preload="intent" className="btn btn-secondary">
          {"Éditer l'AT"}
        </Link>
        <Link from={routeApi.id} to="delete" search replace resetScroll={false} preload="intent" className="btn btn-secondary">
          {"Supprimer l'AT"}
        </Link>
      </div>
    </div>
  );
}
