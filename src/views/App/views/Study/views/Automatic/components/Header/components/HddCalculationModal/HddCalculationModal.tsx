import { useState } from 'react';
import ProductResponseDto from '../../../../../../../../../../utils/types/ProductResponseDto';
import AppViewStudyViewAutomaticViewHeaderComponentHddCalculationModalComponentCamerasSelectionModalComponent from './components/CamerasSelectionModal/CamerasSelectionModal';
import AppViewStudyViewAutomaticViewHeaderComponentHddCalculationModalComponentSettingsModalComponent from './components/SettingsModal/SettingsModal';
import AppViewStudyViewAutomaticViewHeaderComponentHddCalculationModalComponentResultModalComponent from './components/ResultModal/ResultModal';

type Model = {
  product: ProductResponseDto;
  quantity: number;
};

type Settings = {
  hoursPerDay: number;
  days: number;
  hddSpace: number;
};

enum Step {
  CAMERAS,
  SETTINGS,
  RESULT,
}

type AppViewStudyViewAutomaticViewHeaderComponentHddCalculationModalComponentProps = Readonly<{
  onClose: () => void;
}>;
export default function AppViewStudyViewAutomaticViewHeaderComponentHddCalculationModalComponent({
  onClose,
}: AppViewStudyViewAutomaticViewHeaderComponentHddCalculationModalComponentProps) {
  const [data, setData] = useState<{ models: Array<Model>; settings: Settings }>({
    models: [],
    settings: {
      hoursPerDay: 24,
      days: 30,
      hddSpace: 0,
    },
  });
  const [step, setStep] = useState(Step.CAMERAS);

  const onStepOneSubmit = ({ models }: { models: Array<Model> }) => {
    setData((data) => ({ ...data, models: models.filter(({ quantity }) => quantity > 0) }));
    setStep(Step.SETTINGS);
  };

  const onStepTwoPrevious = (settings: Settings) => {
    setData((data) => ({ ...data, settings }));
    setStep(Step.CAMERAS);
  };

  const onStepTwoSubmit = (settings: Settings) => {
    setData((data) => ({ ...data, settings }));
    setStep(Step.RESULT);
  };

  if (step === Step.CAMERAS)
    return (
      <AppViewStudyViewAutomaticViewHeaderComponentHddCalculationModalComponentCamerasSelectionModalComponent
        onClose={onClose}
        onSubmit={onStepOneSubmit}
        models={data.models}
      />
    );
  if (step === Step.SETTINGS)
    return (
      <AppViewStudyViewAutomaticViewHeaderComponentHddCalculationModalComponentSettingsModalComponent
        onPrevious={onStepTwoPrevious}
        onClose={onClose}
        onSubmit={onStepTwoSubmit}
        settings={data.settings}
        models={data.models}
      />
    );
  if (step === Step.RESULT)
    return (
      <AppViewStudyViewAutomaticViewHeaderComponentHddCalculationModalComponentResultModalComponent
        config={data}
        onGoToCameras={() => setStep(Step.CAMERAS)}
        onGoToSettings={() => setStep(Step.SETTINGS)}
        onPrevious={() => setStep(Step.SETTINGS)}
        onClose={onClose}
      />
    );
}
