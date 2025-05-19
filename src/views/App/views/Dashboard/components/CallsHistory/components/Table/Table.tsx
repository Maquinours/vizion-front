import { VirtualElement } from '@popperjs/core';
import { createColumnHelper } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import TableComponent from '../../../../../../../../components/Table/Table';
import { formatDateAndHourWithSlash } from '../../../../../../../../utils/functions/dates';
import AircallCallResponseDto from '../../../../../../../../utils/types/AircallCallResponseDto';
import ProfileResponseDto from '../../../../../../../../utils/types/ProfileResponseDto';
import AppViewDashboardViewCallsHistoryComponentTableComponentContextMenuComponent from './components/ContextMenu/ContextMenu';
import styles from './Table.module.scss';

const columnHelper = createColumnHelper<AircallCallResponseDto>();

interface AppViewDashboardViewCallsHistoryComponentTableComponentProps {
  data: Array<AircallCallResponseDto> | undefined;
  isLoading: boolean;
  getProfileFromPhoneNumber: (phoneNumber: string) => ProfileResponseDto | undefined;
}
export default function AppViewDashboardViewCallsHistoryComponentTableComponent({
  data,
  getProfileFromPhoneNumber,
  isLoading,
}: AppViewDashboardViewCallsHistoryComponentTableComponentProps) {
  const [contextMenuAnchor, setContextMenuAnchor] = useState<VirtualElement>();
  const [number, setNumber] = useState<string>();
  const [profile, setProfile] = useState<ProfileResponseDto>();

  const onCellContextMenu = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>, number: string, profile: ProfileResponseDto | undefined) => {
      event.preventDefault();
      setNumber(number);
      setProfile(profile);
      setContextMenuAnchor({
        getBoundingClientRect: () => ({
          width: 0,
          height: 0,
          x: event.clientX,
          y: event.clientY,
          top: event.clientY,
          right: event.clientX,
          bottom: event.clientY,
          left: event.clientX,
          toJSON: () => {},
        }),
      });
    },
    [setNumber, setContextMenuAnchor],
  );

  const columns = useMemo(
    () => [
      columnHelper.display({
        header: 'Date & Heure',
        cell: ({ row: { original } }) => formatDateAndHourWithSlash(original.started_at * 1_000),
      }),
      columnHelper.display({
        header: 'De',
        cell: ({ row: { original } }) => {
          if (original.direction === 'inbound') {
            const profile = getProfileFromPhoneNumber(original.raw_digits);
            const result = (() => {
              if (profile) return `${profile.enterprise?.name ?? ''} / ${profile.firstName ?? ''} ${profile.lastName ?? ''}`;
              else return `Inconnu ${original.raw_digits}`;
            })();
            return <div onContextMenu={(e) => onCellContextMenu(e, original.raw_digits, profile)}>{result}</div>;
          } else if (original.direction === 'outbound') return original.user?.name;
        },
      }),
      columnHelper.display({
        header: 'À',
        cell: ({ row: { original } }) => {
          if (original.direction === 'inbound') return original.user?.name ?? <b>Non répondu</b>;
          else if (original.direction === 'outbound') {
            const profile = getProfileFromPhoneNumber(original.raw_digits);
            const result = (() => {
              if (profile) return `${profile.enterprise?.name ?? ''} / ${profile.firstName ?? ''} ${profile.lastName ?? ''}`;
              else return `Inconnu ${original.raw_digits}`;
            })();
            return <div onContextMenu={(e) => onCellContextMenu(e, original.raw_digits, profile)}>{result}</div>;
          }
        },
      }),
    ],
    [getProfileFromPhoneNumber],
  );

  return (
    <>
      <div className={styles.table_container}>
        <TableComponent columns={columns} data={data} isLoading={isLoading} />
      </div>
      <AppViewDashboardViewCallsHistoryComponentTableComponentContextMenuComponent
        anchorElement={contextMenuAnchor}
        setAnchorElement={setContextMenuAnchor}
        number={number}
        profile={profile}
      />
    </>
  );
}
