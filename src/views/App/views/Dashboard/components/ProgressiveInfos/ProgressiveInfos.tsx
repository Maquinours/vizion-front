import CardComponent from '../../../../../../components/Card/Card';
import { useQuery } from '@tanstack/react-query';
import { progressiveInfoQueryKeys } from '../../../../../../utils/constants/queryKeys/progressiveInfo';
import { getProgressiveInfos } from '../../../../../../utils/api/progressiveInfo';
import { useLocalStorage } from '@uidotdev/usehooks';
import AppViewDashboardViewProgressiveInfosComponentTableComponent from './components/Table/Table';
import styles from './ProgressiveInfos.module.scss';

export default function AppViewDashboardViewProgressiveInfosComponent() {
  const [isMinimized, setMinimized] = useLocalStorage<boolean>('preferences.dashboard.progressiveInfos.minimized', false);

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: progressiveInfoQueryKeys.listAll(),
    queryFn: getProgressiveInfos,
  });

  return (
    <CardComponent
      title="Fil de l'eau"
      addLink={{ to: '/app/dashboard/create-progressive-info', search: (old) => old, params: {} }}
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
