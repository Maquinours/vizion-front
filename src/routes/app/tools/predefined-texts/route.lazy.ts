import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewPredefinedTextsView from '../../../../views/App/views/Tools/views/PredefinedTexts/PredefinedTexts';

export const Route = createLazyFileRoute('/app/tools/predefined-texts')({
  component: AppViewToolsViewPredefinedTextsView,
});
