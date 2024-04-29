import { Link, getRouteApi } from '@tanstack/react-router';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import styles from './ButtonsSection.module.scss';

const routeApi = getRouteApi('/app/businesses-rma');

export default function AppViewBusinessesRmaViewButtonsSectionComponent() {
  const { data: user } = useAuthentifiedUserQuery();
  return (
    <div className={styles.buttons_container}>
      {user.userInfo.roles.includes('ROLE_REPRESENTANT') && (
        <Link from={routeApi.id} to="representative-turnover" search={(old) => old} className="btn btn-primary">
          {"Mon chiffre d'affaires"}
        </Link>
      )}
      {/* <button className="btn btn-primary" onClick={() => openSeachByProductModal()}> // TODO: reimplement this
        Rechercher une affaire par produit
      </button> */}
    </div>
  );
}
