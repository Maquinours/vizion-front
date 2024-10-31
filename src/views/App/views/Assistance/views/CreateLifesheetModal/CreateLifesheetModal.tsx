import { getRouteApi } from '@tanstack/react-router';
import CreateLifesheetModalComponent from '../../../../../../components/CreateLifesheetModal/CreateLifesheetModal';
import { LifesheetAssociatedItem } from '../../../../../../utils/enums/LifesheetAssociatedItem';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId_/assistance/$assistanceId/create-lifesheet');

export default function AppViewAssistanceViewCreateLifesheetModalView() {
  const navigate = routeApi.useNavigate();

  const { assistanceId } = routeApi.useParams();

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false });
  };

  return <CreateLifesheetModalComponent associatedItemType={LifesheetAssociatedItem.ASSISTANCE} associatedItemId={assistanceId} onClose={onClose} />;
}
