import { useQuery } from '@tanstack/react-query';
import { Link, getRouteApi } from '@tanstack/react-router';
import { RowSelectionState } from '@tanstack/react-table';
import { useLocalStorage } from '@uidotdev/usehooks';
import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import CardComponent from '../../../../../../components/Card/Card';
import { queries } from '../../../../../../utils/constants/queryKeys';
import WorkloadType from '../../../../../../utils/enums/WorkloadType';
import TaskResponseDto from '../../../../../../utils/types/TaskResponseDto';
import styles from './CollectiveTasks.module.scss';
import Table from './components/Table/Table';

const Route = getRouteApi('/app/dashboard');

export default function AppViewDashboardViewCollectiveTasksComponent() {
  const [isMinimized, setMinimized] = useLocalStorage<boolean>('preferences.dashboard.collectiveTasks.minimized', false);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const { data, isLoading, refetch, isRefetching } = useQuery(queries.tasks.list._ctx.byType(WorkloadType.COLLECTIVE));

  const selectedItems = rowSelection
    ? (Object.keys(rowSelection)
        .map((id) => data?.find((d) => d.id === id))
        .filter((data) => data !== undefined) as Array<TaskResponseDto>)
    : [];

  return (
    <CardComponent
      title="Charges de travail collectives"
      addLink={{ to: '/app/dashboard/create-collective-task', search: (old) => old, params: {} }}
      onReload={() => refetch()}
      isReloading={isRefetching}
      isMinimized={isMinimized}
      setMinimized={setMinimized}
    >
      <div className={styles.container}>
        {selectedItems.length > 0 && (
          <div className={styles.header_container}>
            <Link
              from={Route.id}
              to={'./delete-collective-tasks'}
              search={(old) => ({ ...old, tasksId: selectedItems.map(({ id }) => id) })}
              preload="intent"
              replace
            >
              <FaTrash width={18} height={18} color="#16204E" />
            </Link>
          </div>
        )}
        <Table data={data} isLoading={isLoading} rowSelection={rowSelection} setRowSelection={setRowSelection} />
      </div>
    </CardComponent>
  );
}
