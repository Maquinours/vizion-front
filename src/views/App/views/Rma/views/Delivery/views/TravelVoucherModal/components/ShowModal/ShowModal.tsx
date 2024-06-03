import ReactModal from 'react-modal';
import styles from './ShowModal.module.scss';
import { useMemo, useState } from 'react';
import PaginationComponent from '../../../../../../../../../../components/Pagination/Pagination';

type AppViewRmaViewDeliveryViewTravelVoucherModalViewShowModalViewProps = Readonly<{
  show: boolean;
  onClose: () => void;
  data: Array<File> | undefined;
}>;
export default function AppViewRmaViewDeliveryViewTravelVoucherModalViewShowModalComponent({
  show,
  onClose,
  data,
}: AppViewRmaViewDeliveryViewTravelVoucherModalViewShowModalViewProps) {
  const [page, setPage] = useState(0);

  const item = useMemo(() => {
    const item = data?.at(page);
    return item ? URL.createObjectURL(item) : undefined;
  }, [data, page]);

  return (
    <ReactModal isOpen={show} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_header}>
          <div className={styles.modal_title}>Bon de transport</div>
        </div>
        <div className={styles.modal_content}>
          <div className={styles.voucher_item}>
            <iframe title="Bon de transport" src={item}></iframe>
          </div>
          <div className={styles.modal_pagination}>
            <PaginationComponent page={page} totalPages={data?.length} onPageChange={(page) => setPage(page)} />
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
