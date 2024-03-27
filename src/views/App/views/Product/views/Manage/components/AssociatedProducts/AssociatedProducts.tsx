import { createColumnHelper } from '@tanstack/react-table';
import ProductResponseDto from '../../../../../../../../utils/types/ProductResponseDto';
import { Link, getRouteApi } from '@tanstack/react-router';
import { IoIosClose } from 'react-icons/io';
import CardComponent from '../../../../../../../../components/Card/Card';
import { productQueryKeys } from '../../../../../../../../utils/constants/queryKeys/product';
import { useQuery } from '@tanstack/react-query';
import { getAssociatedProductsPage } from '../../../../../../../../utils/api/product';
import TableComponent from '../../../../../../../../components/Table/Table';
import PaginationComponent from '../../../../../../../../components/Pagination/Pagination';
import styles from './AssociatedProducts.module.scss';
import RefreshButtonComponent from '../../../../../../../../components/RefreshButton/RefreshButton';

const routeApi = getRouteApi('/app/products/$productId/manage');

const columnHelper = createColumnHelper<ProductResponseDto>();
const columns = [
  columnHelper.display({
    id: 'image',
    cell: ({ row: { original } }) => (
      <img src={`https://bd.vizeo.eu/6-Photos/${original?.reference}/MINI_${original?.reference}.jpg`} height={25} alt={`Produit ${original?.reference}`} />
    ),
  }),
  columnHelper.display({
    header: 'Référence',
    cell: ({ row: { original } }) => original.reference,
  }),
  columnHelper.display({
    header: 'Désignation',
    cell: ({ row: { original } }) => original.shortDescription,
  }),
  columnHelper.display({
    id: 'actions',
    cell: ({ row: { original } }) => (
      <Link
        from={routeApi.id}
        to={'./remove-associated-product/$associatedProductId'}
        params={(old) => ({ ...old, associatedProductId: original.id })}
        search={(old) => old}
        className={styles.action}
      >
        <IoIosClose />
      </Link>
    ),
  }),
];

const size = 5;

export default function AppViewProductViewManageViewAssociatedProductsComponent() {
  const { productId } = routeApi.useParams();
  const { associatedProductsPage: page } = routeApi.useSearch();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: productQueryKeys.pageByAssociatedProduct(productId, page, size),
    queryFn: () => getAssociatedProductsPage(productId, page, size),
  });

  return (
    <CardComponent title="Produits associés">
      <div className={styles.container}>
        <div className={styles.button_container}>
          <Link from={routeApi.id} to={'./add-associated-product'} search={(old) => old} className="btn btn-primary">
            Ajouter un produit associé
          </Link>
          <RefreshButtonComponent className="btn btn-primary" style={{ marginLeft: '0.5rem' }} onRefresh={() => refetch()} isRefreshing={isRefetching} />
        </div>

        <div className={styles.table}>
          <div className={styles.container}>
            <TableComponent isLoading={isLoading} data={data?.content} columns={columns} rowId="id" />
          </div>
          <div className={styles.pagination}>
            <PaginationComponent
              page={page}
              totalPages={data?.totalElements}
              pageLink={(page) => ({ from: routeApi.id, search: (old) => ({ ...old, associatedProductsPage: page }), params: (old) => old })}
            />
          </div>
        </div>
      </div>
    </CardComponent>
  );
}
