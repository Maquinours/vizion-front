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
import CategoryBusiness from '../../../../../../utils/enums/CategoryBusiness';

const routeApi = getRouteApi('/app/dashboard');

export default function AppViewDashboardViewCallsHistoryComponent() {
  const [isMinimized, setMinimized] = useLocalStorage<boolean>('preferences.dashboard.callsHistory.minimized', false);

  const { callsHistoryDates: dates, callsHistoryProfileId: profileId, callsHistoryPage: page } = routeApi.useSearch();

  const { data: profiles, isLoading: isLoadingProfiles, refetch: refetchProfiles } = useQuery(queries.profiles.list);

  const phoneNumber = useMemo(() => {
    if (!profileId) return undefined;
    const phoneNumber = profiles?.find((profile) => profile.id === profileId)?.standardPhoneNumber;
    if (!phoneNumber) return undefined;
    return parsePhoneNumberWithError(phoneNumber, 'FR').formatInternational();
  }, [profiles, profileId]);

  const {
    data: calls,
    isLoading: isLoadingCalls,
    refetch: refetchCalls,
    isRefetching,
  } = useQuery({
    ...aircallQueryKeys.calls._ctx.search({ from: dates?.at(0), to: dates?.at(1), phoneNumber, page: page + 1, fetchContact: true }),
    enabled: !!profileId && isLoadingProfiles ? false : true,
  });

  const uniqueBusinessNumbers = _.uniq(
    calls?.calls
      .map((call) => (call.contact?.last_name?.trim() || call.contact?.information?.trim())?.toUpperCase().match(/VZO\s\d{4}(?:\d{2})?/)?.[0])
      .filter((information): information is string => !!information),
  );

  const allBusinesses = useQueries({
    queries: uniqueBusinessNumbers.map((number) => {
      const category = (() => {
        switch (number.length) {
          case 10:
            return CategoryBusiness.AFFAIRE;
          case 8:
            return CategoryBusiness.RMA;
          default:
            throw new Error('Invalid business number');
        }
      })();
      return {
        ...queries['all-businesses'].detail._ctx.byCategoryAndNumber({ category, number }),
        staleTime: Infinity,
        retry: (_failureCount: unknown, error: unknown) => !(isAxiosError(error) && error.response?.status === 404),
      };
    }),
  });

  const data = useMemo(() => {
    return calls?.calls.map((call) => {
      const possiblePhoneNumbers = [call.raw_digits.replace(/\s/g, ''), formatPhoneNumber(call.raw_digits).replace(/\s/g, '')];
      const profile = profiles?.find(
        (profile) =>
          (profile.phoneNumber && possiblePhoneNumbers.includes(profile.phoneNumber.replace(/\s/g, ''))) ||
          (profile.standardPhoneNumber && possiblePhoneNumbers.includes(profile.standardPhoneNumber.replace(/\s/g, ''))),
      );
      const businessNumber = (call.contact?.last_name?.trim() || call.contact?.information?.trim())?.toUpperCase().match(/VZO\s\d{4}(?:\d{2})?/)?.[0];
      const allBusiness = allBusinesses.find((business) => business.data?.number === businessNumber)?.data;
      return { call, profile, allBusiness };
    });
  }, [calls, profiles, allBusinesses]);

  const isLoading = useMemo(
    () => isLoadingCalls || isLoadingProfiles || allBusinesses.some((query) => query.isLoading),
    [isLoadingCalls, isLoadingProfiles, allBusinesses],
  );

  const refetch = useCallback(() => {
    refetchCalls();
    refetchProfiles();
    allBusinesses.forEach((query) => query.refetch());
  }, [refetchCalls, profiles, allBusinesses]);

  return (
    <CardComponent title="Historique des appels" onReload={() => refetch()} isReloading={isRefetching} isMinimized={isMinimized} setMinimized={setMinimized}>
      <div className={styles.container}>
        <AppViewDashboardViewCallsHistoryComponentSearchSectionComponent />
        <AppViewDashboardViewCallsHistoryComponentTableComponent data={data} isLoading={isLoading} />
        <AppViewDashboardViewCallsHistoryComponentPaginationComponent
          page={page}
          totalPages={calls ? Math.ceil(calls.meta.total / calls.meta.per_page) : undefined}
        />
      </div>
    </CardComponent>
  );
}
