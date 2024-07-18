import { Row } from '@tanstack/react-table';
import ProductResponseDto from '../../../../../../../../utils/types/ProductResponseDto';
import styles from './SubRow.module.scss';

type AppViewProductsViewTableComponentSubRowComponentProps = Readonly<{
  row: Row<ProductResponseDto>;
}>;
export default function AppViewProductsViewTableComponentSubRowComponent({ row }: AppViewProductsViewTableComponentSubRowComponentProps) {
  return (
    <>
      <tr className={styles.sub_row}>
        <td colSpan={6}>
          <div className={styles.sub_row_title}>
            Produits associés (<span className="text-secondary">{row.original.reference}</span>)
          </div>
        </td>
      </tr>
      {row.original.associatedProduct?.map((itm, idx) => (
        <tr className={styles.sub_row_content} key={idx}>
          <td>
            <img src={`https://bd.vizeo.eu/6-Photos/${itm.reference}/MINI_${itm.reference}.jpg`} alt={itm.reference ?? undefined} />
          </td>
          <td>
            <p>{itm.reference}</p>
          </td>
          <td>
            <p className={styles.description}>{itm.shortDescription}</p>
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      ))}
    </>
  );
}
