import { Outlet, getRouteApi } from '@tanstack/react-router';
import AppViewToolsViewEmailsViewSearchSectionComponent from './components/SearchSection/SearchSection';
import AppViewToolsViewEmailsViewTypeSelectComponent from './components/TypeSelect/TypeSelect';
import PaginationComponent from '../../../../../../components/Pagination/Pagination';
import { useQuery } from '@tanstack/react-query';
import { emailQueryKeys } from '../../../../../../utils/constants/queryKeys/email';
import MailType from '../../../../../../utils/enums/MailType';
import { getEmailsPage, getEmailsPageByType, getEmailsPageWithSearch } from '../../../../../../utils/api/emails';
import styles from './Emails.module.scss';
import AppViewToolsViewEmailsViewTableComponent from './components/Table/Table';

const routeApi = getRouteApi('/app/tools/emails');

const size = 15;

export default function AppViewToolsViewEmailsView() {
  const { page, spam, search } = routeApi.useSearch();

  const { data, isLoading } = useQuery({
    queryKey: emailQueryKeys.pageBySpamStateWithSearch(spam, page, size, search),
    queryFn: () =>
      search
        ? getEmailsPageWithSearch(spam ? [MailType.SPAM] : [MailType.ENVOIE, MailType.RECEPTION], search, page, size)
        : spam
          ? getEmailsPageByType(MailType.SPAM, page, size)
          : getEmailsPage(page, size),
  });

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
