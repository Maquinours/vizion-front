import TableComponent from '../../../../../../../../../../components/Table/Table';
import { createColumnHelper } from '@tanstack/react-table';
import ProductSerialNumberRequestDto from '../../../../../../../../../../utils/types/ProductSerialNumberRequestDto';
import { FaTrash } from 'react-icons/fa';
import ProductSerialListRequestDto from '../../../../../../../../../../utils/types/ProductSerialListRequestDto';
import { useMemo } from 'react';
import { ClipLoader } from 'react-spinners';
import styles from './Table.module.scss';
import { UseMutateFunction } from '@tanstack/react-query';
import ProductSerialNumberResponseDto from '../../../../../../../../../../utils/types/ProductSerialNumberResponseDto';

const columnHelper = createColumnHelper<ProductSerialNumberRequestDto>();

type AppViewProductsViewSerialNumbersModalViewCreateModalViewTableComponentProps = Readonly<{
  requestData: ProductSerialListRequestDto | undefined;
  setRequestData: React.Dispatch<React.SetStateAction<ProductSerialListRequestDto | undefined>>;
  isPending: boolean;
  mutate: UseMutateFunction<ProductSerialNumberResponseDto[], Error, void, unknown>;
}>;
export default function AppViewProductsViewSerialNumbersModalViewCreateModalViewTableComponent({
  requestData,
  setRequestData,
  isPending,
  mutate,
}: AppViewProductsViewSerialNumbersModalViewCreateModalViewTableComponentProps) {
  const removeSerialNumber = (serialNumber: string) => {
    setRequestData((prev) => ({
      ...prev,
      serialNumberDtoList: prev!.serialNumberDtoList!.filter((item) => item.serialNumber !== serialNumber),
    }));
  };

  const columns = useMemo(
    () => [
      columnHelper.display({
        header: 'Référence',
        cell: ({ row: { original } }) => original.productVersionRef,
      }),
      columnHelper.display({
        header: 'Numéro de série',
        cell: ({ row: { original } }) => original.serialNumber,
      }),
      columnHelper.display({
        id: 'actions',
        cell: ({ row: { original } }) => (
          <button onClick={() => removeSerialNumber(original.serialNumber!)}>
            <FaTrash width="18" height="18" color="#F24C52" />
          </button>
        ),
      }),
    ],
    [],
  );

  if (requestData?.serialNumberDtoList && requestData.serialNumberDtoList.length > 0)
    return (
      <div className={styles.list_container}>
        <div className={styles.table_container}>
          <TableComponent columns={columns} data={requestData.serialNumberDtoList!} />
        </div>

        <div className={styles.loader}>
          <ClipLoader color="#31385A" loading={isPending} className="" size={30} speedMultiplier={0.5} />
        </div>
        <div className={styles.buttons_container}>
          <button className="btn btn-secondary" onClick={() => mutate()}>
            {"Valider l'import"}
          </button>
        </div>
      </div>
    );
}
