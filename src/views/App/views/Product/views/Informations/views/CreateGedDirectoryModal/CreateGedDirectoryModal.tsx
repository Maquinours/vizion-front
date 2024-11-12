import { getRouteApi } from '@tanstack/react-router';
import CreateGedDirectoryModalComponent from '../../../../../../../../components/CreateGedDirectoryModal/CreateGedDirectoryModal';
import FileType from '../../../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/products_/$productId/informations/create-ged-directory');

export default function AppViewProductViewInformationsViewCreateGedDirectoryModalView() {
  const navigate = routeApi.useNavigate();

  const { productId } = routeApi.useParams();
  const { gedObjectRelativePath } = routeApi.useSearch();

  return (
    <CreateGedDirectoryModalComponent
      type={FileType.PRODUIT}
      id={productId}
      directoryRelativePath={gedObjectRelativePath}
      onClose={() => navigate({ to: '..', search: (old) => ({ ...old, gedObjectRelativePath: undefined }), replace: true, resetScroll: false })}
    />
  );
}
