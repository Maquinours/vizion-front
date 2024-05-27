import { useQuery } from '@tanstack/react-query';
import { useLocalStorage } from '@uidotdev/usehooks';
import CardComponent from '../../../../../../components/Card/Card';
import { queries } from '../../../../../../utils/constants/queryKeys';
import styles from './ProgressiveInfos.module.scss';
import AppViewDashboardViewProgressiveInfosComponentTableComponent from './components/Table/Table';
import { useSubscription } from 'react-stomp-hooks';

export default function AppViewDashboardViewProgressiveInfosComponent() {
  const [isMinimized, setMinimized] = useLocalStorage<boolean>('preferences.dashboard.progressiveInfos.minimized', false);

  const { data, isLoading, refetch, isRefetching } = useQuery(queries['progressive-infos'].list);

  useSubscription('/topic/progressive-info', () => refetch());

  return (
    <CardComponent
      title="Fil de l'eau"
      addLink={{ to: '/app/dashboard/create-progressive-info', search: (old) => old, replace: true, resetScroll: false }}
      onReload={() => refetch()}
      isReloading={isRefetching}
      isMinimized={isMinimized}
      setMinimized={setMinimized}
    >
      <div className={styles.container}>
        <AppViewDashboardViewProgressiveInfosComponentTableComponent data={data} isLoading={isLoading} />
      </div>
    </CardComponent>
  );
}
