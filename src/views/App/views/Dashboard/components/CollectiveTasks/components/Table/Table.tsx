import { Row, RowSelectionState, createColumnHelper } from '@tanstack/react-table';
import TaskResponseDto from '../../../../../../../../utils/types/TaskResponseDto';
import { formatDateAndHourWithSlash } from '../../../../../../../../utils/functions/dates';
import styles from './Table.module.scss';
import TableComponent from '../../../../../../../../components/Table/Table';
import ContextMenu from './components/ContextMenu/ContextMenu';
import { VirtualElement } from '@popperjs/core';
import React, { useCallback, useMemo, useState } from 'react';
import IndeterminateCheckboxComponent from '../../../../../../../../components/IndeterminateCheckbox/IndeterminateCheckbox';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { taskQueryKeys } from '../../../../../../../../utils/constants/queryKeys/task';

const Route = getRouteApi('/app/dashboard');

const columnHelper = createColumnHelper<TaskResponseDto>();

type AppViewDashboardViewCollectiveTasksComponentTableComponentProps = Readonly<{
  data: Array<TaskResponseDto> | undefined;
  isLoading: boolean;
  rowSelection: RowSelectionState;
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
}>;
export default function AppViewDashboardViewCollectiveTasksComponentTableComponent({
  data,
  isLoading,
  rowSelection,
  setRowSelection,
}: AppViewDashboardViewCollectiveTasksComponentTableComponentProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [currentTask, setCurrentTask] = useState<TaskResponseDto>();
  const [contextMenuAnchorElement, setContextMenuAnchorElement] = useState<VirtualElement | undefined>(undefined);

  const onRowContentClick = useCallback(
    (task: TaskResponseDto) => {
      if (task.mailId) {
        queryClient.setQueryData(taskQueryKeys.detailById(task.id), task);
        navigate({ from: Route.id, to: 'task-email/$taskId', params: { taskId: task.id }, search: (old) => old });
      } else if (task.businessId) {
        // TODO: implement redirect to business
      }
    },
    [navigate, queryClient],
  );

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'checker',
        cell: ({ row }) => (
          <IndeterminateCheckboxComponent
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        ),
      }),
      columnHelper.display({
        id: 'content',
        cell: ({ row: { original } }) => (
          <div className={styles.more_content}>
            <div className={styles.content}>
              {original.mailId ? (
                <button className={styles.mail_content} onClick={() => onRowContentClick(original)}>
                  <div>
                    <div dangerouslySetInnerHTML={{ __html: original.content ?? '' }} />
                  </div>
                  <p>
                    A : {original.receiver?.to?.toString()?.split(';').join(' ')} {original.receiver?.cc?.toString()}
                  </p>
                  <p>
                    De : <a href={`mailto:${original.name}`}>{original.name}</a>
                  </p>
                </button>
              ) : (
                <div className={styles.default_task}>
                  <button onClick={() => onRowContentClick(original)}>{original.content}</button>
                  <div>
                    <span>{original.name}</span> <span>{formatDateAndHourWithSlash(original.createdDate)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ),
      }),
    ],
    [onRowContentClick],
  );

  const onTableRowContextMenu = (e: React.MouseEvent, row: Row<TaskResponseDto>) => {
    e.preventDefault();
    setCurrentTask(row.original);
    const virtualElement: VirtualElement = {
      getBoundingClientRect: () => ({
        width: 0,
        height: 0,
        x: e.clientX,
        y: e.clientY,
        top: e.clientY,
        right: e.clientX,
        bottom: e.clientY,
        left: e.clientX,
        toJSON: () => {},
      }),
    };
    setContextMenuAnchorElement(virtualElement);
  };

  return (
    <>
      <div className={styles.table_container}>
        <TableComponent<TaskResponseDto>
          isLoading={isLoading}
          data={data}
          columns={columns}
          rowId="id"
          onRowContextMenu={onTableRowContextMenu}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
      </div>
      <ContextMenu anchorElement={contextMenuAnchorElement} setAnchorElement={setContextMenuAnchorElement} task={currentTask} />
    </>
  );
}
