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
import TableRowExpandButtonComponent from '../TableRowExpandButton/TableRowExpandButton';

const columnHelper = createColumnHelper<PredefinedMessageResponseDto>();
const columns = [
  columnHelper.display({
    id: 'expand',
    cell: ({ row }) => (
      <div className="text-center">
        <TableRowExpandButtonComponent row={row} />
      </div>
    ),
  }),
  columnHelper.display({ header: 'Nom', cell: ({ row: { original } }) => <div className="text-center">{original.title}</div> }),
];

const renderSubComponent = (row: Row<PredefinedMessageResponseDto>, onRowClick: (e: React.MouseEvent, row: Row<PredefinedMessageResponseDto>) => void) => (
  <tr onClick={(e) => onRowClick(e, row)}>
    <td colSpan={2} className="bg-[#b4cafcab] p-4">
      {parse(DOMPurify.sanitize(row.original.description))}
    </td>
  </tr>
);

type SendEmailPredefinedMessagesModalComponent = Readonly<{
  onClose: () => void;
}>;
export default function SendEmailPredefinedMessagesModalComponent({ onClose }: SendEmailPredefinedMessagesModalComponent) {
  const { getValues, setValue } = useContext(SendEmailFormContext)!;

  const { data, isLoading } = useQuery(queries['predefined-message'].list);

  const onRowClick = (_e: React.MouseEvent, row: Row<PredefinedMessageResponseDto>) => {
    setValue('content', row.original.description + getValues('content'));
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
            <TableComponent
              columns={columns}
              isLoading={isLoading}
              data={data}
              onRowClick={onRowClick}
              rowId={'id'}
              renderSubComponent={({ row }) => renderSubComponent(row, onRowClick)}
              getRowCanExpand={() => true}
            />
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
