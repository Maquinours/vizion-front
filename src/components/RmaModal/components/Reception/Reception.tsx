import { useMemo, useState } from 'react';
import AssistanceResponseDto from '../../../../utils/types/AssistanceResponseDto';
import styles from './Reception.module.scss';
import RmaModalComponentReceptionComponentFooterComponent from './components/Footer/Footer';
import RmaModalComponentReceptionComponentHeaderComponent from './components/Header/Header';
import RmaModalComponentReceptionComponentTableComponent from './components/Table/Table';
import RmaModalComponentReceptionComponentCreateDetailModalView from './components/CreateDetailModal/CreateDetailModal';
import RmaModalComponentReceptionComponentPdfModalComponent from './components/PdfModal/PdfModal';

enum ModalType {
  CREATE_DETAIL,
  PDF,
}

type ModalData = { modal: ModalType.CREATE_DETAIL } | { modal: ModalType.PDF };

type RmaModalComponentReceptionComponentProps = {
  rma: AssistanceResponseDto;
  navigateToNextStep: () => void;
};
export default function RmaModalComponentReceptionComponent({ rma, navigateToNextStep }: RmaModalComponentReceptionComponentProps) {
  const [modalData, setModalData] = useState<ModalData>();

  const modal = useMemo(() => {
    switch (modalData?.modal) {
      case ModalType.CREATE_DETAIL:
        return <RmaModalComponentReceptionComponentCreateDetailModalView rma={rma} onClose={() => setModalData(undefined)} />;
      case ModalType.PDF:
        return <RmaModalComponentReceptionComponentPdfModalComponent rma={rma} onClose={() => setModalData(undefined)} />;
    }
  }, [modalData]);

  return (
    <>
      <div className={styles.container}>
        <RmaModalComponentReceptionComponentHeaderComponent
          rma={rma}
          onCreateDetailClick={() => setModalData({ modal: ModalType.CREATE_DETAIL })}
          onEditClick={() => setModalData({ modal: ModalType.PDF })}
        />
        <div className={styles.grid}>
          <RmaModalComponentReceptionComponentTableComponent rma={rma} />
          <RmaModalComponentReceptionComponentFooterComponent rma={rma} navigateToNextStep={navigateToNextStep} />
        </div>
      </div>
      {modal}
      {/* <Outlet /> */}
    </>
  );
}
