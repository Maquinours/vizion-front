import { Outlet, getRouteApi } from '@tanstack/react-router';
import PaginationComponent from '../../../../components/Pagination/Pagination';
import AppViewFaqViewButtonsComponent from './components/Buttons/Buttons';
import AppViewFaqViewSearchSectionComponent from './components/SearchSection/SearchSection';
import AppViewFaqViewTableComponent from './components/Table/Table';
import styles from './Faq.module.scss';
import { useQuery } from '@tanstack/react-query';
import { faqQueryKeys } from '../../../../utils/constants/queryKeys/faq';
import { getFaqsPageByArchiveState, getFaqsPageByArchiveStateWithSearch } from '../../../../utils/api/faq';

const routeApi = getRouteApi('/app/faq');

const size = 15;

export default function AppViewFaqView() {
  const { page, archived, search } = routeApi.useSearch();

  const { data, isLoading } = useQuery({
    queryKey: faqQueryKeys.pageByArchiveStateAndSearch(archived, search, page, size),
    queryFn: () => (search ? getFaqsPageByArchiveStateWithSearch(archived, search, page, size) : getFaqsPageByArchiveState(archived, page, size)),
  });

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            <AppViewFaqViewSearchSectionComponent />
            <AppViewFaqViewButtonsComponent />
          </div>
          <AppViewFaqViewTableComponent data={data?.content} isLoading={isLoading} />
          <PaginationComponent page={page} totalPages={data?.totalPages} pageLink={(page) => ({ search: (old) => ({ ...old, page }), params: (old) => old })} />
        </div>
      </div>
      <Outlet />
    </>
  );
}
