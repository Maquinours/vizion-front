import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewFaqViewGedModalViewCreateDirectoryModalView from '../../../../../views/App/views/Faq/views/GedModal/views/CreateDirectoryModal/CreateDirectoryModal';

export const Route = createLazyFileRoute('/app/faq/ged/$faqId/create-directory')({
  component: AppViewFaqViewGedModalViewCreateDirectoryModalView,
});
