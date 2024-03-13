import { useQuery } from '@tanstack/react-query';
import { taskQueryKeys } from '../../../../../../utils/constants/queryKeys/task';
import { getPaginatedTasksByStateAndProfileId } from '../../../../../../utils/api/task';
import { getRouteApi } from '@tanstack/react-router';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import { useLocalStorage } from '@uidotdev/usehooks';
import CardComponent from '../../../../../../components/Card/Card';
import AppViewDashboardViewPersonalTasksComponentHeaderComponent from './components/Header/Header';
import AppViewDashboardViewPersonalTasksComponentTableComponent from './components/Table/Table';
import AppViewDashboardViewPersonalTasksComponentPaginationComponent from './components/Pagination/Pagination';

const Route = getRouteApi('/app/dashboard');

export default function AppViewDashboardViewPersonalTasksComponent() {
  const [isMinimized, setMinimized] = useLocalStorage('preferences.dashboard.personalTasks.minimized', false);

  const { personalTaskState: state, personalTaskSize: size, personalTaskPage: page } = Route.useSearch();

  const { data: user } = useAuthentifiedUserQuery();

  const { data, refetch, isRefetching, isLoading } = useQuery({
    queryKey: taskQueryKeys.pageByStateAndProfileId(state, user.profile.id, page, size),
    queryFn: () => getPaginatedTasksByStateAndProfileId(state, user.profile.id, page, size),
  });

  return (
    <CardComponent
      title="Charges de travail personnelles"
      addLink={{ to: '/app/dashboard/create-personal-task', search: (old) => old, params: {} }}
      onReload={() => refetch()}
      isReloading={isRefetching}
      isMinimized={isMinimized}
      setMinimized={setMinimized}
    >
      <AppViewDashboardViewPersonalTasksComponentHeaderComponent />
      <AppViewDashboardViewPersonalTasksComponentTableComponent data={data} isLoading={isLoading} />
      <AppViewDashboardViewPersonalTasksComponentPaginationComponent data={data} />
    </CardComponent>
  );
}
