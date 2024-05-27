import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, Link } from '@tanstack/react-router';
import CardComponent from '../../../../../../../../components/Card/Card';
import PaginationComponent from '../../../../../../../../components/Pagination/Pagination';
import RefreshButtonComponent from '../../../../../../../../components/RefreshButton/RefreshButton';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import AppViewProductViewManageViewStocksComponentTableComponent from './components/Table/Table';
import styles from './Stocks.module.scss';

const routeApi = getRouteApi('/app/products/$productId/manage');

const size = 5;

export default function AppViewProductViewManageViewStocksComponent() {
  const { productId } = routeApi.useParams();
  const { stocksPage: page } = routeApi.useSearch();

  const { data: product } = useSuspenseQuery(queries.product.detail(productId));
  const { data, isLoading, refetch, isRefetching } = useQuery(
    queries['product-version-shelf-stocks'].page._ctx.byProductReference(product.reference!, { page, size }),
  );

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
