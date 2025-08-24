import { VirtualElement } from '@popperjs/core';
import { useQuery } from '@tanstack/react-query';
import { Link, LinkProps } from '@tanstack/react-router';
import { createColumnHelper, Row } from '@tanstack/react-table';
import classNames from 'classnames';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import { useMemo, useState } from 'react';
import { lifesheets } from '../../utils/constants/queryKeys/lifesheet';
import { LifesheetAssociatedItem } from '../../utils/enums/LifesheetAssociatedItem';
import { formatDateAndHourWithSlash } from '../../utils/functions/dates';
import LifeSheetResponseDto from '../../utils/types/LifeSheetResponseDto';
import CardComponent from '../Card/Card';
import PaginationComponent from '../Pagination/Pagination';
import RefreshButtonComponent from '../RefreshButton/RefreshButton';
import TableComponent from '../Table/Table';
import LifesheetComponentContextMenuComponent from './components/ContextMenu/ContextMenu';
import styles from './Lifesheet.module.scss';

const columnHelper = createColumnHelper<LifeSheetResponseDto>();

type LifesheetComponentProps = Readonly<{
  associatedItemType: LifesheetAssociatedItem;
  associatedItemId: string;
  page: number;
  size?: number;
  createLink?: LinkProps;
  onCreateClick?: () => void;
  pageLink?: (page: number) => LinkProps;
  onPageChange?: (page: number) => void;
  className?: string;
  getEmailLink?: (data: LifeSheetResponseDto) => LinkProps;
  getDeleteLink?: (data: LifeSheetResponseDto) => LinkProps;
  onDeleteClick?: (data: LifeSheetResponseDto) => void;
}>;
export default function LifesheetComponent({
  associatedItemType,
  associatedItemId,
  page,
  size = 5,
  createLink,
  onCreateClick,
  pageLink,
  onPageChange,
  className,
  getEmailLink,
  getDeleteLink,
  onDeleteClick,
}: LifesheetComponentProps) {
  const { data, isLoading, refetch, isRefetching } = useQuery(lifesheets.page({ page, size })._ctx.byAssociatedItem({ associatedItemType, associatedItemId }));

  const [contextMenuAnchor, setContextMenuAnchor] = useState<VirtualElement>();
  const [item, setItem] = useState<LifeSheetResponseDto>();

  const columns = useMemo(
    () => [
      columnHelper.display({
        header: 'Nom',
        cell: ({ row: { original } }) => original.name,
      }),
      columnHelper.display({
        header: 'Date & heure',
        cell: ({ row: { original } }) => formatDateAndHourWithSlash(original.modifiedDate),
      }),
      columnHelper.display({
        header: 'Description',
        cell: ({ row: { original } }) => {
          const receiver: string | undefined = original.receiver
            ?.split(';')
            .filter((item) => item.trim().length > 0)
            .join('; ');

          const content = <div className="ql-editor">{parse(DOMPurify.sanitize(`${receiver ? `à [${receiver}] - ` : ''}${original.description}`))}</div>;
          if (original.mailId) {
            if (getEmailLink)
              return (
                <Link {...getEmailLink(original)} replace resetScroll={false} preload="intent" className="flex justify-center">
                  {content}
                </Link>
              );
          }
          return content;
        },
      }),
    ],
    [getEmailLink],
  );

  const createButton = (() => {
    if (createLink && onCreateClick) throw new Error('createLink and onCreateClick cannot be both defined');

    if (createLink)
      return (
        <Link {...createLink} preload="intent" className={classNames('btn btn-primary', styles.link)}>
          Ajouter
        </Link>
      );
    else if (onCreateClick)
      return (
        <button
          type="button"
          onClick={() => {
            onCreateClick();
          }}
          className={classNames('btn btn-primary', styles.link)}
        >
          Ajouter
        </button>
      );
    else throw new Error('createLink or onCreateClick must be defined');
  })();

  const pagination = (() => {
    if (pageLink && onPageChange) throw new Error('pageLink and onPageChange cannot be both defined');

    if (pageLink) return <PaginationComponent page={page} totalPages={data?.totalPages} pageLink={pageLink} />;
    else if (onPageChange) return <PaginationComponent page={page} totalPages={data?.totalPages} onPageChange={onPageChange} />;
  })();

  const onRowContextMenu = (e: React.MouseEvent, row: Row<LifeSheetResponseDto>) => {
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
      <CardComponent title="Fiche de vie" className={className}>
        <div className={styles.container}>
          {createButton}
          <RefreshButtonComponent className={classNames('btn btn-primary', styles.button)} onRefresh={refetch} isRefreshing={isRefetching} />

          <div className={styles.table_container}>
            <TableComponent columns={columns} data={data?.content} isLoading={isLoading} rowId={'id'} onRowContextMenu={onRowContextMenu} />
            {pagination}
            {/* {pageLink && <PaginationComponent page={page} totalPages={data?.totalPages} pageLink={pageLink} />} */}
          </div>
        </div>
      </CardComponent>
      <LifesheetComponentContextMenuComponent
        anchorElement={contextMenuAnchor}
        setAnchorElement={setContextMenuAnchor}
        item={item}
        getDeleteLink={getDeleteLink}
        onDeleteClick={onDeleteClick}
      />
    </>
  );
}
