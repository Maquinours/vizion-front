import { useQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useLocalStorage } from 'usehooks-ts';
import CardComponent from '../../../../../../components/Card/Card';
import { queries } from '../../../../../../utils/constants/queryKeys';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import AppViewDashboardViewPersonalTasksComponentHeaderComponent from './components/Header/Header';
import AppViewDashboardViewPersonalTasksComponentPaginationComponent from './components/Pagination/Pagination';
import AppViewDashboardViewPersonalTasksComponentTableComponent from './components/Table/Table';
import { useSubscription } from 'react-stomp-hooks';

const routeApi = getRouteApi('/app/dashboard');

const size = 10;

export default function AppViewDashboardViewPersonalTasksComponent() {
  const [isMinimized, setMinimized] = useLocalStorage('preferences.dashboard.personalTasks.minimized', false);

  const { personalTaskState: state, personalTaskPage: page } = routeApi.useSearch();

  const { data: user } = useAuthentifiedUserQuery();

  const {
    data: pageData,
    refetch: refetchPage,
    isRefetching: isRefetchingPage,
    isLoading: isLoadingPage,
  } = useQuery(queries.tasks.page._ctx.byStateAndProfileId(state, user.profile.id, { page, size }));

  const { data: counts, refetch: refetchCounts, isRefetching: isRefetchingCounts } = useQuery(queries.tasks.counts._ctx.byProfileId(user.profile.id));

  const refetch = () => {
    refetchPage();
    refetchCounts();
  };

  useSubscription([`/topic/tasks-sender/${user.profile.id}`, `/topic/tasks/${user.profile.id}`], refetch);

  return (
    <CardComponent
      title="Charges de travail personnelles"
      addLink={{ to: '/app/dashboard/create-personal-task', search: true, replace: true, resetScroll: false, preload: 'intent' }}
      onReload={refetch}
      isReloading={isRefetchingPage || isRefetchingCounts}
      isMinimized={isMinimized}
      setMinimized={setMinimized}
    >
      <AppViewDashboardViewPersonalTasksComponentHeaderComponent counts={counts} />
      <AppViewDashboardViewPersonalTasksComponentTableComponent data={pageData} isLoading={isLoadingPage} />
      <AppViewDashboardViewPersonalTasksComponentPaginationComponent data={pageData} />
    </CardComponent>
  );
}
