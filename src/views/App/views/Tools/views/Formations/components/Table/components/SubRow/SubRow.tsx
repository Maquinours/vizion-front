import { Row } from '@tanstack/react-table';
import FormationResponseDto from '../../../../../../../../../../utils/types/FormationResponseDto';
import styles from './SubRow.module.scss';

type AppViewToolsViewFormationsViewTableComponentSubRowComponentProps = Readonly<{ row: Row<FormationResponseDto> }>;
export default function AppViewToolsViewFormationsViewTableComponentSubRowComponent({ row }: AppViewToolsViewFormationsViewTableComponentSubRowComponentProps) {
  return (
    <tr className={styles.sub_row}>
      <td colSpan={7}>
        <div className={styles.sub_row_content}>
          <div dangerouslySetInnerHTML={{ __html: row.original.content }} />
        </div>
      </td>
    </tr>
  );
}
