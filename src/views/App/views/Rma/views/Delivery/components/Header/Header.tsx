import { Link, getRouteApi } from '@tanstack/react-router';
import styles from './Header.module.scss';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import AssistanceState from '../../../../../../../../utils/enums/AssistanceState';

const routeApi = getRouteApi('/app/businesses-rma_/rma/$rmaId/delivery');

export default function AppViewRmaViewDeliveryViewHeaderComponent() {
  const { rmaId } = routeApi.useParams();

  const { data: rma } = useSuspenseQuery(queries.rmas.detail(rmaId));

  return (
    <div className={styles.header}>
      <div className={styles.buttons_container}>
        {rma.state !== AssistanceState.ARCHIVE && (
          <Link
            from="/app/businesses-rma/rma/$rmaId/delivery"
            to="create-detail"
            search
            replace
            resetScroll={false}
            preload="intent"
            className="btn btn-primary"
          >
            Ajouter un article
          </Link>
        )}
        <Link from="/app/businesses-rma/rma/$rmaId/delivery" to="pdf" search replace resetScroll={false} preload="intent" className="btn btn-secondary">
          Éditer
        </Link>
        <Link
          from="/app/businesses-rma/rma/$rmaId/delivery"
          to="travel-voucher"
          search
          replace
          resetScroll={false}
          preload="intent"
          className="btn btn-primary"
        >
          Éditer BT
        </Link>
      </div>
    </div>
  );
}
