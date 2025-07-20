import { WorkloadAssociatedItem } from '../../../../utils/enums/WorkloadAssociatedItem';
import EnterpriseResponseDto from '../../../../utils/types/EnterpriseResponseDto';
import WorkloadsComponent from '../../../Workloads/Workloads';

// const routeApi = getRouteApi('/app/enterprises_/$enterpriseId');

type EnterpriseModalComponentWorkloadsComponentProps = Readonly<{
  enterprise: EnterpriseResponseDto;
  onEmailClick: (data: any) => void;
  onUnlinkClick: (data: any) => void;
}>;
export default function EnterpriseModalComponentWorkloadsComponent({
  enterprise,
  onEmailClick,
  onUnlinkClick,
}: EnterpriseModalComponentWorkloadsComponentProps) {
  //   const { enterpriseId } = routeApi.useParams();

  return (
    <WorkloadsComponent
      associatedItemType={WorkloadAssociatedItem.ENTERPRISE}
      associatedItemId={enterprise.id}
      onEmailClick={onEmailClick}
      onUnlinkClick={onUnlinkClick}
      //   emailLink={(data) => ({
      //     to: '/app/enterprises/$enterpriseId/task-email/$taskId',
      //     params: { taskId: data.id },
      //     search: true,
      //     replace: true,
      //     resetScroll: false,
      //   })}
      //   unlinkLink={(data) => ({
      //     to: '/app/enterprises/$enterpriseId/unlink-task/$taskId',
      //     params: { taskId: data.id },
      //     search: true,
      //     replace: true,
      //     resetScroll: false,
      //   })}
    />
  );
}
