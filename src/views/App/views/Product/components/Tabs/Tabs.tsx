import { Link, getRouteApi } from '@tanstack/react-router';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import styles from './Tabs.module.scss';

const routeApi = getRouteApi('/app/products/$productId');

export default function AppViewProductViewTabsComponent() {
  const { data: user } = useAuthentifiedUserQuery();

  if (user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO'))
    return (
      <div className={styles.tabs_buttons_container}>
        <Link
          from={routeApi.id}
          to={'./informations'}
          search={{ lifesheetPage: 0 }}
          className="btn"
          activeProps={{ className: 'btn-primary' }}
          inactiveProps={{ className: 'btn-primary-light' }}
        >
          Informations
        </Link>
        <Link
          from={routeApi.id}
          to={'./manage'}
          search={{
            associatedProductsPage: 0,
            versionsPage: 0,
            specificationsPage: 0,
            stocksPage: 0,
            salesPage: 0,
            salesSize: 100,
            stockEntriesPage: 0,
            stockEntriesSize: 5,
          }}
          className="btn"
          activeProps={{ className: 'btn-primary' }}
          inactiveProps={{ className: 'btn-primary-light' }}
        >
          Gestion
        </Link>
      </div>
    );
}
