import { Link } from '@tanstack/react-router';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import styles from './Tabs.module.scss';

const routePath = '/app/products/$productId';

export default function AppViewProductViewTabsComponent() {
  const { data: user } = useAuthentifiedUserQuery();

  if (user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO'))
    return (
      <div className={styles.tabs_buttons_container}>
        <Link
          from={routePath}
          to={'/app/products/$productId/informations'}
          className="btn"
          activeProps={{ className: 'btn-primary' }}
          inactiveProps={{ className: 'btn-primary-light' }}
          replace
          preload="intent"
        >
          Informations
        </Link>
        <Link
          from={routePath}
          to={'/app/products/$productId/manage'}
          className="btn"
          activeProps={{ className: 'btn-primary' }}
          inactiveProps={{ className: 'btn-primary-light' }}
          replace
          preload="intent"
        >
          Gestion
        </Link>
      </div>
    );
}
