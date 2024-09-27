import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import CardComponent from '../../../../../../../../components/Card/Card';
import RefreshButtonComponent from '../../../../../../../../components/RefreshButton/RefreshButton';
import TableComponent from '../../../../../../../../components/Table/Table';
import TableRowExpandButtonComponent from '../../../../../../../../components/TableRowExpandButton/TableRowExpandButton';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import ProductFaqResponseDto from '../../../../../../../../utils/types/ProductFaqResponseDto';
import styles from './AssociatedFaqs.module.scss';

const routeApi = getRouteApi('/app/products/$productId/manage');

const columnHelper = createColumnHelper<ProductFaqResponseDto>();
const columns = [
  columnHelper.display({
    id: 'expand',
    cell: ({ row }) => <TableRowExpandButtonComponent row={row} />,
  }),
  columnHelper.display({
    header: 'Titre',
    cell: ({ row }) => row.original.title,
  }),
  columnHelper.display({
    header: 'Niveau',
    cell: ({ row }) => row.original.accessLevel,
  }),
  columnHelper.display({
    id: 'scrollbar_compensator',
  }),
];

export default function AppViewProductViewManageViewAssociatedFaqsComponent() {
  const { productId } = routeApi.useParams();

  const { data, isLoading, refetch, isRefetching } = useSuspenseQuery({
    ...queries.product.detail(productId),
    select: (data) => data.faqList ?? undefined,
  });

  return (
    <CardComponent title="FAQs associées">
      <div className={styles.container}>
        <div className={styles.button_container}>
          <RefreshButtonComponent className="btn btn-primary" style={{ marginLeft: '0.5rem' }} onRefresh={() => refetch()} isRefreshing={isRefetching} />
        </div>

        <div className={styles.table}>
          <div className={styles.container}>
            <TableComponent isLoading={isLoading} data={data} columns={columns} rowId="id" />
          </div>
        </div>
      </div>
    </CardComponent>
  );
}
