import { useQuery } from '@tanstack/react-query';
import PaginationComponent from '../../../../../../components/Pagination/Pagination';
import AppViewToolsViewMailsViewHeaderComponent from './components/Header/Header';
import AppViewToolsViewMailsViewTableComponent from './components/Table/Table';
import styles from './Mails.module.scss';
import { mailQueryKeys } from '../../../../../../utils/constants/queryKeys/mails';
import { Outlet, getRouteApi } from '@tanstack/react-router';

const size = 20;

const routeApi = getRouteApi('/app/tools/mails');

export default function AppViewToolsViewMailsView() {
  const { search, page } = routeApi.useSearch();

  const { data, isLoading } = useQuery(mailQueryKeys.page._ctx.all({ page, size }, search));

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <AppViewToolsViewMailsViewHeaderComponent />
          <AppViewToolsViewMailsViewTableComponent data={data?.content} isLoading={isLoading} />
          <PaginationComponent
            page={page}
            totalPages={data?.totalPages}
            pageLink={(page) => ({ from: routeApi.id, search: (old) => ({ ...old, page }), replace: true, resetScroll: false })}
          />
        </div>
      </div>
      <Outlet />
    </>
  );
}
