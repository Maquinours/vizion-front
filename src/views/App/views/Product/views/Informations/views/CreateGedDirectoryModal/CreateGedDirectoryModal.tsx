import { getRouteApi, useNavigate } from '@tanstack/react-router';
import CreateGedDirectoryModalComponent from '../../../../../../../../components/CreateGedDirectoryModal/CreateGedDirectoryModal';
import FileType from '../../../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/products/$productId/informations/create-ged-directory');

export default function AppViewProductViewInformationsViewCreateGedDirectoryModalView() {
  const navigate = useNavigate();

  const { productId } = routeApi.useParams();
  const { gedObjectRelativePath } = routeApi.useSearch();

  return (
    <CreateGedDirectoryModalComponent
      type={FileType.PRODUIT}
      id={productId}
      directoryRelativePath={gedObjectRelativePath}
      onClose={() =>
        navigate({ from: routeApi.id, to: '..', search: (old) => ({ ...old, gedObjectRelativePath: undefined }), replace: true, resetScroll: false })
      }
    />
  );
}
