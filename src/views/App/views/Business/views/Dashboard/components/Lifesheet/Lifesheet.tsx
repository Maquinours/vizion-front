import { getRouteApi } from '@tanstack/react-router';
import { LifesheetAssociatedItem } from '../../../../../../../../utils/enums/LifesheetAssociatedItem';
import LifesheetComponent from '../../../../../../../../components/Lifesheet/Lifesheet';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/dashboard');
const routePath = '/app/businesses-rma/business/$businessId/dashboard';

export default function AppViewBusinessViewDashboardViewLifesheetComponent() {
  const { businessId } = routeApi.useParams();
  return (
    <LifesheetComponent
      associatedItemType={LifesheetAssociatedItem.BUSINESS}
      associatedItemId={businessId}
      page={0}
      size={100}
      createLink={{
        from: routePath,
        to: '/app/businesses-rma/business/$businessId/dashboard/create-lifesheet',
        search: true,
        replace: true,
        resetScroll: false,
        ignoreBlocker: true,
      }}
      getEmailLink={(data) => ({
        from: routePath,
        to: '/app/businesses-rma/business/$businessId/dashboard/lifesheet-email/$lifesheetId',
        params: { lifesheetId: data.id },
        search: true,
        ignoreBlocker: true,
      })}
      className="flex-1"
    />
  );
}
