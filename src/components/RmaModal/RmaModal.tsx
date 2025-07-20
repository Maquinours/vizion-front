import ReactModal from 'react-modal';
import styles from './RmaModal.module.scss';
import RmaModalComponentSidebarComponent from './components/Sidebar/Sidebar';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../utils/constants/queryKeys';
import { useMemo, useState } from 'react';
import AssistanceState from '../../utils/enums/AssistanceState';
import { RmaStep } from './utils/enums/RmaStep';
import RmaModalComponentSupportComponent from './components/Support/Support';
import RmaModalComponentReceptionComponent from './components/Reception/Reception';
import RmaModalComponentDeliveryComponent from './components/Delivery/Delivery';

type RmaModalComponentProps = Readonly<{
  rmaId: string;
  onClose: () => void;
}>;
export default function RmaModalComponent({ rmaId, onClose }: RmaModalComponentProps) {
  const { data: rma } = useSuspenseQuery(queries.rmas.detail(rmaId));

  const [step, setStep] = useState(() => {
    switch (rma.state) {
      case AssistanceState.RECEPTION:
        return RmaStep.RECEPTION;
      case AssistanceState.ANALYSE_REPARATION_EXPEDITION:
        return RmaStep.DELIVERY;
      default:
        return RmaStep.SUPPORT;
    }
  });

  const children = useMemo(() => {
    switch (step) {
      case RmaStep.SUPPORT:
        return <RmaModalComponentSupportComponent rma={rma} navigateToNextStep={() => setStep(RmaStep.RECEPTION)} />;
      case RmaStep.RECEPTION:
        return <RmaModalComponentReceptionComponent rma={rma} navigateToNextStep={() => setStep(RmaStep.DELIVERY)} />;
      case RmaStep.DELIVERY:
        return <RmaModalComponentDeliveryComponent rma={rma} />;
    }
  }, [step, rma]);

  return (
    <ReactModal isOpen onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.container}>
        <div className={styles.container_grid}>
          <div className={styles.grid_one}>
            <RmaModalComponentSidebarComponent rma={rma} step={step} setStep={setStep} />
          </div>
          <div className={styles.grid_two}>
            {children}
            {/* <Outlet /> */}
          </div>
        </div>
      </div>
      {/* {modal} */}
    </ReactModal>
  );
}
