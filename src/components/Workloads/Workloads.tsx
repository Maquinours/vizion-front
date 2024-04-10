import { useQuery } from '@tanstack/react-query';
import { Link, LinkProps } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import { useMemo } from 'react';
import { queries } from '../../utils/constants/queryKeys';
import { WorkloadAssociatedItem } from '../../utils/enums/WorkloadAssociatedItem';
import { formatDate } from '../../utils/functions/dates';
import TaskResponseDto from '../../utils/types/TaskResponseDto';
import CardComponent from '../Card/Card';
import TableComponent from '../Table/Table';
import styles from './Workloads.module.scss';

const columnHelper = createColumnHelper<TaskResponseDto>();

const page = 0;
const size = 100;

type WorkloadsComponentProps = Readonly<{
  associatedItemType: WorkloadAssociatedItem;
  associatedItemId: string;
  emailLink: (data: TaskResponseDto) => LinkProps;
}>;
export default function WorkloadsComponent({ associatedItemType, associatedItemId, emailLink }: WorkloadsComponentProps) {
  const { data, refetch, isRefetching } = useQuery(queries.tasks.page._ctx.byAssociatedItem({ associatedItemType, associatedItemId }, { page, size }));

  const columns = useMemo(
    () => [
      columnHelper.display({
        header: 'Date',
        cell: ({ row: { original } }) => (original.deadline ? formatDate(original.deadline) : formatDate(original.modifiedDate)),
      }),
      columnHelper.display({
        header: 'Description',
        cell: ({ row: { original } }) => (
          <div className={styles.content_tooltip}>
            {original.mailId ? (
              <Link {...emailLink(original)}>
                {parse(DOMPurify.sanitize(original.content ?? ''))}
                <p className="text-secondary">
                  À : {original.receiver?.to?.toString()?.split(';').join(' ')} {original.receiver?.cc?.toString()}
                </p>
                <p>
                  De :{' '}
                  <a onClick={(e) => e.stopPropagation()} href={`mailto:${original.name}`}>
                    {original.name}
                  </a>
                </p>
              </Link>
            ) : (
              <>
                {parse(DOMPurify.sanitize(original.content ?? ''))}
                {original.enterpriseName && <div className={styles.content}>{original.enterpriseName}</div>}
              </>
            )}
          </div>
        ),
      }),
    ],
    [emailLink],
  );

  const title = useMemo(() => {
    let title = 'Charges ';
    switch (associatedItemType) {
      case WorkloadAssociatedItem.ENTERPRISE:
        title += "de l'entreprise";
        break;
      case WorkloadAssociatedItem.PRODUCT:
        title += 'du produit';
        break;
    }
    return title;
  }, [associatedItemType]);

  return (
    <CardComponent title={title} onReload={() => refetch()} isReloading={isRefetching}>
      <div className={styles.table_container}>
        <TableComponent columns={columns} data={data?.content} rowId="id" />
      </div>
    </CardComponent>
  );
}
