import { createColumnHelper } from '@tanstack/react-table';
import ReactModal from 'react-modal';
import ProductVersionShelfStockEntryResponseDto from '../../../../../../../../utils/types/ProductVersionShelfStockEntryResponseDto';
import { formatDateAndHourWithSlash } from '../../../../../../../../utils/functions/dates';
import AmountFormat from '../../../../../../../../components/AmountFormat/AmountFormat';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { productVersionShelfStocksQueryKeys } from '../../../../../../../../utils/constants/queryKeys/productVersionShelfStock';
import { getProductVersionShelfStockById } from '../../../../../../../../utils/api/productVersionShelfStock';
import { productVersionShelfStockEntryQueryKeys } from '../../../../../../../../utils/constants/queryKeys/productVersionShelfStockEntry';
import { getProductVersionShelfStockEntriesPageByProductShelfStock } from '../../../../../../../../utils/api/productVersionShelfStockEntry';
import TableComponent from '../../../../../../../../components/Table/Table';
import PaginationComponent from '../../../../../../../../components/Pagination/Pagination';
import styles from './StockHistoryModal.module.scss';

const routeApi = getRouteApi('/app/products/$productId/manage/stock-history/$stockId');

const size = 5;

const columnHelper = createColumnHelper<ProductVersionShelfStockEntryResponseDto>();
const columns = [
  columnHelper.display({
    header: 'Date',
    cell: ({ row: { original } }) => <div>{formatDateAndHourWithSlash(original.createdDate)}</div>,
  }),
  columnHelper.display({ header: 'Libellé', cell: ({ row: { original } }) => original.libEntry }),
  columnHelper.display({ header: 'Opération', cell: ({ row: { original } }) => original.operationType }),
  columnHelper.display({ header: 'Avant', cell: ({ row: { original } }) => <AmountFormat value={original.stockBefore} /> }),
  columnHelper.display({ header: '+/-', cell: ({ row: { original } }) => <AmountFormat value={original.stockEntry} /> }),
  columnHelper.display({ header: 'Stock actuel', cell: ({ row: { original } }) => <AmountFormat value={original.currentStock} /> }),
  columnHelper.display({ header: 'Affaire', cell: ({ row: { original } }) => <p>{original.numBusiness}</p> }),
];

export default function AppViewProductViewManageViewStockHistoryModalView() {
  const navigate = useNavigate();

  const { stockId } = routeApi.useParams();
  const { stockHistoryPage: page } = routeApi.useSearch();

  const { data: stock } = useSuspenseQuery({
    queryKey: productVersionShelfStocksQueryKeys.detailById(stockId),
    queryFn: () => getProductVersionShelfStockById(stockId),
  });

  const { data, isLoading } = useQuery({
    queryKey: productVersionShelfStockEntryQueryKeys.pageByVersionShelfStockId(stockId, page, size),
    queryFn: () => getProductVersionShelfStockEntriesPageByProductShelfStock(stockId, page, size),
  });

  const onClose = () => {
    navigate({ from: routeApi.id, to: '../..', search: (old) => ({ ...old, stockHistoryPage: undefined }) });
  };

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.history_modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>
            Historique du stock de version {stock.versionReference} {"sur l'étagère "}
            {stock.productVersionShelf?.number}
          </h6>
        </div>

        <div className={styles.modal_table}>
          <TableComponent data={data?.content} isLoading={isLoading} columns={columns} rowId="id" />
        </div>
        <div className={styles.pagination}>
          <PaginationComponent
            page={page}
            totalPages={data?.totalPages}
            pageLink={(page) => ({ from: routeApi.id, search: (old) => ({ ...old, stockHistoryPage: page }), params: (old) => old })}
          />
        </div>

        <div className={styles.modal_buttons}>
          <button className="btn btn-secondary" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </ReactModal>
  );
}