import { VirtualElement } from '@popperjs/core';
import { useQuery } from '@tanstack/react-query';
import { Link, getRouteApi } from '@tanstack/react-router';
import { OnChangeFn, Row, SortingState, createColumnHelper } from '@tanstack/react-table';
import classNames from 'classnames';
import { useMemo, useState } from 'react';
import AllBusinessRowTooltipComponent from '../../../../../../components/AllBusinessRowTooltip/AllBusinessRowTooltip';
import CardComponent from '../../../../../../components/Card/Card';
import CurrencyFormat from '../../../../../../components/CurrencyFormat/CurrencyFormat';
import PaginationComponent from '../../../../../../components/Pagination/Pagination';
import TableComponent from '../../../../../../components/Table/Table';
import { allBusinesses } from '../../../../../../utils/constants/queryKeys/allBusiness';
import AllBusinessState from '../../../../../../utils/enums/AllBusinessState';
import CategoryBusiness from '../../../../../../utils/enums/CategoryBusiness';
import { formatDateAndHourWithSlash } from '../../../../../../utils/functions/dates';
import AllBusinessResponseDto from '../../../../../../utils/types/AllBusinessResponseDto';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import styles from './AllBusinessTable.module.scss';
import AppViewEnterpriseViewAllBusinessTableComponentContextMenuComponent from './components/ContextMenu/ContextMenu';
import AppViewEnterpriseViewAllBusinessTableComponentSearchSectionComponent from './components/SearchSection/SearchSection';

const size = 15;

const states = [
  {
    label: 'Créée',
    value: AllBusinessState.CREATED,
  },
  {
    label: 'Devis',
    value: AllBusinessState.DEVIS,
  },
  {
    label: 'ARC',
    value: AllBusinessState.ARC,
  },
  {
    label: 'BP',
    value: AllBusinessState.BP,
  },
  {
    label: 'BL',
    value: AllBusinessState.BL,
  },
  {
    label: 'Facture',
    value: AllBusinessState.FACTURE,
  },
  {
    label: 'Bloqué',
    value: AllBusinessState.BLOQUE,
  },
  {
    label: 'Reception',
    value: AllBusinessState.RECEPTION,
  },
  {
    label: 'Prise en charge',
    value: AllBusinessState.PRISE_EN_CHARGE,
  },
  {
    label: 'Analyse',
    value: AllBusinessState.ANALYSE_REPARATION_EXPEDITION,
  },
  {
    label: 'Archive',
    value: AllBusinessState.ARCHIVE,
  },
];

const routeApi = getRouteApi('/app/enterprises_/$enterpriseId');
const routePath = '/app/enterprises/$enterpriseId';

const columnHelper = createColumnHelper<AllBusinessResponseDto>();

export default function AppViewEnterpriseViewAllBusinessTableComponent() {
  const navigate = routeApi.useNavigate();

  const { enterpriseId } = routeApi.useParams();
  const { allBusinessPage: page, allBusinessProfileId: contactId, allBusinessSortBy: sortBy, allBusinessSortOrder: sortOrder } = routeApi.useSearch();

  const { data: authentifiedUser } = useAuthentifiedUserQuery();
  const { data, isLoading } = useQuery(
    allBusinesses.page._ctx.byEnterpriseIdAndPossibleProfileId({ enterpriseId, profileId: contactId, page, size, sortBy, sortOrder }),
  );

  const [selectedItem, setSelectedItem] = useState<AllBusinessResponseDto | undefined>();
  const [contextMenuAnchor, setContextMenuAnchor] = useState<VirtualElement | undefined>();

  const onRowClick = (e: React.MouseEvent, row: Row<AllBusinessResponseDto>) => {
    if (row.original.category === CategoryBusiness.AFFAIRE) {
      if (e.metaKey || e.ctrlKey) window.open(`${window.location.origin}/app/businesses-rma/business/${row.original.businessId}`, '_blank');
      else navigate({ to: '/app/businesses-rma/business/$businessId', params: { businessId: row.original.businessId } });
    } else if (row.original.category === CategoryBusiness.RMA) {
      if (e.metaKey || e.ctrlKey) window.open(`${window.location.origin}/app/businesses-rma/rma/${row.original.businessId}`, '_blank');
      else navigate({ to: '/app/businesses-rma/rma/$rmaId', params: { rmaId: row.original.businessId } });
    }
  };

  const onRowContextMenu = (e: React.MouseEvent, row: Row<AllBusinessResponseDto>) => {
    if (row.original.enterpriseId === enterpriseId) return;
    e.preventDefault();
    setSelectedItem(row.original);
    setContextMenuAnchor({
      getBoundingClientRect: () => ({
        width: 0,
        height: 0,
        x: e.clientX,
        y: e.clientY,
        top: e.clientY,
        right: e.clientX,
        bottom: e.clientY,
        left: e.clientX,
        toJSON: () => {},
      }),
    });
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('number', {
        header: "N° de l'affaire",
        cell: ({ row: { original } }) => {
          const children = <span className={classNames({ italic: original.enterpriseId !== enterpriseId })}>{original.number}</span>;
          if (original.category === CategoryBusiness.AFFAIRE)
            return (
              <Link
                data-tooltip-id="business-number-tooltip"
                data-tooltip-content={original.id}
                data-tooltip-place="left"
                to="/app/businesses-rma/business/$businessId"
                params={{ businessId: original.businessId }}
                onClick={(e) => {
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                }}
              >
                {children}
              </Link>
            );
          else if (original.category === CategoryBusiness.RMA)
            return (
              <Link
                data-tooltip-id="business-number-tooltip"
                data-tooltip-content={original.id}
                data-tooltip-place="left"
                to="/app/businesses-rma/rma/$rmaId"
                params={{ rmaId: original.businessId }}
                onClick={(e) => {
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                }}
              >
                {children}
              </Link>
            );
          else return children;
        },
      }),
      columnHelper.accessor('title', {
        header: "Nom de l'affaire",
        cell: ({ row: { original } }) => <span className={classNames({ italic: original.enterpriseId !== enterpriseId })}>{original.title}</span>,
        enableSorting: false,
      }),
      columnHelper.accessor('enterpriseName', {
        header: 'Client',
        cell: ({ row: { original } }) => {
          const related = original.enterpriseId !== enterpriseId;
          return (
            <span className={classNames({ italic: related })}>
              {related ? `${original.enterpriseName} / ` : ''}
              {original.profileName}
            </span>
          );
        },
        enableSorting: false,
      }),
      columnHelper.accessor('modifiedDate', {
        header: 'Dernière modification',
        cell: ({ row: { original } }) => (
          <span className={classNames({ italic: original.enterpriseId !== enterpriseId })}>{formatDateAndHourWithSlash(original.modifiedDate)}</span>
        ),
      }),
      columnHelper.accessor('totalHt', {
        header: 'Montant HT',
        cell: ({ row: { original } }) => (
          <span className={classNames({ italic: original.enterpriseId !== enterpriseId })}>
            {original.category === CategoryBusiness.AFFAIRE ? <CurrencyFormat value={original.totalHt} /> : 'SAV'}
          </span>
        ),
      }),
      columnHelper.accessor('representativeName', {
        header: 'Représentant',
        cell: ({ row: { original } }) => <span className={classNames({ italic: original.enterpriseId !== enterpriseId })}>{original.representativeName}</span>,
        enableSorting: false,
      }),
      columnHelper.accessor('state', {
        header: 'État',
        cell: ({ row: { original } }) => (
          <span className={classNames({ italic: original.enterpriseId !== enterpriseId })}>
            {`${states.find((state) => state.value === original.state)?.label} ${original.state === AllBusinessState.FACTURE ? original.businessBillNumber : ''}`}
          </span>
        ),
      }),
    ],
    [enterpriseId],
  );

  const sortingState: SortingState | undefined = useMemo(() => {
    if ((sortBy === undefined && sortOrder !== undefined) || (sortBy !== undefined && sortOrder === undefined))
      throw new Error('Sorting by and order should be defined together');
    if (sortBy === undefined || sortOrder === undefined) return [];
    return [{ id: sortBy, desc: sortOrder === 'DESC' }];
  }, [sortBy, sortOrder]);

  const onSortingChange: OnChangeFn<SortingState> = (sorting) => {
    const newSorting = typeof sorting === 'function' ? sorting(sortingState) : sorting;
    if (newSorting.length > 1) throw new Error('Multiple sorting is not supported');
    if (newSorting.length === 0)
      navigate({ search: (old) => ({ ...old, allBusinessSortBy: undefined, allBusinessSortOrder: undefined }), replace: true, resetScroll: false });
    else
      navigate({
        search: (old) => ({ ...old, allBusinessSortBy: newSorting[0]?.id as 'number' | 'totalHt' | 'modifiedDate' | 'state', allBusinessSortOrder: newSorting[0]?.desc ? 'DESC' : 'ASC' }),
        replace: true,
        resetScroll: false,
      });
  };

  return (
    <>
      <div className={styles.container}>
        <CardComponent
          title="Affaires en cours"
          addLink={
            authentifiedUser.userInfo.roles.includes('ROLE_MEMBRE_VIZEO')
              ? { to: '/app/enterprises/$enterpriseId/relate-business-rma', search: true, replace: true, resetScroll: false }
              : undefined
          }
        >
          <div className={styles.card_container}>
            <AppViewEnterpriseViewAllBusinessTableComponentSearchSectionComponent />
            <div className={styles.table_container}>
              <TableComponent
                columns={columns}
                isLoading={isLoading}
                data={data?.content ?? []}
                rowId="id"
                onRowClick={onRowClick}
                onRowContextMenu={onRowContextMenu}
                sorting={sortingState}
                onSortingChange={onSortingChange}
              />
            </div>
            <div className={styles.pagination}>
              <PaginationComponent
                page={page}
                totalPages={data?.totalPages}
                pageLink={(page) => ({ from: routePath, search: (old) => ({ ...old, allBusinessPage: page }), replace: true, resetScroll: false })}
              />
            </div>
          </div>
        </CardComponent>
      </div>
      <AppViewEnterpriseViewAllBusinessTableComponentContextMenuComponent
        anchorElement={contextMenuAnchor}
        setAnchorElement={setContextMenuAnchor}
        selectedItem={selectedItem}
      />
      {!!data && <AllBusinessRowTooltipComponent items={data.content} />}
    </>
  );
}
