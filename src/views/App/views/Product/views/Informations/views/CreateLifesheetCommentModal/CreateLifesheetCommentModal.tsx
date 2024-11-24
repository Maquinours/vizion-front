import { getRouteApi } from '@tanstack/react-router';
import CreateLifesheetModalComponent from '../../../../../../../../components/CreateLifesheetModal/CreateLifesheetModal';
import { LifesheetAssociatedItem } from '../../../../../../../../utils/enums/LifesheetAssociatedItem';

const routeApi = getRouteApi('/app/products_/$productId/informations/create-lifesheet-comment');
export default function AppViewProductViewInformationsViewCreateLifesheetCommentModalView() {
  const navigate = routeApi.useNavigate();

  const { productId } = routeApi.useParams();

  return (
    <CreateLifesheetModalComponent
      associatedItemType={LifesheetAssociatedItem.PRODUCT}
      associatedItemId={productId}
      onClose={() => navigate({ to: '..', search: true, replace: true, resetScroll: false })}
    />
  );
}
