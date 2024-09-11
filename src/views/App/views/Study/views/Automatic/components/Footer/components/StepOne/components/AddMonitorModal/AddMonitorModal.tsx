import { useState } from 'react';
import AppViewStudyViewAutomaticViewFooterComponentAddMonitorModalComponentStepOneComponent from './components/StepOne/StepOne';
import AppViewStudyViewAutomaticViewFooterComponentAddMonitorModalComponentStepTwoComponent from './components/StepTwo/StepTwo';
import ProductResponseDto from '../../../../../../../../../../../../utils/types/ProductResponseDto';

enum Step {
  ONE,
  TWO,
}

type AppViewStudyViewAutomaticViewFooterComponentAddMonitorModalComponentProps = Readonly<{
  onClose: () => void;
  onSubmit: ({ monitor }: { monitor?: ProductResponseDto }) => void;
}>;
export default function AppViewStudyViewAutomaticViewFooterComponentAddMonitorModalComponent({
  onClose,
  onSubmit,
}: AppViewStudyViewAutomaticViewFooterComponentAddMonitorModalComponentProps) {
  const [step, setStep] = useState(Step.ONE);

  const onStepOneSubmit = (answer: boolean) => {
    if (answer === true) setStep(Step.TWO);
    else onSubmit({ monitor: undefined });
  };

  if (step === Step.ONE)
    return <AppViewStudyViewAutomaticViewFooterComponentAddMonitorModalComponentStepOneComponent onClose={onClose} onSubmit={onStepOneSubmit} />;
  if (step === Step.TWO) return <AppViewStudyViewAutomaticViewFooterComponentAddMonitorModalComponentStepTwoComponent onClose={onClose} onSubmit={onSubmit} />;
}
