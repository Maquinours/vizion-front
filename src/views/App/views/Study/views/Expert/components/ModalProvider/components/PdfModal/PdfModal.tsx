import { useEffect } from 'react';
import AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentImageGenerationStepComponent from './components/ImageGenerationStep/ImageGenerationStep';
import AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentShowStepComponent from './components/ShowStep/ShowStep';
import { toast } from 'react-toastify';

type AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentProps = Readonly<{ step: 'IMAGE_GENERATION' } | { step: 'SHOW'; images: Array<Blob> }>;
export default function AppViewStudyViewExpertViewModalProviderComponentPdfModalComponent(
  props: AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentProps,
) {
  useEffect(() => {
    if (props.step === 'IMAGE_GENERATION') toast.loading('Génération du PDF en cours...', { toastId: 'pdf-generation', autoClose: false });
    else toast.update('pdf-generation', { type: 'success', autoClose: 3000, closeButton: true, render: 'PDF généré avec succès !', isLoading: false });
  }, [props.step]);

  useEffect(() => {
    return () => toast.dismiss('pdf-generation');
  }, []);

  switch (props.step) {
    case 'IMAGE_GENERATION':
      return <AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentImageGenerationStepComponent />;
    case 'SHOW':
      return <AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentShowStepComponent images={props.images} />;
  }
}
