import { Link } from '@tanstack/react-router';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import styles from './Buttons.module.scss';

export default function AppViewProductViewButtonsComponent() {
  const { data: user } = useAuthentifiedUserQuery();

  if (user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO'))
    return (
      <div className={styles.buttons_container}>
        <Link search={(old) => ({ ...old, productModal: 'update' })} replace resetScroll={false} preload="intent" className="btn btn-primary-light">
          Modifier le produit
        </Link>
        <Link search={(old) => ({ ...old, productModal: 'delete' })} replace resetScroll={false} preload="intent" className="btn btn-secondary">
          Supprimer le produit
        </Link>
      </div>
    );
}
