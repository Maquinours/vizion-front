import { useQuery } from '@tanstack/react-query';
import { Outlet, getRouteApi } from '@tanstack/react-router';
import PaginationComponent from '../../../../components/Pagination/Pagination';
import { faqs } from '../../../../utils/constants/queryKeys/faq';
import styles from './Faq.module.scss';
import AppViewFaqViewButtonsComponent from './components/Buttons/Buttons';
import AppViewFaqViewSearchSectionComponent from './components/SearchSection/SearchSection';
import AppViewFaqViewTableComponent from './components/Table/Table';

const routeApi = getRouteApi('/app/faq');

const size = 15;

export default function AppViewFaqView() {
  const { page, archived, search } = routeApi.useSearch();

  const { data, isLoading } = useQuery(faqs.page({ page, size })._ctx.byArchiveStateAndSearch(archived, search));

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            <AppViewFaqViewSearchSectionComponent />
            <AppViewFaqViewButtonsComponent />
          </div>
          <AppViewFaqViewTableComponent data={data?.content} isLoading={isLoading} />
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
