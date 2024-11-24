import { VirtualElement } from '@popperjs/core';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, Link } from '@tanstack/react-router';
import { createColumnHelper, Row } from '@tanstack/react-table';
import { useState } from 'react';
import CardComponent from '../../../../../../../../components/Card/Card';
import TableComponent from '../../../../../../../../components/Table/Table';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { formatDateAndHourWithSlash } from '../../../../../../../../utils/functions/dates';
import ProductBomDetailsResponseDto from '../../../../../../../../utils/types/ProductBomDetailsResponseDto';
import AppViewProductViewManageViewNomenclatureComponentContextMenuComponent from './components/ContextMenu/ContextMenu';
import styles from './Nomenclature.module.scss';

const routeApi = getRouteApi('/app/products_/$productId/manage');

const columnHelper = createColumnHelper<ProductBomDetailsResponseDto>();

const columns = [
  columnHelper.display({
    header: 'Date',
    cell: ({ row: { original } }) => <span>{formatDateAndHourWithSlash(original.createdDate)}</span>,
  }),
  columnHelper.display({
    header: 'Produit',
    cell: ({ row: { original } }) => <span>{original.product?.reference ?? ''}</span>,
  }),
  columnHelper.display({
    header: 'Quantité',
    cell: ({ row: { original } }) => <span>{original.qte}</span>,
  }),
];

export default function AppViewProductViewManageViewNomenclatureComponent() {
  const { productId } = routeApi.useParams();

  const { data } = useSuspenseQuery({ ...queries.product.detail(productId), select: (data) => data.productBOMDetails ?? [] });

  const [contextMenuData, setContextMenuData] = useState<{ anchor: VirtualElement; item: ProductBomDetailsResponseDto }>();

  const onRowContextMenu = (e: React.MouseEvent, row: Row<ProductBomDetailsResponseDto>) => {
    e.preventDefault();
    setContextMenuData({
      anchor: {
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
      },
      item: row.original,
    });
  };

  return (
    <>
      <CardComponent title="Nomenclature">
        <div className={styles.container}>
          <div className={styles.button_container}>
            <Link
              from="/app/products/$productId/manage"
              to="add-nomenclature-detail"
              search
              replace
              resetScroll={false}
              preload="intent"
              className="btn btn-primary"
            >
              Ajouter un produit constitutif
            </Link>
          </div>
          <div className={styles.table}>
            <div className={styles.container}>
              <TableComponent isLoading={false} data={data} columns={columns} onRowContextMenu={onRowContextMenu} />
            </div>
          </div>
        </div>
      </CardComponent>
      <AppViewProductViewManageViewNomenclatureComponentContextMenuComponent
        anchorElement={contextMenuData?.anchor}
        item={contextMenuData?.item}
        onClose={() => setContextMenuData(undefined)}
      />
    </>
  );
}
