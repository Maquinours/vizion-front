import { useQuery } from '@tanstack/react-query';
import { Outlet, getRouteApi } from '@tanstack/react-router';
import { queries } from '../../../../utils/constants/queryKeys';
import styles from './Products.module.scss';
import AppViewProductsViewButtonsComponent from './components/Buttons/Buttons';
import AppViewProductsViewPaginationComponent from './components/Pagination/Pagination';
import AppViewProductsViewSearchSectionComponent from './components/SearchSection/SearchSection';
import AppViewProductsViewTableComponent from './components/Table/Table';

const routeApi = getRouteApi('/app/products');
const size = 20;

export default function AppViewProductsView() {
  const { ref, designation, page } = routeApi.useSearch();

  const { data, isLoading } = useQuery(queries.product.page({ page, size })._ctx.search({ designation, ref }));

  return (
    <>
      <div className={styles.container}>
        <AppViewProductsViewButtonsComponent />
        <AppViewProductsViewSearchSectionComponent />
        <AppViewProductsViewTableComponent data={data?.content} isLoading={isLoading} />
        <AppViewProductsViewPaginationComponent totalPages={data?.totalPages} />
      </div>
      <Outlet />
    </>
  );
}
