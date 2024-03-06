import ReactModal from 'react-modal';
import TableComponent from '../../../Table/Table';
import { Row, createColumnHelper } from '@tanstack/react-table';
import PredefinedMessageResponseDto from '../../../../utils/types/PredefinedMessageResponseDto';
import { useQuery } from '@tanstack/react-query';
import { predefinedMessageQueryKeys } from '../../../../utils/constants/queryKeys/predefinedMessage';
import { getAllPredefinedMessages } from '../../../../utils/api/predefinedMessage';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { SendEmailFormSchema } from '../../SendEmail';
import React from 'react';
import styles from './PredefinedMessagesModal.module.scss';

const columnHelper = createColumnHelper<PredefinedMessageResponseDto>();
const columns = [
  columnHelper.display({ header: 'Nom', cell: ({ row: { original } }) => <div>{original.title}</div> }),
  columnHelper.display({ header: 'Description', cell: ({ row: { original } }) => <div dangerouslySetInnerHTML={{ __html: original.description }} /> }),
];

type SendEmailComponentPredefinedMessagesModalComponentProps = Readonly<{
  watch: UseFormWatch<SendEmailFormSchema>;
  setValue: UseFormSetValue<SendEmailFormSchema>;
  onClose: () => void;
}>;

export default function SendEmailComponentPredefinedMessagesModalComponent({
  watch,
  setValue,
  onClose,
}: SendEmailComponentPredefinedMessagesModalComponentProps) {
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
            <TableComponent columns={columns} isLoading={isLoading} data={data} onRowClick={onRowClick} />
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
