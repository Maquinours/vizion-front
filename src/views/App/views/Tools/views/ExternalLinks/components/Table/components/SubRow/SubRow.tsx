import { Row } from '@tanstack/react-table';
import ExternalLinkResponseDto from '../../../../../../../../../../utils/types/ExternalLinkResponseDto';
import styles from './SubRow.module.scss';

type AppViewToolsViewExternalLinksViewTableComponentSubRowComponentProps = Readonly<{
  row: Row<ExternalLinkResponseDto>;
}>;
export default function AppViewToolsViewExternalLinksViewTableComponentSubRowComponent({
  row,
}: AppViewToolsViewExternalLinksViewTableComponentSubRowComponentProps) {
  return (
    <tr className={styles.sub_row}>
      <td>
        <div className={styles.sub_row_content}>
          <div dangerouslySetInnerHTML={{ __html: row.original.description }} />
        </div>
      </td>
    </tr>
  );
}
