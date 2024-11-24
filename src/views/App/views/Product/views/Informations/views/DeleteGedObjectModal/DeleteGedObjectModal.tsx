import { getRouteApi } from '@tanstack/react-router';
import DeleteGedObjectModalComponent from '../../../../../../../../components/DeleteGedObjectModal/DeleteGedObjectModal';
import FileType from '../../../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/products_/$productId/informations/delete-ged-object');
export default function AppViewProductViewInformationsViewDeleteGedObjectModalView() {
  const navigate = routeApi.useNavigate();

  const { productId } = routeApi.useParams();
  const { gedObjectRelativePath } = routeApi.useSearch();

  return (
    <DeleteGedObjectModalComponent
      type={FileType.PRODUIT}
      id={productId}
      objectRelativePath={gedObjectRelativePath}
      onClose={() => navigate({ to: '..', search: (old) => ({ ...old, gedObjectRelativePath: undefined }), replace: true, resetScroll: false })}
    />
  );
}
