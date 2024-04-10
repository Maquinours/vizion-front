import { useQuery } from '@tanstack/react-query';
import { Link, Outlet, getRouteApi } from '@tanstack/react-router';
import PaginationComponent from '../../../../../../components/Pagination/Pagination';
import { news } from '../../../../../../utils/constants/queryKeys/news';
import styles from './News.module.scss';
import AppViewToolsViewNewsViewTableComponent from './components/Table/Table';

const routeApi = getRouteApi('/app/tools/news');

const size = 15;

export default function AppViewToolsViewNewsView() {
  const { page } = routeApi.useSearch();

  const { data, isLoading } = useQuery(news.page({ page, size }));

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.buttons_container}>
            <Link from={routeApi.id} to="./create" search={(old) => old} className="btn btn-secondary">
              Ajouter
            </Link>
          </div>
          <AppViewToolsViewNewsViewTableComponent data={data?.content} isLoading={isLoading} />
          <PaginationComponent
            page={page}
            totalPages={data?.totalPages}
            pageLink={(page) => ({ from: routeApi.id, search: (old) => ({ ...old, page }), params: {} })}
          />
        </div>
      </div>
      <Outlet />
    </>
  );
}
