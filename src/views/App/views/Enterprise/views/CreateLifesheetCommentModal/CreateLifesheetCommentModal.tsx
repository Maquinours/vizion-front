import { getRouteApi, useNavigate } from '@tanstack/react-router';
import CreateLifesheetModalComponent from '../../../../../../components/CreateLifesheetModal/CreateLifesheetModal';
import { LifesheetAssociatedItem } from '../../../../../../utils/enums/LifesheetAssociatedItem';

const Route = getRouteApi('/app/enterprises/$enterpriseId/create-lifesheet-comment');

export default function AppViewEnterpriseViewCreateLifesheetCommentModalView() {
  const navigate = useNavigate();

  const { enterpriseId } = Route.useParams();

  return (
    <CreateLifesheetModalComponent
      associatedItemType={LifesheetAssociatedItem.ENTERPRISE}
      associatedItemId={enterpriseId}
      onClose={() => navigate({ from: Route.id, to: '..', search: (old) => old, params: (old) => old })}
    />
  );
}
