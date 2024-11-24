import { useQuery } from '@tanstack/react-query';
import { getRouteApi, Link } from '@tanstack/react-router';
import CardComponent from '../../../../../../../../components/Card/Card';
import PaginationComponent from '../../../../../../../../components/Pagination/Pagination';
import RefreshButtonComponent from '../../../../../../../../components/RefreshButton/RefreshButton';
import { productSpecificationsQueryKeys } from '../../../../../../../../utils/constants/queryKeys/productSpecifications';
import AppViewProductViewManageViewSpecificationsComponentTableComponent from './components/Table/Table';
import styles from './Specifications.module.scss';

const routeApi = getRouteApi('/app/products_/$productId/manage');
const routePath = '/app/products/$productId/manage';

const size = 5;

export default function AppViewProductViewManageViewSpecificationsComponent() {
  const { productId } = routeApi.useParams();
  const { specificationsPage: page } = routeApi.useSearch();

  const { data, isLoading, refetch, isRefetching } = useQuery(productSpecificationsQueryKeys.page._ctx.byProductId(productId, { page, size }));

  return (
    <CardComponent title="Caractéristiques">
      <div className={styles.container}>
        <div className={styles.button_container}>
          <Link from={routePath} to="add-specification" search replace resetScroll={false} preload="intent" className="btn btn-primary">
            Ajouter des filtres
          </Link>
          <RefreshButtonComponent className="btn btn-primary" style={{ marginLeft: '0.5rem' }} onRefresh={() => refetch()} isRefreshing={isRefetching} />
        </div>

        <div className={styles.table}>
          <AppViewProductViewManageViewSpecificationsComponentTableComponent isLoading={isLoading} data={data?.content} />
          <div className={styles.pagination}>
            <PaginationComponent
              page={page}
              totalPages={data?.totalPages}
              pageLink={(page) => ({
                from: routePath,
                search: (old) => ({ ...old, specificationsPage: page }),
                replace: true,
                resetScroll: false,
              })}
            />
          </div>
        </div>
      </div>
    </CardComponent>
  );
}
