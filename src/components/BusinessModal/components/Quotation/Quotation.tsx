import { useSuspenseQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { queries } from '../../../../utils/constants/queryKeys';
import BusinessResponseDto from '../../../../utils/types/BusinessResponseDto';
import BusinessModalComponentQuotationComponentHeaderComponent from './components/Header/Header';
import BusinessModalComponentQuotationComponentRecapComponent from './components/Recap/Recap';
import BusinessModalComponentQuotationComponentTableComponent from './components/Table/Table';
import BusinessModalComponentQuotationComponentPdfModalComponent from './components/Header/components/PdfModal/PdfModal';
import BusinessSubQuotationResponseDto from '../../../../utils/types/BusinessSubQuotationResponseDto';
import BusinessQuotationDetailsResponseDto from '../../../../utils/types/BusinessQuotationDetailsResponseDto';
import BusinessModalComponentQuotationComponentCreateDetailModalComponent from './components/CreateDetailModal/CreateDetailModal';
import BusinessModalComponentQuotationComponentCreateAssociatedDetailModalComponent from './components/CreateAssociatedDetailModal/CreateAssociatedDetailModal';
import BusinessModalComponentQuotationComponentUpdateSubquotationModalComponent from './components/UpdateSubQuotationModal/UpdateSubQuotationModal';
import BusinessModalComponentQuotationComponentDeleteSubquotationModalComponent from './components/DeleteSubQuotationModal/DeleteSubQuotationModal';
import BusinessModalComponentQuotationComponentUpdateDetailModalComponent from './components/UpdateDetailModal/UpdateDetailModal';
import BusinessModalComponentQuotationComponentDeleteDetailModalComponent from './components/DeleteDetailModal/DeleteDetailModal';

enum ModalType {
  PDF,
  CREATE_DETAIL,
  UPDATE_SUBQUOTATION,
  DELETE_SUBQUOTATION,
  CREATE_ASSOCIATED_DETAIL,
  UPDATE_DETAIL,
  DELETE_DETAIL,
}

type ModalData =
  | { modal: ModalType.PDF }
  | { modal: ModalType.CREATE_DETAIL; subQuotation: BusinessSubQuotationResponseDto }
  | { modal: ModalType.UPDATE_SUBQUOTATION; subQuotation: BusinessSubQuotationResponseDto }
  | { modal: ModalType.DELETE_SUBQUOTATION; subQuotation: BusinessSubQuotationResponseDto }
  | { modal: ModalType.CREATE_ASSOCIATED_DETAIL; detail: BusinessQuotationDetailsResponseDto }
  | { modal: ModalType.UPDATE_DETAIL; detail: BusinessQuotationDetailsResponseDto }
  | { modal: ModalType.DELETE_DETAIL; detail: BusinessQuotationDetailsResponseDto };

type BusinessModalComponentQuotationComponentProps = Readonly<{
  business: BusinessResponseDto;
  goToNextStep: () => void;
}>;
export default function BusinessModalComponentQuotationComponent({ business, goToNextStep }: BusinessModalComponentQuotationComponentProps) {
  const { data: quotation } = useSuspenseQuery(queries['business-quotations'].detail._ctx.byBusinessId(business.id));

  const [hideTotal, setHideTotal] = useState(false);
  const [hideReferences, setHideReferences] = useState(false);
  const [hidePrices, setHidePrices] = useState(false);
  const [hideAddresses, setHideAddresses] = useState(false);
  const [modalData, setModalData] = useState<ModalData>();

  const modal = useMemo(() => {
    switch (modalData?.modal) {
      case ModalType.PDF:
        return (
          <BusinessModalComponentQuotationComponentPdfModalComponent
            business={business}
            quotation={quotation}
            hideAddresses={hideAddresses}
            hideReferences={hideReferences}
            hidePrices={hidePrices}
            hideTotal={hideTotal}
            onClose={() => setModalData(undefined)}
          />
        );
      case ModalType.CREATE_DETAIL:
        return (
          <BusinessModalComponentQuotationComponentCreateDetailModalComponent
            business={business}
            quotation={quotation}
            subQuotation={modalData.subQuotation}
            onClose={() => setModalData(undefined)}
          />
        );
      case ModalType.UPDATE_SUBQUOTATION:
        return (
          <BusinessModalComponentQuotationComponentUpdateSubquotationModalComponent
            quotation={quotation}
            subquotation={modalData.subQuotation}
            onClose={() => setModalData(undefined)}
          />
        );
      case ModalType.DELETE_SUBQUOTATION:
        return (
          <BusinessModalComponentQuotationComponentDeleteSubquotationModalComponent
            business={business}
            quotation={quotation}
            subQuotation={modalData.subQuotation}
            onClose={() => setModalData(undefined)}
          />
        );
      case ModalType.CREATE_ASSOCIATED_DETAIL:
        return (
          <BusinessModalComponentQuotationComponentCreateAssociatedDetailModalComponent
            business={business}
            quotation={quotation}
            detail={modalData.detail}
            onClose={() => setModalData(undefined)}
          />
        );
      case ModalType.UPDATE_DETAIL:
        return (
          <BusinessModalComponentQuotationComponentUpdateDetailModalComponent
            business={business}
            quotation={quotation}
            detail={modalData.detail}
            onClose={() => setModalData(undefined)}
          />
        );
      case ModalType.DELETE_DETAIL:
        return (
          <BusinessModalComponentQuotationComponentDeleteDetailModalComponent
            business={business}
            quotation={quotation}
            detail={modalData.detail}
            onClose={() => setModalData(undefined)}
          />
        );
    }
  }, [modalData, business, quotation, hideAddresses, hideReferences, hidePrices, hideTotal]);

  return (
    <>
      <BusinessModalComponentQuotationComponentHeaderComponent
        business={business}
        quotation={quotation}
        hideTotal={hideTotal}
        setHideTotal={setHideTotal}
        hideReferences={hideReferences}
        setHideReferences={setHideReferences}
        hidePrices={hidePrices}
        setHidePrices={setHidePrices}
        hideAddresses={hideAddresses}
        setHideAddresses={setHideAddresses}
        onEditClick={() => setModalData({ modal: ModalType.PDF })}
        goToNextStep={goToNextStep}
      />
      <BusinessModalComponentQuotationComponentTableComponent
        business={business}
        quotation={quotation}
        hideTotal={hideTotal}
        hideReferences={hideReferences}
        hidePrices={hidePrices}
        onCreateDetailClick={(subQuotation) => setModalData({ modal: ModalType.CREATE_DETAIL, subQuotation })}
        onUpdateSubQuotationClick={(subQuotation) => setModalData({ modal: ModalType.UPDATE_SUBQUOTATION, subQuotation })}
        onDeleteSubQuotationClick={(subQuotation) => setModalData({ modal: ModalType.DELETE_SUBQUOTATION, subQuotation })}
        onCreateAssociatedDetailClick={(detail) => setModalData({ modal: ModalType.CREATE_ASSOCIATED_DETAIL, detail })}
        onUpdateDetailClick={(detail) => setModalData({ modal: ModalType.UPDATE_DETAIL, detail })}
        onDeleteDetailClick={(detail) => setModalData({ modal: ModalType.DELETE_DETAIL, detail })}
      />
      <BusinessModalComponentQuotationComponentRecapComponent business={business} quotation={quotation} />
      {modal}
      {/* <Outlet /> */}
    </>
  );
}
