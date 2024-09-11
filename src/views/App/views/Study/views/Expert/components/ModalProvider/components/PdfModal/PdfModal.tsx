import AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentImageGenerationStepComponent from './components/ImageGenerationStep/ImageGenerationStep';
import AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentShowStepComponent from './components/ShowStep/ShowStep';

type AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentProps = Readonly<{ step: 'IMAGE_GENERATION' } | { step: 'SHOW'; images: Array<Blob> }>;
export default function AppViewStudyViewExpertViewModalProviderComponentPdfModalComponent(
  props: AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentProps,
) {
  switch (props.step) {
    case 'IMAGE_GENERATION':
      return <AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentImageGenerationStepComponent />;
    case 'SHOW':
      return <AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentShowStepComponent images={props.images} />;
  }
}
