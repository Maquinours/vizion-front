import { getRouteApi, useNavigate } from '@tanstack/react-router';
import CreateLifesheetModalComponent from '../../../../../../components/CreateLifesheetModal/CreateLifesheetModal';
import { LifesheetAssociatedItem } from '../../../../../../utils/enums/LifesheetAssociatedItem';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/assistance/$assistanceId/create-lifesheet');

export default function AppViewAssistanceViewCreateLifesheetModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { assistanceId } = routeApi.useParams();

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false });
  };

  return <CreateLifesheetModalComponent associatedItemType={LifesheetAssociatedItem.ASSISTANCE} associatedItemId={assistanceId} onClose={onClose} />;
}
