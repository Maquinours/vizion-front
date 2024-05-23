import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useLocalStorage } from '@uidotdev/usehooks';
import { useCallback } from 'react';
import { View, Views } from 'react-big-calendar';
import CardComponent from '../../../../../../components/Card/Card';
import SchedulerCalendarComponent from '../../../../../../components/SchedulerCalendar/SchedulerCalendar';
import { queries } from '../../../../../../utils/constants/queryKeys';
import RdvUserInfoResponseDto from '../../../../../../utils/types/RdvUserInfoResponseDto';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';

const Route = getRouteApi('/app/dashboard');

const views = [Views.DAY, Views.WORK_WEEK];

export default function AppViewDashboardViewSchedulerComponent() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isMinimized, setMinimized] = useLocalStorage('preferences.dashboard.scheduler.minimized', false);

  const { data: user } = useAuthentifiedUserQuery();

  const { schedulerView: view, schedulerDate: date } = Route.useSearch();

  const { data, refetch, isRefetching } = useSuspenseQuery({
    ...queries['rdv-user-infos'].list,
    select: (data) => data.filter((info) => info.attributeToId === user.profile.id),
  });

  const onViewChange = useCallback(
    (view: View) => {
      if (view !== Views.DAY && view !== Views.WORK_WEEK) return;
      navigate({ from: Route.id, search: (old) => ({ ...old, schedulerView: view }), replace: true, resetScroll: false });
    },
    [navigate],
  );

  const onDateChange = useCallback(
    (date: Date) => {
      navigate({ from: Route.id, search: (old) => ({ ...old, schedulerDate: date }), replace: true, resetScroll: false });
    },
    [navigate],
  );

  const onEventClick = useCallback(
    (event: RdvUserInfoResponseDto) => {
      queryClient.setQueryData(
        queries['rdv-user-infos'].list._ctx.byRdvId(event.rdv!.id).queryKey,
        data.filter((info) => info.rdv!.id === event.rdv!.id),
      );
      navigate({
        from: Route.id,
        to: './scheduler-event-details/$eventId',
        params: { eventId: event.rdv!.id },
        search: (old) => old,
        replace: true,
        resetScroll: false,
      });
    },
    [data, navigate, queryClient],
  );

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
