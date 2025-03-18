import { useQuery } from '@tanstack/react-query';
import { Outlet, getRouteApi, useRouterState } from '@tanstack/react-router';
import { queries } from '../../../../utils/constants/queryKeys';
import styles from './BusinessesRma.module.scss';
import AppViewBusinessesRmaViewPaginationComponent from './components/Pagination/Pagination';
import AppViewBusinessesRmaViewSearchSectionComponent from './components/SearchSection/SearchSection';
import AppViewBusinessesRmaViewTableComponent from './components/Table/Table';
import AppViewBusinessesRmaViewTotalSectionComponent from './components/TotalSection/TotalSection';
import AppViewBusinessesRmaViewButtonsSectionComponent from './components/ButtonsSection/ButtonsSection';

const routeApi = getRouteApi('/app/businesses-rma');

export default function AppViewBusinessesRmaView() {
  const { number, numOrder, name, contact, zipCode, representative, installer, amounts, enterpriseName, state, dates, excludeds, fuzzy, page, size } =
    routeApi.useSearch();

  const qInfos = useRouterState({ select: (state) => state.location.state.qInfos });

  const [minAmount, maxAmount] = [amounts?.at(0), amounts?.at(1)];
  const [startDate, endDate] = [dates?.at(0), dates?.at(1)];

  const { data, isLoading } = useQuery(
    queries['all-businesses'].page._ctx.search(
      {
        numBusiness: number,
        numOrder,
        title: name,
        contact,
        zipCode,
        representativeId: representative,
        installerName: installer,
        minAmount,
        maxAmount,
        enterpriseName,
        state,
        startDate,
        endDate,
        excludedList: excludeds,
        fuzzy,
        qInfos,
      },
      { page, size },
    ),
  );

  return (
    <>
      <div className={styles.container}>
        <AppViewBusinessesRmaViewButtonsSectionComponent />
        <AppViewBusinessesRmaViewSearchSectionComponent />
        <AppViewBusinessesRmaViewTableComponent data={data?.content} isLoading={isLoading} startDate={startDate} endDate={endDate} />
        <AppViewBusinessesRmaViewPaginationComponent totalPages={data?.totalPages} page={page} size={size} />
        <AppViewBusinessesRmaViewTotalSectionComponent data={data?.content} startDate={startDate} endDate={endDate} />
      </div>
      <Outlet />
    </>
  );
}
