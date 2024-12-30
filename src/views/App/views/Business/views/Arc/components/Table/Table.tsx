import { VirtualElement } from '@popperjs/core';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { Row, createColumnHelper } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import AmountFormat from '../../../../../../../../components/AmountFormat/AmountFormat';
import CurrencyFormat from '../../../../../../../../components/CurrencyFormat/CurrencyFormat';
import TableComponent from '../../../../../../../../components/Table/Table';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import BusinessArcDetailsResponseDto from '../../../../../../../../utils/types/BusinessArcDetailsResponseDto';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';
import styles from './Table.module.scss';
import AppViewBusinessViewArcViewTableComponentContextMenuComponent from './components/ContextMenu/ContextMenu';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/arc');

const columnHelper = createColumnHelper<BusinessArcDetailsResponseDto>();

export default function AppViewBusinessViewArcViewTableComponent() {
  const { businessId } = routeApi.useParams();
  const { hideReferencesPrices } = routeApi.useSearch();

  const { data: user } = useAuthentifiedUserQuery();
  const { data: arc } = useSuspenseQuery(queries['business-ARCs'].detail._ctx.byBusinessId(businessId));
  const { data: stocks } = useQuery(queries['product-stocks'].list._ctx.all);

  const [contextMenuAnchor, setContextMenuAnchor] = useState<VirtualElement>();
  const [item, setItem] = useState<BusinessArcDetailsResponseDto>();

  const columns = useMemo(
    () => [
      columnHelper.display({
        header: 'Image',
        cell: ({ row: { original } }) => (
          <div className="flex h-full w-full items-center justify-center">
            <img src={`https://bd.vizeo.eu/6-Photos/${original.productReference}/MINI_${original.productReference}.jpg`} alt={original.productReference} />
          </div>
        ),
      }),
      columnHelper.display({
        header: 'Référence',
        cell: ({ row: { original } }) => !hideReferencesPrices && <p>{original.productReference}</p>,
      }),
      columnHelper.display({
        header: 'Désignation',
        cell: ({ row: { original } }) => <p>{original.productDesignation}</p>,
      }),
      columnHelper.display({
        header: 'Quantité',
        cell: ({ row: { original } }) => <p>{original.quantity}</p>,
      }),
      columnHelper.display({
        header: 'Stock ce jour',
        cell: ({ row: { original } }) => {
          const stock = stocks?.find((stock) => stock.productId === original.productId);
          return !stock?.virtualQty && !stock?.bom && <p>{stock?.currentStock}</p>;
        },
      }),
      columnHelper.display({
        header: 'Prix',
        cell: ({ row: { original } }) =>
          user.userInfo.roles.some((role) => ['ROLE_MEMBRE_VIZEO', 'ROLE_REPRESENTANT'].includes(role)) &&
          !hideReferencesPrices && <CurrencyFormat value={original.publicUnitPrice} />,
      }),
      columnHelper.display({
        header: 'Remise',
        cell: ({ row: { original } }) =>
          user.userInfo.roles.some((role) => ['ROLE_MEMBRE_VIZEO', 'ROLE_REPRESENTANT_VIZEO'].includes(role)) && (
            <AmountFormat value={original.reduction} decimalScale={0} suffix="%" displayType="text" />
          ),
      }),
      columnHelper.display({
        header: 'Prix unitaire',
        cell: ({ row: { original } }) => !hideReferencesPrices && <CurrencyFormat value={original.unitPrice} />,
      }),
      columnHelper.display({
        header: 'Montant',
        cell: ({ row: { original } }) => <CurrencyFormat value={original.totalPrice} />,
      }),
    ],
    [user, hideReferencesPrices, stocks],
  );

  const onRowContextMenu = (e: React.MouseEvent, row: Row<BusinessArcDetailsResponseDto>) => {
    e.preventDefault();
    setItem(row.original);
    setContextMenuAnchor({
      getBoundingClientRect: () => ({
        width: 0,
        height: 0,
        x: e.clientX,
        y: e.clientY,
        top: e.clientY,
        right: e.clientX,
        bottom: e.clientY,
        left: e.clientX,
        toJSON: () => {},
      }),
    });
  };

  return (
    <>
      <div className={styles.table_container}>
        <TableComponent columns={columns} data={arc.arcDetailsList ?? undefined} isLoading={false} onRowContextMenu={onRowContextMenu} />
      </div>
      <AppViewBusinessViewArcViewTableComponentContextMenuComponent anchorElement={contextMenuAnchor} setAnchorElement={setContextMenuAnchor} item={item} />
    </>
  );
}
