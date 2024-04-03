import { Row } from '@tanstack/react-table';
import NewsResponseDto from '../../../../../../../../../../utils/types/NewsResponseDto';
import styles from './SubRow.module.scss';

type AppViewToolsViewNewsViewTableComponentSubRowComponentProps = Readonly<{
  row: Row<NewsResponseDto>;
}>;
export default function AppViewToolsViewNewsViewTableComponentSubRowComponent({ row }: AppViewToolsViewNewsViewTableComponentSubRowComponentProps) {
  return (
    <tr className={styles.sub_row}>
      <td colSpan={8}>
        <div className={styles.sub_row_content}>
          <div dangerouslySetInnerHTML={{ __html: row.original.content }} />
        </div>
      </td>
    </tr>
  );
}
