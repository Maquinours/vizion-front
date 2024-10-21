import { useSuspenseQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { InternalNode, ReactFlowState, useStore } from '@xyflow/react';
import classNames from 'classnames';
import { isEqual } from 'lodash';
import { useMemo } from 'react';
import AmountFormat from '../../../../../../../../../../../../components/AmountFormat/AmountFormat';
import CurrencyFormat from '../../../../../../../../../../../../components/CurrencyFormat/CurrencyFormat';
import TableComponent from '../../../../../../../../../../../../components/Table/Table';
import { queries } from '../../../../../../../../../../../../utils/constants/queryKeys';
import ProductResponseDto from '../../../../../../../../../../../../utils/types/ProductResponseDto';
import { ExpertStudyMonitorNode } from '../../../../../Flow/components/MonitorNode/MonitorNode';
import { ExpertStudyRecorderNode } from '../../../../../Flow/components/RecorderNode/RecorderNode';
import { ExpertStudyMiscProductNode } from '../../../../../Flow/components/MiscProductNode/MiscProductNode';
import { ExpertStudySynopticCameraNode } from '../../../../../Flow/components/SynopticCameraNode/SynopticCameraNode';
import { ExpertStudyTransmitterNode } from '../../../../../Flow/components/TransmitterNode/TransmitterNode';

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
      <CurrencyFormat
        value={'product' in original ? (original.product.publicPrice ?? 0) * original.quantity : original.price}
        className={classNames('flex justify-center px-3 py-3.5 text-left text-sm text-black', 'product' in original ? 'font-normal' : 'font-bold')}
      />
    ),
  }),
];

const selector = (state: ReactFlowState) => ({
  productsData: Array.from(state.nodeLookup.values())
    .filter(
      (
        node,
      ): node is InternalNode<
        ExpertStudySynopticCameraNode | ExpertStudyMonitorNode | ExpertStudyRecorderNode | ExpertStudyTransmitterNode | ExpertStudyMiscProductNode
      > => !!node.type && ['synopticCamera', 'monitor', 'recorder', 'transmitter', 'service'].includes(node.type),
    )
    .reduce((acc: Array<{ id: string; quantity: number }>, node) => {
      const product = acc.find((p) => p.id === node.data.productId);
      const quantity = 'quantity' in node.data && node.data.quantity !== undefined ? node.data.quantity : 1;
      if (!!product) product.quantity += quantity;
      else acc.push({ id: node.data.productId, quantity: quantity });
      if ('options' in node.data) {
        for (const option of node.data.options) {
          const product = acc.find((p) => p.id === option.id);
          if (!!product) product.quantity += option.quantity;
          else acc.push({ id: option.id, quantity: option.quantity });
        }
      }
      return acc;
    }, [])
    .filter((productData) => productData.quantity > 0),
});

export default function AppViewStudyViewExpertViewHeaderComponentCartComponentSynopticTableComponent() {
  const { productsData } = useStore(selector, (a, b) => isEqual(a, b));

  const { data: products } = useSuspenseQuery({ ...queries.product.list, staleTime: Infinity });

  const { data, total } = useMemo(() => {
    const data = productsData
      .map((productData) => ({ product: products.find((product) => product.id === productData.id), quantity: productData.quantity }))
      .filter((productData): productData is { product: ProductResponseDto; quantity: number } => !!productData.product);

    const total = data.reduce(
      (acc: { quantity: number; price: number }, productData) => {
        acc.quantity += productData.quantity;
        acc.price += (productData.product.publicPrice ?? 0) * productData.quantity;
        return acc;
      },
      { quantity: 0, price: 0 },
    );

    return { data, total };
  }, [productsData, products]);

  return (
    <div>
      <TableComponent columns={columns} data={[...data, total]} isLoading={false} className="w-full divide-y divide-gray-300 text-black" />
    </div>
  );
}
