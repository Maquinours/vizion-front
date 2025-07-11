import { useSuspenseQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import ReactModal from 'react-modal';
import { queries } from '../../utils/constants/queryKeys';
import BusinessState from '../../utils/enums/BusinessState';
import styles from './BusinessModal.module.scss';
import BusinessModalComponentArchiveModalComponent from './components/ArchiveModal/ArchiveModal';
import BusinessModalComponentAssistancesModalComponent from './components/AssistancesModal/AssistancesModal';
import BusinessModalComponentCreateAssistanceModalComponent from './components/CreateAssistanceModal/CreateAssistanceModal';
import BusinessModalComponentSidebarComponent from './components/Sidebar/Sidebar';
import { BusinessStep } from './utils/enums/BusinessStep';
import BusinessModalComponentDashboardComponent from './components/Dashboard/Dashboard';
import BusinessModalComponentQuotationComponent from './components/Quotation/Quotation';
import BusinessModalComponentArcComponent from './components/Arc/Arc';
import BusinessModalComponentBpComponent from './components/Bp/Bp';
import BusinessModalComponentBlComponent from './components/Bl/Bl';
import BusinessModalComponentBillComponent from './components/Bill/Bill';
import { RingLoader } from 'react-spinners';

enum BusinessModal {
  ARCHIVE,
  ASSISTANCES,
  CREATE_ASSISTANCE,
}

type BusinessModalComponentProps = Readonly<{
  businessId: string;
  onClose: () => void;
}>;
export default function BusinessModalComponent({ businessId, onClose }: BusinessModalComponentProps) {
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

  const StepComponent = useMemo(() => {
    switch (step) {
      case BusinessStep.DASHBOARD:
        return <BusinessModalComponentDashboardComponent business={business} />;
      case BusinessStep.QUOTATION:
        return <BusinessModalComponentQuotationComponent business={business} />;
      case BusinessStep.ARC:
        return <BusinessModalComponentArcComponent business={business} />;
      case BusinessStep.BP:
        return <BusinessModalComponentBpComponent business={business} />;
      case BusinessStep.BL:
        return <BusinessModalComponentBlComponent business={business} />;
      case BusinessStep.BILL:
        return <BusinessModalComponentBillComponent business={business} />;
    }
  }, [step]);

  const [modal, setModal] = useState<BusinessModal>();

  return (
    <ReactModal isOpen onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.container}>
        <div className={styles.content_grid}>
          <div className={styles.grid_one}>
            <BusinessModalComponentSidebarComponent business={business} step={step} setStep={setStep} />
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
      <BusinessModalComponentArchiveModalComponent business={business} isOpen={modal === BusinessModal.ARCHIVE} onClose={() => setModal(undefined)} />
      <BusinessModalComponentAssistancesModalComponent business={business} isOpen={modal === BusinessModal.ASSISTANCES} onClose={() => setModal(undefined)} />
      <BusinessModalComponentCreateAssistanceModalComponent
        business={business}
        isOpen={modal === BusinessModal.CREATE_ASSISTANCE}
        onClose={() => setModal(undefined)}
      />
      {/* <BusinessModalComponentBeforeCloseModalComponent /> */}
    </ReactModal>
  );
}
