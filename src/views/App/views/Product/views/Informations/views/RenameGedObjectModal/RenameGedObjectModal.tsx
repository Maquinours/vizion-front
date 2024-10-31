import { getRouteApi } from '@tanstack/react-router';
import RenameGedObjectModalComponent from '../../../../../../../../components/RenameGedObjectModal/RenameGedObjectModal';
import FileType from '../../../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/products_/$productId/informations/rename-ged-object');

export default function AppViewProductViewInformationsViewRenameGedObjectModalView() {
  const navigate = routeApi.useNavigate();

  const { productId } = routeApi.useParams();
  const { gedObjectRelativePath } = routeApi.useSearch();

  return (
    <RenameGedObjectModalComponent
      type={FileType.PRODUIT}
      id={productId}
      objectRelativePath={gedObjectRelativePath}
      onClose={() => navigate({ to: '..', search: (old) => ({ ...old, gedObjectRelativePath: undefined }), replace: true, resetScroll: false })}
    />
  );
}
