import { VirtualElement } from '@popperjs/core';
import { createColumnHelper } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import TableComponent from '../../../../../../../../components/Table/Table';
import { formatDateAndHourWithSlash } from '../../../../../../../../utils/functions/dates';
import AircallCallResponseDto from '../../../../../../../../utils/types/AircallCallResponseDto';
import ProfileResponseDto from '../../../../../../../../utils/types/ProfileResponseDto';
import AppViewDashboardViewCallsHistoryComponentTableComponentContextMenuComponent from './components/ContextMenu/ContextMenu';
import styles from './Table.module.scss';
import AircallContactResponseDto from '../../../../../../../../utils/types/AircallContactResponseDto';
import AllBusinessResponseDto from '../../../../../../../../utils/types/AllBusinessResponseDto';
import { Link } from '@tanstack/react-router';
import CategoryBusiness from '../../../../../../../../utils/enums/CategoryBusiness';

const columnHelper = createColumnHelper<{
  call: AircallCallResponseDto;
  profile: ProfileResponseDto | undefined;
  allBusiness: AllBusinessResponseDto | undefined;
}>();

interface AppViewDashboardViewCallsHistoryComponentTableComponentProps {
  data: Array<{ call: AircallCallResponseDto; profile: ProfileResponseDto | undefined; allBusiness: AllBusinessResponseDto | undefined }> | undefined;
  isLoading: boolean;
}
export default function AppViewDashboardViewCallsHistoryComponentTableComponent({
  data,
  isLoading,
}: AppViewDashboardViewCallsHistoryComponentTableComponentProps) {
  const [contextMenuAnchor, setContextMenuAnchor] = useState<VirtualElement>();
  const [contextMenuData, setContextMenuData] = useState<{
    number: string;
    contact: AircallContactResponseDto | null;
    profile: ProfileResponseDto | undefined;
  }>();

  const onCellContextMenu = useCallback(
    (event: React.MouseEvent, number: string, contact: AircallContactResponseDto | null, profile: ProfileResponseDto | undefined) => {
      event.preventDefault();
      setContextMenuData({ number, contact, profile });
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
    [setContextMenuData, setContextMenuAnchor],
  );

  const columns = useMemo(
    () => [
      columnHelper.display({
        header: 'Date & Heure',
        cell: ({ row: { original } }) => formatDateAndHourWithSlash(original.call.started_at * 1_000),
      }),
      columnHelper.display({
        header: 'De',
        cell: ({ row: { original } }) => {
          if (original.call.direction === 'inbound') {
            const result = (() => {
              if (original.profile)
                return `${original.profile.enterprise?.name ?? ''} / ${original.profile.firstName ?? ''} ${original.profile.lastName ?? ''}`;
              else return `${original.call.contact?.last_name?.trim() || original.call.contact?.information?.trim() || `Inconnu ${original.call.raw_digits}`}`;
            })();
            if (original.allBusiness) {
              switch (original.allBusiness.category) {
                case CategoryBusiness.AFFAIRE:
                  return (
                    <Link
                      to="/app/businesses-rma/business/$businessId"
                      params={{ businessId: original.allBusiness.businessId }}
                      onContextMenu={(e) => onCellContextMenu(e, original.call.raw_digits, original.call.contact, original.profile)}
                    >
                      {result}
                    </Link>
                  );
                case CategoryBusiness.RMA:
                  return (
                    <Link
                      to="/app/businesses-rma/rma/$rmaId"
                      params={{ rmaId: original.allBusiness.businessId }}
                      onContextMenu={(e) => onCellContextMenu(e, original.call.raw_digits, original.call.contact, original.profile)}
                    >
                      {result}
                    </Link>
                  );
                default:
                  throw new Error('Invalid business category');
              }
            } else return <div onContextMenu={(e) => onCellContextMenu(e, original.call.raw_digits, original.call.contact, original.profile)}>{result}</div>;
          } else if (original.call.direction === 'outbound') return original.call.user?.name;
        },
      }),
      columnHelper.display({
        header: 'À',
        cell: ({ row: { original } }) => {
          if (original.call.direction === 'inbound') return original.call.user?.name ?? <b>Non répondu</b>;
          else if (original.call.direction === 'outbound') {
            const result = (() => {
              if (original.profile)
                return `${original.profile.enterprise?.name ?? ''} / ${original.profile.firstName ?? ''} ${original.profile.lastName ?? ''}`;
              else return `${original.call.contact?.last_name?.trim() || original.call.contact?.information?.trim() || `Inconnu ${original.call.raw_digits}`}`;
            })();
            if (original.allBusiness) {
              switch (original.allBusiness.category) {
                case CategoryBusiness.AFFAIRE:
                  return (
                    <Link
                      to="/app/businesses-rma/business/$businessId"
                      params={{ businessId: original.allBusiness.businessId }}
                      onContextMenu={(e) => onCellContextMenu(e, original.call.raw_digits, original.call.contact, original.profile)}
                    >
                      {result}
                    </Link>
                  );
                case CategoryBusiness.RMA:
                  return (
                    <Link
                      to="/app/businesses-rma/rma/$rmaId"
                      params={{ rmaId: original.allBusiness.businessId }}
                      onContextMenu={(e) => onCellContextMenu(e, original.call.raw_digits, original.call.contact, original.profile)}
                    >
                      {result}
                    </Link>
                  );
                default:
                  throw new Error('Invalid business category');
              }
            } else return <div onContextMenu={(e) => onCellContextMenu(e, original.call.raw_digits, original.call.contact, original.profile)}>{result}</div>;
          }
        },
      }),
    ],
    [onCellContextMenu],
  );

  return (
    <>
      <div className={styles.table_container}>
        <TableComponent columns={columns} data={data} isLoading={isLoading} />
      </div>
      <AppViewDashboardViewCallsHistoryComponentTableComponentContextMenuComponent
        anchorElement={contextMenuAnchor}
        setAnchorElement={setContextMenuAnchor}
        data={contextMenuData}
      />
    </>
  );
}
