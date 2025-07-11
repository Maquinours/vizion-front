import { LifesheetAssociatedItem } from '../../../../../../utils/enums/LifesheetAssociatedItem';
import BusinessResponseDto from '../../../../../../utils/types/BusinessResponseDto';
import LifesheetComponent from '../../../../../Lifesheet/Lifesheet';

// const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/dashboard');
// const routePath = '/app/businesses-rma/business/$businessId/dashboard';

type BusinessModalComponentDashboardComponentLifesheetComponentProps = Readonly<{
  business: BusinessResponseDto;
  onCreateButtonClick: () => void;
}>;
export default function BusinessModalComponentDashboardComponentLifesheetComponent({
  business,
  onCreateButtonClick,
}: BusinessModalComponentDashboardComponentLifesheetComponentProps) {
  // const { businessId } = routeApi.useParams();
  return (
    <LifesheetComponent
      associatedItemType={LifesheetAssociatedItem.BUSINESS}
      associatedItemId={business.id}
      page={0}
      size={100}
      onCreateClick={onCreateButtonClick}
      // createLink={{
      //   from: routePath,
      //   to: '/app/businesses-rma/business/$businessId/dashboard/create-lifesheet',
      //   search: true,
      //   replace: true,
      //   resetScroll: false,
      //   ignoreBlocker: true,
      // }}
      // getEmailLink={(data) => ({
      //   from: routePath,
      //   to: '/app/businesses-rma/business/$businessId/dashboard/lifesheet-email/$lifesheetId',
      //   params: { lifesheetId: data.id },
      //   search: true,
      //   ignoreBlocker: true,
      // })}
      className="flex-1"
    />
  );
}
