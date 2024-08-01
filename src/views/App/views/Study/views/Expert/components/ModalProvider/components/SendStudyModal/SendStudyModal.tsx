import { useContext, useEffect, useState } from 'react';
import AppViewStudyViewExpertViewModalProviderComponentSendStudyModalComponentImageGenerationStepComponent from './components/GenerationStep/GenerationStep';
import ExpertStudyContext from '../../../../utils/context';
import AppViewStudyViewExpertViewModalProviderComponentSendStudyModalComponentShowStepComponent from './components/ShowStep/ShowStep';
import EnterpriseResponseDto from '../../../../../../../../../../utils/types/EnterpriseResponseDto';
import { toast } from 'react-toastify';

export default function AppViewStudyViewExpertViewModalProviderComponentSendStudyModalComponent() {
  const { setModal } = useContext(ExpertStudyContext)!;

  const [stepData, setStepData] = useState<
    { step: 'GENERATION' } | { step: 'SHOW'; data: { quotationPdf: File; studyPdf: File; representative: EnterpriseResponseDto | undefined } }
  >({ step: 'GENERATION' });

  const onClose = () => {
    setModal(undefined);
  };

  useEffect(() => {
    if (stepData.step === 'GENERATION') toast.loading('Génération du PDF en cours...', { toastId: 'pdf-generation', autoClose: false });
    else
      toast.update('pdf-generation', {
        type: 'success',
        autoClose: 3000,
        closeButton: true,
        render: 'PDF généré avec succès !',
        isLoading: false,
        toastId: 'pdf-generation-success',
      });
  }, [stepData.step]);

  useEffect(() => {
    return () => {
      if (toast.isActive('pdf-generation')) toast.dismiss('pdf-generation');
    };
  }, []);

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
          representative={stepData.data.representative}
        />
      );
  }
}
