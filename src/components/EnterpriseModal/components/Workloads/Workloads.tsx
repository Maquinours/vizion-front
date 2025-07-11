// import { getRouteApi } from '@tanstack/react-router';
// import WorkloadsComponent from '../../../../../../components/Workloads/Workloads';
// import { WorkloadAssociatedItem } from '../../../../../../utils/enums/WorkloadAssociatedItem';

// const routeApi = getRouteApi('/app/enterprises_/$enterpriseId');

// export default function AppViewEnterpriseViewWorkloadsComponent() {
//   const { enterpriseId } = routeApi.useParams();

//   return (
//     <WorkloadsComponent
//       associatedItemType={WorkloadAssociatedItem.ENTERPRISE}
//       associatedItemId={enterpriseId}
//       emailLink={(data) => ({
//         to: '/app/enterprises/$enterpriseId/task-email/$taskId',
//         params: { taskId: data.id },
//         search: true,
//         replace: true,
//         resetScroll: false,
//       })}
//       unlinkLink={(data) => ({
//         to: '/app/enterprises/$enterpriseId/unlink-task/$taskId',
//         params: { taskId: data.id },
//         search: true,
//         replace: true,
//         resetScroll: false,
//       })}
//     />
//   );
// }
