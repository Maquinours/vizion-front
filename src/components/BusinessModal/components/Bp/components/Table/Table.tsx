import { VirtualElement } from '@popperjs/core';
import { useQuery } from '@tanstack/react-query';
import { Row, createColumnHelper } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';
import { BiLinkExternal } from 'react-icons/bi';
import { queries } from '../../../../../../utils/constants/queryKeys';
import BusinessBpDetailsResponseDto from '../../../../../../utils/types/BusinessBpDetailsResponseDto';
import BusinessBpResponseDto from '../../../../../../utils/types/BusinessBpResponseDto';
import BusinessBpSerialResponseDto from '../../../../../../utils/types/BusinessBpSerialResponseDto';
import BusinessResponseDto from '../../../../../../utils/types/BusinessResponseDto';
import { useAuthentifiedUserQuery } from '../../../../../../views/App/utils/functions/getAuthentifiedUser';
import AmountFormat from '../../../../../AmountFormat/AmountFormat';
import TableComponent from '../../../../../Table/Table';
import TableRowExpandButtonComponent from '../../../../../TableRowExpandButton/TableRowExpandButton';
import BusinessModalComponentBpComponentTableComponentDetailContextMenuComponent from './components/DetailContextMenu/DetailContextMenu';
import BusinessModalComponentBpComponentTableComponentSerialContextMenuComponent from './components/SerialContextMenu/SerialContextMenu';
import AppViewBusinessViewBpViewTableComponentSubRowComponent from './components/SubRow/SubRow';
import styles from './Table.module.scss';

// const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/bp');

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
  {
    name: 'V4.7',
    title: "Version 4.7 de l'enregistreur",
    date: new Date('2024-11-11'),
    patchNoteUrl: 'https://bd.vizeo.eu/5-Firmwares/Firmwares/Enregistreurs/HD516/HD516e/info.txt',
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

type BusinessModalComponentBpComponentTableComponentProps = Readonly<{
  business: BusinessResponseDto;
  bp: BusinessBpResponseDto;
  onUpdateDetailClick: (detail: BusinessBpDetailsResponseDto) => void;
  onAddSerialClick: (detail: BusinessBpDetailsResponseDto) => void;
  onDeleteDetailClick: (detail: BusinessBpDetailsResponseDto) => void;
  onCreateDetailRmaClick: (detail: BusinessBpDetailsResponseDto) => void;
  onCreateSerialRmaClick: (serial: BusinessBpSerialResponseDto) => void;
  onDeleteSerialClick: (serial: BusinessBpSerialResponseDto) => void;
}>;
export default function BusinessModalComponentBpComponentTableComponent({
  business,
  bp,
  onUpdateDetailClick,
  onAddSerialClick,
  onDeleteDetailClick,
  onCreateDetailRmaClick,
  onCreateSerialRmaClick,
  onDeleteSerialClick,
}: BusinessModalComponentBpComponentTableComponentProps) {
  // const { businessId } = routeApi.useParams();

  const [detailContextMenuAnchor, setDetailContextMenuAnchor] = useState<VirtualElement | undefined>(undefined);
  const [detail, setDetail] = useState<BusinessBpDetailsResponseDto>();
  const [serialContextMenuAnchor, setSerialContextMenuAnchor] = useState<VirtualElement | undefined>(undefined);
  const [serial, setSerial] = useState<BusinessBpSerialResponseDto>();

  const { data: stocks } = useQuery(queries['product-stocks'].list._ctx.all);
  const { data: user } = useAuthentifiedUserQuery();
  // const { data: bp } = useSuspenseQuery(queries['business-bps'].detail._ctx.byBusinessId(businessId));

  const onSerialNumberContextMenu = (e: React.MouseEvent, serialNumber: BusinessBpSerialResponseDto) => {
    e.preventDefault();
    e.stopPropagation();
    setSerial(serialNumber);
    setSerialContextMenuAnchor(getAnchor(e));
  };

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
                    const { isNvr, version } = (() => {
                      const isNvr = serialNumber.numSerie.toUpperCase().startsWith('B0');
                      const version = isNvr && !!createdDate ? NVR_VERSIONS.find((version) => version.date <= createdDate) : undefined;
                      return { isNvr, version };
                    })();
                    return (
                      <li key={serialNumber.id} onContextMenu={(e) => onSerialNumberContextMenu(e, serialNumber)} className="flex justify-center gap-x-1">
                        <span>{serialNumber.numSerie}</span>
                        {isNvr && (
                          <>
                            {!!version && (
                              <a
                                href={version.patchNoteUrl}
                                target="_blank"
                                rel="noreferrer"
                                title={version.title}
                                className="mx-1 rounded-md bg-[#f24c52] p-1 text-xs text-white"
                              >
                                {version.name}
                              </a>
                            )}
                            <a
                              href={`https://myvizeo.fr/webproxy/home?id=${serialNumber.numSerie}`}
                              target="_blank"
                              title="Accéder à l'enregistreur"
                              rel="noreferrer"
                              style={{ textDecoration: 'revert', color: 'revert' }}
                            >
                              <BiLinkExternal width={13} height={16} />
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
          const stock = stocks?.find((stock) =>
            row.original.productId ? stock.productId === row.original.productId : stock.reference === row.original.productReference,
          );
          return stock && !stock.virtualQty && <AmountFormat value={stock.currentStock} decimalScale={0} />;
        },
      }),
    ],
    [stocks],
  );

  const onRowContextMenu = (e: React.MouseEvent, row: Row<BusinessBpDetailsResponseDto>) => {
    e.preventDefault();
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
      <BusinessModalComponentBpComponentTableComponentDetailContextMenuComponent
        business={business}
        anchorElement={detailContextMenuAnchor}
        setAnchorElement={setDetailContextMenuAnchor}
        item={detail}
        onUpdateDetailClick={onUpdateDetailClick}
        onAddSerialClick={onAddSerialClick}
        onDeleteDetailClick={onDeleteDetailClick}
        onCreateDetailRmaClick={onCreateDetailRmaClick}
      />
      <BusinessModalComponentBpComponentTableComponentSerialContextMenuComponent
        business={business}
        anchorElement={serialContextMenuAnchor}
        setAnchorElement={setSerialContextMenuAnchor}
        item={serial}
        onCreateSerialRmaClick={onCreateSerialRmaClick}
        onDeleteSerialClick={onDeleteSerialClick}
      />
    </>
  );
}
