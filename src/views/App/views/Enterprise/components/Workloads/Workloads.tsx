import { useQuery } from '@tanstack/react-query';
import { taskQueryKeys } from '../../../../../../utils/constants/queryKeys/task';
import { getTasksPageByEnterpriseId } from '../../../../../../utils/api/task';
import { Link, getRouteApi } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import TaskResponseDto from '../../../../../../utils/types/TaskResponseDto';
import { formatDate } from '../../../../../../utils/functions/dates';
import styles from './Workloads.module.scss';
import CardComponent from '../../../../../../components/Card/Card';
import TableComponent from '../../../../../../components/Table/Table';

const Route = getRouteApi('/app/enterprises/$enterpriseId');

const page = 0;
const size = 100;

const columnHelper = createColumnHelper<TaskResponseDto>();
const columns = [
  columnHelper.display({
    header: 'Date',
    cell: ({ row: { original } }) => (original.deadline ? formatDate(original.deadline) : formatDate(original.modifiedDate)),
  }),
  columnHelper.display({
    header: 'Description',
    cell: ({ row: { original } }) => (
      <div className={styles.content_tooltip}>
        {original.mailId ? (
          <Link from={Route.id} to="./task-email/$taskId" search={(old) => old} params={(old) => ({ ...old, taskId: original.id })}>
            <div dangerouslySetInnerHTML={{ __html: original.content ?? '' }} />
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
            <div dangerouslySetInnerHTML={{ __html: original.content ?? '' }} />
            {original.enterpriseName && <div className={styles.content}>{original.enterpriseName}</div>}
          </>
        )}
      </div>
    ),
  }),
];

export default function AppViewEnterpriseViewWorkloadsComponent() {
  const { enterpriseId } = Route.useParams();

  const { data, refetch, isRefetching } = useQuery({
    queryKey: taskQueryKeys.pageByEnterpriseId(enterpriseId, page, size),
    queryFn: () => getTasksPageByEnterpriseId(enterpriseId, page, size),
  });

  return (
    <CardComponent title="Charge de l'entreprise" onReload={() => refetch()} isReloading={isRefetching}>
      <div className={styles.table_container}>
        <TableComponent<TaskResponseDto> columns={columns} data={data?.content ?? []} rowId="id" />
      </div>
    </CardComponent>
  );
}
