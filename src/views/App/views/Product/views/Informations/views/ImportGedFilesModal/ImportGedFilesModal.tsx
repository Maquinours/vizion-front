import { getRouteApi } from '@tanstack/react-router';
import ImportGedFilesModalComponent from '../../../../../../../../components/ImportGedFilesModal/ImportGedFilesModal';
import FileType from '../../../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/products_/$productId/informations/import-ged-files');

export default function AppViewProductViewInformationsViewImportGedFilesModalView() {
  const navigate = routeApi.useNavigate();

  const { productId } = routeApi.useParams();
  const { gedObjectRelativePath } = routeApi.useSearch();

  return (
    <ImportGedFilesModalComponent
      type={FileType.PRODUIT}
      id={productId}
      directoryRelativePath={gedObjectRelativePath}
      onClose={() => navigate({ to: '..', search: (old) => ({ ...old, gedObjectRelativePath: undefined }), replace: true, resetScroll: false })}
    />
  );
}
