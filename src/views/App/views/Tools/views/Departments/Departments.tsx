import { Link, Outlet, getRouteApi } from '@tanstack/react-router';
import PaginationComponent from '../../../../../../components/Pagination/Pagination';
import { useQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../utils/constants/queryKeys';
import { createColumnHelper } from '@tanstack/react-table';
import DepartmentResponseDto from '../../../../../../utils/types/DepartmentResponseDto';
import styles from './Departments.module.scss';
import TableComponent from '../../../../../../components/Table/Table';
import { HiPencilAlt } from 'react-icons/hi';
import { FaTrash } from 'react-icons/fa';

const routeApi = getRouteApi('/app/tools/departments');

const size = 15;

const columnHelper = createColumnHelper<DepartmentResponseDto>();
const columns = [
  columnHelper.display({ header: 'Nom', cell: ({ row: { original } }) => original.name }),
  columnHelper.display({ header: 'Code', cell: ({ row: { original } }) => original.code }),
  columnHelper.display({
    header: 'Actions',
    cell: ({ row: { original } }) => (
      <div className={styles.action_buttons}>
        <Link from={routeApi.id} to="update/$departmentId" params={{ departmentId: original.id }} search={(old) => old} replace resetScroll={false}>
          <HiPencilAlt width="18" height="18" color="#31385A" />
        </Link>
        <Link from={routeApi.id} to="delete/$departmentId" params={{ departmentId: original.id }} search={(old) => old} replace resetScroll={false}>
          <FaTrash width="18" height="18" color="#F24C52" />
        </Link>
      </div>
    ),
  }),
];

export default function AppViewToolsViewDepartmentsView() {
  const { page } = routeApi.useSearch();

  const { data, isLoading } = useQuery(queries.departments.page({ page, size }));

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.buttons_container}>
            <Link from={routeApi.id} to="create" search={(old) => old} replace resetScroll={false} className="btn btn-secondary">
              Ajouter
            </Link>
          </div>

          <div className={styles.table_container}>
            <TableComponent columns={columns} data={data?.content} isLoading={isLoading} />
          </div>
          <div className={styles.pagination}>
            <PaginationComponent
              page={page}
              totalPages={data?.totalPages}
              pageLink={(page) => ({ search: (old) => ({ ...old, page }), replace: true, resetScroll: false })}
            />
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
}
