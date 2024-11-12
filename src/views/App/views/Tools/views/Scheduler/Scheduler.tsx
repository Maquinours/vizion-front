import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, Outlet, getRouteApi } from '@tanstack/react-router';
import { Views } from 'react-big-calendar';
import RefreshButtonComponent from '../../../../../../components/RefreshButton/RefreshButton';
import { queries } from '../../../../../../utils/constants/queryKeys';
import styles from './Scheduler.module.scss';
import AppViewToolsViewSchedulerViewCalendarComponent from './components/Calendar/Calendar';

const routeApi = getRouteApi('/app/tools/scheduler');

const views = [Views.DAY, Views.WORK_WEEK, Views.MONTH, Views.AGENDA];

export default function AppViewToolsViewSchedulerView() {
  const navigate = routeApi.useNavigate();

  const { data, refetch, isRefetching } = useSuspenseQuery(queries['rdv-user-infos'].list);

  const { view, date } = routeApi.useSearch();

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link from={routeApi.id} to="./create" search replace resetScroll={false} preload="intent" className="btn btn-secondary">
            Ajouter un RDV
          </Link>
          <RefreshButtonComponent onRefresh={refetch} isRefreshing={isRefetching} className="btn btn-primary" />
        </div>
        <AppViewToolsViewSchedulerViewCalendarComponent
          events={data}
          views={views}
          view={view}
          date={date}
          onViewChange={(view) => {
            if (view === Views.WEEK) return;
            navigate({
              search: (old) => ({ ...old, view }),
              replace: true,
              resetScroll: false,
            });
          }}
          onDateChange={(date) => navigate({ search: (old) => ({ ...old, date }), replace: true, resetScroll: false })}
        />
      </div>
      <Outlet />
    </>
  );
}
