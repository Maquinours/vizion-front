import { getRouteApi } from '@tanstack/react-router';
import UnlinkWorkloadModalComponent from '../../../../../../../../components/UnlinkWorkloadModal/UnlinkWorkloadModal';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/dashboard/unlink-task/$taskId');

export default function AppViewBusinessViewDashboardViewUnlinkTaskModalView() {
  const navigate = routeApi.useNavigate();

  const { taskId } = routeApi.useParams();

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false, ignoreBlocker: true });
  };

  return <UnlinkWorkloadModalComponent taskId={taskId} onClose={onClose} />;
}
