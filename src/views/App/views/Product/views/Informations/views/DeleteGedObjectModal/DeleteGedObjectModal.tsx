import { getRouteApi, useNavigate } from '@tanstack/react-router';
import DeleteGedObjectModalComponent from '../../../../../../../../components/DeleteGedObjectModal/DeleteGedObjectModal';
import FileType from '../../../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/products/$productId/informations/delete-ged-object');
export default function AppViewProductViewInformationsViewDeleteGedObjectModalView() {
  const navigate = useNavigate();

  const { productId } = routeApi.useParams();
  const { gedObjectRelativePath } = routeApi.useSearch();

  return (
    <DeleteGedObjectModalComponent
      type={FileType.PRODUIT}
      id={productId}
      objectRelativePath={gedObjectRelativePath}
      onClose={() => navigate({ from: routeApi.id, to: '..', search: (old) => ({ lifesheetPage: old.lifesheetPage }) })}
    />
  );
}
