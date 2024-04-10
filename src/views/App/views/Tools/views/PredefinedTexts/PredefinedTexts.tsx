import { Link, Outlet, getRouteApi } from '@tanstack/react-router';
import styles from './PredefinedTexts.module.scss';
import AppViewToolsViewPredefinedTextsViewTableComponent from './components/Table/Table';
import { useQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../utils/constants/queryKeys';
import PaginationComponent from '../../../../../../components/Pagination/Pagination';

const routeApi = getRouteApi('/app/tools/predefined-texts');

const size = 50;

export default function AppViewToolsViewPredefinedTextsView() {
  const { page } = routeApi.useSearch();

  const { data, isLoading } = useQuery(queries['predefined-text'].page({ page, size }));

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.buttons_container}>
            <Link from={routeApi.id} to="./create" search={(old) => old} className="btn btn-secondary">
              Ajouter
            </Link>
          </div>

          <div className={styles.table_container}>
            <AppViewToolsViewPredefinedTextsViewTableComponent data={data?.content} isLoading={isLoading} />
            <PaginationComponent page={page} totalPages={data?.totalPages} pageLink={(page) => ({ search: (old) => ({ ...old, page }) })} />
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
}
