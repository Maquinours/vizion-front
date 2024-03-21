import { useMemo, useState } from 'react';
import ReactModal from 'react-modal';
import styles from './StepTwo.module.scss';
import PaginationComponent from '../../../../../../../../components/Pagination/Pagination';

type AppViewEnterprisesViewCreateContactTravelVoucherModalViewStepTwoComponentProps = Readonly<{
  isOpen: boolean;
  files: Array<File> | undefined;
  onClose: () => void;
}>;
export default function AppViewEnterprisesViewCreateContactTravelVoucherModalViewStepTwoComponent({
  isOpen,
  files,
  onClose,
}: AppViewEnterprisesViewCreateContactTravelVoucherModalViewStepTwoComponentProps) {
  const [page, setPage] = useState(0);

  const travelVouchers = useMemo(() => files?.map((file) => URL.createObjectURL(file)), [files]);

  const travelVoucher = useMemo(() => travelVouchers?.at(page), [travelVouchers, page]);

  return (
    <ReactModal isOpen={isOpen} onRequestClose={onClose} className={styles.voucher_modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_header}>
          <div className={styles.modal_title}>Bon de transport</div>
        </div>
        <div className={styles.modal_content}>
          {travelVoucher && (
            <div className={styles.voucher_item}>
              <iframe title="Bon de transport" src={travelVoucher}></iframe>
            </div>
          )}

          <div className={styles.modal_pagination}>
            <PaginationComponent page={page} totalPages={travelVouchers?.length} onPageChange={(page) => setPage(page)} />
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
