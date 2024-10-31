import { Link } from '@tanstack/react-router';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';
import styles from './Buttons.module.scss';

const routePath = '/app/enterprises/$enterpriseId';

export default function AppViewEnterpriseViewHeaderComponentButtonsComponent() {
  const { data: currentUser } = useAuthentifiedUserQuery();

  return (
    <div className={styles.container}>
      <Link
        from={routePath}
        to="./address-book"
        search={(old) => ({ ...old, search: undefined, page: 0, size: 9 })}
        replace
        resetScroll={false}
        preload="intent"
        className="btn btn-primary"
      >
        {"Carnet d'adresse"}
      </Link>
      {currentUser.userInfo.roles.some((role) => ['ROLE_MEMBRE_VIZEO', 'ROLE_REPRESENTANT'].includes(role)) && (
        <Link from={routePath} to="./delete" search replace resetScroll={false} preload="intent" className="btn btn-secondary">
          Supprimer cette entreprise
        </Link>
      )}
    </div>
  );
}
