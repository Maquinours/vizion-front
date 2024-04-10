import { VirtualElement } from '@popperjs/core';
import { useQueryClient } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { Row, RowSelectionState, createColumnHelper } from '@tanstack/react-table';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import React, { useCallback, useMemo, useState } from 'react';
import IndeterminateCheckboxComponent from '../../../../../../../../components/IndeterminateCheckbox/IndeterminateCheckbox';
import TableComponent from '../../../../../../../../components/Table/Table';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { formatDateAndHourWithSlash } from '../../../../../../../../utils/functions/dates';
import TaskResponseDto from '../../../../../../../../utils/types/TaskResponseDto';
import styles from './Table.module.scss';
import ContextMenu from './components/ContextMenu/ContextMenu';

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
        queryClient.setQueryData(queries.tasks.detail(task.id).queryKey, task);
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
                  <div>{parse(DOMPurify.sanitize(original.content ?? ''))}</div>
                  <p>
                    À : {original.receiver?.to?.toString()?.split(';').join(' ')} {original.receiver?.cc?.toString()}
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
