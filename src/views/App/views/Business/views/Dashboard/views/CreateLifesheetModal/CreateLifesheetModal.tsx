import { useNavigate } from '@tanstack/react-router';
import CreateLifesheetModalComponent from '../../../../../../../../components/CreateLifesheetModal/CreateLifesheetModal';
import { LifesheetAssociatedItem } from '../../../../../../../../utils/enums/LifesheetAssociatedItem';
import { getRouteApi } from '@tanstack/react-router';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/dashboard/create-lifesheet');

export default function AppViewBusinessViewDashboardViewCreateLifesheetModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { businessId } = routeApi.useParams();

  const onClose = () => {
    navigate({ to: '..', search: (old) => old, replace: true, resetScroll: false, ignoreBlocker: true });
  };

  return <CreateLifesheetModalComponent associatedItemType={LifesheetAssociatedItem.BUSINESS} associatedItemId={businessId} onClose={onClose} />;
}
