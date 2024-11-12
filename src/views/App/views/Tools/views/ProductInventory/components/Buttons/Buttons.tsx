import { useMutation } from '@tanstack/react-query';
import { getProductVersionShelfStocksExcel } from '../../../../../../../../utils/api/productVersionShelfStock';
import fileDownload from 'js-file-download';
import { toast } from 'react-toastify';
import styles from './Buttons.module.scss';
import { Link, getRouteApi } from '@tanstack/react-router';

const routeApi = getRouteApi('/app/tools/product-inventory');

type AppViewToolsViewProductInventoryViewButtonsComponentProps = Readonly<{
  resetData: () => void;
}>;
export default function AppViewToolsViewProductInventoryViewButtonsComponent({ resetData }: AppViewToolsViewProductInventoryViewButtonsComponentProps) {
  const { mutate: excelExport, isPending: isExcelExportPending } = useMutation({
    mutationFn: getProductVersionShelfStocksExcel,
    onSuccess: (data) => {
      fileDownload(data, 'inventaire.xlsx');
    },
    onError: (error) => {
      toast.error("Une erreur est survenue lors de l'export de l'inventaire.");
      console.error(error);
    },
  });

  return (
    <div className={styles.footer_buttons}>
      <button className="btn btn-primary-light" onClick={() => resetData()}>
        Annuler
      </button>
      <Link from={routeApi.id} to="validate-quantities" search replace resetScroll={false} className="btn btn-primary">
        Valider les quantités comptées
      </Link>
      <button disabled={isExcelExportPending} className="btn btn-secondary" onClick={() => excelExport()}>
        {isExcelExportPending ? 'Export en cours...' : 'Export sous excel'}
      </button>
    </div>
  );
}
