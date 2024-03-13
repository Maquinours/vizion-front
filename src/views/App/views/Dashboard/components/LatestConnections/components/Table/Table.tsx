import { createColumnHelper } from '@tanstack/react-table';
import TableComponent from '../../../../../../../../components/Table/Table';
import KeycloakEventDetailsResponseDto from '../../../../../../../../utils/types/KeycloakEventDetailsResponseDto';
import { formatDateAndHourWithSlash } from '../../../../../../../../utils/functions/dates';
import { KEYCLOACK_STATES } from '../../utils/constants/states';
import { BsFillCircleFill } from 'react-icons/bs';
import styles from './Table.module.scss';

const columnHelper = createColumnHelper<KeycloakEventDetailsResponseDto>();
const columns = [
  columnHelper.display({
    header: 'Date',
    cell: ({ row: { original } }) => <div>{formatDateAndHourWithSlash(original.createdDate)}</div>,
  }),
  columnHelper.display({
    header: 'Information',
    cell: ({ row: { original } }) => {
      const state = KEYCLOACK_STATES.find((state) => state.value === original.type);
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <p>
            {state?.label} de {original?.fullName ? original?.fullName : original?.username}
          </p>
          <p>
            <BsFillCircleFill color={state?.color} height={20} width={20} />
          </p>
        </div>
      );
    },
  }),
  columnHelper.display({ header: 'Addresse IP', cell: ({ row: { original } }) => <div>{original.ipAddress}</div> }),
  columnHelper.display({ header: 'Pays', cell: ({ row: { original } }) => original.country ?? '' }),
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
