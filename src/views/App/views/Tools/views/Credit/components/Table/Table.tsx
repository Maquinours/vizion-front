import { createColumnHelper } from '@tanstack/react-table';
import TableComponent from '../../../../../../../../components/Table/Table';
import { useMemo } from 'react';
import { BusinessCreditRow } from '../../Credit';
import styles from './Table.module.scss';
import AmountFormat from '../../../../../../../../components/AmountFormat/AmountFormat';
import CurrencyFormat from '../../../../../../../../components/CurrencyFormat/CurrencyFormat';

const columnHelper = createColumnHelper<BusinessCreditRow>();

type AppViewToolsViewCreditsViewTableComponentProps = {
  items: Array<BusinessCreditRow>;
  setItems: React.Dispatch<React.SetStateAction<Array<BusinessCreditRow>>>;
};
export default function AppViewToolsViewCreditsViewTableComponent({ items, setItems }: AppViewToolsViewCreditsViewTableComponentProps) {
  const columns = useMemo(
    () => [
      columnHelper.display({
        header: 'Référence',
        cell: ({ row: { original } }) => (
          <input
            type="text"
            value={original.detail.productReference ?? ''}
            onChange={(e) =>
              setItems((items) =>
                items.map((item) => (item.detail.id === original.detail.id ? { ...item, detail: { ...item.detail, productReference: e.target.value } } : item)),
              )
            }
          />
        ),
      }),
      columnHelper.display({
        header: 'Désignation',
        cell: ({ row: { original } }) => (
          <input
            type="text"
            value={original.detail.productDesignation ?? ''}
            onChange={(e) =>
              setItems((items) =>
                items.map((item) =>
                  item.detail.id === original.detail.id ? { ...item, detail: { ...item.detail, productDesignation: e.target.value } } : item,
                ),
              )
            }
          />
        ),
      }),
      columnHelper.display({
        header: 'Quantité facturée',
        cell: ({ row: { original } }) => (
          <AmountFormat
            displayType="input"
            value={original.detail.quantity}
            decimalScale={0}
            onChange={(e) =>
              setItems((items) =>
                items.map((item) =>
                  item.detail.id === original.detail.id ? { ...item, detail: { ...item.detail, quantity: parseInt(e.target.value) } } : item,
                ),
              )
            }
          />
        ),
      }),
      columnHelper.display({
        header: 'Quantité pour Avoir',
        cell: ({ row: { original } }) => (
          <AmountFormat
            displayType="input"
            value={original.quantity}
            decimalScale={0}
            onChange={(e) =>
              setItems((items) => items.map((item) => (item.detail.id === original.detail.id ? { ...item, quantity: parseInt(e.target.value) } : item)))
            }
          />
        ),
      }),
      columnHelper.display({
        header: 'Prix Facture',
        cell: ({ row: { original } }) => (
          <CurrencyFormat
            displayType="input"
            value={original.detail.unitPrice ?? undefined}
            onValueChange={(v) =>
              setItems((items) =>
                items.map((item) => (item.detail.id === original.detail.id ? { ...item, detail: { ...item.detail, unitPrice: parseFloat(v.value) } } : item)),
              )
            }
          />
        ),
      }),
      columnHelper.display({
        header: 'Prix Avoir',
        cell: ({ row: { original } }) => (
          <CurrencyFormat
            displayType="input"
            value={original.price}
            onValueChange={(v) =>
              setItems((items) => items.map((item) => (item.detail.id === original.detail.id ? { ...item, price: parseFloat(v.value) } : item)))
            }
          />
        ),
      }),
    ],
    [setItems],
  );

  return (
    <div className={styles.table_container}>
      <TableComponent data={items} isLoading={false} columns={columns} />
    </div>
  );
}
