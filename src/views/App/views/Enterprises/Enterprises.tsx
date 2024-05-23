import { useQuery } from '@tanstack/react-query';
import AppViewEnterprisesViewSearchSectionComponent from './components/SearchSection/SearchSection';
import { enterprises } from '../../../../utils/constants/queryKeys/enterprise';
import { Outlet, getRouteApi } from '@tanstack/react-router';
import styles from './Enterprises.module.scss';
import AppViewEnterprisesViewTableComponent from './components/Table/Table';
import PaginationComponent from '../../../../components/Pagination/Pagination';

const Route = getRouteApi('/app/enterprises');

const size = 20;

export default function AppViewEnterprisesView() {
  const { enterprise, contact, zipCode, city, phoneNumber, category, representativeId, page } = Route.useSearch();

  const { data, isLoading } = useQuery(enterprises.page({ enterprise, contact, zipCode, city, phoneNumber, category, representativeId, page, size }));

  return (
    <>
      <div className={styles.container}>
        <AppViewEnterprisesViewSearchSectionComponent />
        <AppViewEnterprisesViewTableComponent data={data?.content} isLoading={isLoading} />
        <PaginationComponent
          page={page}
          totalPages={data?.totalPages}
          pageLink={(page) => ({
            from: Route.id,
            search: (old) => ({
              ...old,
              page,
            }),
            replace: true,
          })}
        />
      </div>
      <Outlet />
    </>
  );
}
