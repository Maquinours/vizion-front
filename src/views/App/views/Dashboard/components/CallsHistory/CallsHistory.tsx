import { useQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { parsePhoneNumberWithError } from 'libphonenumber-js';
import { useMemo } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import CardComponent from '../../../../../../components/Card/Card';
import { queries } from '../../../../../../utils/constants/queryKeys';
import { aircallQueryKeys } from '../../../../../../utils/constants/queryKeys/aircall';
import styles from './CallsHistory.module.scss';
import AppViewDashboardViewCallsHistoryComponentSearchSectionComponent from './components/SearchSection/SearchSection';
import AppViewDashboardViewCallsHistoryComponentTableComponent from './components/Table/Table';
import AppViewDashboardViewCallsHistoryComponentPaginationComponent from './components/Pagination/Pagination';

const routeApi = getRouteApi('/app/dashboard');

export default function AppViewDashboardViewCallsHistoryComponent() {
  const [isMinimized, setMinimized] = useLocalStorage<boolean>('preferences.dashboard.callsHistory.minimized', false);

  const { callsHistoryDates: dates, callsHistoryProfileId: profileId, callsHistoryPage: page } = routeApi.useSearch();

  const { data: profiles, isLoading: isLoadingProfiles } = useQuery(queries.profiles.list);

  const phoneNumber = useMemo(() => {
    const phoneNumber = profiles?.find((profile) => profile.id === profileId)?.standardPhoneNumber;
    if (!phoneNumber) return undefined;
    return parsePhoneNumberWithError(phoneNumber, 'FR').formatInternational();
  }, [profiles, profileId]);

  const { data, isLoading, refetch, isRefetching } = useQuery({
    ...aircallQueryKeys.calls._ctx.search({ from: dates?.at(0), to: dates?.at(1), phoneNumber, page: page + 1 }),
    enabled: !!profileId && isLoadingProfiles ? false : true,
  });

  return (
    <CardComponent title="Historique des appels" onReload={() => refetch()} isReloading={isRefetching} isMinimized={isMinimized} setMinimized={setMinimized}>
      <div className={styles.container}>
        <AppViewDashboardViewCallsHistoryComponentSearchSectionComponent />
        <AppViewDashboardViewCallsHistoryComponentTableComponent data={data?.calls} isLoading={isLoading} />
        <AppViewDashboardViewCallsHistoryComponentPaginationComponent
          page={page}
          totalPages={data ? Math.ceil(data.meta.total / data.meta.per_page) : undefined}
        />
      </div>
    </CardComponent>
  );
}
