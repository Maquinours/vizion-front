import { getRouteApi } from '@tanstack/react-router';
import styles from './Buttons.module.scss';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';
import { Link } from '@tanstack/react-router';

const Route = getRouteApi('/app/enterprises/$enterpriseId');

export default function AppViewEnterpriseViewHeaderComponentButtonsComponent() {
  const { data: currentUser } = useAuthentifiedUserQuery();

  return (
    <div className={styles.container}>
      <Link from={Route.id} to="./address-book" search={(old) => ({ ...old, search: undefined, page: 0, size: 9 })} replace className="btn btn-primary">
        {"Carnet d'adresse"}
      </Link>
      {currentUser.userInfo.roles.some((role) => ['ROLE_MEMBRE_VIZEO', 'ROLE_REPRESENTANT'].includes(role)) && (
        <Link from={Route.id} to="./delete" search={(old) => old} replace className="btn btn-secondary">
          Supprimer cette entreprise
        </Link>
      )}
    </div>
  );
}
