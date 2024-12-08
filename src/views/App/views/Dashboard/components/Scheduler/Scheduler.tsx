import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { View, Views } from 'react-big-calendar';
import { useLocalStorage } from 'usehooks-ts';
import CardComponent from '../../../../../../components/Card/Card';
import SchedulerCalendarComponent from '../../../../../../components/SchedulerCalendar/SchedulerCalendar';
import { queries } from '../../../../../../utils/constants/queryKeys';
import RdvUserInfoResponseDto from '../../../../../../utils/types/RdvUserInfoResponseDto';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';

const routeApi = getRouteApi('/app/dashboard');

const views = [Views.DAY, Views.WORK_WEEK];

export default function AppViewDashboardViewSchedulerComponent() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const [isMinimized, setMinimized] = useLocalStorage('preferences.dashboard.scheduler.minimized', false);

  const { data: user } = useAuthentifiedUserQuery();

  const { schedulerView: view, schedulerDate: date } = routeApi.useSearch();

  const { data, refetch, isRefetching } = useSuspenseQuery({
    ...queries['rdv-user-infos'].list,
    select: (data) => data.filter((info) => info.attributeToId === user.profile.id),
  });

  const onViewChange = (view: View) => {
    if (view !== Views.DAY && view !== Views.WORK_WEEK) return;
    navigate({ search: (old) => ({ ...old, schedulerView: view }), replace: true, resetScroll: false });
  };

  const onDateChange = (date: Date) => {
    navigate({ search: (old) => ({ ...old, schedulerDate: date }), replace: true, resetScroll: false });
  };

  const onEventClick = (event: RdvUserInfoResponseDto) => {
    queryClient.setQueryData(
      queries['rdv-user-infos'].list._ctx.byRdvId(event.rdv!.id).queryKey,
      data.filter((info) => info.rdv!.id === event.rdv!.id),
    );
    navigate({
      to: './scheduler-event-details/$eventId',
      params: { eventId: event.rdv!.id },
      search: true,
      replace: true,
      resetScroll: false,
    });
  };

  return (
    <CardComponent title="Agenda" isMinimized={isMinimized} setMinimized={setMinimized} onReload={refetch} isReloading={isRefetching}>
      <div>
        <SchedulerCalendarComponent
          events={data}
          view={view}
          views={views}
          date={date}
          onViewChange={onViewChange}
          onDateChange={onDateChange}
          onEventClick={onEventClick}
        />
      </div>
    </CardComponent>
  );
}
