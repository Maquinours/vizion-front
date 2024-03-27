import { Link, LinkProps } from '@tanstack/react-router';
import CardComponent from '../Card/Card';
import { useQuery } from '@tanstack/react-query';
import { lifesheetQueryKeys } from '../../utils/constants/queryKeys/lifesheet';
import { LifesheetAssociatedItem } from '../../utils/enums/LifesheetAssociatedItem';
import {
  getLifesheetPageByAssistanceId,
  getLifesheetPageByBusinessId,
  getLifesheetPageByEnterpriseId,
  getLifesheetPageByProductId,
  getLifesheetPageByRmaId,
} from '../../utils/api/lifesheet';
import styles from './Lifesheet.module.scss';
import TableComponent from '../Table/Table';
import PaginationComponent from '../Pagination/Pagination';
import { createColumnHelper } from '@tanstack/react-table';
import LifeSheetResponseDto from '../../utils/types/LifeSheetResponseDto';
import { formatDateAndHourWithSlash } from '../../utils/functions/dates';
import classNames from 'classnames';
import RefreshButtonComponent from '../RefreshButton/RefreshButton';

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
    cell: ({ row: { original } }) => (
      <div dangerouslySetInnerHTML={{ __html: `${original.receiver ? `à [${original.receiver.split(';').join(', ')}]` : ''} ${original.description}` }} />
    ),
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
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: lifesheetQueryKeys.pageByAssociatedItemAndId(associatedItemType, associatedItemId, page, size),
    queryFn: () => {
      switch (associatedItemType) {
        case LifesheetAssociatedItem.PRODUCT:
          return getLifesheetPageByProductId(associatedItemId, page, size);
        case LifesheetAssociatedItem.ENTERPRISE:
          return getLifesheetPageByEnterpriseId(associatedItemId, page, size);
        case LifesheetAssociatedItem.RMA:
          return getLifesheetPageByRmaId(associatedItemId, page, size);
        case LifesheetAssociatedItem.ASSISTANCE:
          return getLifesheetPageByAssistanceId(associatedItemId, page, size);
        case LifesheetAssociatedItem.BUSINESS:
          return getLifesheetPageByBusinessId(associatedItemId, page, size);
      }
    },
  });

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
