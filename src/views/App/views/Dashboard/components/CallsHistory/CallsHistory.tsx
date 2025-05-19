import { useQueries, useQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { parsePhoneNumberWithError } from 'libphonenumber-js';
import { useCallback, useMemo } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import CardComponent from '../../../../../../components/Card/Card';
import { queries } from '../../../../../../utils/constants/queryKeys';
import { aircallQueryKeys } from '../../../../../../utils/constants/queryKeys/aircall';
import styles from './CallsHistory.module.scss';
import AppViewDashboardViewCallsHistoryComponentSearchSectionComponent from './components/SearchSection/SearchSection';
import AppViewDashboardViewCallsHistoryComponentTableComponent from './components/Table/Table';
import AppViewDashboardViewCallsHistoryComponentPaginationComponent from './components/Pagination/Pagination';
import _ from 'lodash';
import { formatPhoneNumber } from 'react-phone-number-input';
import { isAxiosError } from 'axios';

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

  const {
    data,
    isLoading,
    refetch: refetchCalls,
    isRefetching,
  } = useQuery({
    ...aircallQueryKeys.calls._ctx.search({ from: dates?.at(0), to: dates?.at(1), phoneNumber, page: page + 1 }),
    enabled: !!profileId && isLoadingProfiles ? false : true,
  });

  const uniquePhoneNumbers = _.uniq(data?.calls.map((call) => call.raw_digits) || []);

  const callProfiles = useQueries({
    queries: uniquePhoneNumbers.map((phoneNumber) => ({
      ...queries.profiles.detail._ctx.byPhoneNumbers([phoneNumber, formatPhoneNumber(phoneNumber)]),
      staleTime: Infinity,
      retry: (_failureCount: unknown, error: unknown) => !(isAxiosError(error) && error.response?.status === 404),
    })),
  });

  const getProfileFromPhoneNumber = useCallback(
    (phoneNumber: string) => {
      return callProfiles.at(uniquePhoneNumbers.indexOf(phoneNumber))?.data;
    },
    [callProfiles, uniquePhoneNumbers],
  );

  const refetch = useCallback(() => {
    refetchCalls();
    callProfiles.forEach((query) => query.refetch());
  }, [refetchCalls, callProfiles]);

  return (
    <CardComponent title="Historique des appels" onReload={() => refetch()} isReloading={isRefetching} isMinimized={isMinimized} setMinimized={setMinimized}>
      <div className={styles.container}>
        <AppViewDashboardViewCallsHistoryComponentSearchSectionComponent />
        <AppViewDashboardViewCallsHistoryComponentTableComponent
          data={data?.calls}
          isLoading={isLoading}
          getProfileFromPhoneNumber={getProfileFromPhoneNumber}
        />
        <AppViewDashboardViewCallsHistoryComponentPaginationComponent
          page={page}
          totalPages={data ? Math.ceil(data.meta.total / data.meta.per_page) : undefined}
        />
      </div>
    </CardComponent>
  );
}
