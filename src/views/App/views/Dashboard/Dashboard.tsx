import { Outlet } from '@tanstack/react-router';
import styles from './Dashboard.module.scss';
import AppViewDashboardViewCollectiveTasksComponent from './components/CollectiveTasks/CollectiveTasks';
import AppViewDashboardViewProgressiveInfosComponent from './components/ProgressiveInfos/ProgressiveInfos';
import AppViewDashboardViewLatestConnectionsComponent from './components/LatestConnections/LatestConnections';
import AppViewDashboardViewPersonalTasksComponent from './components/PersonalTasks/PersonalTasks';
import AppViewDashboardViewSchedulerComponent from './components/Scheduler/Scheduler';
import Masonry from 'react-masonry-css';
import { StompSessionProvider } from 'react-stomp-hooks';
import { WEBSOCKET_URL } from '../../../../utils/constants/api';
import AppViewDashboardViewCallsHistoryComponent from './components/CallsHistory/CallsHistory';

const breakpointColumnsObj = {
  default: 3,
  1400: 3,
  700: 2,
  500: 1,
};

export default function AppViewDashboardView() {
  return (
    <>
      <StompSessionProvider url={WEBSOCKET_URL}>
        <Masonry breakpointCols={breakpointColumnsObj} className={styles.container} columnClassName={styles.column}>
          <AppViewDashboardViewCollectiveTasksComponent />
          <AppViewDashboardViewPersonalTasksComponent />
          <AppViewDashboardViewProgressiveInfosComponent />
          <AppViewDashboardViewLatestConnectionsComponent />
          <AppViewDashboardViewCallsHistoryComponent />
          <AppViewDashboardViewSchedulerComponent />
        </Masonry>
      </StompSessionProvider>
      <Outlet />
    </>
  );
}
