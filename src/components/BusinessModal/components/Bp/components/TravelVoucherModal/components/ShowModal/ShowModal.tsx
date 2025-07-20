import { useMemo, useState } from 'react';
import ReactModal from 'react-modal';
import styles from './ShowModal.module.scss';
import PaginationComponent from '../../../../../../../Pagination/Pagination';

type BusinessModalComponentBpComponentTravelVoucherModalComponentShowModalComponentProps = {
  show: boolean;
  onClose: () => void;
  data: Array<File> | undefined;
};
export default function BusinessModalComponentBpComponentTravelVoucherModalComponentShowModalComponent({
  show,
  onClose,
  data,
}: BusinessModalComponentBpComponentTravelVoucherModalComponentShowModalComponentProps) {
  const [page, setPage] = useState(0);

  const items = useMemo(() => data?.map((item) => URL.createObjectURL(item)), [data]);
  const item = useMemo(() => items?.at(page), [items, page]);

  return (
    <ReactModal isOpen={show} onRequestClose={onClose} className={styles.show_modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_header}>
          <div className={styles.modal_title}>Bon de transport</div>
        </div>
        <div className={styles.modal_content}>
          <div className={styles.voucher_item}>
            <iframe title="Bon de transport" src={item} />
          </div>

          <div className={styles.modal_pagination}>
            <PaginationComponent page={page} totalPages={items?.length} onPageChange={(page) => setPage(page)} />
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
