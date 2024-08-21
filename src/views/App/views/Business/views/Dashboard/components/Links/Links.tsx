import { Link, getRouteApi, useNavigate } from '@tanstack/react-router';
import CardComponent from '../../../../../../../../components/Card/Card';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import styles from './Links.module.scss';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import CategoryBusiness from '../../../../../../../../utils/enums/CategoryBusiness';
import AllBusinessResponseDto from '../../../../../../../../utils/types/AllBusinessResponseDto';
import { Row, createColumnHelper } from '@tanstack/react-table';
import { FaTrash } from 'react-icons/fa';
import TableComponent from '../../../../../../../../components/Table/Table';
import React, { useCallback } from 'react';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/dashboard');

const columnHelper = createColumnHelper<AllBusinessResponseDto>();
const columns = [
  columnHelper.display({
    header: "Nom de l'affaire",
    cell: ({ row: { original } }) => {
      let children: JSX.Element | undefined = undefined;
      if (original.category === CategoryBusiness.AFFAIRE)
        children = (
          <Link
            to="/app/businesses-rma/business/$businessId"
            params={{ businessId: original.businessId }}
            onClick={(e) => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
            }}
          >
            {original.title ?? ''} {original.number}
          </Link>
        );
      else if (original.category === CategoryBusiness.RMA)
        children = (
          <Link
            to="/app/businesses-rma/rma/$rmaId"
            params={{ rmaId: original.businessId }}
            onClick={(e) => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
            }}
          >
            {original.number}
          </Link>
        );

      return <div className={styles.row}>{children}</div>;
    },
  }),
  columnHelper.display({
    id: 'actions',
    cell: ({ row: { original } }) => (
      <Link
        from={routeApi.id}
        to="delete-link/$associatedId"
        params={{ associatedId: original.id }}
        search={(old) => old}
        replace
        resetScroll={false}
        onClick={(e) => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}
      >
        <FaTrash width={16} height={16} color={'#16204E'} />
      </Link>
    ),
  }),
];

export default function AppViewBusinessViewDashboardViewLinksComponent() {
  const navigate = useNavigate();

  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  const { data: user } = useAuthentifiedUserQuery();

  const { data, isLoading } = useQuery(queries['all-businesses'].list._ctx.associated({ category: CategoryBusiness.AFFAIRE, number: business.numBusiness }));

  const onRowClick = useCallback(
    (e: React.MouseEvent, row: Row<AllBusinessResponseDto>) => {
      if (row.original.category === CategoryBusiness.AFFAIRE) {
        if (e.metaKey || e.ctrlKey) window.open(`${window.location.origin}/app/businesses-rma/business/${row.original.businessId}`, '_blank');
        else navigate({ to: '/app/businesses-rma/business/$businessId', params: { businessId: row.original.businessId } });
      } else if (row.original.category === CategoryBusiness.RMA) {
        if (e.metaKey || e.ctrlKey) window.open(`${window.location.origin}/app/businesses-rma/rma/${row.original.businessId}`, '_blank');
        else navigate({ to: '/app/businesses-rma/rma/$rmaId', params: { rmaId: row.original.businessId } });
      }
    },
    [navigate],
  );

  return (
    <CardComponent title="Liaisons">
      <div className={styles.container}>
        <div className={styles.buttons_container}>
          {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && !business.archived && (
            <Link
              from={routeApi.id}
              to="create-link"
              search={(old) => old}
              replace
              resetScroll={false}
              preload="intent"
              ignoreBlocker
              className="btn btn-primary"
            >
              Ajouter
            </Link>
          )}
        </div>

        <div className={styles.table_container}>
          <TableComponent columns={columns} data={data} isLoading={isLoading} onRowClick={onRowClick} />
        </div>
      </div>
    </CardComponent>
  );
}
