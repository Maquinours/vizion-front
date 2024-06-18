import { VirtualElement } from '@popperjs/core';
import { useQuery } from '@tanstack/react-query';
import { Link, getRouteApi, useNavigate } from '@tanstack/react-router';
import { Row, createColumnHelper } from '@tanstack/react-table';
import classNames from 'classnames';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import React, { useCallback, useMemo, useState } from 'react';
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

const Route = getRouteApi('/app/dashboard/other-personal-tasks/$profileId');

const columnHelper = createColumnHelper<TaskResponseDto>();

type AppViewDashboardViewOtherPersonalTasksModalViewTableComponentProps = Readonly<{
  data: Page<TaskResponseDto> | undefined;
  isLoading: boolean;
}>;
export default function AppViewDashboardViewOtherPersonalTasksModalViewTableComponent({
  data,
  isLoading,
}: AppViewDashboardViewOtherPersonalTasksModalViewTableComponentProps) {
  const navigate = useNavigate();

  const [task, setTask] = useState<TaskResponseDto>();
  const [contextMenuAnchor, setContextMenuAnchor] = useState<VirtualElement>();

  const { data: currentUser } = useAuthentifiedUserQuery();

  const { data: members } = useQuery(queries.profiles.list._ctx.byEnterpriseId(currentUser.profile.enterprise!.id));

  const onMailTaskClick = useCallback(
    (original: TaskResponseDto) => {
      navigate({ from: Route.id, to: '../../task-email/$taskId', params: { taskId: original.id }, search: (old) => old });
    },
    [navigate],
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
                {parse(DOMPurify.sanitize(original.content ?? ''))}
                <p className="text-secondary">A : {original.receiver?.to?.toString().split(';').join(' ')}</p>
                <p>
                  De :{' '}
                  <a
                    onClick={(e) => {
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                    }}
                    href={`mailto:${original.name}`}
                    className="text-blue-600 underline visited:text-purple-600 hover:text-blue-800"
                  >
                    {original.name}
                  </a>
                </p>
              </button>
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
          return <div className={styles.content_tooltip}>{item}</div>;
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
    [currentUser.profile.id, members, onMailTaskClick],
  );

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
        <TableComponent columns={columns} data={data?.content} isLoading={isLoading} onRowContextMenu={onRowContextMenu} rowId={'id'} />
      </div>
      <AppViewDashboardViewPersonalTasksComponentPersonalTasksComponentTableComponentContextMenuComponent
        anchor={contextMenuAnchor}
        setAnchor={setContextMenuAnchor}
        task={task}
      />
    </>
  );
}
