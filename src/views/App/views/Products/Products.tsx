import { useQuery } from '@tanstack/react-query';
import AppViewProductsViewSearchSectionComponent from './components/SearchSection/SearchSection';
import styles from './Products.module.scss';
import { productQueryKeys } from '../../../../utils/constants/queryKeys/product';
import { Outlet, getRouteApi } from '@tanstack/react-router';
import { getProductsPage, getProductsPageWithSearch } from '../../../../utils/api/product';
import AppViewProductsViewTableComponent from './components/Table/Table';
import AppViewProductsViewPaginationComponent from './components/Pagination/Pagination';
import AppViewProductsViewButtonsComponent from './components/Buttons/Buttons';

const routeApi = getRouteApi('/app/products');
const size = 20;

export default function AppViewProductsView() {
  const { ref, designation, page } = routeApi.useSearch();

  const { data, isLoading } = useQuery({
    queryKey: productQueryKeys.pageWithSearch(ref, designation, page, size),
    queryFn: () => (ref || designation ? getProductsPageWithSearch(ref, designation, page, size) : getProductsPage(page, size)),
  });

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
