import { getRouteApi } from '@tanstack/react-router';
import UnlinkWorkloadModalComponent from '../../../../../../components/UnlinkWorkloadModal/UnlinkWorkloadModal';

const routeApi = getRouteApi('/app/enterprises_/$enterpriseId/unlink-task/$taskId');

export default function AppViewEnterpriseViewUnlinkTaskModalView() {
  const navigate = routeApi.useNavigate();

  const { taskId } = routeApi.useParams();

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  return <UnlinkWorkloadModalComponent taskId={taskId} onClose={onClose} />;
}
