import { Outlet, getRouteApi, useNavigate } from '@tanstack/react-router';
import AppViewBusinessViewBlViewBodyComponent from './components/Body/Body';
import AppViewBusinessViewBlViewHeaderComponent from './components/Header/Header';
import PaginationComponent from '../../../../../../components/Pagination/Pagination';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../utils/constants/queryKeys';
import styles from './Bl.module.scss';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/bl');

export default function AppViewBusinessViewBlView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { businessId } = routeApi.useParams();
  const { page } = routeApi.useSearch();

  const { data: bls } = useSuspenseQuery(queries['business-bls'].list._ctx.byBusinessId(businessId));

  return (
    <>
      <div className={styles.container}>
        <AppViewBusinessViewBlViewHeaderComponent />
        <AppViewBusinessViewBlViewBodyComponent />
        <div>
          <PaginationComponent page={page} totalPages={bls.length} onPageChange={(page) => navigate({ search: (old) => ({ ...old, page }) })} />
        </div>
      </div>
      <Outlet />
    </>
  );
}
