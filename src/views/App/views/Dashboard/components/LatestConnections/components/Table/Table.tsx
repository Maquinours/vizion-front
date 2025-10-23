import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import _ from 'lodash';
import { useMemo } from 'react';
import { BsFillCircleFill } from 'react-icons/bs';
import TableComponent from '../../../../../../../../components/Table/Table';
import countries from '../../../../../../../../utils/constants/countries.json';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { formatDateAndHourWithSlash } from '../../../../../../../../utils/functions/dates';
import KeycloakEventDetailsResponseDto from '../../../../../../../../utils/types/KeycloakEventDetailsResponseDto';
import ProfileResponseDto from '../../../../../../../../utils/types/ProfileResponseDto';
import { KEYCLOACK_STATES } from '../../utils/constants/states';
import styles from './Table.module.scss';
import { Link } from '@tanstack/react-router';

const columnHelper = createColumnHelper<{ event: KeycloakEventDetailsResponseDto; profile: ProfileResponseDto | undefined; id: string }>();
const columns = [
  columnHelper.display({
    header: 'Date',
    cell: ({ row: { original } }) => formatDateAndHourWithSlash(original.event.createdDate),
  }),
  columnHelper.display({
    header: 'Information',
    cell: ({ row: { original } }) => {
      const state = KEYCLOACK_STATES.find((state) => state.value === original.event.type);
      return (
        <div className="flex h-full items-center justify-between">
          <span>
            {original.profile ? `${original.profile.firstName} ${original.profile.lastName}` : original.event.fullName || original.event.username || 'Inconnu'}
            {original.profile?.enterprise && (
              <>
                {' '}de{' '}
                <Link to="/app/enterprises/$enterpriseId" params={{ enterpriseId: original.profile.enterprise.id }}>
                  {original.profile.enterprise.name}
                </Link>
              </>
            )}
            {/* {state?.label ?? 'Événement inconnu'} de {original.fullName || original.username || 'inconnu'} {original.en} */}
          </span>
          {!!state && <BsFillCircleFill color={state.color} height={20} width={20} />}
        </div>
      );
    },
  }),
  columnHelper.display({ header: 'Adresse IP', cell: ({ row: { original } }) => original.event.ipAddress }),
  columnHelper.display({
    header: 'Pays',
    cell: ({ row: { original } }) => {
      const countryData = countries.find((country) => country.name === original.event.country);
      return (
        <div className="flex items-center justify-center gap-x-1">
          <span>{original.event.country || 'Pays inconnu'}</span>
          {!!countryData && <img src={countryData.flag} alt={`Drapeau de ${original.event.country}`} height={25} width={25} />}
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
  data: events,
  isLoading,
}: AppViewDashboardViewLatestConnectionsComponentTableComponentProps) {
  const uniqueUserIds = _.uniqBy(events ?? [], 'userId')
    .map(({ userId }) => userId)
    .filter((userId): userId is string => !!userId);

  const { data: profiles } = useQuery(queries.profiles.list._ctx.byIds(uniqueUserIds));

  const data = useMemo(
    () => events?.map((event) => ({ event: event, profile: profiles?.find((profile) => profile.userId === event.userId), id: event.id })),
    [events, profiles],
  );

  return (
    <div className={styles.table_container}>
      <TableComponent data={data} isLoading={isLoading} columns={columns} rowId={'id'} />
    </div>
  );
}
