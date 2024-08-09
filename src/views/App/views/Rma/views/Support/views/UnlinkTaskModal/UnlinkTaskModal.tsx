import { getRouteApi } from '@tanstack/react-router';
import UnlinkWorkloadModalComponent from '../../../../../../../../components/UnlinkWorkloadModal/UnlinkWorkloadModal';

const routeApi = getRouteApi('/app/businesses-rma/rma/$rmaId/support/unlink-task/$taskId');

export default function AppViewRmaViewSupportViewUnlinkTaskModalView() {
  const navigate = routeApi.useNavigate();

  const { taskId } = routeApi.useParams();

  const onClose = () => {
    navigate({ from: routeApi.id, to: '../..', search: true, replace: true, resetScroll: false });
  };

  return <UnlinkWorkloadModalComponent taskId={taskId} onClose={onClose} />;
}
