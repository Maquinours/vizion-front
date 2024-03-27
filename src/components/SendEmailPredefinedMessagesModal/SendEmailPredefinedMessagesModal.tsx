import { useQuery } from '@tanstack/react-query';
import { predefinedMessageQueryKeys } from '../../utils/constants/queryKeys/predefinedMessage';
import { getAllPredefinedMessages } from '../../utils/api/predefinedMessage';
import { Row, createColumnHelper } from '@tanstack/react-table';
import PredefinedMessageResponseDto from '../../utils/types/PredefinedMessageResponseDto';
import { SendEmailFormContext } from '../SendEmail/utils/contexts/sendEmail';
import ReactModal from 'react-modal';
import TableComponent from '../Table/Table';
import styles from './SendEmailPredefinedMessagesModal.module.scss';
import { useContext } from 'react';

const columnHelper = createColumnHelper<PredefinedMessageResponseDto>();
const columns = [
  columnHelper.display({ header: 'Nom', cell: ({ row: { original } }) => <div>{original.title}</div> }),
  columnHelper.display({ header: 'Description', cell: ({ row: { original } }) => <div dangerouslySetInnerHTML={{ __html: original.description }} /> }),
];

type SendEmailPredefinedMessagesModalComponent = Readonly<{
  onClose: () => void;
}>;
export default function SendEmailPredefinedMessagesModalComponent({ onClose }: SendEmailPredefinedMessagesModalComponent) {
  const { watch, setValue } = useContext(SendEmailFormContext)!;

  const { data, isLoading } = useQuery({
    queryKey: predefinedMessageQueryKeys.listAll(),
    queryFn: getAllPredefinedMessages,
  });

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
