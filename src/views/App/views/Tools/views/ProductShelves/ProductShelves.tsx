import { useQuery } from '@tanstack/react-query';
import { Link, Outlet, getRouteApi } from '@tanstack/react-router';
import { queries } from '../../../../../../utils/constants/queryKeys';
import { createColumnHelper } from '@tanstack/react-table';
import ProductShelfResponseDto from '../../../../../../utils/types/ProductShelfResponseDto';
import TableComponent from '../../../../../../components/Table/Table';
import styles from './ProductShelves.module.scss';
import PaginationComponent from '../../../../../../components/Pagination/Pagination';
import { FaTrash } from 'react-icons/fa';

const routeApi = getRouteApi('/app/tools/product-shelves');

const size = 15;

const columnHelper = createColumnHelper<ProductShelfResponseDto>();
const columns = [
  columnHelper.display({
    header: 'Nom',
    cell: ({ row: { original } }) => original.number,
  }),
  columnHelper.display({
    header: 'Note',
    cell: ({ row: { original } }) => original.note,
  }),
  columnHelper.display({
    id: 'actions',
    cell: ({ row: { original } }) => (
      <Link from={routeApi.id} to="delete/$productShelfId" params={{ productShelfId: original.id }} search={(old) => old} replace>
        <FaTrash color="#F24C52" />
      </Link>
    ),
  }),
];

export default function AppViewToolsViewProductShelvesView() {
  const { page } = routeApi.useSearch();

  const { data, isLoading } = useQuery(queries['product-shelves'].page._ctx.all({ page, size }));

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.buttons_container}>
            <Link from={routeApi.id} to="create" search={(old) => old} replace className="btn btn-secondary">
              Ajouter
            </Link>
          </div>

          <div className={styles.table_container}>
            <TableComponent columns={columns} data={data?.content} isLoading={isLoading} />
            <PaginationComponent page={page} totalPages={data?.totalPages} pageLink={(page) => ({ from: routeApi.id, search: (old) => ({ ...old, page }), replace: true })} />
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
}
