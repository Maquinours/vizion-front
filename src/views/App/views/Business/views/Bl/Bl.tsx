import { useSuspenseQuery } from '@tanstack/react-query';
import { Outlet, getRouteApi } from '@tanstack/react-router';
import PaginationComponent from '../../../../../../components/Pagination/Pagination';
import { queries } from '../../../../../../utils/constants/queryKeys';
import styles from './Bl.module.scss';
import AppViewBusinessViewBlViewBodyComponent from './components/Body/Body';
import AppViewBusinessViewBlViewHeaderComponent from './components/Header/Header';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/bl');

export default function AppViewBusinessViewBlView() {
  const { businessId } = routeApi.useParams();
  const { page } = routeApi.useSearch();

  const { data: bls } = useSuspenseQuery(queries['business-bls'].list._ctx.byBusinessId(businessId));

  return (
    <>
      <div className={styles.container}>
        <AppViewBusinessViewBlViewHeaderComponent />
        <AppViewBusinessViewBlViewBodyComponent />
        <div>
          <PaginationComponent
            page={page}
            totalPages={bls.length}
            pageLink={(page) => ({ from: routeApi.id, search: (old) => ({ ...old, page }), replace: true, resetScroll: false })}
          />
        </div>
      </div>
      <Outlet />
    </>
  );
}
