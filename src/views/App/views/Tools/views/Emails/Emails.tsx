import { useQuery } from '@tanstack/react-query';
import { Outlet, getRouteApi } from '@tanstack/react-router';
import PaginationComponent from '../../../../../../components/Pagination/Pagination';
import { queries } from '../../../../../../utils/constants/queryKeys';
import styles from './Emails.module.scss';
import AppViewToolsViewEmailsViewSearchSectionComponent from './components/SearchSection/SearchSection';
import AppViewToolsViewEmailsViewTableComponent from './components/Table/Table';
import AppViewToolsViewEmailsViewTypeSelectComponent from './components/TypeSelect/TypeSelect';

const routeApi = getRouteApi('/app/tools/emails');

const size = 15;

export default function AppViewToolsViewEmailsView() {
  const { page, spam, search } = routeApi.useSearch();

  const { data, isLoading } = useQuery(queries.emails.page._ctx.bySpamStateAndSearch(spam ?? false, search, { page, size }));

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <AppViewToolsViewEmailsViewSearchSectionComponent />
          <AppViewToolsViewEmailsViewTypeSelectComponent />
        </div>
        <AppViewToolsViewEmailsViewTableComponent isLoading={isLoading} data={data?.content} />
        <div className={styles.pagination_container}>
          <PaginationComponent
            page={page}
            totalPages={data?.totalPages}
            pageLink={(page) => ({ from: routeApi.id, to: routeApi.id, search: (old) => ({ ...old, page }) })}
          />
        </div>
      </div>
      <Outlet />
    </>
  );
}
