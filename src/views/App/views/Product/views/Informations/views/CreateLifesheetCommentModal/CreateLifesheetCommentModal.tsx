import { getRouteApi, useNavigate } from '@tanstack/react-router';
import CreateLifesheetModalComponent from '../../../../../../../../components/CreateLifesheetModal/CreateLifesheetModal';
import { LifesheetAssociatedItem } from '../../../../../../../../utils/enums/LifesheetAssociatedItem';

const routeApi = getRouteApi('/app/products/$productId/informations/create-lifesheet-comment');
export default function AppViewProductViewInformationsViewCreateLifesheetCommentModalView() {
  const navigate = useNavigate();

  const { productId } = routeApi.useParams();

  return (
    <CreateLifesheetModalComponent
      associatedItemType={LifesheetAssociatedItem.PRODUCT}
      associatedItemId={productId}
      onClose={() => navigate({ from: routeApi.id, to: '..', search: (old) => old, params: (old) => old })}
    />
  );
}
