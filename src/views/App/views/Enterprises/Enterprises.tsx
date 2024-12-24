import { useQuery } from '@tanstack/react-query';
import AppViewEnterprisesViewSearchSectionComponent from './components/SearchSection/SearchSection';
import { enterprises } from '../../../../utils/constants/queryKeys/enterprise';
import { Outlet, getRouteApi } from '@tanstack/react-router';
import styles from './Enterprises.module.scss';
import AppViewEnterprisesViewTableComponent from './components/Table/Table';
import PaginationComponent from '../../../../components/Pagination/Pagination';
import AppViewEnterprisesViewButtonsComponent from './components/Buttons/Buttons';

const routeApi = getRouteApi('/app/enterprises');

const size = 20;

export default function AppViewEnterprisesView() {
  const { enterprise, contact, zipCode, city, phoneNumber, category, representativeId, fuzzy, page } = routeApi.useSearch();

  const { data, isLoading } = useQuery({
    ...enterprises.page({ enterprise, contact, zipCode, city, phoneNumber, category, representativeId, fuzzy, page, size }),
    select: (data) => ({
      ...data,
      content: data.content.map((enterprise) => ({
        ...enterprise,
        profiles: enterprise.profiles.sort(
          (a, b) =>
            (a.landlinePhoneNumber?.trim() ?? '').toLowerCase().localeCompare((b.landlinePhoneNumber?.trim() ?? '').toLowerCase()) * 100 +
            (a.lastName?.trim() ?? '').toLowerCase().localeCompare((b.lastName?.trim() ?? '').toLowerCase()) * 10 +
            (a.firstName?.trim() ?? '').toLowerCase().localeCompare((b.firstName?.trim() ?? '').toLowerCase()),
        ),
      })),
    }),
  });

  return (
    <>
      <div className={styles.container}>
        <AppViewEnterprisesViewButtonsComponent />
        <AppViewEnterprisesViewSearchSectionComponent />
        <AppViewEnterprisesViewTableComponent data={data?.content} isLoading={isLoading} />
        <PaginationComponent
          page={page}
          totalPages={data?.totalPages}
          pageLink={(page) => ({
            from: routeApi.id,
            search: (old) => ({
              ...old,
              page,
            }),
            replace: true,
            resetScroll: false,
          })}
        />
      </div>
      <Outlet />
    </>
  );
}
