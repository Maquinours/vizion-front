import { useQuery } from '@tanstack/react-query';
import { Link, getRouteApi } from '@tanstack/react-router';
import CardComponent from '../../../../../../../../components/Card/Card';
import PaginationComponent from '../../../../../../../../components/Pagination/Pagination';
import RefreshButtonComponent from '../../../../../../../../components/RefreshButton/RefreshButton';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import styles from './Versions.module.scss';
import AppViewProductViewManageViewVersionsComponentTableComponent from './components/Table/Table';

const routeApi = getRouteApi('/app/products/$productId/manage');

const size = 5;

export default function AppViewProductViewManageViewVersionsComponent() {
  const { productId } = routeApi.useParams();
  const { versionsPage: page } = routeApi.useSearch();

  const { data, isLoading, refetch, isRefetching } = useQuery(queries['product-versions'].page._ctx.byProductId(productId, { page, size }));

  return (
    <CardComponent title="Versions de produit">
      <div className={styles.container}>
        <div className={styles.button_container}>
          <Link from={routeApi.id} to="create-version" search replace resetScroll={false} className="btn btn-primary">
            Ajouter une nouvelle version
          </Link>
          <RefreshButtonComponent className="btn btn-primary" style={{ marginLeft: '0.5rem' }} onRefresh={() => refetch()} isRefreshing={isRefetching} />
        </div>

        <div className={styles.table}>
          <AppViewProductViewManageViewVersionsComponentTableComponent isLoading={isLoading} data={data?.content} />
          <div className={styles.pagination}>
            <PaginationComponent
              page={page}
              totalPages={data?.totalPages}
              pageLink={(page) => ({
                from: routeApi.id,
                search: (old) => ({ ...old, versionsPage: page }),
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
