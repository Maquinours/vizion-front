import { getRouteApi } from '@tanstack/react-router';
import WorkloadsComponent from '../../../../../../../../components/Workloads/Workloads';
import { WorkloadAssociatedItem } from '../../../../../../../../utils/enums/WorkloadAssociatedItem';

const routeApi = getRouteApi('/app/businesses-rma/rma/$rmaId/support');

export default function AppViewRmaViewSupportViewTasksComponent() {
  const { rmaId } = routeApi.useParams();

  return (
    <WorkloadsComponent
      associatedItemType={WorkloadAssociatedItem.RMA}
      associatedItemId={rmaId}
      emailLink={(task) => ({
        to: '/app/businesses-rma/rma/$rmaId/support/task-email/$taskId',
        params: { taskId: task.id },
        search: true,
        replace: true,
        resetScroll: false,
      })}
    />
  );
}
