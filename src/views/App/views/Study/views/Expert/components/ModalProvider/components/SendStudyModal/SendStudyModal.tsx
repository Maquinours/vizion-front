import { useContext, useState } from 'react';
import EnterpriseResponseDto from '../../../../../../../../../../utils/types/EnterpriseResponseDto';
import ExpertStudyContext from '../../../../utils/context';
import AppViewStudyViewExpertViewModalProviderComponentSendStudyModalComponentImageGenerationStepComponent from './components/GenerationStep/GenerationStep';
import AppViewStudyViewExpertViewModalProviderComponentSendStudyModalComponentShowStepComponent from './components/ShowStep/ShowStep';
import useStore, { RFState } from '../../../Flow/utils/store';
import { useShallow } from 'zustand/react/shallow';
import AppViewStudyViewExpertViewModalProviderComponentSendStudyModalComponentWarningStepComponent from './components/WarningStep/WarningStep';

const selector = (state: RFState) => ({
  getPages: state.getPages,
});

export default function AppViewStudyViewExpertViewModalProviderComponentSendStudyModalComponent() {
  const { getPages } = useStore(useShallow(selector));

  const { setModal } = useContext(ExpertStudyContext)!;

  const [stepData, setStepData] = useState<
    | { step: 'WARNING' }
    | { step: 'GENERATION' }
    | { step: 'SHOW'; data: { quotationPdf: File; studyPdf: File; commercialNoticePdf: File | null; representative: EnterpriseResponseDto | undefined } }
  >(() => {
    const nodes = getPages()
      .filter((page) => page.type === 'synoptic')
      .flatMap((page) => page.nodes);
    return nodes.some((node) => node.type === 'image' && node.data.image !== 'https://bd.vizeo.eu/6-Photos/BOX/Box.png')
      ? { step: 'WARNING' }
      : { step: 'GENERATION' };
  });

  const onClose = () => {
    setModal(undefined);
  };

  switch (stepData.step) {
    case 'WARNING':
      return (
        <AppViewStudyViewExpertViewModalProviderComponentSendStudyModalComponentWarningStepComponent
          onClose={onClose}
          onConfirm={() => setStepData({ step: 'GENERATION' })}
        />
      );
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
