import { useQuery } from '@tanstack/react-query';
import { Link, LinkProps } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import classNames from 'classnames';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import { lifesheets } from '../../utils/constants/queryKeys/lifesheet';
import { LifesheetAssociatedItem } from '../../utils/enums/LifesheetAssociatedItem';
import { formatDateAndHourWithSlash } from '../../utils/functions/dates';
import LifeSheetResponseDto from '../../utils/types/LifeSheetResponseDto';
import CardComponent from '../Card/Card';
import PaginationComponent from '../Pagination/Pagination';
import RefreshButtonComponent from '../RefreshButton/RefreshButton';
import TableComponent from '../Table/Table';
import styles from './Lifesheet.module.scss';
import { useMemo } from 'react';

const columnHelper = createColumnHelper<LifeSheetResponseDto>();

type LifesheetComponentProps = Readonly<{
  associatedItemType: LifesheetAssociatedItem;
  associatedItemId: string;
  page: number;
  size?: number;
  createLink: LinkProps;
  pageLink?: (page: number) => LinkProps;
  className?: string;
  getEmailLink: (data: LifeSheetResponseDto) => LinkProps;
}>;
export default function LifesheetComponent({
  associatedItemType,
  associatedItemId,
  page,
  size = 5,
  createLink,
  pageLink,
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

          const content = parse(DOMPurify.sanitize(`${!!receiver ? `à [${receiver}] - ` : ''}${original.description}`));
          if (!!original.mailId)
            return (
              <Link {...getEmailLink(original)} replace resetScroll={false} preload="intent" className="flex justify-center">
                {content}
              </Link>
            );
          return content;
        },
      }),
    ],
    [getEmailLink],
  );

  return (
    <CardComponent title="Fiche de vie" className={className}>
      <div className={styles.container}>
        <Link {...createLink} preload="intent" className={classNames('btn btn-primary', styles.link)}>
          Ajouter un commentaire
        </Link>
        <RefreshButtonComponent className={classNames('btn btn-primary', styles.button)} onRefresh={refetch} isRefreshing={isRefetching} />

        <div className={styles.table_container}>
          <TableComponent columns={columns} data={data?.content} isLoading={isLoading} rowId={'id'} />
          {pageLink && <PaginationComponent page={page} totalPages={data?.totalPages} pageLink={pageLink} />}
        </div>
      </div>
    </CardComponent>
  );
}
