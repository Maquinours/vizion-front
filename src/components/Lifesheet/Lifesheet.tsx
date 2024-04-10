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

const size = 5;

const columnHelper = createColumnHelper<LifeSheetResponseDto>();
const columns = [
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
    cell: ({ row: { original } }) =>
      parse(DOMPurify.sanitize((original.receiver ? `à [${original.receiver.split(';').join(', ')}] ` : '') + original.description)),
  }),
];

type LifesheetComponentProps = Readonly<{
  associatedItemType: LifesheetAssociatedItem;
  associatedItemId: string;
  page: number;
  createLink: LinkProps;
  pageLink: (page: number) => LinkProps;
}>;
export default function LifesheetComponent({ associatedItemType, associatedItemId, page, createLink, pageLink }: LifesheetComponentProps) {
  const { data, isLoading, refetch, isRefetching } = useQuery(lifesheets.page({ page, size })._ctx.byAssociatedItem({ associatedItemType, associatedItemId }));

  return (
    <CardComponent title="Fiche de vie">
      <div className={styles.container}>
        <Link {...createLink} className={classNames('btn btn-primary', styles.link)}>
          Ajouter un commentaire
        </Link>
        <RefreshButtonComponent className={classNames('btn btn-primary', styles.button)} onRefresh={refetch} isRefreshing={isRefetching} />

        <div className={styles.table_container}>
          <TableComponent columns={columns} data={data?.content} isLoading={isLoading} rowId={'id'} />
          <PaginationComponent page={page} totalPages={data?.totalPages} pageLink={pageLink} />
        </div>
      </div>
    </CardComponent>
  );
}
