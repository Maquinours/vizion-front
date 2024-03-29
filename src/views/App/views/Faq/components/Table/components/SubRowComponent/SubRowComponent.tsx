import { Row } from '@tanstack/react-table';
import FaqResponseDto from '../../../../../../../../utils/types/FaqResponseDto';
import styles from './SubRowComponent.module.scss';

type AppViewFaqViewTableComponentSubRowComponentProps = Readonly<{
  row: Row<FaqResponseDto>;
}>;
export default function AppViewFaqViewTableComponentSubRowComponent({ row }: AppViewFaqViewTableComponentSubRowComponentProps) {
  return (
    <tr className={styles.sub_row}>
      <td colSpan={6}>
        <div className={styles.sub_row_content}>
          <div dangerouslySetInnerHTML={{ __html: row.original.description }} />
        </div>
      </td>
    </tr>
  );
}
