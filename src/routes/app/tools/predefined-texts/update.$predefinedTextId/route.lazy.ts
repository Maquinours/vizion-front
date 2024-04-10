import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewPredefinedTextsViewUpdateModalView from '../../../../../views/App/views/Tools/views/PredefinedTexts/views/UpdateModal/UpdateModal';

export const Route = createLazyFileRoute('/app/tools/predefined-texts/update/$predefinedTextId')({
  component: AppViewToolsViewPredefinedTextsViewUpdateModalView,
});
