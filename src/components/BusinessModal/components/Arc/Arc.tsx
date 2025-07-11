import { useSuspenseQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { queries } from '../../../../utils/constants/queryKeys';
import BusinessResponseDto from '../../../../utils/types/BusinessResponseDto';
import BusinessModalComponentArcComponentHeaderComponent from './components/Header/Header';
import BusinessModalComponentArcComponentRecapComponent from './components/Recap/Recap';
import BusinessModalComponentArcComponentTableComponent from './components/Table/Table';
import BusinessModalComponentArcComponentPdfModalComponent from './components/PdfModal/PdfModal';
import BusinessModalComponentArcComponentUpdateShippingPriceModalComponent from './components/UpdateShippingPriceModal/UpdateShippingPriceModal';
import BusinessArcDetailsResponseDto from '../../../../utils/types/BusinessArcDetailsResponseDto';
import BusinessModalComponentArcComponentUpdateDetailModalComponent from './components/UpdateDetailModal/UpdateDetailModal';
import BusinessModalComponentArcComponentDeleteDetailModalComponent from './components/DeleteDetailModal/DeleteDetailModal';

// const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/arc');

enum ModalType {
  PDF,
  UPDATE_SHIPPING_PRICE,
  UPDATE_DETAIL,
  DELETE_DETAIL,
}

type ModalData =
  | { modal: ModalType.PDF }
  | { modal: ModalType.UPDATE_SHIPPING_PRICE }
  | { modal: ModalType.UPDATE_DETAIL; detail: BusinessArcDetailsResponseDto }
  | { modal: ModalType.DELETE_DETAIL; detail: BusinessArcDetailsResponseDto };

type BusinessModalComponentArcComponentProps = Readonly<{
  business: BusinessResponseDto;
}>;
export default function BusinessModalComponentArcComponent({ business }: BusinessModalComponentArcComponentProps) {
  const { data: arc } = useSuspenseQuery(queries['business-ARCs'].detail._ctx.byBusinessId(business.id));

  const [hideReferencesPrices, setHideReferencesPrices] = useState(false);
  const [modalData, setModalData] = useState<ModalData>();

  const modal = useMemo(() => {
    switch (modalData?.modal) {
      case ModalType.PDF:
        return (
          <BusinessModalComponentArcComponentPdfModalComponent
            business={business}
            arc={arc}
            hideReferencesPrices={hideReferencesPrices}
            onClose={() => setModalData(undefined)}
          />
        );
      case ModalType.UPDATE_SHIPPING_PRICE:
        return <BusinessModalComponentArcComponentUpdateShippingPriceModalComponent business={business} arc={arc} onClose={() => setModalData(undefined)} />;
      case ModalType.UPDATE_DETAIL:
        return (
          <BusinessModalComponentArcComponentUpdateDetailModalComponent
            business={business}
            arc={arc}
            detail={modalData.detail}
            onClose={() => setModalData(undefined)}
          />
        );
      case ModalType.DELETE_DETAIL:
        return (
          <BusinessModalComponentArcComponentDeleteDetailModalComponent
            business={business}
            arc={arc}
            detail={modalData.detail}
            onClose={() => setModalData(undefined)}
          />
        );
    }
  }, [modalData, business, arc, hideReferencesPrices]);

  return (
    <>
      <BusinessModalComponentArcComponentHeaderComponent
        business={business}
        arc={arc}
        hideReferencesPrices={hideReferencesPrices}
        setHideReferencesPrices={setHideReferencesPrices}
        onEditClick={() => setModalData({ modal: ModalType.PDF })}
      />
      <BusinessModalComponentArcComponentTableComponent
        arc={arc}
        hideReferencesPrices={hideReferencesPrices}
        onUpdateDetailClick={(detail) => setModalData({ modal: ModalType.UPDATE_DETAIL, detail })}
        onDeleteDetailClick={(detail) => setModalData({ modal: ModalType.DELETE_DETAIL, detail })}
      />
      <BusinessModalComponentArcComponentRecapComponent
        business={business}
        arc={arc}
        onUpdateShippingPriceClick={() => setModalData({ modal: ModalType.UPDATE_SHIPPING_PRICE })}
      />
      {modal}
      {/* <Outlet /> */}
      {/* <LoaderModal isLoading={isPending} /> */}
    </>
  );
}
