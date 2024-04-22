import { Link, getRouteApi } from '@tanstack/react-router';
import CardComponent from '../../../../../../../../components/Card/Card';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import styles from './Links.module.scss';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import CategoryBusiness from '../../../../../../../../utils/enums/CategoryBusiness';
import AllBusinessResponseDto from '../../../../../../../../utils/types/AllBusinessResponseDto';
import { createColumnHelper } from '@tanstack/react-table';
import { FaTrash } from 'react-icons/fa';
import TableComponent from '../../../../../../../../components/Table/Table';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/dashboard');

const columnHelper = createColumnHelper<AllBusinessResponseDto>();
const columns = [
  columnHelper.display({
    header: "Nom de l'affaire",
    cell: ({ row: { original } }) => (
      <div className={styles.row}>
        <Link
          to={original.category === CategoryBusiness.AFFAIRE ? `/app/businesses/business/${original.businessId}` : `/app/businesses/rma/${original.businessId}`} // TODO: check link
        >
          {original.category === CategoryBusiness.AFFAIRE ? `${original.title ?? ''} ${original.number}` : original.number}
        </Link>
      </div>
    ),
  }),
  columnHelper.display({
    id: 'actions',
    cell: ({ row: { original } }) => (
      <Link from={routeApi.id} to="delete-link/$associatedId" params={{ associatedId: original.id }} search={(old) => old}>
        <FaTrash width={16} height={16} color={'#16204E'} />
      </Link>
    ),
  }),
];

export default function AppViewBusinessViewDashboardViewLinksComponent() {
  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  const { data: user } = useAuthentifiedUserQuery();

  const { data, isLoading } = useQuery(queries['all-businesses'].list._ctx.associated({ category: CategoryBusiness.AFFAIRE, number: business.numBusiness }));

  return (
    <CardComponent title="Liaisons">
      <div className={styles.container}>
        <div className={styles.buttons_container}>
          {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && !business.archived && (
            <Link from={routeApi.id} to="create-link" search={(old) => old} className="btn btn-primary">
              Ajouter
            </Link>
          )}
        </div>

        <div className={styles.table_container}>
          <TableComponent columns={columns} data={data} isLoading={isLoading} />
        </div>
      </div>
    </CardComponent>
  );
}
