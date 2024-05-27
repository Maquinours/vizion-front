import { useQuery } from '@tanstack/react-query';
import { Link, Outlet, getRouteApi } from '@tanstack/react-router';
import PaginationComponent from '../../../../../../components/Pagination/Pagination';
import { queries } from '../../../../../../utils/constants/queryKeys';
import styles from './Formations.module.scss';
import AppViewToolsViewFormationsViewTableComponent from './components/Table/Table';

const routeApi = getRouteApi('/app/tools/formations');

const size = 15;

export default function AppViewToolsViewFormationsView() {
  const { page } = routeApi.useSearch();

  const { data, isLoading } = useQuery(queries.formations.page({ page, size }));

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.buttons_container}>
            <Link from={routeApi.id} to="create" search={(old) => old} replace className="btn btn-secondary">
              Ajouter
            </Link>
          </div>
          <AppViewToolsViewFormationsViewTableComponent data={data?.content} isLoading={isLoading} />
          <PaginationComponent
            page={page}
            totalPages={data?.totalPages}
            pageLink={(page) => ({ search: (old) => ({ ...old, page }), replace: true, resetScroll: false })}
          />
        </div>
      </div>
      <Outlet />
    </>
  );
}
