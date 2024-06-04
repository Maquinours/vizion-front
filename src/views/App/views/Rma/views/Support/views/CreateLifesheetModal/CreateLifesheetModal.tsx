import { getRouteApi, useNavigate } from '@tanstack/react-router';
import CreateLifesheetModalComponent from '../../../../../../../../components/CreateLifesheetModal/CreateLifesheetModal';
import { LifesheetAssociatedItem } from '../../../../../../../../utils/enums/LifesheetAssociatedItem';

const routeApi = getRouteApi('/app/businesses-rma/rma/$rmaId/support');

export default function AppViewRmaViewSupportViewCreateLifesheetModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { rmaId } = routeApi.useParams();

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false });
  };

  return <CreateLifesheetModalComponent associatedItemType={LifesheetAssociatedItem.RMA} associatedItemId={rmaId} onClose={onClose} />;
}
