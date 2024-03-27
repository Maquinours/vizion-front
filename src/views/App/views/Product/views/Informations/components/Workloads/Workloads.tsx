import { getRouteApi } from '@tanstack/react-router';
import WorkloadsComponent from '../../../../../../../../components/Workloads/Workloads';
import { WorkloadAssociatedItem } from '../../../../../../../../utils/enums/WorkloadAssociatedItem';

const routeApi = getRouteApi('/app/products/$productId/informations');

export default function AppViewProductViewInformationsViewWorkloadsComponent() {
  const { productId } = routeApi.useParams();

  return (
    <WorkloadsComponent
      associatedItemType={WorkloadAssociatedItem.PRODUCT}
      associatedItemId={productId}
      emailLink={(data) => ({ to: '/app/products/$productId/informations/task-email/$taskId', params: { taskId: data.id }, search: (old) => old })}
    />
  );
}
