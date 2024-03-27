import CardComponent from '../../../../../../../../components/Card/Card';
import PaginationComponent from '../../../../../../../../components/Pagination/Pagination';
import { getRouteApi, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { productVersionShelfStocksQueryKeys } from '../../../../../../../../utils/constants/queryKeys/productVersionShelfStock';
import { getProductVersionShelfStocksPageByProductId } from '../../../../../../../../utils/api/productVersionShelfStock';
import styles from './Stocks.module.scss';
import AppViewProductViewManageViewStocksComponentTableComponent from './components/Table/Table';
import RefreshButtonComponent from '../../../../../../../../components/RefreshButton/RefreshButton';

const routeApi = getRouteApi('/app/products/$productId/manage');

const size = 5;

export default function AppViewProductViewManageViewStocksComponent() {
  const { productId } = routeApi.useParams();
  const { stocksPage: page } = routeApi.useSearch();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: productVersionShelfStocksQueryKeys.pageByProductId(productId, page, size),
    queryFn: () => getProductVersionShelfStocksPageByProductId(productId, page, size),
  });

  return (
    <CardComponent title="Stocks">
      <div className={styles.container}>
        <div className={styles.button_container}>
          <Link from={routeApi.id} to={'./create-stock'} search={(old) => old} className="btn btn-primary">
            Ajouter sur étagère
          </Link>
          <RefreshButtonComponent className="btn btn-primary" style={{ marginLeft: '0.5rem' }} onRefresh={() => refetch()} isRefreshing={isRefetching} />
        </div>

        <div className={styles.table}>
          <AppViewProductViewManageViewStocksComponentTableComponent isLoading={isLoading} data={data?.content} />
          <div className={styles.pagination}>
            <PaginationComponent
              page={page}
              totalPages={data?.totalPages}
              pageLink={(page) => ({ from: routeApi.id, search: (old) => ({ ...old, stocksPage: page }), params: (old) => old })}
            />
          </div>
        </div>
      </div>
    </CardComponent>
  );
}
