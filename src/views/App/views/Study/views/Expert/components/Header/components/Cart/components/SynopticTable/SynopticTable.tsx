import { createColumnHelper } from '@tanstack/react-table';
import ProductResponseDto from '../../../../../../../../../../../../utils/types/ProductResponseDto';
import TableComponent from '../../../../../../../../../../../../components/Table/Table';
import AmountFormat from '../../../../../../../../../../../../components/AmountFormat/AmountFormat';
import classNames from 'classnames';
import CurrencyFormat from '../../../../../../../../../../../../components/CurrencyFormat/CurrencyFormat';

const columnHelper = createColumnHelper<{ product: ProductResponseDto; quantity: number } | { quantity: number; price: number }>();
const columns = [
  columnHelper.display({
    id: 'image',
    cell: ({ row: { original } }) =>
      'product' in original && (
        <div className="flex justify-center">
          <img src={`https://bd.vizeo.eu/6-Photos/${original.product.reference}/${original.product.reference}.jpg`} width={48} height={48} />
        </div>
      ),
  }),
  columnHelper.display({
    header: 'Référence',
    cell: ({ row: { original } }) => (
      <span
        className={classNames(
          'flex justify-center py-3.5 pl-4 pr-4 text-left text-sm text-black sm:pl-6 md:pl-4',
          'product' in original ? 'font-normal' : 'font-bold',
        )}
      >
        {'product' in original ? original.product.reference : 'TOTAL'}
      </span>
    ),
  }),
  columnHelper.display({
    header: 'Quantité',
    cell: ({ row: { original } }) => (
      <AmountFormat
        value={original.quantity}
        className={classNames(
          'flex justify-center px-3 py-3.5 text-left text-sm font-semibold text-black',
          'product' in original ? 'font-normal' : 'font-bold',
        )}
      />
    ),
  }),
  columnHelper.display({
    header: 'Prix',
    cell: ({ row: { original } }) =>
      'product' in original && (
        <CurrencyFormat value={original.product.publicPrice ?? 0} className="flex justify-center px-3 py-3.5 text-left text-sm font-normal text-black" />
      ),
  }),
  columnHelper.display({
    header: 'Total',
    cell: ({ row: { original } }) => (
      <AmountFormat
        value={'product' in original ? (original.product.publicPrice ?? 0) * original.quantity : original.price}
        className={classNames('flex justify-center px-3 py-3.5 text-left text-sm text-black', 'product' in original ? 'font-normal' : 'font-bold')}
      />
    ),
  }),
];

type AppViewStudyViewExpertViewHeaderComponentCartComponentSynopticTableComponentProps = Readonly<{
  data: Array<{ product: ProductResponseDto; quantity: number }>;
}>;
export default function AppViewStudyViewExpertViewHeaderComponentCartComponentSynopticTableComponent({
  data,
}: AppViewStudyViewExpertViewHeaderComponentCartComponentSynopticTableComponentProps) {
  const total = data.reduce(
    (acc: { quantity: number; price: number }, productData) => {
      acc.quantity += productData.quantity;
      acc.price += (productData.product.publicPrice ?? 0) * productData.quantity;
      return acc;
    },
    { quantity: 0, price: 0 },
  );
  return (
    <div>
      <TableComponent columns={columns} data={[...data, total]} isLoading={false} className="w-full divide-y divide-gray-300 text-black" />
    </div>
  );
}
