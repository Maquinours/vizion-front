import { Link, getRouteApi } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import CurrencyFormat from '../../../../../../components/CurrencyFormat/CurrencyFormat';
import RowLinkTableComponent from '../../../../../../components/RowLinkTable/RowLinkTable';
import AllBusinessState from '../../../../../../utils/enums/AllBusinessState';
import CategoryBusiness from '../../../../../../utils/enums/CategoryBusiness';
import { formatDateAndHourWithSlash } from '../../../../../../utils/functions/dates';
import AllBusinessResponseDto from '../../../../../../utils/types/AllBusinessResponseDto';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import styles from './Table.module.scss';

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
  const { state } = routeApi.useSearch();

  const { data: user } = useAuthentifiedUserQuery();

  const columns = useMemo(
    () => [
      columnHelper.display({
        header: `Date de ${state === AllBusinessState.FACTURE ? 'création' : 'modification'}`,
        cell: ({ row: { original } }) => formatDateAndHourWithSlash(state === AllBusinessState.FACTURE ? original.billDate : original.modifiedDate),
      }),
      columnHelper.display({
        header: "Nr d'affaire",
        cell: ({ row: { original } }) => (
          <div style={{ color: 'var(--secondary-color)' }}>
            <span>{original.number}</span>
            <span>{original.businessBillNumber}</span>
            {original.creditNotes?.map((num, idx) => <span key={idx}>Avoir : {num.number}</span>)}
          </div>
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
            {original?.associatedBusinessRMA?.map((item) => {
              const name = `${item.number} ${item.title && item.title !== item.number ? `(${item.title})` : ''}`;
              return (
                <li key={item.businessId}>
                  <Link
                    to="/app/businesses-rma/business/$businessId"
                    params={{ businessId: item.businessId }}
                    disabled={
                      (item.category === CategoryBusiness.AFFAIRE && user.userInfo.roles.includes('ROLE_CLIENT')) || item.category === CategoryBusiness.RMA // TODO: implement for RMAs
                    }
                  >
                    {name}
                  </Link>
                </li>
              );
            })}
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
            {original.supports?.map((item) => {
              // const isClickable = user.userInfo?.roles?.includes('ROLE_MEMBRE_VIZEO');
              return (
                <li key={item.id}>
                  {/* <Link to={`/app/business/assistance/${item.id}`} className={!isClickable ? styles.disabled_link : null}> // TODO: reimplement this
                    {item.name ? item.name : 'Sans nom'}
                  </Link> */}
                </li>
              );
            })}
          </ul>
        ),
      }),
      columnHelper.display({
        header: 'Etat',
        cell: ({ row: { original } }) => STATES.find((state) => original.state === state.value)?.label,
      }),
    ],
    [state, user],
  );

  return (
    <div className={styles.table_container}>
      <RowLinkTableComponent
        columns={columns}
        data={data}
        isLoading={isLoading}
        tableClassName={styles.table}
        headerClassName={styles.thead}
        headerRowClassName={styles.tr}
        headerCellClassName={styles.th}
        bodyClassName={styles.tbody}
        getBodyRowClassName={() => styles.tr}
        bodyCellClassName={styles.td}
        getRowLink={(row) => ({
          to: '/app/businesses-rma/business/$businessId', // TODO: handle RMA
          params: { businessId: row.businessId },
          disabled: row.category !== CategoryBusiness.AFFAIRE,
        })}
      />
    </div>
  );
}
