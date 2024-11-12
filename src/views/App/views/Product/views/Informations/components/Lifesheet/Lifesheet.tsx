import { getRouteApi } from '@tanstack/react-router';
import LifesheetComponent from '../../../../../../../../components/Lifesheet/Lifesheet';
import { LifesheetAssociatedItem } from '../../../../../../../../utils/enums/LifesheetAssociatedItem';

const routeApi = getRouteApi('/app/products_/$productId/informations');
const routePath = '/app/products/$productId/informations';

export default function AppViewProductViewInformationsViewLifesheetComponent() {
  const { productId } = routeApi.useParams();
  const { lifesheetPage } = routeApi.useSearch();

  return (
    <LifesheetComponent
      associatedItemType={LifesheetAssociatedItem.PRODUCT}
      associatedItemId={productId}
      page={lifesheetPage}
      pageLink={(page) => ({ from: routePath, search: (old) => ({ ...old, lifesheetPage: page }), params: (old) => old })}
      createLink={{
        from: routePath,
        to: '/app/products/$productId/informations/create-lifesheet-comment',
        search: true,
        replace: true,
        resetScroll: false,
      }}
      getEmailLink={(data) => ({
        from: routePath,
        to: '/app/products/$productId/informations/lifesheet-email/$lifesheetId',
        params: { lifesheetId: data.id },
        search: true,
      })}
    />
  );
}
