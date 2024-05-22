import { createColumnHelper } from '@tanstack/react-table';
import TableComponent from '../../../../../../../../components/Table/Table';
import KeycloakEventDetailsResponseDto from '../../../../../../../../utils/types/KeycloakEventDetailsResponseDto';
import { formatDateAndHourWithSlash } from '../../../../../../../../utils/functions/dates';
import { KEYCLOACK_STATES } from '../../utils/constants/states';
import { BsFillCircleFill } from 'react-icons/bs';
import styles from './Table.module.scss';
import countries from '../../../../../../../../utils/constants/countries.json';

const columnHelper = createColumnHelper<KeycloakEventDetailsResponseDto>();
const columns = [
  columnHelper.display({
    header: 'Date',
    cell: ({ row: { original } }) => formatDateAndHourWithSlash(original.createdDate),
  }),
  columnHelper.display({
    header: 'Information',
    cell: ({ row: { original } }) => {
      const state = KEYCLOACK_STATES.find((state) => state.value === original.type);
      return (
        <div className="flex h-full items-center justify-between">
          <span>
            {state?.label ?? 'Événement inconnu'} de {original.fullName || original.username || 'inconnu'}
          </span>
          {!!state && <BsFillCircleFill color={state.color} height={20} width={20} />}
        </div>
      );
    },
  }),
  columnHelper.display({ header: 'Adresse IP', cell: ({ row: { original } }) => original.ipAddress }),
  columnHelper.display({
    header: 'Pays',
    cell: ({ row: { original } }) => {
      const countryData = countries.find((country) => country.name === original.country);
      return (
        <div className="flex items-center justify-center gap-x-1">
          <span>{original.country || 'Pays inconnu'}</span>
          {!!countryData && <img src={countryData.flag} alt={`Drapeau de ${original.country}`} height={25} width={25} />}
        </div>
      );
    },
  }),
];

type AppViewDashboardViewLatestConnectionsComponentTableComponentProps = Readonly<{
  data: Array<KeycloakEventDetailsResponseDto> | undefined;
  isLoading: boolean;
}>;
export default function AppViewDashboardViewLatestConnectionsComponentTableComponent({
  data,
  isLoading,
}: AppViewDashboardViewLatestConnectionsComponentTableComponentProps) {
  return (
    <div className={styles.table_container}>
      <TableComponent data={data} isLoading={isLoading} columns={columns} rowId={'id'} />
    </div>
  );
}
