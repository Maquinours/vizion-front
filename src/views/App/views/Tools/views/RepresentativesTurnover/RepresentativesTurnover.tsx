import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { queries } from '../../../../../../utils/constants/queryKeys';
import { enterprises } from '../../../../../../utils/constants/queryKeys/enterprise';
import CategoryClient from '../../../../../../utils/enums/CategoryClient';
import styles from './RepresentativesTurnover.module.scss';
import RepresentativesTurnoverViewButtonsComponent from './components/Buttons/Buttons';
import RepresentativesTurnoverViewRecapSectionComponent from './components/RecapSection/RecapSection';
import RepresentativesTurnoverViewSearchSectionComponent from './components/SearchSection/SearchSection';
import RepresentativesTurnoverViewTableComponent from './components/Table/Table';

const Route = getRouteApi('/app/tools/representatives-turnover');

export default function AppViewToolsViewRepresentativesTurnoverView() {
  const { representativeId, month, year } = Route.useSearch();

  const { data: representatives } = useSuspenseQuery(enterprises.list._ctx.byCategory(CategoryClient.REPRESENTANT));

  const representative = representatives.find((rep) => rep.id === representativeId);

  const { data, isLoading } = useQuery({
    ...queries['sales-vva'].list._ctx.byDepartmentCodesYearAndMonth({
      departmentCodes: representative?.departments?.map((dep) => dep.code) ?? [],
      year,
      month,
    }),
    enabled: !!representative,
  });

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <RepresentativesTurnoverViewSearchSectionComponent />
        <RepresentativesTurnoverViewTableComponent data={data} isLoading={isLoading} />
        <RepresentativesTurnoverViewRecapSectionComponent data={data} />
        <RepresentativesTurnoverViewButtonsComponent />
      </div>
    </div>
  );
}
