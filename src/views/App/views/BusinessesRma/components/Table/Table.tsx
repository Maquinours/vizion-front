import { Link, getRouteApi, useNavigate } from '@tanstack/react-router';
import { Row, createColumnHelper } from '@tanstack/react-table';
import React, { useCallback, useMemo } from 'react';
import CurrencyFormat from '../../../../../../components/CurrencyFormat/CurrencyFormat';
import TableComponent from '../../../../../../components/Table/Table';
import AllBusinessState from '../../../../../../utils/enums/AllBusinessState';
import CategoryBusiness from '../../../../../../utils/enums/CategoryBusiness';
import { formatDateAndHourWithSlash } from '../../../../../../utils/functions/dates';
import AllBusinessResponseDto from '../../../../../../utils/types/AllBusinessResponseDto';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import styles from './Table.module.scss';
import AppViewBusinessesRmaViewTableComponentRowTooltipComponent from './components/RowTooltip/RowTooltip';

const routeApi = getRouteApi('/app/businesses-rma');

const columnHelper = createColumnHelper<AllBusinessResponseDto>();

const STATES = [
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
    label: 'Réception',
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
    label: 'Archivé',
    value: AllBusinessState.ARCHIVE,
  },
];

type AppViewBusinessesRmaViewTableComponent = Readonly<{
  data: Array<AllBusinessResponseDto> | undefined;
  isLoading: boolean;
}>;
export default function AppViewBusinessesRmaViewTableComponent({ data, isLoading }: AppViewBusinessesRmaViewTableComponent) {
  const navigate = useNavigate();

  const { state } = routeApi.useSearch();

  const { data: user } = useAuthentifiedUserQuery();

  // const [tooltipItem, setTooltipItem] = useState<AllBusinessResponseDto>();

  const columns = useMemo(
    () => [
      columnHelper.display({
        header: `Date de ${state === AllBusinessState.FACTURE ? 'création' : 'modification'}`,
        cell: ({ row: { original } }) => formatDateAndHourWithSlash(state === AllBusinessState.FACTURE ? original.billDate : original.modifiedDate),
      }),
      columnHelper.display({
        header: "Nr d'affaire",
        cell: ({ row: { original } }) => (
          <Link
            to="/app/businesses-rma/business/$businessId"
            params={{ businessId: original.businessId }}
            disabled={original.category !== CategoryBusiness.AFFAIRE}
            className={styles.business_number}
            style={{ color: 'var(--secondary-color)' }}
          >
            <span>{original.number}</span>
            <span>{original.businessBillNumber}</span>
            {original.creditNotes?.map((num, idx) => <span key={idx}>Avoir : {num.number}</span>)}
          </Link>
        ),
      }),
      columnHelper.display({
        header: 'Entreprise',
        cell: ({ row: { original } }) => original.enterpriseName ?? '',
      }),
      columnHelper.display({
        header: 'Contact',
        cell: ({ row: { original } }) => original.deliverAddressName,
      }),
      columnHelper.display({
        header: 'Liaisons',
        cell: ({ row: { original } }) => (
          <ul className={styles.associated_list}>
            {original?.associatedBusinessRMA?.map((item) => (
              <li key={item.businessId}>
                {item.category === CategoryBusiness.AFFAIRE ? (
                  <Link
                    to="/app/businesses-rma/business/$businessId"
                    params={{ businessId: item.businessId }}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                    }}
                  >
                    {item.number} {item.title !== item.number ? `(${item.title})` : ''}
                  </Link>
                ) : (
                  item.category === CategoryBusiness.RMA && (
                    <Link
                      to="/app/businesses-rma/rma/$rmaId"
                      params={{ rmaId: item.businessId }}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                      }}
                    >
                      {item.number}
                    </Link>
                  )
                )}
              </li>
            ))}
          </ul>
        ),
      }),
      columnHelper.display({
        header: "Nom de l'affaire",
        cell: ({ row: { original } }) => original.title ?? '',
      }),
      columnHelper.display({
        header: 'Installateur ou info',
        cell: ({ row: { original } }) => original.installerProfileName ?? '',
      }),
      columnHelper.display({
        header: 'Montant HT',
        cell: ({ row: { original } }) =>
          original.category === CategoryBusiness.AFFAIRE ? (
            <>
              <CurrencyFormat value={original.totalHt} />

              {original.creditNotes?.map((num, idx) => <CurrencyFormat key={idx} value={num?.totalAmountHT} prefix="-" allowNegative={false} />)}
            </>
          ) : (
            'SAV'
          ),
      }),
      columnHelper.display({
        header: 'Nr Commande',
        cell: ({ row: { original } }) => original.numOrder ?? '',
      }),
      columnHelper.display({
        header: 'CP de livraison',
        cell: ({ row: { original } }) => original.zipCode ?? '',
      }),
      columnHelper.display({
        header: 'Représentant',
        cell: ({ row: { original } }) => original.representativeName ?? '',
      }),
      columnHelper.display({
        header: 'Assistance',
        cell: ({ row: { original } }) => (
          <ul className={styles.support_listing}>
            {original.supports?.map((item) => (
              <li key={item.id}>
                <Link
                  disabled={!user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO')}
                  to="/app/businesses-rma/business/$businessId/assistance/$assistanceId"
                  params={{ businessId: original.businessId, assistanceId: item.id }}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                  }}
                >
                  {item.name || 'Sans nom'}
                </Link>
              </li>
            ))}
          </ul>
        ),
      }),
      columnHelper.display({
        header: 'État',
        cell: ({ row: { original } }) => STATES.find((state) => original.state === state.value)?.label,
      }),
      columnHelper.display({
        id: 'scrollbar_compensator',
      }),
    ],
    [state, user],
  );

  const getRowClassName = useCallback(() => 'allbusiness-row', []);
  const getRowId = useCallback((row: AllBusinessResponseDto) => row.id, []);

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
    <>
      <div className={styles.table_container}>
        <TableComponent columns={columns} data={data} isLoading={isLoading} onRowClick={onRowClick} getRowClassName={getRowClassName} getRowId={getRowId} />
      </div>
      {!!data && <AppViewBusinessesRmaViewTableComponentRowTooltipComponent items={data} />}
      {/* {!!tooltipItem && <AppViewBusinessesRmaViewTableComponentRowTooltipComponent item={tooltipItem} />} */}
    </>
  );
}
