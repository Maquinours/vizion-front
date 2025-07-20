import { useQuery } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import styles from './SubRow.module.scss';
import BusinessBpDetailsResponseDto from '../../../../../../../../utils/types/BusinessBpDetailsResponseDto';
import { queries } from '../../../../../../../../utils/constants/queryKeys';

type AppViewBusinessViewBpViewTableComponentSubRowComponentProps = {
  row: Row<BusinessBpDetailsResponseDto>;
};
export default function AppViewBusinessViewBpViewTableComponentSubRowComponent({ row }: AppViewBusinessViewBpViewTableComponentSubRowComponentProps) {
  const { data: stocks } = useQuery({
    ...queries['product-version-stocks'].list._ctx.byProductId(row.original.productId ?? ''),
    enabled: !!row.original.productId,
  });

  return (
    <>
      <tr className={styles.sub_row}>
        <td colSpan={6}>
          <div className={styles.sub_row_title}>
            Stock de version (<span className="text-secondary">{row.original.productReference}</span>)
          </div>
        </td>
      </tr>
      {stocks
        ?.filter((stock) => stock.productVersionRef === row.original.productReference)
        .map((stock) => (
          <tr className={styles.sub_row_content} key={stock.id}>
            <td colSpan={6}>
              <div>{stock.productVersionRef}</div>
            </td>
            <td colSpan={1}>
              <div>
                <ul>
                  {row.original.bpSerialList
                    ?.filter((serial) => serial.productVersionReference === stock.productVersionRef)
                    .map((serial) => (
                      <li key={serial.id}>{serial.numSerie}</li>
                    ))}
                </ul>
              </div>
            </td>
            <td colSpan={1}>
              <div>{stock.currentStock}</div>
            </td>
            <td colSpan={1}>
              <div></div>
            </td>
          </tr>
        ))}
    </>
  );
}
