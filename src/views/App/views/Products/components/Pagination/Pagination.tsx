import { getRouteApi } from '@tanstack/react-router';
import PaginationComponent from '../../../../../../components/Pagination/Pagination';

const routeApi = getRouteApi('/app/products');

type AppViewProductsViewPaginationComponentProps = Readonly<{
  totalPages: number | undefined;
}>;
export default function AppViewProductsViewPaginationComponent({ totalPages }: AppViewProductsViewPaginationComponentProps) {
  const { page } = routeApi.useSearch();

  return <PaginationComponent page={page} totalPages={totalPages} pageLink={(page) => ({ from: routeApi.id, search: (old) => ({ ...old, page }) })} />;
}
