import { Link, getRouteApi } from '@tanstack/react-router';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import styles from './ButtonsSection.module.scss';

const routeApi = getRouteApi('/app/businesses-rma');

export default function AppViewBusinessesRmaViewButtonsSectionComponent() {
  const { data: user } = useAuthentifiedUserQuery();
  return (
    <div className={styles.buttons_container}>
      {user.userInfo.roles.includes('ROLE_REPRESENTANT') && (
        <Link
          from={routeApi.id}
          to="representative-turnover"
          search
          state={(prev) => prev}
          replace
          resetScroll={false}
          preload="intent"
          className="btn btn-primary"
        >
          {"Mon chiffre d'affaires"}
        </Link>
      )}
      <Link from={routeApi.id} to="search-by-products" search state={(prev) => prev} replace resetScroll={false} preload="intent" className="btn btn-primary">
        Rechercher par produit(s)
      </Link>
    </div>
  );
}
