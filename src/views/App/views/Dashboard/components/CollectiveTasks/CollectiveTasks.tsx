import { useQuery } from '@tanstack/react-query';
import { Link, getRouteApi } from '@tanstack/react-router';
import { RowSelectionState } from '@tanstack/react-table';
import { useLocalStorage } from 'usehooks-ts';
import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import CardComponent from '../../../../../../components/Card/Card';
import { queries } from '../../../../../../utils/constants/queryKeys';
import WorkloadType from '../../../../../../utils/enums/WorkloadType';
import TaskResponseDto from '../../../../../../utils/types/TaskResponseDto';
import styles from './CollectiveTasks.module.scss';
import Table from './components/Table/Table';
import { useSubscription } from 'react-stomp-hooks';

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

  useSubscription('/topic/tasks-all', () => refetch());

  return (
    <CardComponent
      title="Charges de travail collectives"
      addLink={{ to: '/app/dashboard/create-collective-task', search: true, replace: true, preload: 'intent' }}
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
              to="./delete-collective-tasks"
              search={(old) => ({ ...old, tasksId: selectedItems.map(({ id }) => id) })}
              replace
              resetScroll={false}
              preload="render"
            >
              <FaTrash width={18} height={18} color="#F24C52" />
            </Link>
          </div>
        )}
        <Table data={data} isLoading={isLoading} rowSelection={rowSelection} setRowSelection={setRowSelection} />
      </div>
    </CardComponent>
  );
}
