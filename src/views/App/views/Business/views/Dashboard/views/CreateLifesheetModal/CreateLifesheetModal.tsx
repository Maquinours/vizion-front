import { getRouteApi } from '@tanstack/react-router';
import CreateLifesheetModalComponent from '../../../../../../../../components/CreateLifesheetModal/CreateLifesheetModal';
import { LifesheetAssociatedItem } from '../../../../../../../../utils/enums/LifesheetAssociatedItem';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/dashboard/create-lifesheet');

export default function AppViewBusinessViewDashboardViewCreateLifesheetModalView() {
  const navigate = routeApi.useNavigate();

  const { businessId } = routeApi.useParams();

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false, ignoreBlocker: true });
  };

  return <CreateLifesheetModalComponent associatedItemType={LifesheetAssociatedItem.BUSINESS} associatedItemId={businessId} onClose={onClose} />;
}
