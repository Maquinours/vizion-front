import { useContext, useState } from 'react';
import EnterpriseResponseDto from '../../../../../../../../../../utils/types/EnterpriseResponseDto';
import ExpertStudyContext from '../../../../utils/context';
import AppViewStudyViewExpertViewModalProviderComponentSendStudyModalComponentImageGenerationStepComponent from './components/GenerationStep/GenerationStep';
import AppViewStudyViewExpertViewModalProviderComponentSendStudyModalComponentShowStepComponent from './components/ShowStep/ShowStep';

export default function AppViewStudyViewExpertViewModalProviderComponentSendStudyModalComponent() {
  const { setModal } = useContext(ExpertStudyContext)!;

  const [stepData, setStepData] = useState<
    | { step: 'GENERATION' }
    | { step: 'SHOW'; data: { quotationPdf: File; studyPdf: File; commercialNoticePdf: File; representative: EnterpriseResponseDto | undefined } }
  >({ step: 'GENERATION' });

  const onClose = () => {
    setModal(undefined);
  };

  switch (stepData.step) {
    case 'GENERATION':
      return (
        <AppViewStudyViewExpertViewModalProviderComponentSendStudyModalComponentImageGenerationStepComponent
          onClose={onClose}
          onGenerated={(data) => setStepData({ step: 'SHOW', data: data })}
        />
      );
    case 'SHOW':
      return (
        <AppViewStudyViewExpertViewModalProviderComponentSendStudyModalComponentShowStepComponent
          onClose={onClose}
          quotationPdf={stepData.data.quotationPdf}
          studyPdf={stepData.data.studyPdf}
          commercialNoticePdf={stepData.data.commercialNoticePdf}
          representative={stepData.data.representative}
        />
      );
  }
}
