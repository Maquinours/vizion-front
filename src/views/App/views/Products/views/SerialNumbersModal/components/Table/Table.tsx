import { createColumnHelper } from '@tanstack/react-table';
import ProductSerialNumberResponseDto from '../../../../../../../../utils/types/ProductSerialNumberResponseDto';
import { IoMdTrash } from 'react-icons/io';
import { MdBusinessCenter } from 'react-icons/md';
import { Link, getRouteApi } from '@tanstack/react-router';
import TableComponent from '../../../../../../../../components/Table/Table';
import styles from './Table.module.scss';

const routeApi = getRouteApi('/app/products/serial-numbers');

const columnHelper = createColumnHelper<ProductSerialNumberResponseDto>();
const columns = [
  columnHelper.display({
    header: 'Nr de série',
    cell: ({ row: { original } }) => original.serialNumber,
  }),
  columnHelper.display({
    header: 'Produit',
    cell: ({ row: { original } }) => original.productRef,
  }),
  columnHelper.display({
    header: 'Version',
    cell: ({ row: { original } }) => original.productVersionRef,
  }),
  columnHelper.display({
    header: 'Affaire',
    cell: ({ row: { original } }) =>
      !!original.businessNumber &&
      !!original.businessId && (
        <Link to="/app/businesses-rma/business/$businessId" params={{ businessId: original.businessId }}>
          {original.businessNumber}
        </Link>
      ),
  }),
  columnHelper.display({
    header: 'Avec Fournisseur',
    cell: ({ row: { original } }) =>
      !!original.providerBusinessNumber &&
      !!original.providerBusinessId && (
        <Link to="/app/businesses-rma/business/$businessId" params={{ businessId: original.providerBusinessId }}>
          {original.providerBusinessNumber}
        </Link>
      ),
  }),
  columnHelper.display({
    id: 'actions',
    cell: ({ row: { original } }) => (
      <div style={{ display: 'flex' }}>
        {!original.businessId && !original.businessNumber && (
          <Link from={routeApi.id} to="delete/$serialNumberId" params={{ serialNumberId: original.id }} search={(old) => old} replace>
            <IoMdTrash size={20} />
          </Link>
        )}
        {original.businessNumber?.startsWith('VZO ') && (
          <Link from={routeApi.id} to="create-rma/$serialNumberId" params={{ serialNumberId: original.id }} search={(old) => old} replace>
            <MdBusinessCenter size={20} />
          </Link>
        )}
      </div>
    ),
  }),
];

type AppViewProductsViewSerialNumbersModalViewTableComponentProps = Readonly<{
  data: Array<ProductSerialNumberResponseDto> | undefined;
  isLoading: boolean;
}>;
export default function AppViewProductsViewSerialNumbersModalViewTableComponent({
  data,
  isLoading,
}: AppViewProductsViewSerialNumbersModalViewTableComponentProps) {
  return (
    <div className={styles.table_container}>
      <TableComponent columns={columns} data={data} isLoading={isLoading} />
    </div>
  );
}
