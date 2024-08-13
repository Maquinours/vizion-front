import { Link, getRouteApi } from '@tanstack/react-router';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import styles from './Buttons.module.scss';

const routeApi = getRouteApi('/app/products');

export default function AppViewProductsViewButtonsComponent() {
  const { data: user } = useAuthentifiedUserQuery();

  return (
    <div className={styles.buttons_container}>
      {(user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') || user.profile.expert) && (
        <Link from={routeApi.id} to="serial-numbers" search replace resetScroll={false} preload="intent" className="btn btn-secondary">
          Numéros de série
        </Link>
      )}
    </div>
  );
}
