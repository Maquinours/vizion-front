import { createColumnHelper } from '@tanstack/react-table';
import TableComponent from '../../../../../../components/Table/Table';
import styles from './ProductFilters.module.scss';
import AdvancedProductSpecificationResponseDto from '../../../../../../utils/types/AdvancedProductSpecificationResponseDto';
import { HiPencilAlt } from 'react-icons/hi';
import { FaTrash } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../utils/constants/queryKeys';
import PaginationComponent from '../../../../../../components/Pagination/Pagination';
import { Link, Outlet, getRouteApi } from '@tanstack/react-router';

const routeApi = getRouteApi('/app/tools/product-filters');

const size = 20;

const columnHelper = createColumnHelper<AdvancedProductSpecificationResponseDto>();
const columns = [
  columnHelper.display({
    header: 'Nom',
    cell: ({ row: { original } }) => original.name,
  }),
  columnHelper.display({
    header: 'Description',
    cell: ({ row: { original } }) => original.type,
  }),
  columnHelper.display({
    header: 'Unité',
    cell: ({ row: { original } }) => original.unit,
  }),
  columnHelper.display({
    header: 'Note',
    cell: ({ row: { original } }) => original.comment,
  }),
  columnHelper.display({
    id: 'actions',
    cell: ({ row: { original } }) => (
      <div className={styles.action_buttons}>
        <Link from={routeApi.id} to="update/$productFilterId" params={{ productFilterId: original.id }} search replace resetScroll={false}>
          <HiPencilAlt color="#31385A" />
        </Link>
        <Link from={routeApi.id} to="delete/$productFilterId" params={{ productFilterId: original.id }} search replace resetScroll={false}>
          <FaTrash color="#F24C52" />
        </Link>
      </div>
    ),
  }),
];

export default function AppViewToolsViewProductFiltersView() {
  const { page } = routeApi.useSearch();

  const { data, isLoading } = useQuery(queries['product-filter'].page._ctx.all({ page, size }));

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.buttons_container}>
            <Link from={routeApi.id} to="create" search replace resetScroll={false} className="btn btn-secondary">
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
