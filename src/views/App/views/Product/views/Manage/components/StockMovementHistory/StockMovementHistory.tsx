import { useQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import AmountFormat from '../../../../../../../../components/AmountFormat/AmountFormat';
import CardComponent from '../../../../../../../../components/Card/Card';
import PaginationComponent from '../../../../../../../../components/Pagination/Pagination';
import RefreshButtonComponent from '../../../../../../../../components/RefreshButton/RefreshButton';
import TableComponent from '../../../../../../../../components/Table/Table';
import { productStockEntriesQueryKeys } from '../../../../../../../../utils/constants/queryKeys/productStockEntries';
import { formatDateAndHourWithSlash } from '../../../../../../../../utils/functions/dates';
import ProductStockEntryResponseDto from '../../../../../../../../utils/types/ProductStockEntryResponseDto';
import styles from './StockMovementHistory.module.scss';

const routeApi = getRouteApi('/app/products_/$productId/manage');

const sizeOptions = [5, 10, 15, 20, 25, 30, 50, 100];

const columnHelper = createColumnHelper<ProductStockEntryResponseDto>();
const columns = [
  columnHelper.display({
    header: 'Date',
    cell: ({ row: { original } }) => formatDateAndHourWithSlash(original.createdDate),
  }),
  columnHelper.display({
    header: 'Libellé',
    cell: ({ row: { original } }) => original.libEntry,
  }),
  columnHelper.display({
    header: 'Opération',
    cell: ({ row: { original } }) => original.operationType,
  }),
  columnHelper.display({
    header: 'Avant',
    cell: ({ row: { original } }) => <AmountFormat value={original.stockBefore} />,
  }),
  columnHelper.display({
    header: '+/-',
    cell: ({ row: { original } }) => <AmountFormat value={original.stockEntry} />,
  }),
  columnHelper.display({
    header: 'Stock actuel',
    cell: ({ row: { original } }) => <AmountFormat value={original.currentStock} />,
  }),
  columnHelper.display({
    header: 'Affaire',
    cell: ({ row: { original } }) => original.numBusiness,
  }),
];

export default function AppViewProductViewManageViewStockMovementHistoryComponent() {
  const navigate = routeApi.useNavigate();

  const { productId } = routeApi.useParams();
  const { stockEntriesPage: page, stockEntriesSize: size } = routeApi.useSearch();

  const { data, isLoading, refetch, isRefetching } = useQuery(productStockEntriesQueryKeys.page._ctx.byProductId(productId, { page, size }));

  const onSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigate({
      search: (old) => ({ ...old, stockEntriesPage: 0, stockEntriesSize: Number(e.target.value) as 10 | 100 | 5 | 20 | 50 | 15 | 25 | 30 }),
      replace: true,
      resetScroll: false,
    });
  };

  return (
    <CardComponent title="Historique de mouvement de stock du produit">
      <div className={styles.container}>
        <div className={styles.button_container}>
          <RefreshButtonComponent className="btn btn-primary" style={{ marginLeft: '0.5rem' }} onRefresh={() => refetch()} isRefreshing={isRefetching} />
          <select defaultValue={5} value={size} onChange={onSizeChange} className={styles.size_select}>
            {sizeOptions.map((el) => (
              <option key={el} value={el}>
                {el}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.table}>
          <div className={styles.container}>
            <TableComponent data={data?.content} isLoading={isLoading} columns={columns} />
          </div>
          <div className={styles.pagination}>
            <PaginationComponent
              page={page}
              totalPages={data?.totalPages}
              pageLink={(page) => ({
                from: '/app/products/$productId/manage',
                search: (old) => ({ ...old, stockEntriesPage: page }),
                replace: true,
                resetScroll: false,
              })}
            />
          </div>
        </div>
      </div>
    </CardComponent>
  );
}
