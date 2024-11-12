import { createColumnHelper } from '@tanstack/react-table';
import ProductSerialNumberResponseDto from '../../../../../../../../utils/types/ProductSerialNumberResponseDto';
import { IoIosRemoveCircle, IoMdTrash } from 'react-icons/io';
import { MdBusinessCenter } from 'react-icons/md';
import { Link, getRouteApi } from '@tanstack/react-router';
import TableComponent from '../../../../../../../../components/Table/Table';
import styles from './Table.module.scss';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';
import { useMemo } from 'react';
import { HiPencilAlt } from 'react-icons/hi';

const routeApi = getRouteApi('/app/products/serial-numbers');

const columnHelper = createColumnHelper<ProductSerialNumberResponseDto>();

type AppViewProductsViewSerialNumbersModalViewTableComponentProps = Readonly<{
  data: Array<ProductSerialNumberResponseDto> | undefined;
  isLoading: boolean;
}>;
export default function AppViewProductsViewSerialNumbersModalViewTableComponent({
  data,
  isLoading,
}: AppViewProductsViewSerialNumbersModalViewTableComponentProps) {
  const { data: user } = useAuthentifiedUserQuery();

  const columns = useMemo(
    () => [
      columnHelper.display({
        header: 'Numéro de série',
        cell: ({ row: { original } }) => original.serialNumber,
      }),
      columnHelper.display({
        header: 'Produit',
        cell: ({ row: { original } }) => original.productRef,
      }),
      columnHelper.display({
        header: 'Version',
        cell: ({ row: { original } }) => original.productVersionRef,
      }),
      columnHelper.display({
        header: 'Affaire',
        cell: ({ row: { original } }) =>
          !!original.businessNumber &&
          (original.businessId ? (
            <Link to="/app/businesses-rma/business/$businessId" params={{ businessId: original.businessId }}>
              {original.businessNumber}
            </Link>
          ) : (
            <span>{original.businessNumber}</span>
          )),
      }),
      columnHelper.display({
        header: 'Note',
        cell: ({ row: { original } }) => original.note,
      }),
      columnHelper.display({
        id: 'actions',
        cell: ({ row: { original } }) => (
          <div className="flex items-center justify-center gap-x-2 px-2">
            {!!original.businessId && user.userInfo.roles.includes('ROLE_DIRECTION_VIZEO') && (
              <Link
                from={routeApi.id}
                to="remove-from-business/$serialNumberId"
                params={{ serialNumberId: original.id }}
                search
                replace
                resetScroll={false}
                preload="intent"
                title="Retirer le numéro de série de l'affaire"
              >
                <IoIosRemoveCircle size={20} />
              </Link>
            )}
            {!original.businessId && !original.businessNumber && (
              <Link
                from={routeApi.id}
                to="delete/$serialNumberId"
                params={{ serialNumberId: original.id }}
                search
                replace
                resetScroll={false}
                preload="intent"
                title="Supprimer le numéro de série"
              >
                <IoMdTrash size={20} />
              </Link>
            )}
            {original.businessNumber?.startsWith('VZO ') && (
              <Link
                from={routeApi.id}
                to="create-rma/$serialNumberId"
                params={{ serialNumberId: original.id }}
                search
                replace
                resetScroll={false}
                preload="intent"
                title="Créer un RMA à partir du numéro de série"
              >
                <MdBusinessCenter size={20} />
              </Link>
            )}
            <Link
              from={routeApi.id}
              to="update/$serialNumberId"
              params={{ serialNumberId: original.id }}
              search
              replace
              resetScroll={false}
              preload="intent"
              title="Modifier la note du numéro de série"
            >
              <HiPencilAlt size={20} />
            </Link>
          </div>
        ),
      }),
    ],
    [user.userInfo.roles],
  );

  return (
    <div className={styles.table_container}>
      <TableComponent columns={columns} data={data} isLoading={isLoading} />
    </div>
  );
}
