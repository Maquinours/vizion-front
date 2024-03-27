import { Row, createColumnHelper } from '@tanstack/react-table';
import classNames from 'classnames';
import styles from './Table.module.scss';
import { AiFillTag } from 'react-icons/ai';
import React, { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { markTaskAsRead } from './utils/api/tasks';
import { VirtualElement } from '@popperjs/core';
import AppViewDashboardViewPersonalTasksComponentPersonalTasksComponentTableComponentContextMenuComponent from './components/ContextMenu/ContextMenu';
import TaskResponseDto from '../../../../../../../../utils/types/TaskResponseDto';
import Page from '../../../../../../../../utils/types/Page';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';
import { profileQueryKeys } from '../../../../../../../../utils/constants/queryKeys/profile';
import { getProfilesByEnterpriseId } from '../../../../../../../../utils/api/profile';
import { taskQueryKeys } from '../../../../../../../../utils/constants/queryKeys/task';
import { formatDate, formatDateWithHour, isDateOutdated } from '../../../../../../../../utils/functions/dates';
import TaskState from '../../../../../../../../utils/enums/TaskState';
import TableComponent from '../../../../../../../../components/Table/Table';

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
  const navigate = useNavigate();

  const [task, setTask] = useState<TaskResponseDto>();
  const [contextMenuAnchor, setContextMenuAnchor] = useState<VirtualElement>();

  const { data: currentUser } = useAuthentifiedUserQuery();

  const { data: members } = useQuery({
    queryKey: profileQueryKeys.listByEnterpriseId(currentUser.profile.enterprise!.id),
    queryFn: () => getProfilesByEnterpriseId(currentUser.profile.enterprise!.id),
  });

  const onMailTaskClick = useCallback(
    (original: TaskResponseDto) => {
      queryClient.setQueryData(taskQueryKeys.detailById(original.id), original);
      navigate({ from: Route.id, to: './task-email/$taskId', params: { taskId: original.id }, search: (old) => old });
    },
    [queryClient, navigate],
  );

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
              <button onClick={() => onMailTaskClick(original)}>
                <div dangerouslySetInnerHTML={{ __html: original.content! }} />
                <p className="text-secondary">A : {original.receiver?.to?.toString().split(';').join(' ')}</p>
                <p>
                  De :{' '}
                  <a onClick={(e) => e.stopPropagation()} href={`mailto:${original.name}`}>
                    {original.name}
                  </a>
                </p>
              </button>
            );
          else {
            const sender = members?.find((member) => member.id === original.senderId);
            item = (
              <>
                <div dangerouslySetInnerHTML={{ __html: original.content! }} />
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
          return <div className={styles.content_tooltip}>{item}</div>;
        },
      }),
      columnHelper.display({
        header: 'Objet',
        cell: () => {
          // TODO: reimplement following links
          //   if (original.businessId) return <Link to={`/app/business/get-business/${original.businessId}`}>{original.businessNum}</Link>;
          //   if (original.rmaId) return <Link to={`/app/rma/get-rma/${original.rmaId}`}>{original.rmaNum}</Link>;
          //   if (original.enterpriseId) return <Link to={`/app/enterprises/get-enterprise/${original.enterpriseId}`}>{original.enterpriseName}</Link>;
          //   if (original.productId) return <Link to={`/app/products/get-product/${original.productId}`}>{original.reference}</Link>;
          return 'Non relié';
        },
      }),
    ],
    [currentUser.profile.id, members, onMailTaskClick],
  );

  const { mutate: readTaskMutate } = useMutation({
    mutationFn: (task: TaskResponseDto) => markTaskAsRead(task),
    onMutate: (task) => {
      const newTask = { ...task, taskOpened: true };
      queryClient.setQueriesData<Page<TaskResponseDto>>({ queryKey: taskQueryKeys.pages() }, (old) =>
        old ? { ...old, content: old?.content.map((t) => (t.id === task.id ? newTask : t)) } : old,
      );
      queryClient.setQueriesData<Array<TaskResponseDto>>({ queryKey: taskQueryKeys.lists() }, (old) => old?.map((t) => (t.id === task.id ? newTask : t)));
      queryClient.setQueriesData<TaskResponseDto>({ queryKey: taskQueryKeys.details() }, (old) => (old?.id === task.id ? newTask : old));
    },
    onError: (error, task) => {
      queryClient.setQueriesData<Page<TaskResponseDto>>({ queryKey: taskQueryKeys.pages() }, (old) =>
        old ? { ...old, content: old?.content.map((t) => (t.id === task.id ? { ...t, taskOpened: false } : t)) } : old,
      );
      queryClient.setQueriesData<Array<TaskResponseDto>>({ queryKey: taskQueryKeys.lists() }, (old) =>
        old?.map((t) => (t.id === task.id ? { ...t, taskOpened: false } : t)),
      );
      queryClient.setQueriesData<TaskResponseDto>({ queryKey: taskQueryKeys.details() }, (old) => (old?.id === task.id ? { ...old, taskOpened: false } : old));

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
        <TableComponent columns={columns} data={data?.content} isLoading={isLoading} onRowClick={onRowClick} onRowContextMenu={onRowContextMenu} rowId={'id'} />
      </div>
      <AppViewDashboardViewPersonalTasksComponentPersonalTasksComponentTableComponentContextMenuComponent
        anchor={contextMenuAnchor}
        setAnchor={setContextMenuAnchor}
        task={task}
      />
    </>
  );
}