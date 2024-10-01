import { Row } from '@tanstack/react-table';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import ProductFaqResponseDto from '../../../../../../../../../../utils/types/ProductFaqResponseDto';
import styles from './SubRowComponent.module.scss';

type AppViewProductViewManageViewAssociatedFaqsComponentSubRowComponentProps = Readonly<{
  row: Row<ProductFaqResponseDto>;
}>;
export default function AppViewProductViewManageViewAssociatedFaqsComponentSubRowComponent({
  row,
}: AppViewProductViewManageViewAssociatedFaqsComponentSubRowComponentProps) {
  return (
    <tr className={styles.sub_row}>
      <td colSpan={6}>
        <div className={styles.sub_row_content}>{parse(DOMPurify.sanitize(row.original.description))}</div>
      </td>
    </tr>
  );
}
