import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, Outlet, getRouteApi, useNavigate } from '@tanstack/react-router';
import { View, Views } from 'react-big-calendar';
import RefreshButtonComponent from '../../../../../../components/RefreshButton/RefreshButton';
import SchedulerCalendarComponent from '../../../../../../components/SchedulerCalendar/SchedulerCalendar';
import { queries } from '../../../../../../utils/constants/queryKeys';
import styles from './Scheduler.module.scss';

const routeApi = getRouteApi('/app/tools/scheduler');

const views = [Views.DAY, Views.WORK_WEEK, Views.MONTH, Views.WORK_WEEK, Views.AGENDA];

export default function AppViewToolsViewSchedulerView() {
  const navigate = useNavigate();

  const { data, refetch, isRefetching } = useSuspenseQuery(queries['rdv-user-infos'].list);

  const { view, date } = routeApi.useSearch();

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link from={routeApi.id} to="./create" search={(old) => old} className="btn btn-secondary">
            Ajouter un RDV
          </Link>
          <RefreshButtonComponent onRefresh={refetch} isRefreshing={isRefetching} className="btn btn-primary" />
        </div>
        <SchedulerCalendarComponent
          events={data}
          views={views}
          view={view}
          date={date}
          onViewChange={(view) =>
            navigate({
              from: routeApi.id,
              search: (old) => ({ ...old, view: view as Exclude<View, 'week'> }),
            })
          }
          onDateChange={(date) => navigate({ from: routeApi.id, search: (old) => ({ ...old, date }) })}
          onEventClick={(event) => navigate({ from: routeApi.id, to: './details/$rdvId', params: { rdvId: event.id }, search: (old) => old })}
        />
      </div>
      <Outlet />
    </>
  );
}
