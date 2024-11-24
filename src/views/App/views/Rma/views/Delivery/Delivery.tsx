import { Outlet, getRouteApi } from '@tanstack/react-router';
import styles from './Delivery.module.scss';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../utils/constants/queryKeys';
import AppViewRmaViewDeliveryViewHeaderComponent from './components/Header/Header';
import AppViewRmaViewDeliveryViewTableComponent from './components/Table/Table';

const routeApi = getRouteApi('/app/businesses-rma_/rma/$rmaId/delivery');

export default function AppViewRmaViewDeliveryView() {
  const { rmaId } = routeApi.useParams();

  const { data: rma } = useSuspenseQuery(queries.rmas.detail(rmaId));

  return (
    <>
      <div className={styles.container}>
        <div className={styles.grid}>
          <AppViewRmaViewDeliveryViewHeaderComponent />
          <div className={styles.rma_number}>
            <div>
              Numéro : <span>{rma.number}</span>
            </div>
          </div>
          <AppViewRmaViewDeliveryViewTableComponent rma={rma} />
        </div>
      </div>
      <Outlet />
    </>
  );
}
