import { useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../utils/constants/queryKeys';
import BusinessResponseDto from '../../../../utils/types/BusinessResponseDto';
import BusinessModalComponentBpComponentFooterComponent from './components/Footer/Footer';
import BusinessModalComponentBpComponentHeaderComponent from './components/Header/Header';
import BusinessModalComponentBpComponentTableComponent from './components/Table/Table';
import BusinessBpDetailsResponseDto from '../../../../utils/types/BusinessBpDetailsResponseDto';
import { useMemo, useState } from 'react';
import BusinessModalComponentBpComponentCreateDetailRmaModalComponent from './components/CreateDetailRmaModal/CreateDetailRmaModal';
import BusinessModalComponentBpComponentUpdateDetailModalComponent from './components/UpdateDetailModal/UpdateDetailModal';
import BusinessModalComponentBpComponentDeleteDetailModalComponent from './components/DeleteDetailModal/DeleteDetailModal';
import BusinessModalComponentBpComponentAddSerialModalComponent from './components/AddSerialModal/AddSerialModal';
import BusinessModalComponentBpComponentDeleteSerialModalComponent from './components/DeleteSerialModal/DeleteSerialModal';
import BusinessBpSerialResponseDto from '../../../../utils/types/BusinessBpSerialResponseDto';
import BusinessModalComponentBpComponentCreateSerialRmaModalComponent from './components/CreateSerialRmaModal/CreateSerialRmaModal';
import BusinessModalComponentBpComponentTravelVoucherModalComponent from './components/TravelVoucherModal/TravelVoucherModal';
import AssistanceResponseDto from '../../../../utils/types/AssistanceResponseDto';
import RmaModalComponent from '../../../RmaModal/RmaModal';

enum ModalType {
  CREATE_DETAIL_RMA,
  UPDATE_DETAIL,
  DELETE_DETAIL,
  ADD_SERIAL,
  DELETE_SERIAL,
  CREATE_SERIAL_RMA,
  TRAVEL_VOUCHER,
  RMA,
}

type ModalData =
  | { modal: ModalType.CREATE_DETAIL_RMA; detail: BusinessBpDetailsResponseDto }
  | { modal: ModalType.UPDATE_DETAIL; detail: BusinessBpDetailsResponseDto }
  | { modal: ModalType.DELETE_DETAIL; detail: BusinessBpDetailsResponseDto }
  | { modal: ModalType.ADD_SERIAL; detail: BusinessBpDetailsResponseDto }
  | {
      modal: ModalType.DELETE_SERIAL;
      serialNumber: BusinessBpSerialResponseDto;
    }
  | {
      modal: ModalType.CREATE_SERIAL_RMA;
      serialNumber: BusinessBpSerialResponseDto;
    }
  | { modal: ModalType.TRAVEL_VOUCHER }
  | { modal: ModalType.RMA; rma: AssistanceResponseDto };

type BusinessModalComponentBpComponentProps = Readonly<{
  business: BusinessResponseDto;
  goToNextStep: () => void;
  goToDashboard: () => void;
}>;
export default function BusinessModalComponentBpComponent({ business, goToNextStep, goToDashboard }: BusinessModalComponentBpComponentProps) {
  const { data: bp } = useSuspenseQuery(queries['business-bps'].detail._ctx.byBusinessId(business.id));

  const [modalData, setModalData] = useState<ModalData>();

  const modal = useMemo(() => {
    switch (modalData?.modal) {
      case ModalType.CREATE_DETAIL_RMA:
        return (
          <BusinessModalComponentBpComponentCreateDetailRmaModalComponent
            business={business}
            detail={modalData.detail}
            onClose={() => setModalData(undefined)}
            goToRmaModal={(rma) => setModalData({ modal: ModalType.RMA, rma })}
          />
        );
      case ModalType.UPDATE_DETAIL:
        return (
          <BusinessModalComponentBpComponentUpdateDetailModalComponent
            business={business}
            bp={bp}
            detail={modalData.detail}
            onClose={() => setModalData(undefined)}
          />
        );
      case ModalType.DELETE_DETAIL:
        return (
          <BusinessModalComponentBpComponentDeleteDetailModalComponent business={business} detail={modalData.detail} onClose={() => setModalData(undefined)} />
        );
      case ModalType.ADD_SERIAL:
        return (
          <BusinessModalComponentBpComponentAddSerialModalComponent
            business={business}
            bp={bp}
            detail={modalData.detail}
            onClose={() => setModalData(undefined)}
          />
        );
      case ModalType.DELETE_SERIAL:
        return (
          <BusinessModalComponentBpComponentDeleteSerialModalComponent
            business={business}
            bp={bp}
            serialNumber={modalData.serialNumber}
            onClose={() => setModalData(undefined)}
          />
        );
      case ModalType.CREATE_SERIAL_RMA:
        return (
          <BusinessModalComponentBpComponentCreateSerialRmaModalComponent
            business={business}
            bp={bp}
            serialNumber={modalData.serialNumber}
            onClose={() => setModalData(undefined)}
            goToRmaModal={(rma) => setModalData({ modal: ModalType.RMA, rma })}
          />
        );
      case ModalType.TRAVEL_VOUCHER:
        return <BusinessModalComponentBpComponentTravelVoucherModalComponent business={business} bp={bp} onClose={() => setModalData(undefined)} />;
      case ModalType.RMA:
        return <RmaModalComponent rmaId={modalData.rma.id} onClose={() => setModalData(undefined)} />;
    }
  }, [modalData, business, bp]);

  return (
    <>
      <BusinessModalComponentBpComponentHeaderComponent business={business} bp={bp} />
      <BusinessModalComponentBpComponentTableComponent
        business={business}
        bp={bp}
        onUpdateDetailClick={(detail) => setModalData({ modal: ModalType.UPDATE_DETAIL, detail })}
        onAddSerialClick={(detail) => setModalData({ modal: ModalType.ADD_SERIAL, detail })}
        onDeleteDetailClick={(detail) => setModalData({ modal: ModalType.DELETE_DETAIL, detail })}
        onCreateDetailRmaClick={(detail) => setModalData({ modal: ModalType.CREATE_DETAIL_RMA, detail })}
        onCreateSerialRmaClick={(serial) => setModalData({ modal: ModalType.CREATE_SERIAL_RMA, serialNumber: serial })}
        onDeleteSerialClick={(serial) => setModalData({ modal: ModalType.DELETE_SERIAL, serialNumber: serial })}
      />
      <BusinessModalComponentBpComponentFooterComponent
        business={business}
        bp={bp}
        onTravelVoucherClick={() => setModalData({ modal: ModalType.TRAVEL_VOUCHER })}
        goToNextStep={goToNextStep}
        goToDashboard={goToDashboard}
      />
      {modal}
      {/* <Outlet /> */}
    </>
  );
}
