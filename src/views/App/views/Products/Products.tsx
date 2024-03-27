import { useQuery } from '@tanstack/react-query';
import AppViewProductsViewSearchSectionComponent from './components/SearchSection/SearchSection';
import styles from './Products.module.scss';
import { productQueryKeys } from '../../../../utils/constants/queryKeys/product';
import { getRouteApi } from '@tanstack/react-router';
import { getProductsPage, getProductsPageWithSearch } from '../../../../utils/api/product';
import AppViewProductsViewTableComponent from './components/Table/Table';
import AppViewProductsViewPaginationComponent from './components/Pagination/Pagination';

const routeApi = getRouteApi('/app/products');
const size = 20;

export default function AppViewProductsView() {
  const { ref, designation, page } = routeApi.useSearch();

  const { data, isLoading } = useQuery({
    queryKey: productQueryKeys.pageWithSearch(ref, designation, page, size),
    queryFn: () => (ref || designation ? getProductsPageWithSearch(ref, designation, page, size) : getProductsPage(page, size)),
  });

  return (
    <div className={styles.container}>
      <AppViewProductsViewSearchSectionComponent />
      <AppViewProductsViewTableComponent data={data?.content} isLoading={isLoading} />
      <AppViewProductsViewPaginationComponent totalPages={data?.totalPages} />
    </div>
  );
}
