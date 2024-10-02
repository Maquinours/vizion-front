import { Row, createColumnHelper } from '@tanstack/react-table';
import FaqResponseDto from '../../../../../../utils/types/FaqResponseDto';
import TableRowExpandButtonComponent from '../../../../../../components/TableRowExpandButton/TableRowExpandButton';
import TableComponent from '../../../../../../components/Table/Table';
import styles from './Table.module.scss';
import AppViewFaqViewTableComponentSubRowComponent from './components/SubRowComponent/SubRowComponent';
import { useCallback, useState } from 'react';
import { VirtualElement } from '@popperjs/core';
import AppViewFaqViewTableComponentContextMenuComponent from './components/ContextMenu/ContextMenu';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import { Link } from '@tanstack/react-router';

const columnHelper = createColumnHelper<FaqResponseDto>();
const columns = [
  columnHelper.display({
    id: 'expand',
    cell: ({ row }) => <TableRowExpandButtonComponent row={row} />,
  }),
  columnHelper.display({
    header: 'Problème',
    cell: ({ row }) => parse(DOMPurify.sanitize(row.original.title)),
  }),
  //   columnHelper.display({ // TODO: reimplement this with a link
  //     header: 'Fichiers associés',
  //     cell: ({ row }) => (
  //       <div style={{ cursor: 'pointer' }} onClick={() => openGed(row.original)}>
  //         0 fichier associé
  //       </div>
  //     ),
  //   }),
  columnHelper.display({
    header: 'Produits',
    cell: ({ row: { original } }) => (
      <div className="flex flex-col items-center">
        {original.products?.map((product) => (
          <Link to="/app/products/$productId" params={{ productId: product.id }} className="w-fit">
            {product.reference}
          </Link>
        ))}
      </div>
    ),
  }),
  columnHelper.display({
    header: 'Niveau',
    cell: ({ row }) => row.original.accessLevel,
  }),
  columnHelper.display({
    id: 'scrollbar_compensator',
  }),
];

type AppViewFaqViewTableComponentProps = Readonly<{
  data: Array<FaqResponseDto> | undefined;
  isLoading: boolean;
}>;
export default function AppViewFaqViewTableComponent({ data, isLoading }: AppViewFaqViewTableComponentProps) {
  const [contextMenuAnchor, setContextMenuAnchor] = useState<VirtualElement>();
  const [faq, setFaq] = useState<FaqResponseDto>();

  const onRowContextMenu = useCallback((e: React.MouseEvent, row: Row<FaqResponseDto>) => {
    e.preventDefault();
    setFaq(row.original);
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
      <div className={styles.table_container}>
        <TableComponent
          columns={columns}
          data={data}
          isLoading={isLoading}
          getRowCanExpand={() => true}
          renderSubComponent={AppViewFaqViewTableComponentSubRowComponent}
          onRowContextMenu={onRowContextMenu}
        />
      </div>
      <AppViewFaqViewTableComponentContextMenuComponent anchorElement={contextMenuAnchor} setAnchorElement={setContextMenuAnchor} faq={faq} />
    </>
  );
}
