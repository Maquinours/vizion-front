import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { yearsList } from '../../../../../../../../utils/functions/dates';
import CardComponent from '../../../../../../../../components/Card/Card';
import styles from './InputsSection.module.scss';
import { useMutation } from '@tanstack/react-query';
import { getExcelTurnoversByYear } from '../../../../../../../../utils/api/turnovers';
import fileDownload from 'js-file-download';
import { toast } from 'react-toastify';

const routeApi = getRouteApi('/app/tools/global-turnover');

const years = yearsList();

export default function AppViewToolsViewGlobalTurnoverViewInputsSectionComponent() {
  const navigate = useNavigate({ from: routeApi.id });

  const { year } = routeApi.useSearch();

  const { mutate, isPending } = useMutation({
    mutationFn: () => getExcelTurnoversByYear(year),
    onMutate: () => ({ year }),
    onSuccess: (data, _params, context) => {
      fileDownload(data, `CA global des représentants - ${context.year}.xlsx`);
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la génération du fichier excel');
    },
  });

  return (
    <div className={styles.research_container}>
      <CardComponent title="CA global des représentants">
        <div className={styles.research_content}>
          <div className={styles.form}>
            <div className={styles.form_group}>
              <label htmlFor="year">Année :</label>
              <select id="year" value={year} onChange={(e) => navigate({ search: (old) => ({ ...old, year: Number(e.target.value) }) })}>
                {years.map((item, key) => (
                  <option key={key} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.form_buttons}>
              <button type="button" className="btn btn-secondary" disabled={isPending} onClick={() => mutate()}>
                {isPending ? 'Export en cours...' : 'Export sous excel'}
              </button>
            </div>
          </div>
        </div>
      </CardComponent>
    </div>
  );
}
