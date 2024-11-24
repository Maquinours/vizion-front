import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import ReactModal from 'react-modal';
import AmountFormat from '../../../../../../../../components/AmountFormat/AmountFormat';
import PaginationComponent from '../../../../../../../../components/Pagination/Pagination';
import TableComponent from '../../../../../../../../components/Table/Table';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { formatDateAndHourWithSlash } from '../../../../../../../../utils/functions/dates';
import ProductVersionShelfStockEntryResponseDto from '../../../../../../../../utils/types/ProductVersionShelfStockEntryResponseDto';
import styles from './StockHistoryModal.module.scss';

const routeApi = getRouteApi('/app/products_/$productId/manage/stock-history/$stockId');
const routePath = '/app/products/$productId/manage/stock-history/$stockId';

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
  const navigate = routeApi.useNavigate();

  const { stockId } = routeApi.useParams();
  const { stockHistoryPage: page } = routeApi.useSearch();

  const { data: stock } = useSuspenseQuery(queries['product-version-shelf-stocks'].detail._ctx.byId(stockId));

  const { data, isLoading } = useQuery(queries['product-version-shelf-stock-entries'].page._ctx.byProductShelfStockId(stockId, { page, size }));

  const onClose = () => {
    navigate({ to: '../..', search: (old) => ({ ...old, stockHistoryPage: undefined }), replace: true, resetScroll: false });
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
            pageLink={(page) => ({ from: routePath, search: (old) => ({ ...old, stockHistoryPage: page }), params: (old) => old })}
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
