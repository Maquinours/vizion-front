import { useQuery } from '@tanstack/react-query';
import { getRouteApi, Link } from '@tanstack/react-router';
import CardComponent from '../../../../../../../../components/Card/Card';
import PaginationComponent from '../../../../../../../../components/Pagination/Pagination';
import RefreshButtonComponent from '../../../../../../../../components/RefreshButton/RefreshButton';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import AppViewProductViewManageViewSpecificationsComponentTableComponent from './components/Table/Table';
import styles from './Specifications.module.scss';

const routeApi = getRouteApi('/app/products/$productId/manage');

const size = 5;

export default function AppViewProductViewManageViewSpecificationsComponent() {
  const { productId } = routeApi.useParams();
  const { specificationsPage: page } = routeApi.useSearch();

  const { data, isLoading, refetch, isRefetching } = useQuery(queries.product.detail._ctx.byId(productId)._ctx.specifications._ctx.page({ page, size }));

  return (
    <CardComponent title="Caractéristiques">
      <div className={styles.container}>
        <div className={styles.button_container}>
          <Link from={routeApi.id} to="./add-specification" search={(old) => old} className="btn btn-primary">
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
              pageLink={(page) => ({ from: routeApi.id, search: (old) => ({ ...old, specificationsPage: page }), params: (old) => old })}
            />
          </div>
        </div>
      </div>
    </CardComponent>
  );
}
