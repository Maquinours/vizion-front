import { useQuery } from '@tanstack/react-query';
import { Link, LinkProps } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import classNames from 'classnames';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import { useMemo } from 'react';
import { lifesheets } from '../../utils/constants/queryKeys/lifesheet';
import { LifesheetAssociatedItem } from '../../utils/enums/LifesheetAssociatedItem';
import { formatDateAndHourWithSlash } from '../../utils/functions/dates';
import LifeSheetResponseDto from '../../utils/types/LifeSheetResponseDto';
import CardComponent from '../Card/Card';
import PaginationComponent from '../Pagination/Pagination';
import RefreshButtonComponent from '../RefreshButton/RefreshButton';
import TableComponent from '../Table/Table';
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
}: LifesheetComponentProps) {
  const { data, isLoading, refetch, isRefetching } = useQuery(lifesheets.page({ page, size })._ctx.byAssociatedItem({ associatedItemType, associatedItemId }));

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

  const createButton = useMemo(() => {
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
  }, [createLink, onCreateClick]);

  const pagination = useMemo(() => {
    if (pageLink && onPageChange) throw new Error('pageLink and onPageChange cannot be both defined');

    if (pageLink) return <PaginationComponent page={page} totalPages={data?.totalPages} pageLink={pageLink} />;
    else if (onPageChange) return <PaginationComponent page={page} totalPages={data?.totalPages} onPageChange={onPageChange} />;
  }, [pageLink, onPageChange]);

  return (
    <CardComponent title="Fiche de vie" className={className}>
      <div className={styles.container}>
        {createButton}
        <RefreshButtonComponent className={classNames('btn btn-primary', styles.button)} onRefresh={refetch} isRefreshing={isRefetching} />

        <div className={styles.table_container}>
          <TableComponent columns={columns} data={data?.content} isLoading={isLoading} rowId={'id'} />
          {pagination}
          {/* {pageLink && <PaginationComponent page={page} totalPages={data?.totalPages} pageLink={pageLink} />} */}
        </div>
      </div>
    </CardComponent>
  );
}
