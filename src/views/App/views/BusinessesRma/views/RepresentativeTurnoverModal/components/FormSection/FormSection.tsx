import { useForm } from 'react-hook-form';
import CardComponent from '../../../../../../../../components/Card/Card';
import MONTHS from '../../../../../../../../utils/constants/months';
import { yearsList } from '../../../../../../../../utils/functions/dates';
import styles from './FormSection.module.scss';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { getSalesVvaExcelByDepartmentCodesYearAndMonth } from '../../../../../../../../utils/api/salesVva';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import fileDownload from 'js-file-download';
import { toast } from 'react-toastify';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';
import { formatFileName } from '../../../../../../../../utils/functions/files';

const routeApi = getRouteApi('/app/businesses-rma/representative-turnover');

const years = yearsList();

const yupSchema = yup.object().shape({
  year: yup.number().required(),
  month: yup.number().required(),
});

export default function AppViewBusinessesRmaViewRepresentativeTurnoverModalViewFormSectionComponent() {
  const navigate = useNavigate({ from: routeApi.id });

  const { month, year } = routeApi.useSearch();

  const { data: user } = useAuthentifiedUserQuery();
  const { data: enterprise } = useSuspenseQuery(queries.enterprise.detail(user.profile.enterprise!.id));

  const { register, setValue, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onSubmit = ({ year, month }: yup.InferType<typeof yupSchema>) => {
    navigate({ search: (old) => ({ ...old, year, month }), state: (prev) => prev, replace: true, resetScroll: false });
  };

  const onReset = () => {
    navigate({ search: (old) => ({ ...old, year: undefined, month: undefined }), state: (prev) => prev, replace: true, resetScroll: false });
  };

  const { mutate: excelExport, isPending: isExcelExporting } = useMutation({
    mutationFn: () => getSalesVvaExcelByDepartmentCodesYearAndMonth({ repCodes: enterprise.departments?.map((d) => d.code) ?? [], year, month }),
    onSuccess: (data) => {
      const fileName = formatFileName(
        `Chiffre_Affaire_${month.toLocaleString('fr-FR', {
          minimumIntegerDigits: 2,
        })}_${year}_${user.profile.enterprise!.name}.xls`,
      );
      fileDownload(data, fileName);
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la génération du fichier Excel');
    },
  });

  useEffect(() => {
    setValue('year', year);
    setValue('month', month);
  }, [month, year]);

  return (
    <div className={styles.research_container}>
      <CardComponent title="Chiffre d'affaire">
        <div className={styles.research_content}>
          <form onSubmit={handleSubmit(onSubmit)} onReset={onReset}>
            <div className={styles.form_group}>
              <label htmlFor="year">Année :</label>
              <select id="year" {...register('year')}>
                {years.map((item, key) => (
                  <option key={key} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="month">Mois :</label>
              <select id="month" {...register('month')}>
                {MONTHS.map((item, index) => (
                  <option key={item} value={index + 1}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div />
            <div className={styles.form_buttons}>
              <button type="reset" className="btn btn-primary">
                Annuler
              </button>
              <button type="submit" className="btn btn-secondary">
                Afficher
              </button>

              <button disabled={isExcelExporting} className="btn btn-secondary" onClick={() => excelExport()}>
                {isExcelExporting ? 'Export en cours...' : 'Exporter mon CA'}
              </button>
            </div>
          </form>
        </div>
      </CardComponent>
    </div>
  );
}
