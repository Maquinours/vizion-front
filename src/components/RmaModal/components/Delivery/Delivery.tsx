import { useMemo, useState } from 'react';
import AssistanceResponseDto from '../../../../utils/types/AssistanceResponseDto';
import RmaModalComponentDeliveryComponentHeaderComponent from './components/Header/Header';
import AppViewRmaViewDeliveryViewTableComponent from './components/Table/Table';
import styles from './Delivery.module.scss';
import RmaModalComponentDeliveryComponentCreateDetailModalView from './components/CreateDetailModal/CreateDetailModal';
import RmaModalComponentDeliveryComponentTravelVoucherModalComponent from './components/TravelVoucherModal/TravelVoucherModal';
import RmaModalComponentDeliveryComponentPdfModalComponent from './components/PdfModal/PdfModal';

// const routeApi = getRouteApi('/app/businesses-rma_/rma/$rmaId/delivery');

enum ModalType {
  CREATE_DETAIL,
  TRAVEL_VOUCHER,
  PDF,
}

type ModalData = { modal: ModalType.CREATE_DETAIL } | { modal: ModalType.TRAVEL_VOUCHER } | { modal: ModalType.PDF };

type RmaModalComponentDeliveryComponentProps = {
  rma: AssistanceResponseDto;
};
export default function RmaModalComponentDeliveryComponent({ rma }: RmaModalComponentDeliveryComponentProps) {
  // const { rmaId } = routeApi.useParams();

  // const { data: rma } = useSuspenseQuery(queries.rmas.detail(rmaId));

  const [modalData, setModalData] = useState<ModalData>();

  const modal = useMemo(() => {
    switch (modalData?.modal) {
      case ModalType.CREATE_DETAIL:
        return <RmaModalComponentDeliveryComponentCreateDetailModalView rma={rma} onClose={() => setModalData(undefined)} />;
      case ModalType.TRAVEL_VOUCHER:
        return <RmaModalComponentDeliveryComponentTravelVoucherModalComponent rma={rma} onClose={() => setModalData(undefined)} />;
      case ModalType.PDF:
        return <RmaModalComponentDeliveryComponentPdfModalComponent rma={rma} onClose={() => setModalData(undefined)} />;
    }
  }, [modalData, rma]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.grid}>
          <RmaModalComponentDeliveryComponentHeaderComponent
            rma={rma}
            onCreateDetailClick={() => setModalData({ modal: ModalType.CREATE_DETAIL })}
            onEditClick={() => setModalData({ modal: ModalType.PDF })}
            onTravelVoucherClick={() => setModalData({ modal: ModalType.TRAVEL_VOUCHER })}
          />
          <div className={styles.rma_number}>
            <div>
              Numéro : <span>{rma.number}</span>
            </div>
          </div>
          <AppViewRmaViewDeliveryViewTableComponent rma={rma} />
        </div>
      </div>
      {modal}
      {/* <Outlet /> */}
    </>
  );
}
