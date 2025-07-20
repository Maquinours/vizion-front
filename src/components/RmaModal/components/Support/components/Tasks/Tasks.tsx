import { WorkloadAssociatedItem } from '../../../../../../utils/enums/WorkloadAssociatedItem';
import AssistanceResponseDto from '../../../../../../utils/types/AssistanceResponseDto';
import TaskResponseDto from '../../../../../../utils/types/TaskResponseDto';
import WorkloadsComponent from '../../../../../Workloads/Workloads';

// const routeApi = getRouteApi('/app/businesses-rma_/rma/$rmaId/support');

type RmaModalComponentSupportComponentTasksComponentProps = Readonly<{
  rma: AssistanceResponseDto;
  onEmailClick: (data: TaskResponseDto) => void;
  onUnlinkClick: (data: TaskResponseDto) => void;
}>;
export default function RmaModalComponentSupportComponentTasksComponent({
  rma,
  onEmailClick,
  onUnlinkClick,
}: RmaModalComponentSupportComponentTasksComponentProps) {
  // const { rmaId } = routeApi.useParams();

  return (
    <WorkloadsComponent
      associatedItemType={WorkloadAssociatedItem.RMA}
      associatedItemId={rma.id}
      onEmailClick={onEmailClick}
      onUnlinkClick={onUnlinkClick}
      // emailLink={(task) => ({
      //   to: '/app/businesses-rma/rma/$rmaId/support/task-email/$taskId',
      //   params: { taskId: task.id },
      //   search: true,
      //   replace: true,
      //   resetScroll: false,
      // })}
      // unlinkLink={(task) => ({
      //   to: '/app/businesses-rma/rma/$rmaId/support/unlink-task/$taskId',
      //   params: { taskId: task.id },
      //   search: true,
      //   replace: true,
      //   resetScroll: false,
      // })}
    />
  );
}
