import { Row, createColumnHelper } from '@tanstack/react-table';
import TableComponent from '../../../../../../../../components/Table/Table';
import BusinessBpDetailsResponseDto from '../../../../../../../../utils/types/BusinessBpDetailsResponseDto';
import React, { useCallback, useMemo, useState } from 'react';
import TableRowExpandButtonComponent from '../../../../../../../../components/TableRowExpandButton/TableRowExpandButton';
import AmountFormat from '../../../../../../../../components/AmountFormat/AmountFormat';
import { BiLinkExternal } from 'react-icons/bi';
import styles from './Table.module.scss';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';
import { getRouteApi } from '@tanstack/react-router';
import AppViewBusinessViewBpViewTableComponentSubRowComponent from './components/SubRow/SubRow';
import AppViewBusinessViewBpViewTableComponentDetailContextMenuComponent from './components/DetailContextMenu/DetailContextMenu';
import { VirtualElement } from '@popperjs/core';
import BusinessBpSerialResponseDto from '../../../../../../../../utils/types/BusinessBpSerialResponseDto';
import AppViewBusinessViewBpViewTableComponentSerialContextMenuComponent from './components/SerialContextMenu/SerialContextMenu';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/bp');

const NVR_VERSIONS = [
  {
    name: 'V2311',
    title: "Version de l'enregistreur datant de novembre 2023",
    date: new Date('2023-11-08'),
    patchNoteUrl: 'https://bd.vizeo.eu/.index.php?p=5-Firmwares%2F3+-MAJ++2023%2FMAJ+HDXXd_e%2FMAJ+11_2023&view=info.txt',
  },
  {
    name: 'V2401',
    title: "Version de l'enregistreur datant de janvier 2024",
    date: new Date('2024-01-15'),
    patchNoteUrl: 'https://bd.vizeo.eu/.index.php?p=5-Firmwares%2F3+-MAJ++2023%2FMAJ+HDXXd_e%2FMAJ+01_2024&view=info.txt',
  },
].sort((a, b) => b.date.getTime() - a.date.getTime());

const columnHelper = createColumnHelper<BusinessBpDetailsResponseDto>();

const getAnchor = (e: React.MouseEvent) => {
  return {
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
  };
};

export default function AppViewBusinessViewBpViewTableComponent() {
  const { businessId } = routeApi.useParams();

  const [detailContextMenuAnchor, setDetailContextMenuAnchor] = useState<VirtualElement | undefined>(undefined);
  const [detail, setDetail] = useState<BusinessBpDetailsResponseDto>();
  const [serialContextMenuAnchor, setSerialContextMenuAnchor] = useState<VirtualElement | undefined>(undefined);
  const [serial, setSerial] = useState<BusinessBpSerialResponseDto>();

  const { data: stocks } = useQuery(queries['product-stocks'].list._ctx.all);
  const { data: user } = useAuthentifiedUserQuery();
  const { data: bp } = useSuspenseQuery(queries['business-bps'].detail._ctx.byBusinessId(businessId));

  const onSerialNumberContextMenu = useCallback(
    (e: React.MouseEvent, serialNumber: BusinessBpSerialResponseDto) => {
      setSerial(serialNumber);
      setSerialContextMenuAnchor(getAnchor(e));
    },
    [setSerial, setSerialContextMenuAnchor],
  );

  const columns = useMemo(
    () => [
      columnHelper.display({
        header: 'Référence',
        cell: ({ row }) => (
          <div className={styles.more_component}>
            {row.original.productReference}
            <div className={styles.sub_component}>
              <TableRowExpandButtonComponent row={row} />
            </div>
          </div>
        ),
      }),
      columnHelper.display({
        header: 'Désignation',
        cell: ({ row }) => row.original.productDesignation,
      }),
      columnHelper.display({
        header: 'Quantité prévue',
        cell: ({ row }) => <AmountFormat value={row.original.quantity} decimalScale={0} />,
      }),
      columnHelper.display({
        header: 'Quantité préparée',
        cell: ({ row }) => <AmountFormat value={row.original.quantityPrep} decimalScale={0} />,
      }),
      columnHelper.display({
        header: 'Colis',
        cell: ({ row }) => row.original.packageNumber,
      }),
      columnHelper.display({
        header: 'Commentaire',
        cell: ({ row }) => row.original.comment,
      }),
      columnHelper.display({
        header: 'Numéro de série',
        cell: ({ row }) => (
          <div style={{ userSelect: 'text', padding: '5px 0' }}>
            {!row.original.bpSerialList || row.original.bpSerialList.length === 0 ? (
              <span>Aucun numéro de série</span>
            ) : (
              <ul>
                {[...row.original.bpSerialList]
                  .sort((a, b) => {
                    if (a.numSerie < b.numSerie) return -1;
                    else if (a.numSerie > b.numSerie) return 1;
                    return 0;
                  })
                  .map((serialNumber) => {
                    const createdDate = serialNumber.createdDate ? new Date(serialNumber.createdDate) : undefined;
                    const version =
                      serialNumber.numSerie.toUpperCase().startsWith('B0') && createdDate
                        ? NVR_VERSIONS.find((version) => version.date <= createdDate)
                        : undefined;
                    return (
                      <li key={serialNumber.id} onContextMenu={(e) => onSerialNumberContextMenu(e, serialNumber)}>
                        <span>{serialNumber.numSerie}</span>
                        {version && (
                          <>
                            <a
                              href={version.patchNoteUrl}
                              target="_blank"
                              rel="noreferrer"
                              title={version.title}
                              style={{
                                backgroundColor: 'rgb(242, 76, 82)',
                                color: 'rgb(255 255 255)',
                                fontSize: 10,
                                marginLeft: 5,
                                marginRight: 5,
                                borderRadius: '0.375rem',
                                padding: 3.5,
                              }}
                            >
                              {version.name}
                            </a>
                            <a
                              href={`https://myvizeo.fr/webproxy/home?id=${serialNumber.numSerie}`}
                              target="_blank"
                              title="Accéder à l'enregistreur"
                              rel="noreferrer"
                            >
                              <BiLinkExternal style={{ textDecoration: 'revert', color: 'revert' }} width={13} height={16} />
                            </a>
                          </>
                        )}
                      </li>
                    );
                  })}
              </ul>
            )}
          </div>
        ),
      }),
      columnHelper.display({
        header: 'Stock',
        cell: ({ row }) => {
          const stock = stocks?.find((stock) => stock.productId === row.original.productId);
          return stock && !stock.virtualQty && <AmountFormat value={stock.currentStock} decimalScale={0} />;
        },
      }),
    ],
    [stocks],
  );

  const onRowContextMenu = (e: React.MouseEvent, row: Row<BusinessBpDetailsResponseDto>) => {
    setDetail(row.original);
    setDetailContextMenuAnchor(getAnchor(e));
  };

  return (
    <>
      <div className={styles.table_container}>
        <TableComponent
          columns={columns}
          data={bp.bpDetailsList}
          isLoading={false}
          getRowCanExpand={() => user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO')}
          renderSubComponent={AppViewBusinessViewBpViewTableComponentSubRowComponent}
          onRowContextMenu={onRowContextMenu}
          getRowClassName={(row) =>
            row.quantity === row.quantityPrep ? styles.success : (row.quantity ?? 0) > (row.quantityPrep ?? 0) ? styles.warning : styles.danger
          }
        />
      </div>
      <AppViewBusinessViewBpViewTableComponentDetailContextMenuComponent
        anchorElement={detailContextMenuAnchor}
        setAnchorElement={setDetailContextMenuAnchor}
        item={detail}
      />
      <AppViewBusinessViewBpViewTableComponentSerialContextMenuComponent
        anchorElement={serialContextMenuAnchor}
        setAnchorElement={setSerialContextMenuAnchor}
        item={serial}
      />
    </>
  );
}
