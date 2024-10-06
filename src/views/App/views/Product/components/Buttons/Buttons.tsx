import { Link, useLocation } from '@tanstack/react-router';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import styles from './Buttons.module.scss';

export default function AppViewProductViewButtonsComponent() {
  useLocation(); // We need to use useLocation to trigger a rerender of the links when the user navigates

  const { data: user } = useAuthentifiedUserQuery();

  if (user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO'))
    return (
      <div className={styles.buttons_container}>
        <Link to="." search={(old) => ({ ...old, productModal: 'update' })} replace resetScroll={false} preload="intent" className="btn btn-primary-light">
          Modifier le produit
        </Link>
        <Link to="." search={(old) => ({ ...old, productModal: 'delete' })} replace resetScroll={false} preload="intent" className="btn btn-secondary">
          Supprimer le produit
        </Link>
      </div>
    );
}
