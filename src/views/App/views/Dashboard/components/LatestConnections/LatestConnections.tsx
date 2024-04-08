import { useQuery } from '@tanstack/react-query';
import { useLocalStorage } from '@uidotdev/usehooks';
import CardComponent from '../../../../../../components/Card/Card';
import { keycloakEvents } from '../../../../../../utils/constants/queryKeys/keycloakEvent';
import styles from './LatestConnections.module.scss';
import AppViewDashboardViewLatestConnectionsComponentHeaderComponent from './components/Header/Header';
import AppViewDashboardViewLatestConnectionsComponentTableComponent from './components/Table/Table';

const page = 0;
const size = 100;

export default function AppViewDashboardViewLatestConnectionsComponent() {
  const [isMinimized, setMinimized] = useLocalStorage<boolean>('preferences.dashboard.latestConnections.minimized', false);

  const { data, isLoading, refetch, isRefetching } = useQuery(keycloakEvents.page({ page, size }));

  return (
    <CardComponent
      title="Derniers connectés sur VIZION"
      onReload={() => refetch()}
      isReloading={isRefetching}
      isMinimized={isMinimized}
      setMinimized={setMinimized}
    >
      <div className={styles.container}>
        <AppViewDashboardViewLatestConnectionsComponentHeaderComponent />
        <AppViewDashboardViewLatestConnectionsComponentTableComponent data={data?.content} isLoading={isLoading} />
      </div>
    </CardComponent>
  );
}
