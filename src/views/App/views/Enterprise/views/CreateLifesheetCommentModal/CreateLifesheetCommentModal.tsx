import { getRouteApi } from '@tanstack/react-router';
import CreateLifesheetModalComponent from '../../../../../../components/CreateLifesheetModal/CreateLifesheetModal';
import { LifesheetAssociatedItem } from '../../../../../../utils/enums/LifesheetAssociatedItem';

const routeApi = getRouteApi('/app/enterprises_/$enterpriseId/create-lifesheet-comment');

export default function AppViewEnterpriseViewCreateLifesheetCommentModalView() {
  const navigate = routeApi.useNavigate();

  const { enterpriseId } = routeApi.useParams();

  return (
    <CreateLifesheetModalComponent
      associatedItemType={LifesheetAssociatedItem.ENTERPRISE}
      associatedItemId={enterpriseId}
      onClose={() => navigate({ to: '..', search: true, replace: true, resetScroll: false })}
    />
  );
}
