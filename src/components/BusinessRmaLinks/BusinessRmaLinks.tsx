import { useQuery } from '@tanstack/react-query';
import { Link, LinkOptions, useNavigate } from '@tanstack/react-router';
import { Row, createColumnHelper } from '@tanstack/react-table';
import React, { useCallback, useMemo } from 'react';
import { FaTrash } from 'react-icons/fa';
import { queries } from '../../utils/constants/queryKeys';
import CategoryBusiness from '../../utils/enums/CategoryBusiness';
import AllBusinessResponseDto from '../../utils/types/AllBusinessResponseDto';
import { useAuthentifiedUserQuery } from '../../views/App/utils/functions/getAuthentifiedUser';
import CardComponent from '../Card/Card';
import TableComponent from '../Table/Table';
import styles from './BusinessRmaLinks.module.scss';
import classNames from 'classnames';

const columnHelper = createColumnHelper<AllBusinessResponseDto>();

type BusinessRmaLinksComponentProps = Readonly<{
  category: CategoryBusiness;
  number: string;
  canCreate: boolean;
  createLink: LinkOptions;
  getDeleteLink: (data: AllBusinessResponseDto) => LinkOptions;
  className?: string;
}>;
export default function BusinessRmaLinksComponent({ category, number, canCreate, createLink, getDeleteLink, className }: BusinessRmaLinksComponentProps) {
  const navigate = useNavigate();

  const { data: user } = useAuthentifiedUserQuery();

  const { data, isLoading } = useQuery(queries['all-businesses'].list._ctx.associated({ category: category, number: number }));

  const columns = useMemo(
    () => [
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
            {...getDeleteLink(original)}
            onClick={(e) => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
            }}
          >
            <FaTrash width={16} height={16} color="#F24C52" />
          </Link>
        ),
      }),
    ],
    [getDeleteLink],
  );

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
      <div className={classNames(styles.container, className)}>
        <div className={styles.buttons_container}>
          {canCreate && user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
            <Link {...createLink} className="btn btn-primary">
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
