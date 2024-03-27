import { getRouteApi } from '@tanstack/react-router';
import LifesheetComponent from '../../../../../../../../components/Lifesheet/Lifesheet';
import { LifesheetAssociatedItem } from '../../../../../../../../utils/enums/LifesheetAssociatedItem';

const routeApi = getRouteApi('/app/products/$productId/informations');

export default function AppViewProductViewInformationsViewLifesheetComponent() {
  const { productId } = routeApi.useParams();
  const { lifesheetPage } = routeApi.useSearch();

  return (
    <LifesheetComponent
      associatedItemType={LifesheetAssociatedItem.PRODUCT}
      associatedItemId={productId}
      page={lifesheetPage}
      pageLink={(page) => ({ from: routeApi.id, search: (old) => ({ ...old, lifesheetPage: page }), params: (old) => old })}
      createLink={{ from: routeApi.id, to: '/app/products/$productId/informations/create-lifesheet-comment', search: (old) => old, params: (old) => old }}
    />
  );
}
