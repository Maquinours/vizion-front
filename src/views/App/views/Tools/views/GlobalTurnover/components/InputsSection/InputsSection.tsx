import { useMutation } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import fileDownload from 'js-file-download';
import { toast } from 'react-toastify';
import CardComponent from '../../../../../../../../components/Card/Card';
import { getExcelTurnoversByYear } from '../../../../../../../../utils/api/turnovers';
import { yearsList } from '../../../../../../../../utils/functions/dates';
import styles from './InputsSection.module.scss';

const routeApi = getRouteApi('/app/tools/global-turnover');

const years = yearsList();

export default function AppViewToolsViewGlobalTurnoverViewInputsSectionComponent() {
  const navigate = routeApi.useNavigate();

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
