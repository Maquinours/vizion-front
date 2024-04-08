import { useQuery } from '@tanstack/react-query';
import { Row, createColumnHelper } from '@tanstack/react-table';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import { useContext } from 'react';
import ReactModal from 'react-modal';
import { queries } from '../../utils/constants/queryKeys';
import PredefinedMessageResponseDto from '../../utils/types/PredefinedMessageResponseDto';
import { SendEmailFormContext } from '../SendEmail/utils/contexts/sendEmail';
import TableComponent from '../Table/Table';
import styles from './SendEmailPredefinedMessagesModal.module.scss';

const columnHelper = createColumnHelper<PredefinedMessageResponseDto>();
const columns = [
  columnHelper.display({ header: 'Nom', cell: ({ row: { original } }) => <div>{original.title}</div> }),
  columnHelper.display({ header: 'Description', cell: ({ row: { original } }) => parse(DOMPurify.sanitize(original.description)) }),
];

type SendEmailPredefinedMessagesModalComponent = Readonly<{
  onClose: () => void;
}>;
export default function SendEmailPredefinedMessagesModalComponent({ onClose }: SendEmailPredefinedMessagesModalComponent) {
  const { watch, setValue } = useContext(SendEmailFormContext)!;

  const { data, isLoading } = useQuery(queries['predefined-message'].list);

  const onRowClick = (_e: React.MouseEvent, row: Row<PredefinedMessageResponseDto>) => {
    setValue('content', row.original.description + watch('content'));
    onClose();
  };

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.message_modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_header}>
          <div className={styles.modal_title}>
            <p>Messages prédéfinis</p>
          </div>
        </div>
        <div className={styles.modal_content}>
          <div className={styles.table_content}>
            <TableComponent columns={columns} isLoading={isLoading} data={data} onRowClick={onRowClick} rowId={'id'} />
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
