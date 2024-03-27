import CardComponent from '../../../../../../../../components/Card/Card';
import { useQuery } from '@tanstack/react-query';
import { productVersionQueryKeys } from '../../../../../../../../utils/constants/queryKeys/productVersion';
import { Link, getRouteApi } from '@tanstack/react-router';
import { getProductVersionsPageByProductId } from '../../../../../../../../utils/api/productVersion';
import PaginationComponent from '../../../../../../../../components/Pagination/Pagination';
import AppViewProductViewManageViewVersionsComponentTableComponent from './components/Table/Table';
import styles from './Versions.module.scss';
import RefreshButtonComponent from '../../../../../../../../components/RefreshButton/RefreshButton';

const routeApi = getRouteApi('/app/products/$productId/manage');

const size = 5;

export default function AppViewProductViewManageViewVersionsComponent() {
  const { productId } = routeApi.useParams();
  const { versionsPage: page } = routeApi.useSearch();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: productVersionQueryKeys.pageByProductId(productId, page, size),
    queryFn: () => getProductVersionsPageByProductId(productId, page, size),
  });

  return (
    <CardComponent title="Versions de produit">
      <div className={styles.container}>
        <div className={styles.button_container}>
          <Link from={routeApi.id} to="./create-version" search={(old) => old} className="btn btn-primary">
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
              pageLink={(page) => ({ from: routeApi.id, search: (old) => ({ ...old, versionsPage: page }), params: (old) => old })}
            />
          </div>
        </div>
      </div>
    </CardComponent>
  );
}
