import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewPredefinedTextsViewCreateModalView from '../../../../../views/App/views/Tools/views/PredefinedTexts/views/CreateModal/CreateModal';

export const Route = createLazyFileRoute('/app/tools/predefined-texts/create')({
  component: AppViewToolsViewPredefinedTextsViewCreateModalView,
});
