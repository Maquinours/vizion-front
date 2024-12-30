import { Link } from '@tanstack/react-router';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import styles from './Buttons.module.scss';

const routePath = '/app/products';

export default function AppViewProductsViewButtonsComponent() {
  const { data: user } = useAuthentifiedUserQuery();

  return (
    <div className={styles.buttons_container}>
      {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
        <Link from={routePath} to="create" search replace resetScroll={false} preload="intent" className="btn btn-secondary">
          Ajouter un produit
        </Link>
      )}
      {(user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') || user.profile.expert) && (
        <Link from={routePath} to="serial-numbers" search replace resetScroll={false} preload="intent" className="btn btn-secondary">
          Numéros de série
        </Link>
      )}
    </div>
  );
}
