import { Row, createColumnHelper } from '@tanstack/react-table';
import AmountFormat from '../../../../../../../../../../components/AmountFormat/AmountFormat';
import AdvancedProductSpecificationProductResponseDto from '../../../../../../../../../../utils/types/AdvancedProductSpecificationProductResponseDto';
import TableComponent from '../../../../../../../../../../components/Table/Table';
import styles from './Table.module.scss';
import { useCallback, useState } from 'react';
import { VirtualElement } from '@popperjs/core';
import AppViewProductViewManageViewSpecificationsComponentTableComponentContextMenuComponent from './ContextMenu/ContextMenu';

const columnHelper = createColumnHelper<AdvancedProductSpecificationProductResponseDto>();
const columns = [
  columnHelper.display({ header: 'Nom', cell: ({ row: { original } }) => original.specification?.name }),
  columnHelper.display({
    header: 'Valeur',
    cell: ({ row: { original } }) => <AmountFormat value={original.value} suffix={' ' + original.specification?.unit?.toLowerCase()} />,
  }),
  columnHelper.display({
    header: 'Maximum',
    cell: ({ row: { original } }) => <AmountFormat value={original.maxValue} suffix={' ' + original.specification?.unit?.toLowerCase()} />,
  }),
  columnHelper.display({
    header: 'Minimum',
    cell: ({ row: { original } }) => <AmountFormat value={original.minValue} suffix={' ' + original.specification?.unit?.toLowerCase()} />,
  }),
];

type AppViewProductViewManageViewProductViewSpecificationsComponentTableComponentProps = Readonly<{
  isLoading: boolean;
  data: Array<AdvancedProductSpecificationProductResponseDto> | undefined;
}>;
export default function AppViewProductViewManageViewSpecificationsComponentTableComponent({
  isLoading,
  data,
}: AppViewProductViewManageViewProductViewSpecificationsComponentTableComponentProps) {
  const [productSpecification, setProductSpecification] = useState<AdvancedProductSpecificationProductResponseDto>();
  const [contextMenuAnchor, setContextMenuAnchor] = useState<VirtualElement | undefined>();

  const onRowContextMenu = useCallback((e: React.MouseEvent, row: Row<AdvancedProductSpecificationProductResponseDto>) => {
    e.preventDefault();
    setProductSpecification(row.original);
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
  }, []);

  return (
    <>
      <div className={styles.container}>
        <TableComponent isLoading={isLoading} data={data} columns={columns} rowId="id" onRowContextMenu={onRowContextMenu} />
      </div>
      <AppViewProductViewManageViewSpecificationsComponentTableComponentContextMenuComponent
        anchorElement={contextMenuAnchor}
        setAnchorElement={setContextMenuAnchor}
        productSpecification={productSpecification}
      />
    </>
  );
}
