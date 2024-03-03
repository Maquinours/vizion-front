import CommonCard from '../../../../../../components/Card/Card';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactSelect from 'react-select';
import YEARS from '../../../../../../utils/constants/years';
import MONTHS from '../../../../../../utils/constants/months';
import styles from './SearchSection.module.scss';
import enterpriseQueryKeys from '../../../../../../utils/constants/queryKeys/enterprise';
import { useSuspenseQuery } from '@tanstack/react-query';
import CategoryClient from '../../../../../../utils/enums/CategoryClient';
import { getEnterprisesByCategory } from '../../../../../../utils/api/enterprises';
import { getAvailableMonthsForYear } from '../../../../../../utils/functions/moment';

const Route = getRouteApi('/app/tools/representatives-turnover');

export default function RepresentativesTurnoverViewSearchSectionComponent() {
  const navigate = useNavigate();

  const { representativeId, year, month } = Route.useSearch();

  const { data: representatives } = useSuspenseQuery({
    queryKey: enterpriseQueryKeys.listByCategory(CategoryClient.REPRESENTANT),
    queryFn: () => getEnterprisesByCategory(CategoryClient.REPRESENTANT),
  });

  return (
    <div className={styles.research_container}>
      <CommonCard title="CA des représentants">
        <div className={styles.research_content}>
          <form>
            <div className={styles.form_group}>
              <label htmlFor="representative">Représentant :</label>
              <ReactSelect
                id="representative"
                value={representatives?.find((rep) => rep.id === representativeId)}
                options={representatives}
                onChange={(opt) => navigate({ from: Route.id, search: (old) => ({ ...old, representativeId: opt?.id }) })}
                placeholder="Sélectionnez un représentant"
                getOptionLabel={(opt) => opt.name}
                getOptionValue={(opt) => opt.id}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary: '#31385a',
                  },
                })}
              />
            </div>
            <div className={styles.form_group}>
              <label htmlFor="year">Année :</label>
              <ReactSelect
                id="year"
                value={{ label: year, value: year }}
                options={YEARS.map((year) => ({ label: year, value: year }))}
                onChange={(opt) =>
                  navigate({
                    from: Route.id,
                    search: (old) => ({
                      ...old,
                      year: opt!.value ?? old.year,
                      month: getAvailableMonthsForYear(opt!.value).length >= old.month ? old.month : getAvailableMonthsForYear(opt!.value).length,
                    }),
                  })
                }
                placeholder="Sélectionnez une année"
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary: '#31385a',
                  },
                })}
              />
            </div>
            <div className={styles.form_group}>
              <label htmlFor="month">Mois :</label>
              <ReactSelect
                id="month"
                value={{ label: MONTHS.at(month - 1), value: month }}
                options={getAvailableMonthsForYear(year).map((month, index) => ({ label: month, value: index + 1 }))}
                onChange={(opt) => navigate({ from: Route.id, search: (old) => ({ ...old, month: opt?.value ?? old.month }) })}
                placeholder="Sélectionnez un mois"
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary: '#31385a',
                  },
                })}
              />
            </div>
          </form>
        </div>
      </CommonCard>
    </div>
  );
}
