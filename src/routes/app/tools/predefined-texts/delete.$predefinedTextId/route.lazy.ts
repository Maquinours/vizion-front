import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewPredefinedTextsViewDeleteModalView from '../../../../../views/App/views/Tools/views/PredefinedTexts/views/DeleteModal/DeleteModal';

export const Route = createLazyFileRoute('/app/tools/predefined-texts/delete/$predefinedTextId')({
  component: AppViewToolsViewPredefinedTextsViewDeleteModalView,
});
