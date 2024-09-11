import { VirtualElement } from '@popperjs/core';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, getRouteApi } from '@tanstack/react-router';
import { Row, createColumnHelper } from '@tanstack/react-table';
import classNames from 'classnames';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import React, { useMemo, useState } from 'react';
import { AiFillTag } from 'react-icons/ai';
import TableComponent from '../../../../../../../../components/Table/Table';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import TaskState from '../../../../../../../../utils/enums/TaskState';
import { formatDate, formatDateWithHour, isDateOutdated } from '../../../../../../../../utils/functions/dates';
import Page from '../../../../../../../../utils/types/Page';
import TaskResponseDto from '../../../../../../../../utils/types/TaskResponseDto';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';
import styles from './Table.module.scss';
import AppViewDashboardViewPersonalTasksComponentPersonalTasksComponentTableComponentContextMenuComponent from './components/ContextMenu/ContextMenu';
import { markTaskAsRead } from './utils/api/tasks';

const Route = getRouteApi('/app/dashboard');

const columnHelper = createColumnHelper<TaskResponseDto>();

type AppViewDashboardViewPersonalTasksComponentTableComponentProps = Readonly<{
  data: Page<TaskResponseDto> | undefined;
  isLoading: boolean;
}>;
export default function AppViewDashboardViewPersonalTasksComponentTableComponent({
  data,
  isLoading,
}: AppViewDashboardViewPersonalTasksComponentTableComponentProps) {
  const queryClient = useQueryClient();

  const [task, setTask] = useState<TaskResponseDto>();
  const [contextMenuAnchor, setContextMenuAnchor] = useState<VirtualElement>();

  const { data: currentUser } = useAuthentifiedUserQuery();

  const { data: members } = useQuery(queries.profiles.list._ctx.byEnterpriseId(currentUser.profile.enterprise!.id));

  const columns = useMemo(
    () => [
      columnHelper.display({
        header: 'Création',
        cell: ({ row: { original } }) => <div>{formatDateWithHour(original.createdDate)}</div>,
      }),
      columnHelper.display({
        header: 'Echéance',
        cell: ({ row: { original } }) => (
          <div
            className={classNames({
              [styles.isOutdated]: original.deadline ? isDateOutdated(original.deadline) : isDateOutdated(original.modifiedDate),
            })}
          >
            {original.deadline ? formatDate(original.deadline) : formatDate(original.modifiedDate)}
          </div>
        ),
      }),
      columnHelper.display({
        header: 'Description',
        cell: ({ row: { original } }) => {
          let item;
          if (original.mailId)
            item = (
              <Link
                from={Route.id}
                to="task-email/$taskId"
                params={{ taskId: original.id }}
                search
                replace
                resetScroll={false}
                className={styles.link}
                preload="intent"
              >
                {parse(DOMPurify.sanitize(original.content ?? ''))}
                <p className="text-secondary">A : {original.receiver?.to?.toString().split(';').join(' ')}</p>
                <p>De : {original.name}</p>
              </Link>
            );
          else {
            const sender = members?.find((member) => member.id === original.senderId);
            item = (
              <>
                {parse(DOMPurify.sanitize(original.content ?? ''))}
                <div className={styles.tag}>
                  {original.profileId !== original.senderId && currentUser.profile.id !== original.senderId && (
                    <span>{sender ? `De ${sender.firstName} ${sender.lastName}` : ''} </span>
                  )}
                  {original.receiverState === TaskState.ARCHIVED &&
                    original.profileId !== original.senderId &&
                    [TaskState.CREATED, TaskState.CLOSED].includes(original.state!) && (
                      <AiFillTag color={original?.profileId === currentUser.profile.id ? '#5DC896' : '#F24C52'} size={16} />
                    )}
                </div>
              </>
            );
          }
          return <div className={styles.content}>{item}</div>;
        },
      }),
      columnHelper.display({
        header: 'Objet',
        cell: ({ row: { original } }) => {
          if (original.businessId)
            return (
              <Link to="/app/businesses-rma/business/$businessId" params={{ businessId: original.businessId }}>
                {original.businessNum}
              </Link>
            );
          if (original.rmaId)
            return (
              <Link to="/app/businesses-rma/rma/$rmaId" params={{ rmaId: original.rmaId }}>
                {original.rmaNum}
              </Link>
            );
          if (original.enterpriseId)
            return (
              <Link to="/app/enterprises/$enterpriseId" params={{ enterpriseId: original.enterpriseId }}>
                {original.enterpriseName}
              </Link>
            );
          if (original.productId)
            return (
              <Link to="/app/products/$productId" params={{ productId: original.productId }}>
                {original.reference}
              </Link>
            );
          return 'Non relié';
        },
      }),
    ],
    [currentUser.profile.id, members],
  );

  const { mutate: readTaskMutate } = useMutation({
    mutationFn: (task: TaskResponseDto) => markTaskAsRead(task),
    onMutate: (task) => {
      const newTask = { ...task, taskOpened: true };
      queryClient.setQueriesData<Page<TaskResponseDto>>({ queryKey: queries.tasks.page.queryKey }, (old) =>
        old ? { ...old, content: old?.content.map((t) => (t.id === task.id ? newTask : t)) } : old,
      );
      queryClient.setQueriesData<Array<TaskResponseDto>>({ queryKey: queries.tasks.list.queryKey }, (old) => old?.map((t) => (t.id === task.id ? newTask : t)));
      queryClient.setQueriesData<TaskResponseDto>({ queryKey: queries.tasks.detail._def }, (old) => (old?.id === task.id ? newTask : old));
    },
    onError: (error, task) => {
      queryClient.setQueriesData<Page<TaskResponseDto>>({ queryKey: queries.tasks.page.queryKey }, (old) =>
        old ? { ...old, content: old?.content.map((t) => (t.id === task.id ? { ...t, taskOpened: false } : t)) } : old,
      );
      queryClient.setQueriesData<Array<TaskResponseDto>>({ queryKey: queries.tasks.list.queryKey }, (old) =>
        old?.map((t) => (t.id === task.id ? { ...t, taskOpened: false } : t)),
      );
      queryClient.setQueriesData<TaskResponseDto>({ queryKey: queries.tasks.detail._def }, (old) =>
        old?.id === task.id ? { ...old, taskOpened: false } : old,
      );

      console.error(error);
    },
  });

  const onRowClick = (e: React.MouseEvent, row: Row<TaskResponseDto>) => {
    if (!row.original.taskOpened) {
      e.preventDefault();
      readTaskMutate(row.original);
    }
  };

  const onRowContextMenu = (e: React.MouseEvent, row: Row<TaskResponseDto>) => {
    e.preventDefault();
    setTask(row.original);
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
    setContextMenuAnchor(virtualElement);
  };

  return (
    <>
      <div className={styles.table_container}>
        <TableComponent
          columns={columns}
          data={data?.content}
          isLoading={isLoading}
          onRowClick={onRowClick}
          onRowContextMenu={onRowContextMenu}
          rowId={'id'}
          getRowClassName={(row) =>
            classNames({
              [styles.not_read]: !row.taskOpened,
            })
          }
        />
      </div>
      <AppViewDashboardViewPersonalTasksComponentPersonalTasksComponentTableComponentContextMenuComponent
        anchor={contextMenuAnchor}
        setAnchor={setContextMenuAnchor}
        task={task}
      />
    </>
  );
}
