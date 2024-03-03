import { getRouteApi } from '@tanstack/react-router';
import { getExcelTurnoversByRepresentativeMonthAndYear } from './utils/api/excelTurnovers';
import fileDownload from 'js-file-download';
import styles from './Buttons.module.scss';
import { toast } from 'react-toastify';
import { getEnterprisesByCategory } from '../../../../../../utils/api/enterprises';
import enterpriseQueryKeys from '../../../../../../utils/constants/queryKeys/enterprise';
import CategoryClient from '../../../../../../utils/enums/CategoryClient';
import { useSuspenseQuery } from '@tanstack/react-query';

const Route = getRouteApi('/app/tools/representatives-turnover');

export default function RepresentativesTurnoverViewButtonsComponent() {
  const { representativeId, year, month } = Route.useSearch();

  const { data: representative } = useSuspenseQuery({
    queryKey: enterpriseQueryKeys.listByCategory(CategoryClient.REPRESENTANT),
    queryFn: () => getEnterprisesByCategory(CategoryClient.REPRESENTANT),
    select: (data) => data.find((rep) => rep.id === representativeId),
  });

  const onExportExcel = () => {
    getExcelTurnoversByRepresentativeMonthAndYear(representative!, year, month)
      .then((blob) => fileDownload(blob, `Chiffre_Affaire.xlsx`))
      .catch((error) => {
        toast.error('Une erreur est survenue lors de la génération du fichier excel');
        console.error(error);
      });
  };

  if (!representative) return;
  return (
    <div className={styles.export_container}>
      <button className="btn btn-secondary" onClick={onExportExcel}>
        Export sous excel
      </button>
    </div>
  );
}
