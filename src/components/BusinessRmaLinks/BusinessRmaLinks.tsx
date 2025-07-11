import { useQuery } from '@tanstack/react-query';
import { Link, LinkOptions, useNavigate } from '@tanstack/react-router';
import { Row, createColumnHelper } from '@tanstack/react-table';
import React, { ReactElement, useMemo } from 'react';
import { FaTrash } from 'react-icons/fa';
import { queries } from '../../utils/constants/queryKeys';
import CategoryBusiness from '../../utils/enums/CategoryBusiness';
import AllBusinessResponseDto from '../../utils/types/AllBusinessResponseDto';
import { useAuthentifiedUserQuery } from '../../views/App/utils/functions/getAuthentifiedUser';
import CardComponent from '../Card/Card';
import TableComponent from '../Table/Table';
import styles from './BusinessRmaLinks.module.scss';

const columnHelper = createColumnHelper<AllBusinessResponseDto>();

type BusinessRmaLinksComponentProps = Readonly<{
  category: CategoryBusiness;
  number: string;
  getItemLink?: (data: AllBusinessResponseDto) => LinkOptions;
  onItemClick?: (data: AllBusinessResponseDto) => void;
  canCreate: boolean;
  createLink?: LinkOptions;
  onCreateClick?: () => void;
  getDeleteLink?: (data: AllBusinessResponseDto) => LinkOptions;
  onDeleteClick?: (data: AllBusinessResponseDto) => void;
  className?: string;
}>;
export default function BusinessRmaLinksComponent({
  category,
  number,
  getItemLink,
  onItemClick,
  canCreate,
  createLink,
  onCreateClick,
  getDeleteLink,
  onDeleteClick,
  className,
}: BusinessRmaLinksComponentProps) {
  const navigate = useNavigate();

  const { data: user } = useAuthentifiedUserQuery();

  const { data, isLoading } = useQuery(queries['all-businesses'].list._ctx.associated({ category: category, number: number }));

  const columns = useMemo(
    () => [
      columnHelper.display({
        header: "Nom de l'affaire",
        cell: ({ row: { original } }) => {
          if (getItemLink && onItemClick) throw new Error('getItemLink and onItemClick cannot be both defined');
          if (!getItemLink && !onItemClick) throw new Error('getItemLink or onItemClick must be defined');

          let children: ReactElement | undefined = undefined;
          if (original.category === CategoryBusiness.AFFAIRE) {
            const text = `${original.title ?? ''} ${original.number}`;
            if (getItemLink)
              children = (
                <Link
                  {...getItemLink(original)}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                  }}
                >
                  {text}
                </Link>
              );
            else if (onItemClick)
              children = (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                    onItemClick(original);
                  }}
                >
                  {text}
                </button>
              );
          } else if (original.category === CategoryBusiness.RMA) {
            const text = `${original.number}`;

            if (getItemLink)
              children = (
                <Link
                  {...getItemLink(original)}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                  }}
                >
                  {text}
                </Link>
              );
            else if (onItemClick)
              children = (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                    onItemClick(original);
                  }}
                >
                  {text}
                </button>
              );
          }

          return <div className={styles.row}>{children}</div>;
        },
      }),
      columnHelper.display({
        id: 'actions',
        cell: ({ row: { original } }) => {
          const children = <FaTrash width={16} height={16} color="#F24C52" />;

          if (getDeleteLink && onDeleteClick) throw new Error('getDeleteLink and onDeleteClick cannot be both defined');

          if (getDeleteLink)
            return (
              <Link
                {...getDeleteLink(original)}
                onClick={(e) => {
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                }}
              >
                {children}
              </Link>
            );
          else if (onDeleteClick)
            return (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                  onDeleteClick(original);
                }}
              >
                {children}
              </button>
            );
          else throw new Error('getDeleteLink or onDeleteClick must be defined');
        },
      }),
    ],
    [getDeleteLink, onDeleteClick],
  );

  const createButton = useMemo(() => {
    if (createLink && onCreateClick) throw new Error('createLink and onCreateClick cannot be both defined');

    if (createLink)
      return (
        <Link {...createLink} className="btn btn-primary">
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
          className="btn btn-primary"
        >
          Ajouter
        </button>
      );
    else throw new Error('createLink or onCreateClick must be defined');
  }, [createLink, onCreateClick]);

  const onRowClick = (e: React.MouseEvent, row: Row<AllBusinessResponseDto>) => {
    if (row.original.category === CategoryBusiness.AFFAIRE) {
      if (getItemLink) {
        if (e.metaKey || e.ctrlKey) window.open(getItemLink(row.original).href, '_blank');
        else navigate(getItemLink(row.original));
      } else if (onItemClick) onItemClick(row.original);
    } else if (row.original.category === CategoryBusiness.RMA) {
      if (getItemLink) {
        if (e.metaKey || e.ctrlKey) window.open(`${window.location.origin}/app/businesses-rma/rma/${row.original.businessId}`, '_blank');
        else navigate({ to: '/app/businesses-rma/rma/$rmaId', params: { rmaId: row.original.businessId } });
      } else if (onItemClick) onItemClick(row.original);
    }
  };

  return (
    <CardComponent title="Liaisons" className={className}>
      <div className={styles.container}>
        <div className={styles.buttons_container}>{canCreate && user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && createButton}</div>

        <div className={styles.table_container}>
          <TableComponent columns={columns} data={data} isLoading={isLoading} onRowClick={onRowClick} />
        </div>
      </div>
    </CardComponent>
  );
}
