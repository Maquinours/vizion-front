import { VirtualElement } from '@popperjs/core';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Row, createColumnHelper } from '@tanstack/react-table';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import _ from 'lodash';
import { useMemo, useState } from 'react';
import TableComponent from '../../../../../../components/Table/Table';
import TableRowExpandButtonComponent from '../../../../../../components/TableRowExpandButton/TableRowExpandButton';
import { queries } from '../../../../../../utils/constants/queryKeys';
import { formatDateAndHourWithSlash } from '../../../../../../utils/functions/dates';
import FaqResponseDto from '../../../../../../utils/types/FaqResponseDto';
import styles from './Table.module.scss';
import AppViewFaqViewTableComponentContextMenuComponent from './components/ContextMenu/ContextMenu';
import AppViewFaqViewTableComponentSubRowComponent from './components/SubRowComponent/SubRowComponent';

const columnHelper = createColumnHelper<FaqResponseDto>();

type AppViewFaqViewTableComponentProps = Readonly<{
  data: Array<FaqResponseDto> | undefined;
  isLoading: boolean;
}>;
export default function AppViewFaqViewTableComponent({ data, isLoading }: AppViewFaqViewTableComponentProps) {
  const [contextMenuAnchor, setContextMenuAnchor] = useState<VirtualElement>();
  const [faq, setFaq] = useState<FaqResponseDto>();

  const profileIds = useMemo(() => _.uniq(data?.map((faq) => faq.modifiedBy).filter((id): id is string => !!id) ?? []), [data]);

  const { data: profiles } = useQuery({
    ...queries.profiles.list._ctx.byIds(profileIds),
  });

  const columns = useMemo(
    () => [
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
              <Link
                key={product.id}
                to="/app/products/$productId"
                params={{ productId: product.id }}
                className="w-fit text-[var(--primary-color)] hover:text-[var(--secondary-color)]"
              >
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
        header: 'Concerné',
        cell: ({ row }) =>
          row.original.assistanceId && row.original.businessId ? (
            <Link
              to="/app/businesses-rma/business/$businessId/assistance/$assistanceId"
              params={{ businessId: row.original.businessId, assistanceId: row.original.assistanceId }}
              className="w-fit text-[var(--primary-color)] hover:text-[var(--secondary-color)]"
            >
              {row.original.assistanceName}
            </Link>
          ) : null,
      }),
      columnHelper.display({
        header: 'Dernière modification',
        cell: ({ row }) => {
          const profile = profiles?.find((profile) => profile.userId === row.original.modifiedBy);
          return `${formatDateAndHourWithSlash(row.original.modifiedDate)} ${profile ? `(${profile.firstName} ${profile.lastName})` : ''}`.trim();
        },
      }),
      columnHelper.display({
        id: 'scrollbar_compensator',
      }),
    ],
    [profiles],
  );

  const onRowContextMenu = (e: React.MouseEvent, row: Row<FaqResponseDto>) => {
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
  };

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
