import { useQuery } from '@tanstack/react-query';
import { Outlet, getRouteApi } from '@tanstack/react-router';
import { queries } from '../../../../utils/constants/queryKeys';
import styles from './BusinessesRma.module.scss';
import AppViewBusinessesRmaViewPaginationComponent from './components/Pagination/Pagination';
import AppViewBusinessesRmaViewSearchSectionComponent from './components/SearchSection/SearchSection';
import AppViewBusinessesRmaViewTableComponent from './components/Table/Table';
import AppViewBusinessesRmaViewTotalSectionComponent from './components/TotalSection/TotalSection';
import AppViewBusinessesRmaViewButtonsSectionComponent from './components/ButtonsSection/ButtonsSection';

const routeApi = getRouteApi('/app/businesses-rma');

export default function AppViewBusinessesRmaView() {
  const { number, numOrder, name, contact, deliverPhoneNumber, zipCode, representative, installer, enterpriseName, state, dates, excludeds, page, size } =
    routeApi.useSearch();

  const { data, isLoading } = useQuery(
    queries['all-businesses'].page._ctx.search(
      {
        numBusiness: number,
        numOrder,
        title: name,
        contact,
        deliverPhoneNumber,
        zipCode,
        representativeId: representative,
        installerName: installer,
        enterpriseName,
        state,
        startDate: dates.at(0),
        endDate: dates.at(1),
        excludedList: excludeds,
      },
      { page, size },
    ),
  );

  return (
    <>
      <div className={styles.container}>
        <AppViewBusinessesRmaViewButtonsSectionComponent />
        <AppViewBusinessesRmaViewSearchSectionComponent />
        <AppViewBusinessesRmaViewTableComponent data={data?.content} isLoading={isLoading} />
        <AppViewBusinessesRmaViewPaginationComponent totalPages={data?.totalPages} page={page} size={size} />
        <AppViewBusinessesRmaViewTotalSectionComponent data={data?.content} />
      </div>
      <Outlet />
    </>
  );
}
