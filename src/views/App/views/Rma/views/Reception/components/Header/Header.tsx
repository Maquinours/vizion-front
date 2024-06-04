import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, getRouteApi } from '@tanstack/react-router';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import styles from './Header.module.scss';

const routeApi = getRouteApi('/app/businesses-rma/rma/$rmaId/reception');

export default function AppViewRmaViewReceptionViewHeaderComponent() {
  const { rmaId } = routeApi.useParams();
  const { data: rma } = useSuspenseQuery(queries.rmas.detail(rmaId));

  return (
    <div className={styles.header}>
      <div className={styles.buttons_container}>
        {rma.state !== 'ARCHIVE' && (
          <Link from={routeApi.id} to="create-detail" search replace resetScroll={false} className="btn btn-primary">
            Ajouter un article
          </Link>
        )}
        <Link from={routeApi.id} to="pdf" search replace resetScroll={false} className="btn btn-secondary">
          Editer
        </Link>
      </div>
    </div>
  );
}
