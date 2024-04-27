import { useQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useLocalStorage } from '@uidotdev/usehooks';
import CardComponent from '../../../../../../components/Card/Card';
import { queries } from '../../../../../../utils/constants/queryKeys';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import AppViewDashboardViewPersonalTasksComponentHeaderComponent from './components/Header/Header';
import AppViewDashboardViewPersonalTasksComponentPaginationComponent from './components/Pagination/Pagination';
import AppViewDashboardViewPersonalTasksComponentTableComponent from './components/Table/Table';

const Route = getRouteApi('/app/dashboard');

const size = 10;

export default function AppViewDashboardViewPersonalTasksComponent() {
  const [isMinimized, setMinimized] = useLocalStorage('preferences.dashboard.personalTasks.minimized', false);

  const { personalTaskState: state, personalTaskPage: page } = Route.useSearch();

  const { data: user } = useAuthentifiedUserQuery();

  const { data, refetch, isRefetching, isLoading } = useQuery(queries.tasks.page._ctx.byStateAndProfileId(state, user.profile.id, { page, size }));

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
