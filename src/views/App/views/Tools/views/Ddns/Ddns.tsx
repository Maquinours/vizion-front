import AppViewToolsViewDdnsViewSearchSectionComponent from './components/SearchSection/SearchSection';
import styles from './Ddns.module.scss';
import PaginationComponent from '../../../../../../components/Pagination/Pagination';
import { Link, Outlet, getRouteApi } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { ddnsQueryKeys } from '../../../../../../utils/constants/queryKeys/ddns';
import { getDdnsPage, getDdnsPageWithSearch } from '../../../../../../utils/api/ddns';
import AppViewToolsViewDdnsViewTableComponent from './components/Table/Table';

const routeApi = getRouteApi('/app/tools/ddns');

const size = 15;

export default function AppViewToolsViewDdnsView() {
  const { page, email, domain, serial, ref, date } = routeApi.useSearch();

  const { data, isLoading } = useQuery({
    queryKey: ddnsQueryKeys.pageWithSearch(email, domain, serial, ref, date, page, size),
    queryFn: () => (email || domain || serial || ref || date ? getDdnsPageWithSearch(email, domain, serial, ref, date, page, size) : getDdnsPage(page, size)),
  });

  return (
    <>
      <div className={styles.container}>
        <div className={styles.button_container}>
          <Link from={routeApi.id} to="./create" search={(old) => old} className="btn btn-secondary">
            Ajouter DDNS
          </Link>
        </div>
        <AppViewToolsViewDdnsViewSearchSectionComponent />

        <div className={styles.content}>
          <AppViewToolsViewDdnsViewTableComponent data={data?.content} isLoading={isLoading} />
          <div className={styles.pagination}>
            <PaginationComponent
              page={page}
              totalPages={data?.totalPages}
              pageLink={(page) => ({ from: routeApi.id, search: (old) => ({ ...old, page }), params: (old) => old })}
            />
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
}
