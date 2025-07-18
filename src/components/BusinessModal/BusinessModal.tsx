import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import ReactModal from 'react-modal';
import { RingLoader } from 'react-spinners';
import { queries } from '../../utils/constants/queryKeys';
import BusinessState from '../../utils/enums/BusinessState';
import CategoryBusiness from '../../utils/enums/CategoryBusiness';
import TechnicalSupportResponseDto from '../../utils/types/TechnicalSupportResponseDto';
import AssistanceModalComponent from '../AssistanceModal/AssistanceModal';
import styles from './BusinessModal.module.scss';
import BusinessModalComponentArcComponent from './components/Arc/Arc';
import BusinessModalComponentArchiveModalComponent from './components/ArchiveModal/ArchiveModal';
import BusinessModalComponentAssistancesModalComponent from './components/AssistancesModal/AssistancesModal';
import BusinessModalComponentBillComponent from './components/Bill/Bill';
import BusinessModalComponentBlComponent from './components/Bl/Bl';
import BusinessModalComponentBpComponent from './components/Bp/Bp';
import BusinessModalComponentCreateAssistanceModalComponent from './components/CreateAssistanceModal/CreateAssistanceModal';
import BusinessModalComponentDashboardComponent from './components/Dashboard/Dashboard';
import BusinessModalComponentQuotationComponent from './components/Quotation/Quotation';
import BusinessModalComponentSidebarComponent from './components/Sidebar/Sidebar';
import { BusinessStep } from './utils/enums/BusinessStep';
import LoaderModal from '../LoaderModal/LoaderModal';

enum ModalType {
  CREATE_ASSISTANCE,
  ASSISTANCES,
  ARCHIVE,
  ASSISTANCE,
}

type ModalData =
  | { modal: ModalType.CREATE_ASSISTANCE }
  | { modal: ModalType.ASSISTANCES }
  | { modal: ModalType.ARCHIVE }
  | { modal: ModalType.ASSISTANCE; assistance: TechnicalSupportResponseDto };

type BusinessModalComponentProps = Readonly<{
  businessId: string;
  onClose: () => void;
}>;
export default function BusinessModalComponent({ businessId, onClose }: BusinessModalComponentProps) {
  const queryClient = useQueryClient();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  const [step, setStep] = useState(() => {
    switch (business.state) {
      case BusinessState.CREATED:
      case BusinessState.FACTURE:
        return BusinessStep.DASHBOARD;
      case BusinessState.DEVIS:
        return BusinessStep.QUOTATION;
      case BusinessState.ARC:
        return BusinessStep.ARC;
      case BusinessState.BP:
        return BusinessStep.BP;
      case BusinessState.BL:
        return BusinessStep.BL;
      default:
        return BusinessStep.DASHBOARD;
    }
  });

  const [modalData, setModalData] = useState<ModalData>();

  const StepComponent = useMemo(() => {
    switch (step) {
      case BusinessStep.DASHBOARD:
        return <BusinessModalComponentDashboardComponent business={business} goToNextStep={() => setStep(BusinessStep.QUOTATION)} />;
      case BusinessStep.QUOTATION:
        return <BusinessModalComponentQuotationComponent business={business} goToNextStep={() => setStep(BusinessStep.ARC)} />;
      case BusinessStep.ARC:
        return <BusinessModalComponentArcComponent business={business} goToNextStep={() => setStep(BusinessStep.BP)} />;
      case BusinessStep.BP:
        return (
          <BusinessModalComponentBpComponent
            business={business}
            goToDashboard={() => setStep(BusinessStep.DASHBOARD)}
            goToNextStep={() => setStep(BusinessStep.BL)}
          />
        );
      case BusinessStep.BL:
        return (
          <BusinessModalComponentBlComponent
            business={business}
            goToDashboard={() => setStep(BusinessStep.DASHBOARD)}
            goToNextStep={() => setStep(BusinessStep.BILL)}
          />
        );
      case BusinessStep.BILL:
        return <BusinessModalComponentBillComponent business={business} />;
    }
  }, [step]);

  const modal = useMemo(() => {
    switch (modalData?.modal) {
      case ModalType.CREATE_ASSISTANCE:
        return <BusinessModalComponentCreateAssistanceModalComponent business={business} isOpen onClose={() => setModalData(undefined)} />;
      case ModalType.ASSISTANCES:
        return <BusinessModalComponentAssistancesModalComponent business={business} isOpen onClose={() => setModalData(undefined)} />;
      case ModalType.ARCHIVE:
        return <BusinessModalComponentArchiveModalComponent business={business} isOpen onClose={() => setModalData(undefined)} />;
      case ModalType.ASSISTANCE:
        return <AssistanceModalComponent business={business} assistanceId={modalData.assistance.id} onClose={() => setModalData(undefined)} />;
    }
  }, [modalData, business]);

  const onAssistanceButtonClick = async () => {
    const assistances = await queryClient.ensureQueryData(
      queries['technical-supports'].list._ctx.byBusinessOrRmaNumber({
        categoryBusiness: CategoryBusiness.AFFAIRE,
        number: business.numBusiness,
      }),
    );
    if (assistances.length === 0) setModalData({ modal: ModalType.CREATE_ASSISTANCE });
    else if (assistances.length === 1 && [business.state, business.oldState].includes(BusinessState.FACTURE))
      setModalData({ modal: ModalType.ASSISTANCE, assistance: assistances[0] });
    else setModalData({ modal: ModalType.ASSISTANCES });
  };

  return (
    <ReactModal isOpen onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.container}>
        <div className={styles.content_grid}>
          <div className={styles.grid_one}>
            <BusinessModalComponentSidebarComponent
              business={business}
              step={step}
              setStep={setStep}
              onAssistanceButtonClick={onAssistanceButtonClick}
              onArchiveButtonClick={() => setModalData({ modal: ModalType.ARCHIVE })}
            />
          </div>
          <div className={styles.grid_two}>
            <React.Suspense
              fallback={
                <div className="flex h-full w-full items-center justify-center">
                  <RingLoader size={80} color="#31385A" loading speedMultiplier={1} />
                </div>
              }
            >
              {StepComponent}
            </React.Suspense>
            {/* <Outlet /> */}
          </div>
        </div>
      </div>
      <React.Suspense fallback={<LoaderModal />}>{modal}</React.Suspense>
      {/* <BusinessModalComponentBeforeCloseModalComponent /> */}
    </ReactModal>
  );
}
