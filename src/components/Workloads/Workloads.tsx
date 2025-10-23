import { useQuery } from '@tanstack/react-query';
import { Link, LinkProps } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import { JSX, useMemo } from 'react';
import { queries } from '../../utils/constants/queryKeys';
import { WorkloadAssociatedItem } from '../../utils/enums/WorkloadAssociatedItem';
import { formatDate } from '../../utils/functions/dates';
import TaskResponseDto from '../../utils/types/TaskResponseDto';
import CardComponent from '../Card/Card';
import TableComponent from '../Table/Table';
import styles from './Workloads.module.scss';
import { FaTrash } from 'react-icons/fa';

const columnHelper = createColumnHelper<TaskResponseDto>();

const page = 0;
const size = 100;

type WorkloadsComponentProps = Readonly<{
  associatedItemType: WorkloadAssociatedItem;
  associatedItemId: string;
  emailLink?: (data: TaskResponseDto) => LinkProps;
  onEmailClick?: (data: TaskResponseDto) => void;
  unlinkLink?: (data: TaskResponseDto) => LinkProps;
  onUnlinkClick?: (data: TaskResponseDto) => void;
}>;
export default function WorkloadsComponent({
  associatedItemType,
  associatedItemId,
  emailLink,
  onEmailClick,
  unlinkLink,
  onUnlinkClick,
}: WorkloadsComponentProps) {
  const { data, refetch, isRefetching } = useQuery(queries.tasks.page._ctx.byAssociatedItem({ associatedItemType, associatedItemId }, { page, size }));

  const columns = useMemo(
    () => [
      columnHelper.display({
        header: 'Date',
        cell: ({ row: { original } }) => {
          if (original.mailId) {
            const subChildren = original.deadline ? formatDate(original.deadline) : formatDate(original.modifiedDate);
            if (emailLink)
              return (
                <Link {...emailLink(original)} preload="intent">
                  {subChildren}
                </Link>
              );
            else if (onEmailClick)
              return (
                <button
                  type="button"
                  onClick={() => {
                    onEmailClick(original);
                  }}
                >
                  {subChildren}
                </button>
              );
            else throw new Error('emailLink or onEmailClick must be defined');
          } else if (original.deadline) return formatDate(original.deadline);
          else return formatDate(original.modifiedDate);
        },
        // original.mailId ? (
        //   <Link {...emailLink(original)} preload="intent">
        //     {original.deadline ? formatDate(original.deadline) : formatDate(original.modifiedDate)}
        //   </Link>
        // ) : original.deadline ? (
        //   formatDate(original.deadline)
        // ) : (
        //   formatDate(original.modifiedDate)
        // ),
      }),
      columnHelper.display({
        header: 'Description',
        cell: ({ row: { original } }) => {
          let children: JSX.Element;
          if (original.mailId) {
            children = (() => {
              const subChildren = (
                <>
                  {parse(DOMPurify.sanitize(original.content ?? ''))}
                  <p className="text-secondary">
                    À : {original.receiver?.to?.toString()?.split(';').join(' ')} {original.receiver?.cc?.toString()}
                  </p>
                  <p>De : {original.name}</p>
                </>
              );

              if (emailLink) {
                return (
                  <Link {...emailLink(original)} preload="intent">
                    {subChildren}
                  </Link>
                );
              } else if (onEmailClick) {
                return (
                  <button
                    type="button"
                    onClick={() => {
                      onEmailClick(original);
                    }}
                  >
                    {subChildren}
                  </button>
                );
              } else throw new Error('emailLink or onEmailClick must be defined');
            })();
          } else {
            children = (
              <>
                <div className="ql-editor">{parse(DOMPurify.sanitize(original.content ?? ''))}</div>
                {original.enterpriseName && <div className={styles.content}>{original.enterpriseName}</div>}
              </>
            );
          }
          return <div className={styles.content_tooltip}>{children}</div>;
        },
        // (
        //   <div className={styles.content_tooltip}>
        //     {original.mailId ? (
        //       <Link {...emailLink(original)} preload="intent">
        //         {parse(DOMPurify.sanitize(original.content ?? ''))}
        //         <p className="text-secondary">
        //           À : {original.receiver?.to?.toString()?.split(';').join(' ')} {original.receiver?.cc?.toString()}
        //         </p>
        //         <p>De : {original.name}</p>
        //       </Link>
        //     ) : (
        //       <>
        //         <div className="ql-editor">{parse(DOMPurify.sanitize(original.content ?? ''))}</div>
        //         {original.enterpriseName && <div className={styles.content}>{original.enterpriseName}</div>}
        //       </>
        //     )}
        //   </div>
        // ),
      }),
      columnHelper.display({
        id: 'actions',
        cell: ({ row: { original } }) => {
          const subChildren = <FaTrash width={16} height={16} color={'#F24C52'} />;
          let children: JSX.Element;
          if (unlinkLink)
            children = (
              <Link {...unlinkLink(original)} preload="intent">
                {subChildren}
              </Link>
            );
          else if (onUnlinkClick)
            children = (
              <button type="button" onClick={() => onUnlinkClick(original)}>
                {subChildren}
              </button>
            );
          else throw new Error('unlinkLink or onUnlinkClick must be defined');

          return <div className={styles.actions}>{children}</div>;
        },
        // (
        //   <div className={styles.actions}>
        //     <Link {...unlinkLink(original)} preload="intent">
        //       <FaTrash width={16} height={16} color={'#F24C52'} />
        //     </Link>
        //   </div>
        // ),
      }),
    ],
    [emailLink, unlinkLink],
  );

  return (
    <CardComponent title="Documents liés" onReload={() => refetch()} isReloading={isRefetching}>
      <div className={styles.table_container}>
        <TableComponent columns={columns} data={data?.content} rowId="id" />
      </div>
    </CardComponent>
  );
}
