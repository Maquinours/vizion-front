import { getRouteApi } from '@tanstack/react-router';
import { getExcelTurnoversByRepresentativeMonthAndYear } from './utils/api/excelTurnovers';
import fileDownload from 'js-file-download';
import styles from './Buttons.module.scss';
import { toast } from 'react-toastify';
import { enterprises } from '../../../../../../../../utils/constants/queryKeys/enterprise';
import { useQuery } from '@tanstack/react-query';
import CategoryClient from '../../../../../../../../utils/enums/CategoryClient';

const Route = getRouteApi('/app/tools/representatives-turnover');

export default function AppViewToolsViewRepresentativesTurnoverViewButtonsComponent() {
  const { representativeId, year, month } = Route.useSearch();

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
