import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ImportGedFilesModalComponent from '../../../../../../../../components/ImportGedFilesModal/ImportGedFilesModal';
import FileType from '../../../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/products/$productId/informations/import-ged-files');

export default function AppViewProductViewInformationsViewImportGedFilesModalView() {
  const navigate = useNavigate();

  const { productId } = routeApi.useParams();
  const { gedObjectRelativePath } = routeApi.useSearch();

  return (
    <ImportGedFilesModalComponent
      type={FileType.PRODUIT}
      id={productId}
      directoryRelativePath={gedObjectRelativePath}
      onClose={() => navigate({ from: routeApi.id, to: '..', search: (old) => ({ lifesheetPage: old.lifesheetPage }) })}
    />
  );
}
