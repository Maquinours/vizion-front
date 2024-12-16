import { useQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import fileDownload from 'js-file-download';
import { toast } from 'react-toastify';
import { enterprises } from '../../../../../../../../utils/constants/queryKeys/enterprise';
import CategoryClient from '../../../../../../../../utils/enums/CategoryClient';
import styles from './Buttons.module.scss';
import { getExcelTurnoversByRepresentativeMonthAndYear } from './utils/api/excelTurnovers';

const routeApi = getRouteApi('/app/tools/representatives-turnover');

export default function AppViewToolsViewRepresentativesTurnoverViewButtonsComponent() {
  const { representativeId, year, month } = routeApi.useSearch();

  const { data: representative } = useQuery({
    ...enterprises.detail(representativeId!),
    enabled: !!representativeId,
    select: (data) => (data.category === CategoryClient.REPRESENTANT ? data : undefined),
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
